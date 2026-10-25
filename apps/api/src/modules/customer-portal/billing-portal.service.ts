import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateBillingProfileDto, CreateCustomerSubscriptionDto, CreateInvoiceRecordDto, CreatePaymentMethodDto, CreateUsageMetricDto } from './dto/customer-portal.dto';

@Injectable()
export class BillingPortalService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  subscriptions(customerAccountId?: string, status?: string, planTier?: string) {
    return this.prisma.customerSubscription.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerAccountId: customerAccountId ?? undefined, status: status ?? undefined, planTier: planTier ?? undefined, deletedAt: null }, include: { customerAccount: true, billingProfile: true, invoices: true, usageMetrics: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createSubscription(dto: CreateCustomerSubscriptionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.customerSubscription.create({ data: { tenantId, workspaceId, customerAccountId: dto.customerAccountId, billingProfileId: dto.billingProfileId, subscriptionKey: dto.subscriptionKey ?? 'customer-subscription-' + randomUUID(), planName: dto.planName, planTier: dto.planTier ?? 'standard', status: dto.status ?? 'active', currency: dto.currency ?? 'USD', amountMonthly: dto.amountMonthly ?? 0, billingCycle: dto.billingCycle ?? 'monthly', startsAt: dto.startsAt ? new Date(dto.startsAt) : new Date(), renewsAt: dto.renewsAt ? new Date(dto.renewsAt) : undefined, cancelledAt: dto.cancelledAt ? new Date(dto.cancelledAt) : undefined, entitlements: dto.entitlements ?? [], usageLimits: dto.usageLimits ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'customer.subscription.created', source: 'customer-portal', subject: { type: 'customer_subscription', id: record.id }, payload: { subscriptionKey: record.subscriptionKey, planTier: record.planTier, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  billingProfiles(customerAccountId?: string, status?: string, currency?: string) {
    return this.prisma.billingProfile.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerAccountId: customerAccountId ?? undefined, status: status ?? undefined, currency: currency ?? undefined, deletedAt: null }, include: { customerAccount: true, subscriptions: true, invoices: true, paymentMethods: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createBillingProfile(dto: CreateBillingProfileDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.billingProfile.create({ data: { tenantId, workspaceId, customerAccountId: dto.customerAccountId, profileKey: dto.profileKey ?? 'billing-profile-' + randomUUID(), billingName: dto.billingName, billingEmail: dto.billingEmail, taxId: dto.taxId, countryCode: dto.countryCode, currency: dto.currency ?? 'USD', paymentTerms: dto.paymentTerms ?? 'net_30', status: dto.status ?? 'active', address: dto.address ?? {}, taxMetadata: dto.taxMetadata ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'billing.profile.created', source: 'customer-billing', subject: { type: 'billing_profile', id: record.id }, payload: { profileKey: record.profileKey, currency: record.currency, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  invoices(customerAccountId?: string, status?: string, subscriptionId?: string) {
    return this.prisma.invoiceRecord.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerAccountId: customerAccountId ?? undefined, subscriptionId: subscriptionId ?? undefined, status: status ?? undefined, deletedAt: null }, include: { customerAccount: true, subscription: true, billingProfile: true }, orderBy: { dueAt: 'desc' }, take: 100 });
  }

  async createInvoice(dto: CreateInvoiceRecordDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.invoiceRecord.create({ data: { tenantId, workspaceId, customerAccountId: dto.customerAccountId, subscriptionId: dto.subscriptionId, billingProfileId: dto.billingProfileId, invoiceKey: dto.invoiceKey ?? 'invoice-record-' + randomUUID(), invoiceNumber: dto.invoiceNumber, status: dto.status ?? 'draft', currency: dto.currency ?? 'USD', subtotal: dto.subtotal ?? 0, taxAmount: dto.taxAmount ?? 0, totalAmount: dto.totalAmount ?? 0, amountPaid: dto.amountPaid ?? 0, amountDue: dto.amountDue ?? 0, issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined, lineItems: dto.lineItems ?? [], taxBreakdown: dto.taxBreakdown ?? [], payments: dto.payments ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'invoice.record.created', source: 'customer-billing', subject: { type: 'invoice_record', id: record.id }, payload: { invoiceNumber: record.invoiceNumber, status: record.status, currency: record.currency }, actorUserId: this.context.context()?.userId });
    return record;
  }

  paymentMethods(customerAccountId?: string, status?: string, provider?: string) {
    return this.prisma.paymentMethod.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerAccountId: customerAccountId ?? undefined, status: status ?? undefined, provider: provider ?? undefined, deletedAt: null }, include: { customerAccount: true, billingProfile: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createPaymentMethod(dto: CreatePaymentMethodDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.paymentMethod.create({ data: { tenantId, workspaceId, customerAccountId: dto.customerAccountId, billingProfileId: dto.billingProfileId, methodKey: dto.methodKey ?? 'payment-method-' + randomUUID(), provider: dto.provider ?? 'stripe', methodType: dto.methodType ?? 'card', status: dto.status ?? 'active', brand: dto.brand, last4: dto.last4, expMonth: dto.expMonth, expYear: dto.expYear, isDefault: dto.isDefault ?? false, verifiedAt: dto.verifiedAt ? new Date(dto.verifiedAt) : undefined, billingDetails: dto.billingDetails ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'payment.method.created', source: 'customer-billing', subject: { type: 'payment_method', id: record.id }, payload: { provider: record.provider, methodType: record.methodType, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  usageMetrics(customerAccountId?: string, subscriptionId?: string, metricType?: string) {
    return this.prisma.usageMetric.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerAccountId: customerAccountId ?? undefined, subscriptionId: subscriptionId ?? undefined, metricType: metricType ?? undefined, deletedAt: null }, include: { customerAccount: true, subscription: true }, orderBy: { periodEnd: 'desc' }, take: 100 });
  }

  async createUsageMetric(dto: CreateUsageMetricDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.usageMetric.create({ data: { tenantId, workspaceId, customerAccountId: dto.customerAccountId, subscriptionId: dto.subscriptionId, metricKey: dto.metricKey ?? 'usage-metric-' + randomUUID(), metricName: dto.metricName, metricType: dto.metricType ?? 'usage', periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), quantity: dto.quantity ?? 0, unit: dto.unit ?? 'count', source: dto.source ?? 'platform', billable: dto.billable ?? true, dimensions: dto.dimensions ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'usage.metric.recorded', source: 'customer-billing', subject: { type: 'usage_metric', id: record.id }, payload: { metricName: record.metricName, metricType: record.metricType, billable: record.billable }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [subscriptions, profiles, invoices, paymentMethods, usage] = await Promise.all([this.subscriptions(), this.billingProfiles(), this.invoices(), this.paymentMethods(), this.usageMetrics()]);
    return {
      subscriptions,
      profiles,
      invoices,
      paymentMethods,
      usage,
      summary: {
        activeSubscriptions: subscriptions.filter((subscription: { status: string }) => subscription.status === 'active').length,
        billingProfileCount: profiles.length,
        openInvoiceCount: invoices.filter((invoice: { status: string }) => ['open', 'issued', 'overdue'].includes(invoice.status)).length,
        totalAmountDue: invoices.reduce((sum: number, invoice: { amountDue: unknown }) => sum + Number(invoice.amountDue ?? 0), 0),
        paymentMethodCount: paymentMethods.length,
        billableMetricCount: usage.filter((metric: { billable: boolean }) => metric.billable).length,
      },
    };
  }
}
