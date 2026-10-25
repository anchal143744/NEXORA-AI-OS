import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateCapacityForecastDto, CreateScalingEventDto, CreateScalingPolicyDto } from './dto/reliability-operations.dto';

@Injectable()
export class ScalingOperationsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  policies(serviceName?: string, status?: string, region?: string) {
    return this.prisma.scalingPolicy.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, serviceName: serviceName ?? undefined, status: status ?? undefined, region: region ?? undefined, deletedAt: null }, include: { events: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createPolicy(dto: CreateScalingPolicyDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.scalingPolicy.create({ data: { tenantId, workspaceId, policyKey: dto.policyKey ?? `scaling-policy-${randomUUID()}`, name: dto.name, serviceName: dto.serviceName, serviceType: dto.serviceType ?? 'api', region: dto.region ?? 'global', status: dto.status ?? 'active', mode: dto.mode ?? 'automatic', minInstances: dto.minInstances ?? 1, maxInstances: dto.maxInstances ?? 10, targetCpu: dto.targetCpu, targetMemory: dto.targetMemory, targetLatencyMs: dto.targetLatencyMs, cooldownSeconds: dto.cooldownSeconds ?? 300, rules: dto.rules ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'scaling.policy.created', source: 'reliability-operations', subject: { type: 'scaling_policy', id: record.id }, payload: { serviceName: record.serviceName, mode: record.mode, region: record.region, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  scalingEvents(serviceName?: string, status?: string, region?: string) {
    return this.prisma.scalingEvent.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, serviceName: serviceName ?? undefined, status: status ?? undefined, region: region ?? undefined, deletedAt: null }, include: { policy: true }, orderBy: { triggeredAt: 'desc' }, take: 100 });
  }

  async createScalingEvent(dto: CreateScalingEventDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    if (dto.policyId) await this.ensurePolicy(dto.policyId, tenantId, workspaceId);
    const record = await this.prisma.scalingEvent.create({ data: { tenantId, workspaceId, policyId: dto.policyId, eventKey: dto.eventKey ?? `scaling-event-${randomUUID()}`, serviceName: dto.serviceName, region: dto.region ?? 'global', direction: dto.direction ?? 'out', previousCapacity: dto.previousCapacity, requestedCapacity: dto.requestedCapacity, newCapacity: dto.newCapacity, reason: dto.reason, status: dto.status ?? 'requested', triggeredAt: dto.triggeredAt ? new Date(dto.triggeredAt) : new Date(), completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'scaling.event.created', source: 'reliability-operations', subject: { type: 'scaling_event', id: record.id }, payload: { serviceName: record.serviceName, direction: record.direction, status: record.status, region: record.region }, actorUserId: this.context.context()?.userId });
    return record;
  }

  capacityForecasts(serviceName?: string, forecastType?: string, region?: string) {
    return this.prisma.capacityForecast.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, serviceName: serviceName ?? undefined, forecastType: forecastType ?? undefined, region: region ?? undefined, deletedAt: null }, include: { serviceHealth: true }, orderBy: { forecastAt: 'desc' }, take: 100 });
  }

  async createCapacityForecast(dto: CreateCapacityForecastDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.capacityForecast.create({ data: { tenantId, workspaceId, serviceHealthId: dto.serviceHealthId, forecastKey: dto.forecastKey ?? `capacity-forecast-${randomUUID()}`, serviceName: dto.serviceName, region: dto.region ?? 'global', forecastType: dto.forecastType ?? 'capacity', horizon: dto.horizon ?? '30d', demandScore: dto.demandScore, recommendedCapacity: dto.recommendedCapacity, confidence: dto.confidence, forecastAt: dto.forecastAt ? new Date(dto.forecastAt) : new Date(), signals: dto.signals ?? [], recommendations: dto.recommendations ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'capacity.forecast.created', source: 'reliability-operations', subject: { type: 'capacity_forecast', id: record.id }, payload: { serviceName: record.serviceName, horizon: record.horizon, recommendedCapacity: record.recommendedCapacity, confidence: record.confidence }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async operations() {
    const [policies, events, forecasts] = await Promise.all([this.policies(), this.scalingEvents(), this.capacityForecasts()]);
    return { policies, events, forecasts, summary: { activePolicyCount: policies.filter((policy: { status: string }) => policy.status === 'active').length, pendingScalingEventCount: events.filter((event: { status: string }) => ['requested', 'running'].includes(event.status)).length, forecastCount: forecasts.length } };
  }

  private async ensurePolicy(id: string, tenantId: string, workspaceId?: string | null) {
    const record = await this.prisma.scalingPolicy.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!record) throw new NotFoundException('Scaling policy not found');
  }
}