import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreatePerformanceMetricDto, CreateResourceAllocationDto, CreateResourceUsageDto } from './dto/finops.dto';

@Injectable()
export class ResourceAnalyticsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  usage(resourceType?: string, provider?: string, serviceName?: string) {
    return this.prisma.resourceUsage.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, resourceType: resourceType ?? undefined, provider: provider ?? undefined, serviceName: serviceName ?? undefined, deletedAt: null }, include: { costCenter: true, performanceMetrics: true }, orderBy: { measuredAt: 'desc' }, take: 100 });
  }

  async createUsage(dto: CreateResourceUsageDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const totalCost = dto.totalCost ?? (dto.unitCost !== undefined ? Number((dto.usageQuantity * dto.unitCost).toFixed(4)) : undefined);
    const record = await this.prisma.resourceUsage.create({ data: { tenantId, workspaceId, costCenterId: dto.costCenterId, usageKey: dto.usageKey ?? `resource-usage-${randomUUID()}`, resourceType: dto.resourceType, provider: dto.provider ?? 'internal', serviceName: dto.serviceName, region: dto.region ?? 'global', usageQuantity: dto.usageQuantity, usageUnit: dto.usageUnit ?? 'unit', unitCost: dto.unitCost, totalCost, currency: dto.currency ?? 'USD', measuredAt: dto.measuredAt ? new Date(dto.measuredAt) : new Date(), dimensions: dto.dimensions ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'resource.usage.recorded', source: 'finops', subject: { type: 'resource_usage', id: record.id }, payload: { resourceType: record.resourceType, provider: record.provider, serviceName: record.serviceName, totalCost: record.totalCost }, actorUserId: this.context.context()?.userId });
    return record;
  }

  allocations(resourceType?: string, allocationType?: string, allocatedTo?: string) {
    return this.prisma.resourceAllocation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, resourceType: resourceType ?? undefined, allocationType: allocationType ?? undefined, allocatedTo: allocatedTo ?? undefined, deletedAt: null }, include: { costCenter: true }, orderBy: { effectiveFrom: 'desc' }, take: 100 });
  }

  async createAllocation(dto: CreateResourceAllocationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.resourceAllocation.create({ data: { tenantId, workspaceId, costCenterId: dto.costCenterId, allocationKey: dto.allocationKey ?? `resource-allocation-${randomUUID()}`, resourceType: dto.resourceType, resourceName: dto.resourceName, allocationType: dto.allocationType ?? 'department', allocatedTo: dto.allocatedTo, allocationPercent: dto.allocationPercent, allocatedCost: dto.allocatedCost, currency: dto.currency ?? 'USD', effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date(), effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'resource.allocation.created', source: 'finops', subject: { type: 'resource_allocation', id: record.id }, payload: { resourceType: record.resourceType, resourceName: record.resourceName, allocatedTo: record.allocatedTo, allocatedCost: record.allocatedCost }, actorUserId: this.context.context()?.userId });
    return record;
  }

  performanceMetrics(metricType?: string, status?: string, serviceName?: string) {
    return this.prisma.performanceMetric.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, metricType: metricType ?? undefined, status: status ?? undefined, serviceName: serviceName ?? undefined, deletedAt: null }, include: { resourceUsage: true }, orderBy: { measuredAt: 'desc' }, take: 100 });
  }

  async createPerformanceMetric(dto: CreatePerformanceMetricDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const status = dto.status ?? (dto.threshold !== undefined && dto.value > dto.threshold ? 'breach' : 'ok');
    const record = await this.prisma.performanceMetric.create({ data: { tenantId, workspaceId, resourceUsageId: dto.resourceUsageId, metricKey: dto.metricKey ?? `performance-metric-${randomUUID()}`, metricName: dto.metricName, metricType: dto.metricType ?? 'latency', value: dto.value, unit: dto.unit ?? 'ms', threshold: dto.threshold, status, provider: dto.provider, serviceName: dto.serviceName, measuredAt: dto.measuredAt ? new Date(dto.measuredAt) : new Date(), dimensions: dto.dimensions ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'performance.metric.recorded', source: 'finops', subject: { type: 'performance_metric', id: record.id }, payload: { metricName: record.metricName, metricType: record.metricType, value: record.value, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async analytics() {
    const [usage, allocations, metrics] = await Promise.all([this.usage(), this.allocations(), this.performanceMetrics()]);
    const totalCost = usage.reduce((sum: number, item: { totalCost?: number | null }) => sum + Number(item.totalCost ?? 0), 0);
    return { usage, allocations, metrics, summary: { usageCount: usage.length, allocationCount: allocations.length, performanceMetricCount: metrics.length, totalUsageCost: totalCost, performanceBreachCount: metrics.filter((metric: { status: string }) => metric.status === 'breach').length } };
  }
}