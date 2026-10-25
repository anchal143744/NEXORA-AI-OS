import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateSreAlertDto } from './dto/reliability-operations.dto';
import { IncidentManagementService } from './incident-management.service';
import { ReliabilityHealthService } from './reliability-health.service';
import { ScalingOperationsService } from './scaling-operations.service';

@Injectable()
export class SreAutomationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly context: TenantContextService,
    private readonly events: EventBusService,
    private readonly health: ReliabilityHealthService,
    private readonly incidents: IncidentManagementService,
    private readonly scaling: ScalingOperationsService,
  ) {}

  alerts(severity?: string, status?: string, alertType?: string) {
    return this.prisma.sreAlert.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, severity: severity ?? undefined, status: status ?? undefined, alertType: alertType ?? undefined, deletedAt: null }, include: { serviceHealth: true, incident: true }, orderBy: { triggeredAt: 'desc' }, take: 100 });
  }

  async createAlert(dto: CreateSreAlertDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.sreAlert.create({ data: { tenantId, workspaceId, serviceHealthId: dto.serviceHealthId, incidentId: dto.incidentId, alertKey: dto.alertKey ?? `sre-alert-${randomUUID()}`, alertType: dto.alertType ?? 'slo', severity: dto.severity ?? 'medium', status: dto.status ?? 'open', title: dto.title, message: dto.message, source: dto.source ?? 'sre_automation', triggeredAt: dto.triggeredAt ? new Date(dto.triggeredAt) : new Date(), acknowledgedAt: dto.acknowledgedAt ? new Date(dto.acknowledgedAt) : undefined, resolvedAt: dto.resolvedAt ? new Date(dto.resolvedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'sre.alert.created', source: 'reliability-operations', subject: { type: 'sre_alert', id: record.id }, payload: { alertType: record.alertType, severity: record.severity, status: record.status, title: record.title }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [health, incidentCenter, scaling, alerts] = await Promise.all([this.health.reliabilityDashboard(), this.incidents.incidentCenter(), this.scaling.operations(), this.alerts()]);
    return { health, incidentCenter, scaling, alerts, summary: { degradedServices: health.summary.degradedServiceCount, openIncidents: incidentCenter.summary.openIncidentCount, queuedRecoveries: incidentCenter.summary.queuedRecoveryCount, activeScalingPolicies: scaling.summary.activePolicyCount, openAlerts: alerts.filter((alert: { status: string }) => alert.status === 'open').length } };
  }

  async reliabilityIntelligence() {
    const dashboard = await this.dashboard();
    return { dashboard: dashboard.summary, recommendations: [{ type: 'slo', priority: dashboard.summary.degradedServices > 0 ? 'high' : 'medium', action: 'Review degraded services and SLO breach windows.' }, { type: 'recovery', priority: dashboard.summary.queuedRecoveries > 0 ? 'high' : 'low', action: 'Execute queued recovery automation and capture timeline updates.' }, { type: 'capacity', priority: dashboard.summary.activeScalingPolicies > 0 ? 'medium' : 'low', action: 'Compare scaling policy limits with capacity forecasts before demand spikes.' }] };
  }
}