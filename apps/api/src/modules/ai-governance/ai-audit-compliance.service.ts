import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateAIAuditLogDto, CreateAIComplianceRecordDto } from './dto/ai-governance.dto';

@Injectable()
export class AiAuditComplianceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  auditLogs(action?: string, severity?: string) {
    return this.prisma.aIAuditLog.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, action: action ?? undefined, severity: severity ?? undefined, deletedAt: null }, include: { aiModel: true, decision: true }, orderBy: { occurredAt: 'desc' }, take: 100 });
  }

  async createAuditLog(dto: CreateAIAuditLogDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.aIAuditLog.create({ data: { tenantId, workspaceId, aiModelId: dto.aiModelId, decisionId: dto.decisionId, auditKey: dto.auditKey ?? `ai-audit-${randomUUID()}`, action: dto.action, actorUserId: dto.actorUserId ?? this.context.context()?.userId, severity: dto.severity ?? 'info', source: dto.source ?? 'ai_governance', payload: dto.payload ?? {}, occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'ai.audit.log.created', source: 'ai-governance', subject: { type: 'ai_audit_log', id: record.id }, payload: { action: record.action, severity: record.severity, source: record.source }, actorUserId: this.context.context()?.userId });
    return record;
  }

  complianceRecords(framework?: string, status?: string) {
    return this.prisma.aIComplianceRecord.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, framework: framework ?? undefined, status: status ?? undefined, deletedAt: null }, include: { aiModel: true, deployment: true }, orderBy: { assessedAt: 'desc' }, take: 100 });
  }

  async createComplianceRecord(dto: CreateAIComplianceRecordDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.aIComplianceRecord.create({ data: { tenantId, workspaceId, aiModelId: dto.aiModelId, deploymentId: dto.deploymentId, complianceKey: dto.complianceKey ?? `ai-compliance-${randomUUID()}`, framework: dto.framework, controlId: dto.controlId, status: dto.status ?? 'pending', evidence: dto.evidence ?? [], findings: dto.findings ?? [], remediation: dto.remediation ?? [], assessedAt: dto.assessedAt ? new Date(dto.assessedAt) : new Date(), assessorUserId: dto.assessorUserId ?? this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'ai.compliance.record.created', source: 'ai-governance', subject: { type: 'ai_compliance_record', id: record.id }, payload: { framework: record.framework, controlId: record.controlId, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async auditTrail(aiModelId?: string, decisionId?: string) {
    const logs = await this.prisma.aIAuditLog.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, aiModelId: aiModelId ?? undefined, decisionId: decisionId ?? undefined, deletedAt: null }, orderBy: { occurredAt: 'desc' }, take: 100 });
    return { logs, summary: { logCount: logs.length, warningCount: logs.filter((log: { severity: string }) => ['warning', 'critical'].includes(log.severity)).length } };
  }

  async complianceDashboard() {
    const records = await this.complianceRecords();
    return { records, summary: { recordCount: records.length, passedCount: records.filter((record: { status: string }) => record.status === 'passed').length, failedCount: records.filter((record: { status: string }) => record.status === 'failed').length, pendingCount: records.filter((record: { status: string }) => record.status === 'pending').length } };
  }
}