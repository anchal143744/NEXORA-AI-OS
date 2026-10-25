import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateSecurityAlertDto, CreateSecurityIncidentDto, CreateSecurityInvestigationDto, UpdateSecurityInvestigationDto } from './dto/security-intelligence.dto';

@Injectable()
export class SecurityCommandService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  incidents(severity?: string, status?: string, incidentType?: string) {
    return this.prisma.securityIncident.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, severity: severity ?? undefined, status: status ?? undefined, incidentType: incidentType ?? undefined, deletedAt: null }, include: { alerts: true, investigations: true, threatEvents: true, complianceViolations: true }, orderBy: { detectedAt: 'desc' }, take: 100 });
  }

  async createIncident(dto: CreateSecurityIncidentDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.securityIncident.create({ data: { tenantId, workspaceId, incidentKey: dto.incidentKey ?? `security-incident-${randomUUID()}`, title: dto.title, description: dto.description, incidentType: dto.incidentType ?? 'security', severity: dto.severity ?? 'medium', status: dto.status ?? 'open', source: dto.source ?? 'security_command_center', detectedAt: dto.detectedAt ? new Date(dto.detectedAt) : new Date(), resolvedAt: dto.resolvedAt ? new Date(dto.resolvedAt) : undefined, assignedUserId: dto.assignedUserId, impact: dto.impact ?? [], timeline: dto.timeline ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'security.incident.created', source: 'security-intelligence', subject: { type: 'security_incident', id: record.id }, payload: { incidentKey: record.incidentKey, severity: record.severity, status: record.status, incidentType: record.incidentType }, actorUserId: this.context.context()?.userId });
    return record;
  }

  alerts(severity?: string, status?: string, alertType?: string) {
    return this.prisma.securityAlert.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, severity: severity ?? undefined, status: status ?? undefined, alertType: alertType ?? undefined, deletedAt: null }, include: { incident: true, threat: true }, orderBy: { triggeredAt: 'desc' }, take: 100 });
  }

  async createAlert(dto: CreateSecurityAlertDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    if (dto.incidentId) await this.ensureIncident(dto.incidentId, tenantId, workspaceId);
    const record = await this.prisma.securityAlert.create({ data: { tenantId, workspaceId, incidentId: dto.incidentId, threatId: dto.threatId, alertKey: dto.alertKey ?? `security-alert-${randomUUID()}`, alertType: dto.alertType ?? 'security', severity: dto.severity ?? 'medium', status: dto.status ?? 'open', title: dto.title, message: dto.message, source: dto.source ?? 'security_alerts', triggeredAt: dto.triggeredAt ? new Date(dto.triggeredAt) : new Date(), acknowledgedAt: dto.acknowledgedAt ? new Date(dto.acknowledgedAt) : undefined, resolvedAt: dto.resolvedAt ? new Date(dto.resolvedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'security.alert.created', source: 'security-intelligence', subject: { type: 'security_alert', id: record.id }, payload: { alertKey: record.alertKey, severity: record.severity, status: record.status, alertType: record.alertType }, actorUserId: this.context.context()?.userId });
    return record;
  }

  investigations(status?: string, priority?: string) {
    return this.prisma.securityInvestigation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, priority: priority ?? undefined, deletedAt: null }, include: { incident: true }, orderBy: { openedAt: 'desc' }, take: 100 });
  }

  async createInvestigation(dto: CreateSecurityInvestigationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    if (dto.incidentId) await this.ensureIncident(dto.incidentId, tenantId, workspaceId);
    const record = await this.prisma.securityInvestigation.create({ data: { tenantId, workspaceId, incidentId: dto.incidentId, investigationKey: dto.investigationKey ?? `security-investigation-${randomUUID()}`, title: dto.title, status: dto.status ?? 'open', priority: dto.priority ?? 'medium', investigatorUserId: dto.investigatorUserId ?? this.context.context()?.userId, findings: dto.findings ?? [], evidence: dto.evidence ?? [], actions: dto.actions ?? [], openedAt: dto.openedAt ? new Date(dto.openedAt) : new Date(), closedAt: dto.closedAt ? new Date(dto.closedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'security.investigation.created', source: 'security-intelligence', subject: { type: 'security_investigation', id: record.id }, payload: { investigationKey: record.investigationKey, status: record.status, priority: record.priority }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async updateInvestigation(id: string, dto: UpdateSecurityInvestigationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    await this.ensureInvestigation(id, tenantId, workspaceId);
    const record = await this.prisma.securityInvestigation.update({ where: { id }, data: { status: dto.status, priority: dto.priority, investigatorUserId: dto.investigatorUserId, findings: dto.findings, evidence: dto.evidence, actions: dto.actions, closedAt: dto.closedAt ? new Date(dto.closedAt) : undefined, metadata: dto.metadata } });
    await this.events.publish({ tenantId, workspaceId, type: 'security.investigation.updated', source: 'security-intelligence', subject: { type: 'security_investigation', id: record.id }, payload: { status: record.status, priority: record.priority }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async commandCenter() {
    const [incidents, alerts, investigations] = await Promise.all([this.incidents(), this.alerts(), this.investigations()]);
    return { incidents, alerts, investigations, summary: { openIncidentCount: incidents.filter((incident: { status: string }) => incident.status === 'open').length, criticalAlertCount: alerts.filter((alert: { severity: string }) => alert.severity === 'critical').length, activeInvestigationCount: investigations.filter((item: { status: string }) => item.status !== 'closed').length } };
  }

  async dashboard() {
    const center = await this.commandCenter();
    return { ...center, controls: ['incident_triage', 'threat_correlation', 'zero_trust_review', 'compliance_monitoring'] };
  }

  private async ensureIncident(id: string, tenantId: string, workspaceId?: string | null) {
    const record = await this.prisma.securityIncident.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!record) throw new NotFoundException('Security incident not found');
  }

  private async ensureInvestigation(id: string, tenantId: string, workspaceId?: string | null) {
    const record = await this.prisma.securityInvestigation.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!record) throw new NotFoundException('Security investigation not found');
  }
}