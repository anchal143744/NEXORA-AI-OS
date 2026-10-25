import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateBudgetPlanDto } from './dto/strategic-forecasting.dto';

@Injectable()
export class BudgetPlanningService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  plans(fiscalYear?: string, status?: string) {
    return this.prisma.budgetPlan.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, fiscalYear: fiscalYear ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async create(dto: CreateBudgetPlanDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const variance = dto.variance ?? (Number(dto.plannedBudget ?? 0) - Number(dto.allocatedBudget ?? 0));
    const record = await this.prisma.budgetPlan.create({ data: { tenantId, workspaceId, strategicPlanId: dto.strategicPlanId, budgetKey: dto.budgetKey ?? `budget-plan-${randomUUID()}`, name: dto.name, fiscalYear: dto.fiscalYear, status: dto.status ?? 'draft', departmentId: dto.departmentId, currencyCode: dto.currencyCode ?? 'USD', plannedRevenue: dto.plannedRevenue, plannedExpenses: dto.plannedExpenses, plannedBudget: dto.plannedBudget, allocatedBudget: dto.allocatedBudget, variance, assumptions: dto.assumptions ?? [], lineItems: dto.lineItems ?? [], approvals: dto.approvals ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'budget.plan.created', source: 'strategic-forecasting', subject: { type: 'budget_plan', id: record.id }, payload: { fiscalYear: record.fiscalYear, variance: record.variance, currencyCode: record.currencyCode }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async variance() {
    const plans = await this.plans();
    const totalPlanned = plans.reduce((sum: number, plan: { plannedBudget?: number | null }) => sum + Number(plan.plannedBudget ?? 0), 0);
    const totalAllocated = plans.reduce((sum: number, plan: { allocatedBudget?: number | null }) => sum + Number(plan.allocatedBudget ?? 0), 0);
    return { plans, totalPlanned, totalAllocated, variance: totalPlanned - totalAllocated };
  }

  async recommendations() {
    const analysis = await this.variance();
    return { ...analysis, recommendations: analysis.variance > 0 ? [{ action: 'allocate_unfunded_budget' }] : [{ action: 'review_overallocated_budget' }] };
  }
}