import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateForecastModelDto, GenerateForecastResultDto } from './dto/strategic-forecasting.dto';

@Injectable()
export class ForecastingService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  dashboard() {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId() ?? undefined;
    return Promise.all([
      this.prisma.forecastModel.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 20 }),
      this.prisma.forecastResult.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 30 }),
      this.prisma.riskForecast.findMany({ where: { tenantId, workspaceId, deletedAt: null, status: 'open' }, orderBy: { generatedAt: 'desc' }, take: 10 }),
      this.prisma.growthForecast.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 10 }),
    ]).then(([models, results, risks, growth]) => ({ models, results, risks, growth, summary: { modelCount: models.length, resultCount: results.length, openRiskCount: risks.length, growthForecastCount: growth.length } }));
  }

  models(forecastType?: string, status?: string) {
    return this.prisma.forecastModel.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, forecastType: forecastType ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createModel(dto: CreateForecastModelDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.forecastModel.create({ data: { tenantId, workspaceId, modelKey: dto.modelKey ?? `forecast-model-${randomUUID()}`, name: dto.name, forecastType: dto.forecastType, horizon: dto.horizon ?? 'monthly', cadence: dto.cadence ?? 'monthly', algorithm: dto.algorithm ?? 'ai_assisted', status: dto.status ?? 'active', sourceData: dto.sourceData ?? {}, assumptions: dto.assumptions ?? [], features: dto.features ?? [], confidence: dto.confidence, ownerUserId: dto.ownerUserId, lastTrainedAt: this.optionalDate(dto.lastTrainedAt), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'forecast.model.created', source: 'strategic-forecasting', subject: { type: 'forecast_model', id: record.id }, payload: { forecastType: record.forecastType, modelKey: record.modelKey }, actorUserId: this.context.context()?.userId });
    return record;
  }

  results(forecastModelId?: string, forecastType?: string) {
    return this.prisma.forecastResult.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, forecastModelId: forecastModelId ?? undefined, forecastType: forecastType ?? undefined, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 100 });
  }

  async generateResult(dto: GenerateForecastResultDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const model = await this.prisma.forecastModel.findFirst({ where: { id: dto.forecastModelId, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!model) throw new NotFoundException('Forecast model not found');
    const record = await this.prisma.forecastResult.create({ data: { tenantId, workspaceId, forecastModelId: dto.forecastModelId, resultKey: dto.resultKey ?? `forecast-result-${randomUUID()}`, forecastType: dto.forecastType, periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), horizonStart: new Date(dto.horizonStart), horizonEnd: new Date(dto.horizonEnd), baseValue: dto.baseValue, forecastValue: dto.forecastValue, lowerBound: dto.lowerBound, upperBound: dto.upperBound, confidence: dto.confidence, unit: dto.unit ?? 'amount', currencyCode: dto.currencyCode, drivers: dto.drivers ?? [], explanation: dto.explanation ?? this.defaultExplanation(dto), recommendations: dto.recommendations ?? this.defaultRecommendations(dto.forecastType), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'forecast.result.generated', source: 'strategic-forecasting', subject: { type: 'forecast_result', id: record.id }, payload: { forecastType: record.forecastType, forecastValue: record.forecastValue, confidence: record.confidence }, actorUserId: this.context.context()?.userId });
    return record;
  }

  byType(forecastType: string) {
    return Promise.all([this.models(forecastType), this.results(undefined, forecastType)]).then(([models, results]) => ({ forecastType, models, results, summary: this.summarizeResults(results) }));
  }

  private summarizeResults(results: Array<{ forecastValue: number; confidence?: number | null }>) {
    const forecastTotal = results.reduce((sum, result) => sum + Number(result.forecastValue ?? 0), 0);
    const averageConfidence = results.length ? results.reduce((sum, result) => sum + Number(result.confidence ?? 0), 0) / results.length : 0;
    return { count: results.length, forecastTotal, averageConfidence };
  }

  private optionalDate(value?: string) { return value ? new Date(value) : undefined; }
  private defaultExplanation(dto: GenerateForecastResultDto) { return { method: 'ai_assisted_forecast', basis: dto.drivers ?? [], confidence: dto.confidence ?? null }; }
  private defaultRecommendations(type: string) { return [{ action: `review_${type}_forecast_drivers` }, { action: `monitor_${type}_variance` }]; }
}