import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateReliabilityScoreDto, CreateServiceHealthDto, CreateUptimeMetricDto } from './dto/reliability-operations.dto';

@Injectable()
export class ReliabilityHealthService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  serviceHealth(serviceType?: string, status?: string, region?: string) {
    return this.prisma.serviceHealth.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, serviceType: serviceType ?? undefined, status: status ?? undefined, region: region ?? undefined, deletedAt: null }, include: { incidents: true, uptimeMetrics: true, alerts: true }, orderBy: { lastCheckedAt: 'desc' }, take: 100 });
  }

  async createServiceHealth(dto: CreateServiceHealthDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.serviceHealth.create({ data: { tenantId, workspaceId, serviceKey: dto.serviceKey ?? `service-health-${randomUUID()}`, serviceName: dto.serviceName, serviceType: dto.serviceType ?? 'api', environment: dto.environment ?? 'production', region: dto.region ?? 'global', status: dto.status ?? this.statusFromSignals(dto.errorRate, dto.latencyMs), latencyMs: dto.latencyMs, errorRate: dto.errorRate, throughput: dto.throughput, saturation: dto.saturation, dependencyStatus: dto.dependencyStatus ?? [], lastCheckedAt: dto.lastCheckedAt ? new Date(dto.lastCheckedAt) : new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'service.health.recorded', source: 'reliability-operations', subject: { type: 'service_health', id: record.id }, payload: { serviceName: record.serviceName, serviceType: record.serviceType, status: record.status, region: record.region }, actorUserId: this.context.context()?.userId });
    return record;
  }

  uptimeMetrics(serviceName?: string, status?: string, region?: string) {
    return this.prisma.uptimeMetric.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, serviceName: serviceName ?? undefined, status: status ?? undefined, region: region ?? undefined, deletedAt: null }, include: { serviceHealth: true }, orderBy: { windowEnd: 'desc' }, take: 100 });
  }

  async createUptimeMetric(dto: CreateUptimeMetricDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.uptimeMetric.create({ data: { tenantId, workspaceId, serviceHealthId: dto.serviceHealthId, metricKey: dto.metricKey ?? `uptime-metric-${randomUUID()}`, serviceName: dto.serviceName, region: dto.region ?? 'global', environment: dto.environment ?? 'production', uptimePercent: dto.uptimePercent, availabilitySlo: dto.availabilitySlo, downtimeMinutes: dto.downtimeMinutes ?? 0, windowStart: new Date(dto.windowStart), windowEnd: new Date(dto.windowEnd), status: dto.status ?? this.uptimeStatus(dto.uptimePercent, dto.availabilitySlo), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'uptime.metric.recorded', source: 'reliability-operations', subject: { type: 'uptime_metric', id: record.id }, payload: { serviceName: record.serviceName, uptimePercent: record.uptimePercent, status: record.status, region: record.region }, actorUserId: this.context.context()?.userId });
    return record;
  }

  scores(scopeType?: string, scoreBand?: string) {
    return this.prisma.reliabilityScore.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, scopeType: scopeType ?? undefined, scoreBand: scoreBand ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 100 });
  }

  async createScore(dto: CreateReliabilityScoreDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.reliabilityScore.create({ data: { tenantId, workspaceId, scoreKey: dto.scoreKey ?? `reliability-score-${randomUUID()}`, scopeType: dto.scopeType ?? 'workspace', scopeId: dto.scopeId, score: dto.score, scoreBand: dto.scoreBand ?? this.scoreBand(dto.score), previousScore: dto.previousScore, trend: dto.trend ?? this.trend(dto.score, dto.previousScore), factors: dto.factors ?? [], recommendations: dto.recommendations ?? [], calculatedAt: dto.calculatedAt ? new Date(dto.calculatedAt) : new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'reliability.score.updated', source: 'reliability-operations', subject: { type: 'reliability_score', id: record.id }, payload: { score: record.score, scoreBand: record.scoreBand, trend: record.trend }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async uptimeMonitor() {
    const [services, metrics] = await Promise.all([this.serviceHealth(), this.uptimeMetrics()]);
    return { services, metrics, summary: { serviceCount: services.length, degradedServiceCount: services.filter((item: { status: string }) => ['degraded', 'down'].includes(item.status)).length, sloBreachCount: metrics.filter((item: { status: string }) => item.status === 'breach').length } };
  }

  async reliabilityDashboard() {
    const [monitor, scores] = await Promise.all([this.uptimeMonitor(), this.scores()]);
    return { ...monitor, scores, summary: { ...monitor.summary, latestScore: scores[0]?.score ?? null, latestScoreBand: scores[0]?.scoreBand ?? 'unknown' } };
  }

  private statusFromSignals(errorRate?: number, latencyMs?: number) { return Number(errorRate ?? 0) > 0.05 || Number(latencyMs ?? 0) > 2000 ? 'degraded' : 'healthy'; }
  private uptimeStatus(uptime: number, slo?: number) { return slo !== undefined && uptime < slo ? 'breach' : 'ok'; }
  private scoreBand(score: number) { return score >= 99 ? 'excellent' : score >= 95 ? 'healthy' : score >= 90 ? 'watch' : 'risk'; }
  private trend(score: number, previous?: number) { if (previous === undefined) return 'stable'; return score > previous ? 'up' : score < previous ? 'down' : 'stable'; }
}