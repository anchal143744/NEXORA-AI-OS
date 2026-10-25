import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateComplianceViolationDto, CreateSecurityAuditDto } from './dto/security-intelligence.dto';

@Injectable()
export class SecurityAuditService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  audits(auditType?: string, action?: string, severity?: string) {
    return this.prisma.securityAudit.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, auditType: auditType ?? undefined, action: action ?? undefined, severity: severity ?? undefined, deletedAt: null }, include: { incident: true }, orderBy: { occurredAt: 'desc' }, take: 100 });
  }

  async createAudit(dto: CreateSecurityAuditDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.securityAudit.create({ data: { tenantId, workspaceId, incidentId: dto.incidentId, auditKey: dto.auditKey ?? `security-audit-${randomUUID()}`, auditType: dto.auditType ?? 'security', action: dto.action, actorUserId: dto.actorUserId ?? this.context.context()?.userId, severity: dto.severity ?? 'info', source: dto.source ?? 'security_audit', payload: dto.payload ?? {}, occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'security.audit.created', source: 'security-intelligence', subject: { type: 'security_audit', id: record.id }, payload: { auditType: record.auditType, action: record.action, severity: record.severity }, actorUserId: this.context.context()?.userId });
    return record;
  }

  complianceViolations(framework?: string, status?: string, severity?: string) {
    return this.prisma.complianceViolation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, framework: framework ?? undefined, status: status ?? undefined, severity: severity ?? undefined, deletedAt: null }, include: { incident: true }, orderBy: { detectedAt: 'desc' }, take: 100 });
  }

  async createViolation(dto: CreateComplianceViolationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.complianceViolation.create({ data: { tenantId, workspaceId, incidentId: dto.incidentId, violationKey: dto.violationKey ?? `compliance-violation-${randomUUID()}`, framework: dto.framework, controlId: dto.controlId, severity: dto.severity ?? 'medium', status: dto.status ?? 'open', description: dto.description, evidence: dto.evidence ?? [], remediation: dto.remediation ?? [], detectedAt: dto.detectedAt ? new Date(dto.detectedAt) : new Date(), resolvedAt: dto.resolvedAt ? new Date(dto.resolvedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'compliance.violation.created', source: 'security-intelligence', subject: { type: 'compliance_violation', id: record.id }, payload: { framework: record.framework, controlId: record.controlId, severity: record.severity, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async complianceMonitoring() {
    const [audits, violations] = await Promise.all([this.audits(), this.complianceViolations()]);
    return { audits, violations, summary: { auditCount: audits.length, openViolationCount: violations.filter((violation: { status: string }) => violation.status === 'open').length, criticalViolationCount: violations.filter((violation: { severity: string }) => violation.severity === 'critical').length } };
  }
}