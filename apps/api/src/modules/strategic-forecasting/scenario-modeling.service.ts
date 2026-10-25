import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateScenarioModelDto, GenerateScenarioResultDto } from './dto/strategic-forecasting.dto';

@Injectable()
export class ScenarioModelingService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  scenarios(status?: string, scenarioType?: string) {
    return this.prisma.scenarioModel.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, scenarioType: scenarioType ?? undefined, deletedAt: null }, include: { results: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createScenario(dto: CreateScenarioModelDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.scenarioModel.create({ data: { tenantId, workspaceId, strategicPlanId: dto.strategicPlanId, scenarioKey: dto.scenarioKey ?? `scenario-${randomUUID()}`, name: dto.name, scenarioType: dto.scenarioType ?? 'what_if', status: dto.status ?? 'draft', baseCase: dto.baseCase ?? {}, assumptions: dto.assumptions ?? [], variables: dto.variables ?? {}, createdByUserId: dto.createdByUserId ?? this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'scenario.model.created', source: 'strategic-forecasting', subject: { type: 'scenario_model', id: record.id }, payload: { scenarioType: record.scenarioType, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  results(scenarioModelId?: string) {
    return this.prisma.scenarioResult.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, scenarioModelId: scenarioModelId ?? undefined, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 100 });
  }

  async generateResult(dto: GenerateScenarioResultDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const scenario = await this.prisma.scenarioModel.findFirst({ where: { id: dto.scenarioModelId, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!scenario) throw new NotFoundException('Scenario model not found');
    const record = await this.prisma.scenarioResult.create({ data: { tenantId, workspaceId, scenarioModelId: dto.scenarioModelId, resultKey: dto.resultKey ?? `scenario-result-${randomUUID()}`, outcomeSummary: dto.outcomeSummary, kpiImpacts: dto.kpiImpacts ?? [], financialImpact: dto.financialImpact ?? {}, riskImpact: dto.riskImpact ?? {}, recommendedActions: dto.recommendedActions ?? [{ action: 'review_scenario_assumptions' }], confidence: dto.confidence, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'scenario.result.generated', source: 'strategic-forecasting', subject: { type: 'scenario_result', id: record.id }, payload: { scenarioModelId: record.scenarioModelId, confidence: record.confidence }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async studio() {
    const [scenarios, results, plans] = await Promise.all([this.scenarios(), this.results(), this.prisma.strategicPlan.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, take: 20 })]);
    return { scenarios, results, plans, modelingModes: ['base_case', 'best_case', 'worst_case', 'what_if', 'stress_test'] };
  }

  whatIf() {
    return Promise.all([this.scenarios(undefined, 'what_if'), this.prisma.forecastResult.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 20 })]).then(([scenarios, forecasts]) => ({ scenarios, forecasts, recommendations: [{ action: 'compare_base_best_worst_case' }, { action: 'quantify_budget_and_capacity_sensitivity' }] }));
  }
}