
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateProcurementApprovalDto, CreateProcurementRequestDto, CreatePurchaseCategoryDto, CreatePurchaseOrderDto } from './dto/procurement.dto';

@Injectable()
export class ProcurementWorkflowService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  categories(status?: string) {
    return this.prisma.purchaseCategory.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, deletedAt: null }, include: { budgetAllocations: true, spendTransactions: true, spendInsights: true, costOptimizationRecommendations: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createCategory(dto: CreatePurchaseCategoryDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.purchaseCategory.create({ data: { tenantId, workspaceId, categoryKey: dto.categoryKey ?? 'purchase-category-' + randomUUID(), name: dto.name, description: dto.description, parentCategoryId: dto.parentCategoryId, status: dto.status ?? 'active', budgetOwnerUserId: dto.budgetOwnerUserId, spendPolicy: dto.spendPolicy ?? {}, approvalPolicy: dto.approvalPolicy ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'purchase.category.created', source: 'procurement', subject: { type: 'purchase_category', id: record.id }, payload: { categoryKey: record.categoryKey, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  requests(status?: string, priority?: string, vendorId?: string) {
    return this.prisma.procurementRequest.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, priority: priority ?? undefined, vendorId: vendorId ?? undefined, deletedAt: null }, include: { vendor: true, purchaseCategory: true, approvals: true, purchaseOrders: true, procurementEvents: true }, orderBy: { requestedAt: 'desc' }, take: 100 });
  }

  async createRequest(dto: CreateProcurementRequestDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.procurementRequest.create({ data: { tenantId, workspaceId, vendorId: dto.vendorId, purchaseCategoryId: dto.purchaseCategoryId, requestKey: dto.requestKey ?? 'procurement-request-' + randomUUID(), title: dto.title, description: dto.description, requestType: dto.requestType ?? 'purchase', status: dto.status ?? 'draft', priority: dto.priority ?? 'normal', requestedByUserId: dto.requestedByUserId, departmentId: dto.departmentId, currency: dto.currency ?? 'USD', estimatedAmount: dto.estimatedAmount ?? 0, businessJustification: dto.businessJustification, requestedAt: dto.requestedAt ? new Date(dto.requestedAt) : undefined, requiredBy: dto.requiredBy ? new Date(dto.requiredBy) : undefined, approvalPolicy: dto.approvalPolicy ?? {}, lineItems: dto.lineItems ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'procurement.request.created', source: 'procurement', subject: { type: 'procurement_request', id: record.id }, payload: { requestKey: record.requestKey, status: record.status, priority: record.priority }, actorUserId: this.context.context()?.userId });
    return record;
  }

  approvals(status?: string, riskLevel?: string, procurementRequestId?: string) {
    return this.prisma.procurementApproval.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, riskLevel: riskLevel ?? undefined, procurementRequestId: procurementRequestId ?? undefined, deletedAt: null }, include: { procurementRequest: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createApproval(dto: CreateProcurementApprovalDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.procurementApproval.create({ data: { tenantId, workspaceId, procurementRequestId: dto.procurementRequestId, approvalKey: dto.approvalKey ?? 'procurement-approval-' + randomUUID(), approverUserId: dto.approverUserId, approverRole: dto.approverRole, status: dto.status ?? 'pending', approvalLevel: dto.approvalLevel ?? 1, riskLevel: dto.riskLevel ?? 'low', decisionAt: dto.decisionAt ? new Date(dto.decisionAt) : undefined, comments: dto.comments, policySnapshot: dto.policySnapshot ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'procurement.approval.created', source: 'procurement', subject: { type: 'procurement_approval', id: record.id }, payload: { approvalKey: record.approvalKey, status: record.status, approvalLevel: record.approvalLevel }, actorUserId: this.context.context()?.userId });
    return record;
  }

  purchaseOrders(status?: string, vendorId?: string, purchaseCategoryId?: string) {
    return this.prisma.purchaseOrder.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, vendorId: vendorId ?? undefined, purchaseCategoryId: purchaseCategoryId ?? undefined, deletedAt: null }, include: { procurementRequest: true, vendor: true, purchaseCategory: true, spendTransactions: true, procurementEvents: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createPurchaseOrder(dto: CreatePurchaseOrderDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.purchaseOrder.create({ data: { tenantId, workspaceId, procurementRequestId: dto.procurementRequestId, vendorId: dto.vendorId, purchaseCategoryId: dto.purchaseCategoryId, orderKey: dto.orderKey ?? 'purchase-order-' + randomUUID(), purchaseOrderNumber: dto.purchaseOrderNumber, status: dto.status ?? 'draft', currency: dto.currency ?? 'USD', subtotal: dto.subtotal ?? 0, taxAmount: dto.taxAmount ?? 0, totalAmount: dto.totalAmount ?? 0, issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined, expectedDeliveryAt: dto.expectedDeliveryAt ? new Date(dto.expectedDeliveryAt) : undefined, receivedAt: dto.receivedAt ? new Date(dto.receivedAt) : undefined, lineItems: dto.lineItems ?? [], terms: dto.terms ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'purchase.order.created', source: 'procurement', subject: { type: 'purchase_order', id: record.id }, payload: { orderKey: record.orderKey, status: record.status, totalAmount: record.totalAmount }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [categories, requests, approvals, purchaseOrders] = await Promise.all([this.categories(), this.requests(), this.approvals(), this.purchaseOrders()]);
    return { categories, requests, approvals, purchaseOrders, summary: { categoryCount: categories.length, requestCount: requests.length, pendingRequestCount: requests.filter((request: { status: string }) => request.status === 'pending' || request.status === 'submitted').length, pendingApprovalCount: approvals.filter((approval: { status: string }) => approval.status === 'pending').length, purchaseOrderCount: purchaseOrders.length } };
  }
}
