import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateFailoverEventDto, CreateRegionHealthDto } from './dto/reliability-operations.dto';

@Injectable()
export class GlobalOperationsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  regionHealth(provider?: string, status?: string, region?: string) {
    return this.prisma.regionHealth.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, provider: provider ?? undefined, status: status ?? undefined, region: region ?? undefined, deletedAt: null }, include: { failoverEvents: true }, orderBy: { lastCheckedAt: 'desc' }, take: 100 });
  }

  async createRegionHealth(dto: CreateRegionHealthDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.regionHealth.create({ data: { tenantId, workspaceId, regionKey: dto.regionKey ?? `region-health-${randomUUID()}`, region: dto.region, provider: dto.provider ?? 'aws', status: dto.status ?? this.statusFromSignals(dto.errorRate, dto.capacityUtilization), latencyMs: dto.latencyMs, errorRate: dto.errorRate, capacityUtilization: dto.capacityUtilization, activeFailover: dto.activeFailover ?? false, lastCheckedAt: dto.lastCheckedAt ? new Date(dto.lastCheckedAt) : new Date(), metrics: dto.metrics ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'region.health.recorded', source: 'reliability-operations', subject: { type: 'region_health', id: record.id }, payload: { region: record.region, provider: record.provider, status: record.status, activeFailover: record.activeFailover }, actorUserId: this.context.context()?.userId });
    return record;
  }

  failoverEvents(status?: string, sourceRegion?: string, targetRegion?: string) {
    return this.prisma.failoverEvent.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, sourceRegion: sourceRegion ?? undefined, targetRegion: targetRegion ?? undefined, deletedAt: null }, include: { regionHealth: true, incident: true }, orderBy: { startedAt: 'desc' }, take: 100 });
  }

  async createFailoverEvent(dto: CreateFailoverEventDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.failoverEvent.create({ data: { tenantId, workspaceId, regionHealthId: dto.regionHealthId, incidentId: dto.incidentId, eventKey: dto.eventKey ?? `failover-event-${randomUUID()}`, sourceRegion: dto.sourceRegion, targetRegion: dto.targetRegion, status: dto.status ?? 'initiated', reason: dto.reason, startedAt: dto.startedAt ? new Date(dto.startedAt) : new Date(), completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined, rollbackAt: dto.rollbackAt ? new Date(dto.rollbackAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'failover.event.created', source: 'reliability-operations', subject: { type: 'failover_event', id: record.id }, payload: { sourceRegion: record.sourceRegion, targetRegion: record.targetRegion, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [regions, failovers] = await Promise.all([this.regionHealth(), this.failoverEvents()]);
    return { regions, failovers, summary: { regionCount: regions.length, degradedRegionCount: regions.filter((region: { status: string }) => ['degraded', 'down'].includes(region.status)).length, activeFailoverCount: regions.filter((region: { activeFailover: boolean }) => region.activeFailover).length, failoverEventCount: failovers.length } };
  }

  private statusFromSignals(errorRate?: number, capacityUtilization?: number) { return Number(errorRate ?? 0) > 0.05 || Number(capacityUtilization ?? 0) > 0.9 ? 'degraded' : 'healthy'; }
}