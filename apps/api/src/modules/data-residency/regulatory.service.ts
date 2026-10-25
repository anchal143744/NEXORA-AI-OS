import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateComplianceAuditDto, CreateComplianceRequirementDto, CreateRegulatoryAlertDto, CreateRegulatoryFrameworkDto, CreateRegulatoryRiskDto } from './dto/data-residency.dto';

@Injectable()
export class RegulatoryService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  frameworks(frameworkType?: string, countryCode?: string, status?: string) {
    return this.prisma.regulatoryFramework.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, frameworkType: frameworkType ?? undefined, countryCode: countryCode ?? undefined, status: status ?? undefined, deletedAt: null }, include: { requirements: true, risks: true, alerts: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createFramework(dto: CreateRegulatoryFrameworkDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.regulatoryFramework.create({ data: { tenantId, workspaceId, frameworkKey: dto.frameworkKey ?? `regulatory-framework-${randomUUID()}`, name: dto.name, frameworkType: dto.frameworkType ?? 'privacy', countryCode: dto.countryCode, jurisdiction: dto.jurisdiction, status: dto.status ?? 'active', authority: dto.authority, version: dto.version, effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined, effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'regulatory.framework.created', source: 'data-residency', subject: { type: 'regulatory_framework', id: record.id }, payload: { frameworkType: record.frameworkType, countryCode: record.countryCode, jurisdiction: record.jurisdiction, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  requirements(frameworkId?: string, severity?: string, status?: string) {
    return this.prisma.complianceRequirement.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, frameworkId: frameworkId ?? undefined, severity: severity ?? undefined, status: status ?? undefined, deletedAt: null }, include: { framework: true, risks: true, audits: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createRequirement(dto: CreateComplianceRequirementDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.complianceRequirement.create({ data: { tenantId, workspaceId, frameworkId: dto.frameworkId, requirementKey: dto.requirementKey ?? `compliance-requirement-${randomUUID()}`, title: dto.title, description: dto.description, requirementType: dto.requirementType ?? 'control', severity: dto.severity ?? 'medium', status: dto.status ?? 'active', controlMapping: dto.controlMapping ?? [], evidenceRequirements: dto.evidenceRequirements ?? [], ownerUserId: dto.ownerUserId, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'compliance.requirement.created', source: 'data-residency', subject: { type: 'compliance_requirement', id: record.id }, payload: { requirementType: record.requirementType, severity: record.severity, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  audits(status?: string, severity?: string, auditType?: string) {
    return this.prisma.complianceAudit.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, severity: severity ?? undefined, auditType: auditType ?? undefined, deletedAt: null }, include: { framework: true, requirement: true, dataRegion: true }, orderBy: { auditedAt: 'desc' }, take: 100 });
  }

  async createAudit(dto: CreateComplianceAuditDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.complianceAudit.create({ data: { tenantId, workspaceId, frameworkId: dto.frameworkId, requirementId: dto.requirementId, dataRegionId: dto.dataRegionId, auditKey: dto.auditKey ?? `compliance-audit-${randomUUID()}`, auditType: dto.auditType ?? 'regulatory', status: dto.status ?? 'open', severity: dto.severity ?? 'medium', scope: dto.scope ?? {}, findings: dto.findings ?? [], evidence: dto.evidence ?? [], remediation: dto.remediation ?? [], auditedAt: dto.auditedAt ? new Date(dto.auditedAt) : new Date(), auditorUserId: dto.auditorUserId ?? this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'compliance.audit.created', source: 'data-residency', subject: { type: 'compliance_audit', id: record.id }, payload: { auditType: record.auditType, status: record.status, severity: record.severity }, actorUserId: this.context.context()?.userId });
    return record;
  }

  alerts(severity?: string, status?: string, alertType?: string) {
    return this.prisma.regulatoryAlert.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, severity: severity ?? undefined, status: status ?? undefined, alertType: alertType ?? undefined, deletedAt: null }, include: { framework: true, dataRegion: true }, orderBy: { triggeredAt: 'desc' }, take: 100 });
  }

  async createAlert(dto: CreateRegulatoryAlertDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.regulatoryAlert.create({ data: { tenantId, workspaceId, frameworkId: dto.frameworkId, dataRegionId: dto.dataRegionId, alertKey: dto.alertKey ?? `regulatory-alert-${randomUUID()}`, alertType: dto.alertType ?? 'compliance', severity: dto.severity ?? 'medium', status: dto.status ?? 'open', title: dto.title, message: dto.message, source: dto.source ?? 'regulatory_operations', triggeredAt: dto.triggeredAt ? new Date(dto.triggeredAt) : new Date(), acknowledgedAt: dto.acknowledgedAt ? new Date(dto.acknowledgedAt) : undefined, resolvedAt: dto.resolvedAt ? new Date(dto.resolvedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'regulatory.alert.created', source: 'data-residency', subject: { type: 'regulatory_alert', id: record.id }, payload: { alertType: record.alertType, severity: record.severity, status: record.status, title: record.title }, actorUserId: this.context.context()?.userId });
    return record;
  }

  risks(riskType?: string, severity?: string, status?: string) {
    return this.prisma.regulatoryRisk.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, riskType: riskType ?? undefined, severity: severity ?? undefined, status: status ?? undefined, deletedAt: null }, include: { framework: true, requirement: true, dataRegion: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createRisk(dto: CreateRegulatoryRiskDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const riskScore = dto.riskScore ?? Number((Number(dto.probability ?? 0.5) * Number(dto.impactScore ?? 0.5)).toFixed(4));
    const record = await this.prisma.regulatoryRisk.create({ data: { tenantId, workspaceId, frameworkId: dto.frameworkId, requirementId: dto.requirementId, dataRegionId: dto.dataRegionId, riskKey: dto.riskKey ?? `regulatory-risk-${randomUUID()}`, riskType: dto.riskType, severity: dto.severity ?? this.severityFromScore(riskScore), probability: dto.probability, impactScore: dto.impactScore, riskScore, status: dto.status ?? 'open', mitigationPlan: dto.mitigationPlan ?? [], dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'regulatory.risk.created', source: 'data-residency', subject: { type: 'regulatory_risk', id: record.id }, payload: { riskType: record.riskType, severity: record.severity, riskScore: record.riskScore, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [frameworks, requirements, audits, alerts, risks] = await Promise.all([this.frameworks(), this.requirements(), this.audits(), this.alerts(), this.risks()]);
    return { frameworks, requirements, audits, alerts, risks, summary: { frameworkCount: frameworks.length, requirementCount: requirements.length, openAuditCount: audits.filter((audit: { status: string }) => audit.status === 'open').length, openAlertCount: alerts.filter((alert: { status: string }) => alert.status === 'open').length, openRiskCount: risks.filter((risk: { status: string }) => risk.status === 'open').length } };
  }

  private severityFromScore(score: number) { return score >= 0.85 ? 'critical' : score >= 0.65 ? 'high' : score >= 0.35 ? 'medium' : 'low'; }
}