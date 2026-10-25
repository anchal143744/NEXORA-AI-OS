
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { EnterpriseGraphSyncDto } from '../dto/knowledge-graph.dto';

type GraphRecord = Record<string, any>;

type EdgeCandidate = {
  sourceKey: string;
  targetKey?: string | null;
  edgeType: string;
  label: string;
  weight?: number;
  metadata?: Record<string, unknown>;
};

type SourceSpec = {
  delegate: string;
  entityType: string;
  sourceType: string;
  moduleKey: string;
  workspaceField?: string;
  title: (record: GraphRecord) => string;
  summary: (record: GraphRecord) => string | undefined;
  text: (record: GraphRecord) => string;
  attributes: (record: GraphRecord) => Record<string, unknown>;
  edges: (record: GraphRecord) => EdgeCandidate[];
};

@Injectable()
export class EnterpriseGraphSyncService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  async sync(dto: EnterpriseGraphSyncDto = {}) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const limit = Math.min(Math.max(dto.limit ?? 100, 1), 500);
    const index = await this.ensureEnterpriseIndex(tenantId, workspaceId);
    const entityMap = new Map<string, string>();
    const edgeQueue: EdgeCandidate[] = [];
    const moduleFilter = dto.modules?.length ? new Set(dto.modules) : null;
    const stats = { scanned: 0, entities: 0, indexedDocuments: 0, edges: 0, skippedEdges: 0 };

    for (const spec of this.sources().filter((item) => !moduleFilter || moduleFilter.has(item.moduleKey) || moduleFilter.has(item.entityType))) {
      const delegate = (this.prisma as any)[spec.delegate];
      if (!delegate?.findMany) continue;
      const where: Record<string, unknown> = { tenantId, deletedAt: null };
      if (workspaceId && spec.workspaceField) where[spec.workspaceField] = workspaceId;
      const records = await delegate.findMany({ where, orderBy: { updatedAt: 'desc' }, take: limit });
      stats.scanned += records.length;

      for (const record of records) {
        const entityKey = this.entityKey(spec.entityType, record.id);
        const entity = await this.upsertEntity(tenantId, spec, record, entityKey);
        entityMap.set(entityKey, entity.id);
        await this.upsertNode(tenantId, entity.id, spec.entityType, spec.title(record), spec.attributes(record));
        await this.indexRecord(tenantId, index.id, spec, record);
        stats.entities += 1;
        stats.indexedDocuments += 1;
        edgeQueue.push(...spec.edges(record).map((edge) => ({ ...edge, sourceKey: edge.sourceKey || entityKey })));
      }
    }

    for (const edge of edgeQueue) {
      if (!edge.targetKey) {
        stats.skippedEdges += 1;
        continue;
      }
      const sourceEntityId = entityMap.get(edge.sourceKey);
      const targetEntityId = entityMap.get(edge.targetKey);
      if (!sourceEntityId || !targetEntityId || sourceEntityId === targetEntityId) {
        stats.skippedEdges += 1;
        continue;
      }
      await this.upsertEdge(tenantId, sourceEntityId, targetEntityId, edge);
      stats.edges += 1;
    }

    const snapshot = await this.prisma.contextSnapshot.create({
      data: {
        tenantId,
        workspaceId,
        snapshotType: 'enterprise_intelligence_graph_sync',
        payload: { ...stats, modules: dto.modules ?? 'all', syncedAt: new Date().toISOString() },
      },
    });

    await this.events.publish({
      tenantId,
      workspaceId,
      type: 'data.lineage.recorded',
      source: 'enterprise-knowledge-graph',
      subject: { type: 'context_snapshot', id: snapshot.id },
      payload: stats,
      actorUserId: this.context.context()?.userId,
    });

    return { snapshotId: snapshot.id, tenantId, workspaceId, ...stats };
  }

  async enterpriseGraph(workspaceId?: string, depth = 2) {
    const tenantId = this.context.currentTenantId();
    const nodes = await this.prisma.knowledgeNode.findMany({ where: { tenantId, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 750 });
    const edges = await this.prisma.knowledgeEdge.findMany({ where: { tenantId, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 1500 });
    const entityIds = new Set(nodes.map((node: any) => node.entityId));
    const entities = await this.prisma.ontologyEntity.findMany({ where: { tenantId, id: { in: Array.from(entityIds) }, deletedAt: null } });
    return {
      workspaceId,
      depth,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      entityTypes: this.countBy(entities, 'entityType'),
      relationshipTypes: this.countBy(edges, 'edgeType'),
      nodes,
      edges,
    };
  }

  private async ensureEnterpriseIndex(tenantId: string, workspaceId?: string) {
    const indexKey = workspaceId ? `enterprise-intelligence-${workspaceId}` : 'enterprise-intelligence-global';
    const existing = await this.prisma.searchIndex.findFirst({ where: { tenantId, indexKey, deletedAt: null } });
    if (existing) return existing;
    return this.prisma.searchIndex.create({
      data: {
        tenantId,
        workspaceId,
        indexKey,
        name: workspaceId ? 'Workspace Enterprise Intelligence Index' : 'Global Enterprise Intelligence Index',
        indexType: 'knowledge_graph',
        moduleKey: 'enterprise-intelligence',
        entityType: 'enterprise',
        sensitivityLevel: 'internal',
        accessPolicy: { tenantScoped: true, workspaceScoped: Boolean(workspaceId), rbacAware: true },
        metadata: { createdBy: 'phase-72-enterprise-graph-sync' },
      },
    });
  }

  private async upsertEntity(tenantId: string, spec: SourceSpec, record: GraphRecord, entityKey: string) {
    return this.prisma.ontologyEntity.upsert({
      where: { tenantId_entityType_entityKey: { tenantId, entityType: spec.entityType, entityKey } },
      update: { name: spec.title(record), sourceId: record.id, attributes: spec.attributes(record), tags: [spec.moduleKey, spec.sourceType] },
      create: { tenantId, entityType: spec.entityType, entityKey, name: spec.title(record), sourceId: record.id, attributes: spec.attributes(record), tags: [spec.moduleKey, spec.sourceType] },
    });
  }

  private upsertNode(tenantId: string, entityId: string, nodeType: string, label: string, properties: Record<string, unknown>) {
    return this.prisma.knowledgeNode.upsert({
      where: { tenantId_entityId: { tenantId, entityId } },
      update: { nodeType, label, properties },
      create: { tenantId, entityId, nodeType, label, properties },
    });
  }

  private async upsertEdge(tenantId: string, sourceEntityId: string, targetEntityId: string, edge: EdgeCandidate) {
    const existing = await this.prisma.knowledgeEdge.findFirst({ where: { tenantId, sourceEntityId, targetEntityId, edgeType: edge.edgeType, deletedAt: null } });
    if (existing) {
      return this.prisma.knowledgeEdge.update({ where: { id: existing.id }, data: { weight: edge.weight ?? existing.weight, properties: edge.metadata ?? existing.properties } });
    }
    const relationship = await this.prisma.ontologyRelationship.create({
      data: { tenantId, sourceEntityId, targetEntityId, relationshipType: edge.edgeType, label: edge.label, confidence: edge.weight ?? 1, metadata: edge.metadata ?? {} },
    });
    return this.prisma.knowledgeEdge.create({
      data: { tenantId, sourceEntityId, targetEntityId, relationshipId: relationship.id, edgeType: edge.edgeType, weight: edge.weight ?? 1, properties: edge.metadata ?? {} },
    });
  }

  private async indexRecord(tenantId: string, indexId: string, spec: SourceSpec, record: GraphRecord) {
    const workspaceId = record.workspaceId ?? undefined;
    const existing = await this.prisma.searchIndexedDocument.findFirst({ where: { tenantId, indexId, sourceType: spec.sourceType, sourceId: record.id, deletedAt: null } });
    const data = {
      workspaceId,
      moduleKey: spec.moduleKey,
      title: spec.title(record),
      summary: spec.summary(record),
      searchableText: spec.text(record),
      sensitivityLevel: 'internal',
      classification: 'enterprise',
      permissions: { tenantScoped: true, workspaceScoped: Boolean(workspaceId) },
      metadata: { entityType: spec.entityType, sourceType: spec.sourceType, sourceId: record.id },
      indexedAt: new Date(),
    };
    if (existing) return this.prisma.searchIndexedDocument.update({ where: { id: existing.id }, data });
    return this.prisma.searchIndexedDocument.create({ data: { tenantId, indexId, sourceType: spec.sourceType, sourceId: record.id, language: 'en', ...data } });
  }

  private entityKey(entityType: string, id?: string | null) {
    return `${entityType}:${id ?? randomUUID()}`;
  }

  private countBy(records: any[], field: string) {
    return records.reduce<Record<string, number>>((acc, record) => {
      const key = String(record[field] ?? 'unknown');
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }

  private sources(): SourceSpec[] {
    return [
      {
        delegate: 'organization',
        entityType: 'organization',
        sourceType: 'organization',
        moduleKey: 'core',
        title: (r) => r.name,
        summary: (r) => r.legalName ?? r.industry,
        text: (r) => [r.name, r.legalName, r.registrationId, r.countryCode, r.industry].filter(Boolean).join(' '),
        attributes: (r) => ({ countryCode: r.countryCode, industry: r.industry, metadata: r.metadata ?? {} }),
        edges: () => [],
      },
      {
        delegate: 'business',
        entityType: 'business',
        sourceType: 'business',
        moduleKey: 'core',
        title: (r) => r.name,
        summary: (r) => [r.businessType, r.industry, r.revenueBand].filter(Boolean).join(' / '),
        text: (r) => [r.name, r.businessType, r.industry, r.countryCode, r.teamSizeBand, r.revenueBand, JSON.stringify(r.goals ?? [])].filter(Boolean).join(' '),
        attributes: (r) => ({ businessType: r.businessType, industry: r.industry, countryCode: r.countryCode, teamSizeBand: r.teamSizeBand, revenueBand: r.revenueBand, goals: r.goals ?? [] }),
        edges: (r) => [{ sourceKey: this.entityKey('business', r.id), targetKey: this.entityKey('organization', r.organizationId), edgeType: 'belongs_to', label: 'Business belongs to organization' }],
      },
      {
        delegate: 'workspace',
        entityType: 'workspace',
        sourceType: 'workspace',
        moduleKey: 'core',
        title: (r) => r.name,
        summary: (r) => r.description,
        text: (r) => [r.name, r.slug, r.description].filter(Boolean).join(' '),
        attributes: (r) => ({ slug: r.slug, organizationId: r.organizationId, businessId: r.businessId, metadata: r.metadata ?? {} }),
        edges: (r) => [
          { sourceKey: this.entityKey('workspace', r.id), targetKey: this.entityKey('organization', r.organizationId), edgeType: 'belongs_to', label: 'Workspace belongs to organization' },
          { sourceKey: this.entityKey('workspace', r.id), targetKey: r.businessId ? this.entityKey('business', r.businessId) : undefined, edgeType: 'belongs_to', label: 'Workspace belongs to business' },
        ],
      },
      {
        delegate: 'department',
        entityType: 'department',
        sourceType: 'department',
        moduleKey: 'hr',
        workspaceField: 'workspaceId',
        title: (r) => r.name,
        summary: (r) => r.managerUserId ? `Managed by user ${r.managerUserId}` : undefined,
        text: (r) => [r.name, r.managerUserId].filter(Boolean).join(' '),
        attributes: (r) => ({ workspaceId: r.workspaceId, managerUserId: r.managerUserId }),
        edges: (r) => [
          { sourceKey: this.entityKey('department', r.id), targetKey: this.entityKey('workspace', r.workspaceId), edgeType: 'belongs_to', label: 'Department belongs to workspace' },
          { sourceKey: this.entityKey('department', r.id), targetKey: r.managerUserId ? this.entityKey('user', r.managerUserId) : undefined, edgeType: 'managed_by', label: 'Department managed by user' },
        ],
      },
      {
        delegate: 'user',
        entityType: 'user',
        sourceType: 'user',
        moduleKey: 'iam',
        title: (r) => r.displayName,
        summary: (r) => r.email,
        text: (r) => [r.displayName, r.email, r.status, r.locale, r.timezone].filter(Boolean).join(' '),
        attributes: (r) => ({ email: r.email, status: r.status, locale: r.locale, timezone: r.timezone }),
        edges: () => [],
      },
      {
        delegate: 'employee',
        entityType: 'employee',
        sourceType: 'employee',
        moduleKey: 'hr',
        workspaceField: 'workspaceId',
        title: (r) => r.name ?? r.recordKey,
        summary: (r) => r.title ?? r.description,
        text: (r) => [r.name, r.title, r.description, r.status, r.category, r.stage, r.riskLevel].filter(Boolean).join(' '),
        attributes: (r) => ({ workspaceId: r.workspaceId, departmentId: r.departmentId, managerEmployeeId: r.managerEmployeeId, status: r.status, score: r.score, riskLevel: r.riskLevel }),
        edges: (r) => [
          { sourceKey: this.entityKey('employee', r.id), targetKey: r.workspaceId ? this.entityKey('workspace', r.workspaceId) : undefined, edgeType: 'belongs_to', label: 'Employee belongs to workspace' },
          { sourceKey: this.entityKey('employee', r.id), targetKey: r.departmentId ? this.entityKey('department', r.departmentId) : undefined, edgeType: 'works_in', label: 'Employee works in department' },
          { sourceKey: this.entityKey('employee', r.id), targetKey: r.managerEmployeeId ? this.entityKey('employee', r.managerEmployeeId) : undefined, edgeType: 'reports_to', label: 'Employee reports to manager' },
          { sourceKey: this.entityKey('employee', r.id), targetKey: r.userId ? this.entityKey('user', r.userId) : undefined, edgeType: 'connected_to', label: 'Employee linked to user' },
        ],
      },
      {
        delegate: 'crmLeadRecord',
        entityType: 'lead',
        sourceType: 'crm_lead',
        moduleKey: 'crm',
        workspaceField: 'workspaceId',
        title: (r) => [r.firstName, r.lastName].filter(Boolean).join(' '),
        summary: (r) => [r.company, r.status, r.source].filter(Boolean).join(' / '),
        text: (r) => [r.firstName, r.lastName, r.email, r.phone, r.company, r.source, r.status].filter(Boolean).join(' '),
        attributes: (r) => ({ workspaceId: r.workspaceId, status: r.status, source: r.source, ownerUserId: r.ownerUserId, company: r.company }),
        edges: (r) => [
          { sourceKey: this.entityKey('lead', r.id), targetKey: this.entityKey('workspace', r.workspaceId), edgeType: 'belongs_to', label: 'Lead belongs to workspace' },
          { sourceKey: this.entityKey('lead', r.id), targetKey: r.ownerUserId ? this.entityKey('user', r.ownerUserId) : undefined, edgeType: 'assigned_to', label: 'Lead assigned to owner' },
        ],
      },
      {
        delegate: 'crmCustomerRecord',
        entityType: 'customer',
        sourceType: 'crm_customer',
        moduleKey: 'crm',
        workspaceField: 'workspaceId',
        title: (r) => r.name,
        summary: (r) => [r.company, r.lifecycleStage].filter(Boolean).join(' / '),
        text: (r) => [r.name, r.email, r.phone, r.company, r.lifecycleStage].filter(Boolean).join(' '),
        attributes: (r) => ({ workspaceId: r.workspaceId, lifecycleStage: r.lifecycleStage, ownerUserId: r.ownerUserId, company: r.company }),
        edges: (r) => [
          { sourceKey: this.entityKey('customer', r.id), targetKey: this.entityKey('workspace', r.workspaceId), edgeType: 'belongs_to', label: 'Customer belongs to workspace' },
          { sourceKey: this.entityKey('customer', r.id), targetKey: r.ownerUserId ? this.entityKey('user', r.ownerUserId) : undefined, edgeType: 'assigned_to', label: 'Customer assigned to owner' },
        ],
      },
      {
        delegate: 'crmOpportunity',
        entityType: 'opportunity',
        sourceType: 'crm_opportunity',
        moduleKey: 'crm',
        workspaceField: 'workspaceId',
        title: (r) => r.name,
        summary: (r) => [r.stage, r.amount?.toString?.(), r.currency].filter(Boolean).join(' / '),
        text: (r) => [r.name, r.stage, r.closeReason, r.amount?.toString?.(), r.currency].filter(Boolean).join(' '),
        attributes: (r) => ({ workspaceId: r.workspaceId, stage: r.stage, amount: r.amount?.toString?.(), currency: r.currency, expectedCloseDate: r.expectedCloseDate }),
        edges: (r) => [
          { sourceKey: this.entityKey('opportunity', r.id), targetKey: this.entityKey('workspace', r.workspaceId), edgeType: 'belongs_to', label: 'Opportunity belongs to workspace' },
          { sourceKey: this.entityKey('opportunity', r.id), targetKey: r.customerId ? this.entityKey('customer', r.customerId) : undefined, edgeType: 'generates', label: 'Customer generates opportunity' },
        ],
      },
      {
        delegate: 'invoice',
        entityType: 'invoice',
        sourceType: 'invoice',
        moduleKey: 'finance',
        workspaceField: 'workspaceId',
        title: (r) => r.invoiceNumber,
        summary: (r) => [r.status, r.currency, r.total?.toString?.()].filter(Boolean).join(' / '),
        text: (r) => [r.invoiceNumber, r.status, r.currency, r.notes, r.total?.toString?.(), r.amountDue?.toString?.()].filter(Boolean).join(' '),
        attributes: (r) => ({ workspaceId: r.workspaceId, status: r.status, currency: r.currency, total: r.total?.toString?.(), amountDue: r.amountDue?.toString?.(), dueAt: r.dueAt }),
        edges: (r) => [
          { sourceKey: this.entityKey('invoice', r.id), targetKey: r.workspaceId ? this.entityKey('workspace', r.workspaceId) : undefined, edgeType: 'belongs_to', label: 'Invoice belongs to workspace' },
          { sourceKey: this.entityKey('invoice', r.id), targetKey: r.customerId ? this.entityKey('customer', r.customerId) : undefined, edgeType: 'bills', label: 'Invoice bills customer' },
        ],
      },
      {
        delegate: 'revenueContract',
        entityType: 'contract',
        sourceType: 'revenue_contract',
        moduleKey: 'revenue',
        workspaceField: 'workspaceId',
        title: (r) => r.title,
        summary: (r) => [r.contractNumber, r.status, r.contractValue?.toString?.()].filter(Boolean).join(' / '),
        text: (r) => [r.title, r.contractNumber, r.contractType, r.status, r.currency, r.contractValue?.toString?.(), r.annualRecurringRevenue?.toString?.()].filter(Boolean).join(' '),
        attributes: (r) => ({ workspaceId: r.workspaceId, status: r.status, contractType: r.contractType, contractValue: r.contractValue?.toString?.(), annualRecurringRevenue: r.annualRecurringRevenue?.toString?.(), renewalDate: r.renewalDate }),
        edges: (r) => [
          { sourceKey: this.entityKey('contract', r.id), targetKey: r.workspaceId ? this.entityKey('workspace', r.workspaceId) : undefined, edgeType: 'belongs_to', label: 'Contract belongs to workspace' },
        ],
      },
      {
        delegate: 'project',
        entityType: 'project',
        sourceType: 'project',
        moduleKey: 'projects',
        workspaceField: 'workspaceId',
        title: (r) => r.name,
        summary: (r) => r.status,
        text: (r) => [r.name, r.status].filter(Boolean).join(' '),
        attributes: (r) => ({ workspaceId: r.workspaceId, teamId: r.teamId, status: r.status, dueDate: r.dueDate }),
        edges: (r) => [
          { sourceKey: this.entityKey('project', r.id), targetKey: r.workspaceId ? this.entityKey('workspace', r.workspaceId) : undefined, edgeType: 'belongs_to', label: 'Project belongs to workspace' },
          { sourceKey: this.entityKey('project', r.id), targetKey: r.teamId ? this.entityKey('team', r.teamId) : undefined, edgeType: 'assigned_to', label: 'Project assigned to team' },
        ],
      },
      {
        delegate: 'task',
        entityType: 'task',
        sourceType: 'task',
        moduleKey: 'projects',
        workspaceField: 'workspaceId',
        title: (r) => r.title,
        summary: (r) => r.description ?? r.status,
        text: (r) => [r.title, r.description, r.status, r.priority].filter(Boolean).join(' '),
        attributes: (r) => ({ workspaceId: r.workspaceId, projectId: r.projectId, status: r.status, priority: r.priority, dueAt: r.dueAt }),
        edges: (r) => [
          { sourceKey: this.entityKey('task', r.id), targetKey: r.workspaceId ? this.entityKey('workspace', r.workspaceId) : undefined, edgeType: 'belongs_to', label: 'Task belongs to workspace' },
          { sourceKey: this.entityKey('task', r.id), targetKey: r.projectId ? this.entityKey('project', r.projectId) : undefined, edgeType: 'belongs_to', label: 'Task belongs to project' },
          { sourceKey: this.entityKey('task', r.id), targetKey: r.assigneeUserId ? this.entityKey('user', r.assigneeUserId) : undefined, edgeType: 'assigned_to', label: 'Task assigned to user' },
        ],
      },
      {
        delegate: 'workflow',
        entityType: 'workflow',
        sourceType: 'workflow',
        moduleKey: 'workflows',
        workspaceField: 'workspaceId',
        title: (r) => r.name,
        summary: (r) => r.status,
        text: (r) => [r.name, r.slug, r.status, JSON.stringify(r.triggerDefinition ?? {})].filter(Boolean).join(' '),
        attributes: (r) => ({ workspaceId: r.workspaceId, slug: r.slug, status: r.status, version: r.version }),
        edges: (r) => [
          { sourceKey: this.entityKey('workflow', r.id), targetKey: r.workspaceId ? this.entityKey('workspace', r.workspaceId) : undefined, edgeType: 'belongs_to', label: 'Workflow belongs to workspace' },
        ],
      },
      {
        delegate: 'workflowExecution',
        entityType: 'workflow_execution',
        sourceType: 'workflow_execution',
        moduleKey: 'workflows',
        workspaceField: 'workspaceId',
        title: (r) => `Workflow execution ${r.id}`,
        summary: (r) => [r.status, r.approvalStatus].filter(Boolean).join(' / '),
        text: (r) => [r.id, r.status, r.approvalStatus, JSON.stringify(r.error ?? {})].filter(Boolean).join(' '),
        attributes: (r) => ({ workspaceId: r.workspaceId, workflowId: r.workflowId, status: r.status, approvalStatus: r.approvalStatus, latencyMs: r.latencyMs }),
        edges: (r) => [
          { sourceKey: this.entityKey('workflow_execution', r.id), targetKey: r.workspaceId ? this.entityKey('workspace', r.workspaceId) : undefined, edgeType: 'belongs_to', label: 'Workflow execution belongs to workspace' },
          { sourceKey: this.entityKey('workflow_execution', r.id), targetKey: this.entityKey('workflow', r.workflowId), edgeType: 'executes', label: 'Workflow execution executes workflow' },
        ],
      },
    ];
  }
}
