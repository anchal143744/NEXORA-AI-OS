import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CompleteRecoveryActionDto, CreateIncidentTimelineDto, CreateRecoveryActionDto, CreateSystemIncidentDto } from './dto/reliability-operations.dto';

@Injectable()
export class IncidentManagementService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  incidents(severity?: string, status?: string, region?: string) {
    return this.prisma.systemIncident.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, severity: severity ?? undefined, status: status ?? undefined, region: region ?? undefined, deletedAt: null }, include: { serviceHealth: true, timelineEntries: true, recoveryActions: true, alerts: true, failoverEvents: true }, orderBy: { detectedAt: 'desc' }, take: 100 });
  }

  async createIncident(dto: CreateSystemIncidentDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.systemIncident.create({ data: { tenantId, workspaceId, serviceHealthId: dto.serviceHealthId, incidentKey: dto.incidentKey ?? `system-incident-${randomUUID()}`, title: dto.title, description: dto.description, incidentType: dto.incidentType ?? 'reliability', severity: dto.severity ?? 'medium', status: dto.status ?? 'open', source: dto.source ?? 'reliability_command_center', region: dto.region, detectedAt: dto.detectedAt ? new Date(dto.detectedAt) : new Date(), resolvedAt: dto.resolvedAt ? new Date(dto.resolvedAt) : undefined, assignedUserId: dto.assignedUserId, impact: dto.impact ?? [], timeline: dto.timeline ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'system.incident.created', source: 'reliability-operations', subject: { type: 'system_incident', id: record.id }, payload: { incidentKey: record.incidentKey, severity: record.severity, status: record.status, region: record.region }, actorUserId: this.context.context()?.userId });
    return record;
  }

  timelines(incidentId?: string, eventType?: string) {
    return this.prisma.incidentTimeline.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, incidentId: incidentId ?? undefined, eventType: eventType ?? undefined, deletedAt: null }, include: { incident: true }, orderBy: { occurredAt: 'desc' }, take: 100 });
  }

  async createTimeline(dto: CreateIncidentTimelineDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    await this.ensureIncident(dto.incidentId, tenantId, workspaceId);
    const record = await this.prisma.incidentTimeline.create({ data: { tenantId, workspaceId, incidentId: dto.incidentId, timelineKey: dto.timelineKey ?? `incident-timeline-${randomUUID()}`, eventType: dto.eventType ?? 'update', title: dto.title, description: dto.description, actorUserId: dto.actorUserId ?? this.context.context()?.userId, occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'incident.timeline.created', source: 'reliability-operations', subject: { type: 'incident_timeline', id: record.id }, payload: { incidentId: record.incidentId, eventType: record.eventType, title: record.title }, actorUserId: this.context.context()?.userId });
    return record;
  }

  recoveryActions(incidentId?: string, status?: string, actionType?: string) {
    return this.prisma.recoveryAction.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, incidentId: incidentId ?? undefined, status: status ?? undefined, actionType: actionType ?? undefined, deletedAt: null }, include: { incident: true }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async createRecoveryAction(dto: CreateRecoveryActionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    if (dto.incidentId) await this.ensureIncident(dto.incidentId, tenantId, workspaceId);
    const record = await this.prisma.recoveryAction.create({ data: { tenantId, workspaceId, incidentId: dto.incidentId, actionKey: dto.actionKey ?? `recovery-action-${randomUUID()}`, actionType: dto.actionType, status: dto.status ?? 'queued', automationType: dto.automationType ?? 'runbook', startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined, completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined, rollbackAvailable: dto.rollbackAvailable ?? false, result: dto.result ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'recovery.action.created', source: 'reliability-operations', subject: { type: 'recovery_action', id: record.id }, payload: { actionType: record.actionType, status: record.status, automationType: record.automationType }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async completeRecoveryAction(id: string, dto: CompleteRecoveryActionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    const existing = await this.prisma.recoveryAction.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!existing) throw new NotFoundException('Recovery action not found');
    const record = await this.prisma.recoveryAction.update({ where: { id }, data: { status: dto.status ?? 'completed', completedAt: dto.completedAt ? new Date(dto.completedAt) : new Date(), result: dto.result ?? existing.result } });
    await this.events.publish({ tenantId, workspaceId, type: 'recovery.action.completed', source: 'reliability-operations', subject: { type: 'recovery_action', id: record.id }, payload: { actionType: record.actionType, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async incidentCenter() {
    const [incidents, timelines, actions] = await Promise.all([this.incidents(), this.timelines(), this.recoveryActions()]);
    return { incidents, timelines, actions, summary: { openIncidentCount: incidents.filter((incident: { status: string }) => incident.status === 'open').length, criticalIncidentCount: incidents.filter((incident: { severity: string }) => incident.severity === 'critical').length, queuedRecoveryCount: actions.filter((action: { status: string }) => action.status === 'queued').length } };
  }

  private async ensureIncident(id: string, tenantId: string, workspaceId?: string | null) {
    const record = await this.prisma.systemIncident.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!record) throw new NotFoundException('System incident not found');
  }
}