import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateFeatureUsageDto, CreateProductUsageMetricDto, CreateSessionAnalyticsDto, TrackProductEventDto } from './dto/product-intelligence.dto';

@Injectable()
export class UsageAnalyticsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  eventsList(eventName?: string, userId?: string) {
    return this.prisma.productEvent.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, eventName: eventName ?? undefined, userId: userId ?? undefined, deletedAt: null }, orderBy: { occurredAt: 'desc' }, take: 200 });
  }

  async trackEvent(dto: TrackProductEventDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const event = await this.prisma.productEvent.create({ data: { tenantId, workspaceId, eventKey: dto.eventKey ?? `event-${randomUUID()}`, userId: dto.userId ?? this.context.context()?.userId, customerIdentityId: dto.customerIdentityId, sessionId: dto.sessionId, journeyId: dto.journeyId, eventName: dto.eventName, eventType: dto.eventType ?? 'track', productKey: dto.productKey ?? 'nexora', moduleKey: dto.moduleKey, featureKey: dto.featureKey, source: dto.source ?? 'web', occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(), properties: dto.properties ?? {}, context: dto.context ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'product.event.tracked', source: 'usage-analytics', subject: { type: 'product_event', id: event.id }, payload: { eventName: event.eventName, moduleKey: event.moduleKey, featureKey: event.featureKey }, actorUserId: this.context.context()?.userId });
    return event;
  }

  metrics(metricType?: string, moduleKey?: string) {
    return this.prisma.productUsageMetric.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, metricType: metricType ?? undefined, moduleKey: moduleKey ?? undefined, deletedAt: null }, orderBy: { periodEnd: 'desc' }, take: 150 });
  }

  async createMetric(dto: CreateProductUsageMetricDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const metric = await this.prisma.productUsageMetric.create({ data: { tenantId, workspaceId, metricKey: dto.metricKey ?? `metric-${randomUUID()}`, productKey: dto.productKey ?? 'nexora', moduleKey: dto.moduleKey, featureKey: dto.featureKey, metricType: dto.metricType, metricName: dto.metricName, value: dto.value, unit: dto.unit ?? 'count', dimensions: dto.dimensions ?? {}, periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'product.usage.metric.recorded', source: 'usage-analytics', subject: { type: 'product_usage_metric', id: metric.id }, payload: { metricType: metric.metricType, metricName: metric.metricName, value: metric.value }, actorUserId: this.context.context()?.userId });
    return metric;
  }

  sessions(userId?: string) {
    return this.prisma.sessionAnalytics.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, userId: userId ?? undefined, deletedAt: null }, orderBy: { startedAt: 'desc' }, take: 150 });
  }

  createSession(dto: CreateSessionAnalyticsDto) {
    return this.prisma.sessionAnalytics.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), sessionKey: dto.sessionKey ?? `session-${randomUUID()}`, userId: dto.userId ?? this.context.context()?.userId, customerIdentityId: dto.customerIdentityId, deviceId: dto.deviceId, source: dto.source ?? 'web', startedAt: dto.startedAt ? new Date(dto.startedAt) : new Date(), endedAt: dto.endedAt ? new Date(dto.endedAt) : undefined, durationSeconds: dto.durationSeconds, pageViews: dto.pageViews ?? 0, eventCount: dto.eventCount ?? 0, featureCount: dto.featureCount ?? 0, entryUrl: dto.entryUrl, exitUrl: dto.exitUrl, referrer: dto.referrer, metadata: dto.metadata ?? {} } });
  }

  featureUsage(moduleKey?: string, featureKey?: string) {
    return this.prisma.featureUsage.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, moduleKey: moduleKey ?? undefined, featureKey: featureKey ?? undefined, deletedAt: null }, orderBy: { periodEnd: 'desc' }, take: 150 });
  }

  async createFeatureUsage(dto: CreateFeatureUsageDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const usage = await this.prisma.featureUsage.create({ data: { tenantId, workspaceId, usageKey: dto.usageKey ?? `feature-usage-${randomUUID()}`, productKey: dto.productKey ?? 'nexora', moduleKey: dto.moduleKey, featureKey: dto.featureKey, userId: dto.userId, teamId: dto.teamId, usageCount: dto.usageCount ?? 0, activeUsers: dto.activeUsers ?? 0, adoptionRate: dto.adoptionRate, lastUsedAt: dto.lastUsedAt ? new Date(dto.lastUsedAt) : undefined, periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'feature.usage.recorded', source: 'usage-analytics', subject: { type: 'feature_usage', id: usage.id }, payload: { moduleKey: usage.moduleKey, featureKey: usage.featureKey, usageCount: usage.usageCount }, actorUserId: this.context.context()?.userId });
    return usage;
  }

  async userActivity(userId?: string) {
    const currentUserId = userId ?? this.context.context()?.userId;
    const [events, sessions, journeys] = await Promise.all([this.eventsList(undefined, currentUserId), this.sessions(currentUserId), this.prisma.userJourney.findMany({ where: { tenantId: this.context.currentTenantId(), userId: currentUserId ?? undefined, deletedAt: null }, orderBy: { startedAt: 'desc' }, take: 50 })]);
    return { userId: currentUserId, events, sessions, journeys };
  }

  workspaceAnalytics() { return this.analyticsRollup('workspace'); }
  teamAnalytics(teamId?: string) { return this.analyticsRollup('team', teamId); }
  moduleAnalytics(moduleKey?: string) { return this.analyticsRollup('module', moduleKey); }

  private async analyticsRollup(scope: string, key?: string) {
    const [events, metrics, features, sessions] = await Promise.all([this.eventsList(), this.metrics(undefined, scope === 'module' ? key : undefined), this.featureUsage(scope === 'module' ? key : undefined), this.sessions()]);
    return { scope, key, eventCount: events.length, metricCount: metrics.length, featureUsageCount: features.length, sessionCount: sessions.length };
  }
}
