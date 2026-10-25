import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateGrowthForecastDto, CreateRiskForecastDto } from './dto/strategic-forecasting.dto';

@Injectable()
export class GrowthRiskForecastService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  riskForecasts(riskType?: string, severity?: string, status?: string) {
    return this.prisma.riskForecast.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, riskType: riskType ?? undefined, severity: severity ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 100 });
  }

  async createRisk(dto: CreateRiskForecastDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const severity = dto.severity ?? this.severity(dto.probability, dto.impactScore);
    const record = await this.prisma.riskForecast.create({ data: { tenantId, workspaceId, riskKey: dto.riskKey ?? `risk-forecast-${randomUUID()}`, riskType: dto.riskType, riskName: dto.riskName, severity, probability: dto.probability, impactScore: dto.impactScore, confidence: dto.confidence, horizonStart: dto.horizonStart ? new Date(dto.horizonStart) : undefined, horizonEnd: dto.horizonEnd ? new Date(dto.horizonEnd) : undefined, drivers: dto.drivers ?? [], mitigationActions: dto.mitigationActions ?? [{ action: `mitigate_${dto.riskType}` }], status: dto.status ?? 'open', metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'risk.forecast.generated', source: 'strategic-forecasting', subject: { type: 'risk_forecast', id: record.id }, payload: { riskType: record.riskType, severity: record.severity, probability: record.probability, impactScore: record.impactScore }, actorUserId: this.context.context()?.userId });
    return record;
  }

  alerts() {
    return this.riskForecasts(undefined, undefined, 'open').then((risks: Array<{ severity: string }>) => ({ risks, alerts: risks.filter((risk: { severity: string }) => ['high', 'critical'].includes(risk.severity)) }));
  }

  mitigation() {
    return this.riskForecasts(undefined, undefined, 'open').then((risks: Array<{ id: string; mitigationActions: unknown }>) => ({ risks, mitigationPlan: risks.flatMap((risk: { id: string; mitigationActions: unknown }) => Array.isArray(risk.mitigationActions) ? risk.mitigationActions.map((action) => ({ riskId: risk.id, action })) : []) }));
  }

  growthForecasts(growthType?: string) {
    return this.prisma.growthForecast.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, growthType: growthType ?? undefined, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 100 });
  }

  async createGrowth(dto: CreateGrowthForecastDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const growthRate = dto.growthRate ?? this.growthRate(dto.baselineValue, dto.forecastValue);
    const record = await this.prisma.growthForecast.create({ data: { tenantId, workspaceId, growthKey: dto.growthKey ?? `growth-forecast-${randomUUID()}`, growthType: dto.growthType, metricName: dto.metricName, baselineValue: dto.baselineValue, forecastValue: dto.forecastValue, growthRate, confidence: dto.confidence, horizonStart: dto.horizonStart ? new Date(dto.horizonStart) : undefined, horizonEnd: dto.horizonEnd ? new Date(dto.horizonEnd) : undefined, drivers: dto.drivers ?? [], opportunities: dto.opportunities ?? [{ opportunity: `improve_${dto.metricName}` }], recommendedActions: dto.recommendedActions ?? [{ action: `accelerate_${dto.growthType}` }], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'growth.forecast.generated', source: 'strategic-forecasting', subject: { type: 'growth_forecast', id: record.id }, payload: { growthType: record.growthType, metricName: record.metricName, growthRate: record.growthRate }, actorUserId: this.context.context()?.userId });
    return record;
  }

  recommendations() {
    return this.growthForecasts().then((growth: Array<{ id: string; recommendedActions: unknown }>) => ({ growth, recommendations: growth.flatMap((item: { id: string; recommendedActions: unknown }) => Array.isArray(item.recommendedActions) ? item.recommendedActions.map((action) => ({ growthForecastId: item.id, action })) : []) }));
  }

  private severity(probability?: number, impact?: number) { const score = Number(probability ?? 0) * Number(impact ?? 0); return score >= 0.75 ? 'critical' : score >= 0.5 ? 'high' : score >= 0.25 ? 'medium' : 'low'; }
  private growthRate(base?: number, forecast?: number) { return base && forecast ? (forecast - base) / base : undefined; }
}