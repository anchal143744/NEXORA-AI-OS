
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateBudgetAllocationDto, CreateCostOptimizationRecommendationDto, CreateProcurementEventDto, CreateSpendInsightDto, CreateSpendTransactionDto } from './dto/procurement.dto';

@Injectable()
export class SpendIntelligenceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  budgets(status?: string, purchaseCategoryId?: string) {
    return this.prisma.budgetAllocation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, purchaseCategoryId: purchaseCategoryId ?? undefined, deletedAt: null }, include: { purchaseCategory: true }, orderBy: { periodStart: 'desc' }, take: 100 });
  }

  async createBudget(dto: CreateBudgetAllocationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.budgetAllocation.create({ data: { tenantId, workspaceId, purchaseCategoryId: dto.purchaseCategoryId, budgetKey: dto.budgetKey ?? 'budget-allocation-' + randomUUID(), departmentId: dto.departmentId, ownerUserId: dto.ownerUserId, periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), currency: dto.currency ?? 'USD', allocatedAmount: dto.allocatedAmount ?? 0, committedAmount: dto.committedAmount ?? 0, spentAmount: dto.spentAmount ?? 0, remainingAmount: dto.remainingAmount ?? 0, status: dto.status ?? 'active', thresholdPercent: dto.thresholdPercent, controls: dto.controls ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'budget.allocation.created', source: 'procurement', subject: { type: 'budget_allocation', id: record.id }, payload: { budgetKey: record.budgetKey, allocatedAmount: record.allocatedAmount, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  transactions(status?: string, spendType?: string, vendorId?: string) {
    return this.prisma.spendTransaction.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, spendType: spendType ?? undefined, vendorId: vendorId ?? undefined, deletedAt: null }, include: { vendor: true, purchaseOrder: true, purchaseCategory: true }, orderBy: { transactionDate: 'desc' }, take: 100 });
  }

  async createTransaction(dto: CreateSpendTransactionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.spendTransaction.create({ data: { tenantId, workspaceId, vendorId: dto.vendorId, purchaseOrderId: dto.purchaseOrderId, purchaseCategoryId: dto.purchaseCategoryId, transactionKey: dto.transactionKey ?? 'spend-transaction-' + randomUUID(), transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : undefined, source: dto.source ?? 'procurement', spendType: dto.spendType ?? 'purchase', currency: dto.currency ?? 'USD', amount: dto.amount ?? 0, taxAmount: dto.taxAmount ?? 0, status: dto.status ?? 'posted', invoiceReference: dto.invoiceReference, paymentReference: dto.paymentReference, costCenterId: dto.costCenterId, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'spend.transaction.recorded', source: 'procurement', subject: { type: 'spend_transaction', id: record.id }, payload: { transactionKey: record.transactionKey, amount: record.amount, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  insights(severity?: string, status?: string, insightType?: string) {
    return this.prisma.spendInsight.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, severity: severity ?? undefined, status: status ?? undefined, insightType: insightType ?? undefined, deletedAt: null }, include: { purchaseCategory: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createInsight(dto: CreateSpendInsightDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.spendInsight.create({ data: { tenantId, workspaceId, purchaseCategoryId: dto.purchaseCategoryId, insightKey: dto.insightKey ?? 'spend-insight-' + randomUUID(), insightType: dto.insightType, title: dto.title, severity: dto.severity ?? 'info', status: dto.status ?? 'open', timeframeStart: dto.timeframeStart ? new Date(dto.timeframeStart) : undefined, timeframeEnd: dto.timeframeEnd ? new Date(dto.timeframeEnd) : undefined, amountImpact: dto.amountImpact ?? 0, confidence: dto.confidence, findings: dto.findings ?? [], recommendations: dto.recommendations ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'spend.insight.created', source: 'procurement', subject: { type: 'spend_insight', id: record.id }, payload: { insightKey: record.insightKey, severity: record.severity, insightType: record.insightType }, actorUserId: this.context.context()?.userId });
    return record;
  }

  recommendations(status?: string, priority?: string, recommendationType?: string) {
    return this.prisma.costOptimizationRecommendation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, priority: priority ?? undefined, recommendationType: recommendationType ?? undefined, deletedAt: null }, include: { vendor: true, purchaseCategory: true }, orderBy: { detectedAt: 'desc' }, take: 100 });
  }

  async createRecommendation(dto: CreateCostOptimizationRecommendationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.costOptimizationRecommendation.create({ data: { tenantId, workspaceId, vendorId: dto.vendorId, purchaseCategoryId: dto.purchaseCategoryId, recommendationKey: dto.recommendationKey ?? 'cost-optimization-' + randomUUID(), title: dto.title, recommendationType: dto.recommendationType ?? 'cost_saving', status: dto.status ?? 'open', priority: dto.priority ?? 'normal', estimatedSavings: dto.estimatedSavings ?? 0, confidence: dto.confidence, implementationEffort: dto.implementationEffort ?? 'medium', detectedAt: dto.detectedAt ? new Date(dto.detectedAt) : undefined, actions: dto.actions ?? [], evidence: dto.evidence ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'cost.optimization.recommendation.created', source: 'procurement', subject: { type: 'cost_optimization_recommendation', id: record.id }, payload: { recommendationKey: record.recommendationKey, priority: record.priority, estimatedSavings: record.estimatedSavings }, actorUserId: this.context.context()?.userId });
    return record;
  }

  procurementEvents(eventType?: string, severity?: string, vendorId?: string) {
    return this.prisma.procurementEvent.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, eventType: eventType ?? undefined, severity: severity ?? undefined, vendorId: vendorId ?? undefined, deletedAt: null }, include: { vendor: true, procurementRequest: true, purchaseOrder: true }, orderBy: { occurredAt: 'desc' }, take: 100 });
  }

  async createEvent(dto: CreateProcurementEventDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.procurementEvent.create({ data: { tenantId, workspaceId, vendorId: dto.vendorId, procurementRequestId: dto.procurementRequestId, purchaseOrderId: dto.purchaseOrderId, eventKey: dto.eventKey ?? 'procurement-event-' + randomUUID(), eventType: dto.eventType, source: dto.source ?? 'procurement', severity: dto.severity ?? 'info', subjectType: dto.subjectType, subjectId: dto.subjectId, payload: dto.payload ?? {}, occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : undefined, processedAt: dto.processedAt ? new Date(dto.processedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'procurement.event.created', source: 'procurement', subject: { type: 'procurement_event', id: record.id }, payload: { eventKey: record.eventKey, eventType: record.eventType, severity: record.severity }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async spendDashboard() {
    const [transactions, insights] = await Promise.all([this.transactions(), this.insights()]);
    return { transactions, insights, summary: { transactionCount: transactions.length, insightCount: insights.length, criticalInsightCount: insights.filter((insight: { severity: string }) => insight.severity === 'critical').length } };
  }

  async budgetDashboard() {
    const budgets = await this.budgets();
    return { budgets, summary: { budgetCount: budgets.length, activeBudgetCount: budgets.filter((budget: { status: string }) => budget.status === 'active').length, thresholdBudgetCount: budgets.filter((budget: { thresholdPercent: number | null }) => typeof budget.thresholdPercent === 'number' && budget.thresholdPercent >= 90).length } };
  }

  async optimizationDashboard() {
    const recommendations = await this.recommendations();
    return { recommendations, summary: { recommendationCount: recommendations.length, openRecommendationCount: recommendations.filter((recommendation: { status: string }) => recommendation.status === 'open').length, highPriorityCount: recommendations.filter((recommendation: { priority: string }) => recommendation.priority === 'high' || recommendation.priority === 'critical').length } };
  }
}
