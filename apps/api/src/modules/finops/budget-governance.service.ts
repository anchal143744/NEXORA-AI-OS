import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateBudgetTrackingDto, CreateCostAlertDto, CreateFinOpsPolicyDto } from './dto/finops.dto';

@Injectable()
export class BudgetGovernanceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  policies(policyType?: string, status?: string, enforcementMode?: string) {
    return this.prisma.finOpsPolicy.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, policyType: policyType ?? undefined, status: status ?? undefined, enforcementMode: enforcementMode ?? undefined, deletedAt: null }, include: { budgets: true, alerts: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createPolicy(dto: CreateFinOpsPolicyDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.finOpsPolicy.create({ data: { tenantId, workspaceId, policyKey: dto.policyKey ?? `finops-policy-${randomUUID()}`, name: dto.name, policyType: dto.policyType ?? 'budget', status: dto.status ?? 'active', enforcementMode: dto.enforcementMode ?? 'monitor', rules: dto.rules ?? [], thresholds: dto.thresholds ?? {}, actions: dto.actions ?? [], ownerUserId: dto.ownerUserId, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'finops.policy.created', source: 'finops', subject: { type: 'finops_policy', id: record.id }, payload: { policyKey: record.policyKey, policyType: record.policyType, status: record.status, enforcementMode: record.enforcementMode }, actorUserId: this.context.context()?.userId });
    return record;
  }

  budgets(period?: string, status?: string) {
    return this.prisma.budgetTracking.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, period: period ?? undefined, status: status ?? undefined, deletedAt: null }, include: { costCenter: true, policy: true, alerts: true }, orderBy: { periodEnd: 'desc' }, take: 100 });
  }

  async createBudget(dto: CreateBudgetTrackingDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const status = dto.status ?? (Number(dto.actualAmount ?? 0) > dto.budgetAmount ? 'over_budget' : 'tracking');
    const record = await this.prisma.budgetTracking.create({ data: { tenantId, workspaceId, costCenterId: dto.costCenterId, policyId: dto.policyId, budgetKey: dto.budgetKey ?? `budget-tracking-${randomUUID()}`, name: dto.name, period: dto.period ?? 'monthly', budgetAmount: dto.budgetAmount, actualAmount: dto.actualAmount ?? 0, forecastAmount: dto.forecastAmount, currency: dto.currency ?? 'USD', status, periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'budget.tracking.created', source: 'finops', subject: { type: 'budget_tracking', id: record.id }, payload: { name: record.name, period: record.period, budgetAmount: record.budgetAmount, actualAmount: record.actualAmount, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  alerts(severity?: string, status?: string, alertType?: string) {
    return this.prisma.costAlert.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, severity: severity ?? undefined, status: status ?? undefined, alertType: alertType ?? undefined, deletedAt: null }, include: { costCenter: true, policy: true, budget: true }, orderBy: { triggeredAt: 'desc' }, take: 100 });
  }

  async createAlert(dto: CreateCostAlertDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.costAlert.create({ data: { tenantId, workspaceId, costCenterId: dto.costCenterId, policyId: dto.policyId, budgetId: dto.budgetId, alertKey: dto.alertKey ?? `cost-alert-${randomUUID()}`, alertType: dto.alertType ?? 'budget', severity: dto.severity ?? 'medium', status: dto.status ?? 'open', title: dto.title, message: dto.message, thresholdAmount: dto.thresholdAmount, actualAmount: dto.actualAmount, currency: dto.currency ?? 'USD', triggeredAt: dto.triggeredAt ? new Date(dto.triggeredAt) : new Date(), acknowledgedAt: dto.acknowledgedAt ? new Date(dto.acknowledgedAt) : undefined, resolvedAt: dto.resolvedAt ? new Date(dto.resolvedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'cost.alert.created', source: 'finops', subject: { type: 'cost_alert', id: record.id }, payload: { alertType: record.alertType, severity: record.severity, status: record.status, title: record.title }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [policies, budgets, alerts] = await Promise.all([this.policies(), this.budgets(), this.alerts()]);
    const totalBudget = budgets.reduce((sum: number, item: { budgetAmount: number }) => sum + Number(item.budgetAmount), 0);
    const totalActual = budgets.reduce((sum: number, item: { actualAmount: number }) => sum + Number(item.actualAmount), 0);
    return { policies, budgets, alerts, summary: { activePolicyCount: policies.filter((policy: { status: string }) => policy.status === 'active').length, budgetCount: budgets.length, openAlertCount: alerts.filter((alert: { status: string }) => alert.status === 'open').length, totalBudget, totalActual } };
  }
}