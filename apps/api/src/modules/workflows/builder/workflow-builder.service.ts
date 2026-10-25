import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventBusService } from '../../events/event-bus.service';
import { DomainEventType } from '../../events/contracts/domain-event.contract';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { WorkflowGraphDefinition, WorkflowNodeDefinition, WorkflowTriggerDefinition } from '../contracts/workflow-definition.contract';
import { CreateWorkflowDefinitionDto, UpdateWorkflowDefinitionDto, WorkflowBuilderNodeType, WorkflowEdgeDto, WorkflowNodeDto } from '../dto/workflow-builder.dto';
import { WorkflowValidationService } from '../workflow-validation.service';

type StoredNode = WorkflowNodeDto & { nodeKey: string; nodeType: WorkflowBuilderNodeType; label: string; configuration?: Record<string, unknown> };
type StoredEdge = WorkflowEdgeDto & { sourceNodeKey: string; targetNodeKey: string };
type BuilderDefinitionRecord = Record<string, unknown> & { id: string; tenantId: string; workspaceId?: string | null; slug: string; version: number; name: string; workflowId?: string | null; nodes: StoredNode[]; edges: StoredEdge[] };

@Injectable()
export class WorkflowBuilderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly context: TenantContextService,
    private readonly validator: WorkflowValidationService,
    private readonly events: EventBusService,
  ) {}

  async create(dto: CreateWorkflowDefinitionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    const nodes = dto.nodes ?? this.defaultNodes();
    const edges = dto.edges ?? this.defaultEdges(nodes);
    this.assertCanvas(nodes, edges);
    const definition = await this.prisma.workflowDefinition.create({
      data: {
        tenantId,
        workspaceId,
        templateId: dto.templateId,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        industry: dto.industry,
        canvas: dto.canvas ?? this.canvasFrom(nodes, edges),
        nodeGroups: dto.nodeGroups ?? [],
        viewport: dto.viewport ?? { zoom: 1, x: 0, y: 0 },
        metadata: dto.metadata ?? {},
        nodes: { create: nodes.map((node) => this.nodeCreateData(tenantId, workspaceId, node)) },
        edges: { create: edges.map((edge) => this.edgeCreateData(tenantId, workspaceId, edge)) },
      },
      include: { nodes: true, edges: true, template: true },
    });
    await this.audit('workflow.definition.created', 'workflow_definition', definition.id, undefined, definition);
    await this.publish('workflow.definition.created', tenantId, workspaceId, { type: 'workflow_definition', id: definition.id }, { definitionId: definition.id, slug: definition.slug, nodeCount: nodes.length, edgeCount: edges.length });
    return definition;
  }

  list(status?: string) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    return this.prisma.workflowDefinition.findMany({ where: { tenantId, workspaceId, status: status ?? undefined, deletedAt: null }, include: { nodes: true, edges: true }, orderBy: [{ updatedAt: 'desc' }] });
  }

  async get(id: string) {
    const definition = await this.prisma.workflowDefinition.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { nodes: true, edges: true, template: true, workflow: true } });
    if (!definition) throw new NotFoundException('Workflow definition not found');
    return definition;
  }

  async update(id: string, dto: UpdateWorkflowDefinitionDto) {
    const before = await this.get(id) as BuilderDefinitionRecord;
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    if (dto.nodes || dto.edges) this.assertCanvas(dto.nodes ?? before.nodes, dto.edges ?? before.edges);
    const definition = await this.prisma.workflowDefinition.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status,
        canvas: dto.canvas,
        nodeGroups: dto.nodeGroups,
        viewport: dto.viewport,
        metadata: dto.metadata,
        nodes: dto.nodes ? { deleteMany: {}, create: dto.nodes.map((node) => this.nodeCreateData(tenantId, workspaceId, node)) } : undefined,
        edges: dto.edges ? { deleteMany: {}, create: dto.edges.map((edge) => this.edgeCreateData(tenantId, workspaceId, edge)) } : undefined,
      },
      include: { nodes: true, edges: true, template: true },
    });
    await this.audit('workflow.definition.updated', 'workflow_definition', definition.id, before, definition);
    return definition;
  }

  async publishDefinition(id: string) {
    const definition = await this.get(id) as BuilderDefinitionRecord;
    const graphDefinition = this.toRuntimeGraph(definition.nodes, definition.edges);
    this.validator.validateGraph(graphDefinition);
    const triggerDefinition = this.toTriggerDefinition(definition.nodes);
    this.validator.validateTrigger(triggerDefinition);
    const workflow = definition.workflowId
      ? await this.prisma.workflow.update({ where: { id: definition.workflowId }, data: { name: definition.name, slug: definition.slug, status: 'ACTIVE', triggerDefinition, graphDefinition, version: definition.version } })
      : await this.prisma.workflow.create({ data: { tenantId: definition.tenantId, workspaceId: definition.workspaceId ?? undefined, name: definition.name, slug: definition.slug, status: 'ACTIVE', triggerDefinition, graphDefinition, version: definition.version } });
    const published = await this.prisma.workflowDefinition.update({ where: { id }, data: { workflowId: workflow.id, status: 'published', publishedAt: new Date() }, include: { nodes: true, edges: true, workflow: true } });
    await this.audit('workflow.definition.published', 'workflow_definition', id, definition, published, workflow.id);
    await this.publish('workflow.definition.published', definition.tenantId, definition.workspaceId ?? undefined, { type: 'workflow_definition', id }, { definitionId: id, workflowId: workflow.id, trigger: triggerDefinition.type });
    return { definition: published, workflow, graphDefinition, triggerDefinition };
  }

  private nodeCreateData(tenantId: string, workspaceId: string | undefined, node: WorkflowNodeDto) {
    return { tenantId, workspaceId, nodeKey: node.nodeKey, nodeType: node.nodeType, label: node.label, position: node.position, size: node.size ?? {}, configuration: node.configuration ?? {}, validation: node.validation ?? {}, groupKey: node.groupKey };
  }

  private edgeCreateData(tenantId: string, workspaceId: string | undefined, edge: WorkflowEdgeDto) {
    return { tenantId, workspaceId, edgeKey: edge.edgeKey, sourceNodeKey: edge.sourceNodeKey, targetNodeKey: edge.targetNodeKey, condition: edge.condition ?? {}, label: edge.label, style: edge.style ?? {} };
  }

  private assertCanvas(nodes: Array<Pick<WorkflowNodeDto, 'nodeKey'>>, edges: Array<Pick<WorkflowEdgeDto, 'sourceNodeKey' | 'targetNodeKey'>>) {
    if (nodes.length === 0) throw new BadRequestException('Workflow builder requires at least one node');
    const keys = new Set(nodes.map((node) => node.nodeKey));
    if (keys.size !== nodes.length) throw new BadRequestException('Workflow builder node keys must be unique');
    for (const edge of edges) if (!keys.has(edge.sourceNodeKey) || !keys.has(edge.targetNodeKey)) throw new BadRequestException(`Workflow edge references missing nodes: ${edge.sourceNodeKey} -> ${edge.targetNodeKey}`);
  }

  private defaultNodes(): WorkflowNodeDto[] {
    return [
      { nodeKey: 'trigger-1', nodeType: 'trigger', label: 'Manual trigger', position: { x: 80, y: 140 }, configuration: { triggerType: 'manual.trigger' } },
      { nodeKey: 'ai-decision-1', nodeType: 'ai_decision', label: 'AI decision', position: { x: 360, y: 140 }, configuration: { system: 'Evaluate the workflow context and choose the next best action.' } },
      { nodeKey: 'notification-1', nodeType: 'notification', label: 'Notify owner', position: { x: 660, y: 140 }, configuration: { title: 'Workflow completed', body: 'Automation finished successfully.' } },
    ];
  }

  private defaultEdges(nodes: WorkflowNodeDto[]): WorkflowEdgeDto[] {
    return nodes.slice(0, -1).map((node, index) => ({ edgeKey: `edge-${index + 1}`, sourceNodeKey: node.nodeKey, targetNodeKey: nodes[index + 1].nodeKey, style: { intent: 'success' } }));
  }

  private canvasFrom(nodes: WorkflowNodeDto[], edges: WorkflowEdgeDto[]) {
    return { version: 1, nodeCount: nodes.length, edgeCount: edges.length, supports: ['drag', 'drop', 'zoom', 'pan', 'groups'] };
  }

  private toTriggerDefinition(nodes: StoredNode[]): WorkflowTriggerDefinition {
    const trigger = nodes.find((node) => node.nodeType === 'trigger');
    return { type: String(trigger?.configuration?.triggerType ?? 'manual.trigger') as WorkflowTriggerDefinition['type'], config: trigger?.configuration ?? {} };
  }

  private toRuntimeGraph(nodes: StoredNode[], edges: StoredEdge[]): WorkflowGraphDefinition {
    const outgoing = new Map<string, string[]>();
    for (const edge of edges) outgoing.set(edge.sourceNodeKey, [...(outgoing.get(edge.sourceNodeKey) ?? []), edge.targetNodeKey]);
    const runtimeNodes: WorkflowNodeDefinition[] = nodes.map((node) => ({ id: node.nodeKey, type: this.toRuntimeNodeType(node.nodeType), name: node.label, config: this.toRuntimeConfig(node), next: this.toNext(outgoing.get(node.nodeKey)) }));
    return { startNodeId: nodes.find((node) => node.nodeType === 'trigger')?.nodeKey ?? nodes[0].nodeKey, nodes: runtimeNodes };
  }

  private toRuntimeNodeType(type: WorkflowBuilderNodeType): WorkflowNodeDefinition['type'] {
    if (type === 'crm' || type === 'finance' || type === 'hr' || type === 'inventory') return 'action';
    return type;
  }

  private toRuntimeConfig(node: StoredNode): Record<string, unknown> {
    const config = node.configuration ?? {};
    if (node.nodeType === 'condition') return { operator: 'exists', field: 'input', ...config };
    if (node.nodeType === 'action') return { action: 'create_task', title: node.label, ...config };
    if (node.nodeType === 'crm') return { action: 'create_crm_record', source: 'workflow_builder', ...config };
    if (node.nodeType === 'finance') return { action: 'create_finance_record', category: 'automation', ...config };
    if (node.nodeType === 'hr') return { action: 'assign_employee', ...config };
    if (node.nodeType === 'inventory') return { action: 'create_task', title: 'Review inventory signal', ...config };
    return config;
  }

  private toNext(next?: string[]) {
    if (!next || next.length === 0) return undefined;
    return next.length === 1 ? next[0] : next;
  }

  private async audit(action: string, resourceType: string, resourceId: string, before?: unknown, after?: unknown, workflowId?: string) {
    const context = this.context.context();
    await this.prisma.workflowAudit.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId(), workflowId, actorUserId: context?.userId, action, resourceType, resourceId, before: before as object | undefined, after: after as object | undefined } });
  }

  private publish(type: DomainEventType, tenantId: string, workspaceId: string | undefined, subject: { type: string; id: string }, payload: Record<string, unknown>) {
    return this.events.publish({ tenantId, workspaceId, type, source: 'workflow-builder', subject, payload, actorUserId: this.context.context()?.userId });
  }
}
