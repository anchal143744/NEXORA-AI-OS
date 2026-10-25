
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { calculateReplenishmentQuantity } from './supply-chain-calculations';
import { CreateDemandForecastModelDto, CreateDemandForecastScenarioDto, CreateReplenishmentPlanDto } from './dto/supply-chain.dto';

@Injectable()
export class SupplyChainPlanningService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  forecastModels(status?: string, modelType?: string) {
    return this.prisma.demandForecastModel.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, modelType: modelType ?? undefined, deletedAt: null }, include: { scenarios: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createForecastModel(dto: CreateDemandForecastModelDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.demandForecastModel.create({ data: { tenantId, workspaceId, modelKey: dto.modelKey ?? 'demand-model-' + randomUUID(), name: dto.name, modelType: dto.modelType ?? 'statistical', status: dto.status ?? 'active', horizonDays: dto.horizonDays ?? 90, accuracyScore: dto.accuracyScore, seasonalityProfile: dto.seasonalityProfile ?? {}, trendProfile: dto.trendProfile ?? {}, parameters: dto.parameters ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'demand.forecast.model.created', source: 'supply-chain', subject: { type: 'demand_forecast_model', id: record.id }, payload: { modelKey: record.modelKey, modelType: record.modelType, horizonDays: record.horizonDays }, actorUserId: this.context.context()?.userId });
    return record;
  }

  forecastScenarios(status?: string, scenarioType?: string, itemId?: string) {
    return this.prisma.demandForecastScenario.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, scenarioType: scenarioType ?? undefined, itemId: itemId ?? undefined, deletedAt: null }, include: { model: true, item: true }, orderBy: { periodStart: 'desc' }, take: 100 });
  }

  async createForecastScenario(dto: CreateDemandForecastScenarioDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.demandForecastScenario.create({ data: { tenantId, workspaceId, modelId: dto.modelId, itemId: dto.itemId, scenarioKey: dto.scenarioKey ?? 'demand-scenario-' + randomUUID(), name: dto.name, scenarioType: dto.scenarioType ?? 'baseline', status: dto.status ?? 'active', periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), forecastQuantity: dto.forecastQuantity ?? 0, confidence: dto.confidence, trendAnalysis: dto.trendAnalysis ?? {}, seasonalityAnalysis: dto.seasonalityAnalysis ?? {}, assumptions: dto.assumptions ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'demand.forecast.scenario.created', source: 'supply-chain', subject: { type: 'demand_forecast_scenario', id: record.id }, payload: { scenarioKey: record.scenarioKey, scenarioType: record.scenarioType, forecastQuantity: record.forecastQuantity }, actorUserId: this.context.context()?.userId });
    return record;
  }

  replenishmentPlans(status?: string, priority?: string, itemId?: string) {
    return this.prisma.replenishmentPlan.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, priority: priority ?? undefined, itemId: itemId ?? undefined, deletedAt: null }, include: { item: true, warehouse: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createReplenishmentPlan(dto: CreateReplenishmentPlanDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const recommendedQuantity = dto.recommendedQuantity ?? calculateReplenishmentQuantity({ quantityAvailable: 0, reorderPoint: dto.reorderPoint ?? 0, safetyStock: dto.safetyStock ?? 0 });
    const record = await this.prisma.replenishmentPlan.create({ data: { tenantId, workspaceId, itemId: dto.itemId, warehouseId: dto.warehouseId, planKey: dto.planKey ?? 'replenishment-plan-' + randomUUID(), status: dto.status ?? 'recommended', priority: dto.priority ?? 'normal', reorderPoint: dto.reorderPoint ?? 0, safetyStock: dto.safetyStock ?? 0, recommendedQuantity, plannedOrderDate: dto.plannedOrderDate ? new Date(dto.plannedOrderDate) : undefined, expectedReceiptDate: dto.expectedReceiptDate ? new Date(dto.expectedReceiptDate) : undefined, aiRecommendation: dto.aiRecommendation ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'replenishment.plan.created', source: 'supply-chain', subject: { type: 'replenishment_plan', id: record.id }, payload: { planKey: record.planKey, status: record.status, recommendedQuantity: record.recommendedQuantity }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async forecastingDashboard() {
    const [models, scenarios] = await Promise.all([this.forecastModels(), this.forecastScenarios()]);
    return { models, scenarios, summary: { modelCount: models.length, scenarioCount: scenarios.length, activeScenarioCount: scenarios.filter((scenario: { status: string }) => scenario.status === 'active').length } };
  }

  async replenishmentDashboard() {
    const plans = await this.replenishmentPlans();
    return { plans, summary: { planCount: plans.length, recommendedCount: plans.filter((plan: { status: string }) => plan.status === 'recommended').length, highPriorityCount: plans.filter((plan: { priority: string }) => plan.priority === 'high' || plan.priority === 'critical').length } };
  }
}
