import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateStrategicGoalDto, CreateStrategicPlanDto } from './dto/strategic-forecasting.dto';

@Injectable()
export class StrategicPlanningService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  plans(status?: string, planType?: string) {
    return this.prisma.strategicPlan.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, planType: planType ?? undefined, deletedAt: null }, include: { goals: true, budgetPlans: true, capacityPlans: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createPlan(dto: CreateStrategicPlanDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.strategicPlan.create({ data: { tenantId, workspaceId, planKey: dto.planKey ?? `strategic-plan-${randomUUID()}`, name: dto.name, planType: dto.planType ?? 'annual', status: dto.status ?? 'draft', planningHorizon: dto.planningHorizon ?? 'yearly', startDate: dto.startDate ? new Date(dto.startDate) : undefined, endDate: dto.endDate ? new Date(dto.endDate) : undefined, ownerUserId: dto.ownerUserId, departments: dto.departments ?? [], kpis: dto.kpis ?? [], assumptions: dto.assumptions ?? [], objectives: dto.objectives ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'strategic.plan.created', source: 'strategic-forecasting', subject: { type: 'strategic_plan', id: record.id }, payload: { planType: record.planType, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  goals(status?: string, goalType?: string) {
    return this.prisma.strategicGoal.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, goalType: goalType ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createGoal(dto: CreateStrategicGoalDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.strategicGoal.create({ data: { tenantId, workspaceId, strategicPlanId: dto.strategicPlanId, goalKey: dto.goalKey ?? `strategic-goal-${randomUUID()}`, name: dto.name, description: dto.description, goalType: dto.goalType ?? 'growth', status: dto.status ?? 'active', priority: dto.priority ?? 'normal', ownerUserId: dto.ownerUserId, targetMetric: dto.targetMetric, targetValue: dto.targetValue, currentValue: dto.currentValue, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, kpis: dto.kpis ?? [], milestones: dto.milestones ?? [], recommendations: dto.recommendations ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'strategic.goal.created', source: 'strategic-forecasting', subject: { type: 'strategic_goal', id: record.id }, payload: { goalType: record.goalType, status: record.status, priority: record.priority }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async kpiPlanning() {
    const [plans, goals, forecasts] = await Promise.all([this.plans('active'), this.goals('active'), this.prisma.forecastResult.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 25 })]);
    return { plans, goals, forecasts, recommendations: goals.map((goal: { id: string; targetMetric?: string | null; targetValue?: number | null; currentValue?: number | null }) => ({ goalId: goal.id, metric: goal.targetMetric, gap: Number(goal.targetValue ?? 0) - Number(goal.currentValue ?? 0) })) };
  }

  departmentPlanning() {
    return Promise.all([this.plans(), this.prisma.budgetPlan.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, take: 50 }), this.prisma.capacityPlan.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, take: 50 })]).then(([plans, budgets, capacities]) => ({ plans, budgets, capacities }));
  }
}