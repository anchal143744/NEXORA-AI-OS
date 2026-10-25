import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateCostCenterDto, CreateCostForecastDto, CreateCostMetricDto } from './dto/finops.dto';

@Injectable()
export class CostIntelligenceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  costCenters(status?: string, department?: string) {
    return this.prisma.costCenter.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, department: department ?? undefined, deletedAt: null }, include: { costMetrics: true, budgetTracking: true, resourceAllocations: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createCostCenter(dto: CreateCostCenterDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.costCenter.create({ data: { tenantId, workspaceId, costCenterKey: dto.costCenterKey ?? `cost-center-${randomUUID()}`, name: dto.name, department: dto.department, ownerUserId: dto.ownerUserId, status: dto.status ?? 'active', currency: dto.currency ?? 'USD', monthlyBudget: dto.monthlyBudget, annualBudget: dto.annualBudget, tags: dto.tags ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'cost.center.created', source: 'finops', subject: { type: 'cost_center', id: record.id }, payload: { costCenterKey: record.costCenterKey, name: record.name, department: record.department, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  costMetrics(metricType?: string, provider?: string, serviceName?: string) {
    return this.prisma.costMetric.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, metricType: metricType ?? undefined, provider: provider ?? undefined, serviceName: serviceName ?? undefined, deletedAt: null }, include: { costCenter: true }, orderBy: { periodEnd: 'desc' }, take: 100 });
  }

  async createCostMetric(dto: CreateCostMetricDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.costMetric.create({ data: { tenantId, workspaceId, costCenterId: dto.costCenterId, metricKey: dto.metricKey ?? `cost-metric-${randomUUID()}`, metricName: dto.metricName, metricType: dto.metricType ?? 'cost', amount: dto.amount, currency: dto.currency ?? 'USD', periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), provider: dto.provider, serviceName: dto.serviceName, dimensions: dto.dimensions ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'cost.metric.recorded', source: 'finops', subject: { type: 'cost_metric', id: record.id }, payload: { metricName: record.metricName, metricType: record.metricType, amount: record.amount, currency: record.currency }, actorUserId: this.context.context()?.userId });
    return record;
  }

  forecasts(forecastType?: string, horizon?: string) {
    return this.prisma.costForecast.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, forecastType: forecastType ?? undefined, horizon: horizon ?? undefined, deletedAt: null }, include: { costCenter: true }, orderBy: { forecastAt: 'desc' }, take: 100 });
  }

  async createForecast(dto: CreateCostForecastDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.costForecast.create({ data: { tenantId, workspaceId, costCenterId: dto.costCenterId, forecastKey: dto.forecastKey ?? `cost-forecast-${randomUUID()}`, forecastType: dto.forecastType ?? 'monthly', horizon: dto.horizon ?? '30d', predictedCost: dto.predictedCost, currency: dto.currency ?? 'USD', confidence: dto.confidence, baselineCost: dto.baselineCost, variancePercent: dto.variancePercent, forecastAt: dto.forecastAt ? new Date(dto.forecastAt) : new Date(), signals: dto.signals ?? [], assumptions: dto.assumptions ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'cost.forecast.created', source: 'finops', subject: { type: 'cost_forecast', id: record.id }, payload: { forecastType: record.forecastType, horizon: record.horizon, predictedCost: record.predictedCost, confidence: record.confidence }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [costCenters, metrics, forecasts] = await Promise.all([this.costCenters(), this.costMetrics(), this.forecasts()]);
    const totalCost = metrics.reduce((sum: number, metric: { amount: number }) => sum + Number(metric.amount), 0);
    return { costCenters, metrics, forecasts, summary: { costCenterCount: costCenters.length, metricCount: metrics.length, forecastCount: forecasts.length, totalCost } };
  }
}