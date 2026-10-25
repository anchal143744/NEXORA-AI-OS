import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateApiBillingDto, CreateApiQuotaDto, CreateApiUsageRecordDto, CreateGovernancePolicyDto, CreateRateLimitPolicyDto } from './dto/platform-governance.dto';

@Injectable()
export class ApiMonetizationService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  usage(endpoint?: string, apiProductId?: string, subscriptionId?: string) {
    return this.prisma.apiUsageRecord.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, endpoint: endpoint ?? undefined, apiProductId: apiProductId ?? undefined, subscriptionId: subscriptionId ?? undefined, deletedAt: null },
      include: { apiProduct: true, subscription: true },
      orderBy: { occurredAt: 'desc' },
      take: 100,
    });
  }

  async createUsage(dto: CreateApiUsageRecordDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.apiUsageRecord.create({ data: { tenantId, workspaceId, apiProductId: dto.apiProductId, subscriptionId: dto.subscriptionId, apiKeyId: dto.apiKeyId, usageKey: dto.usageKey ?? 'api-usage-' + randomUUID(), endpoint: dto.endpoint, method: dto.method ?? 'GET', statusCode: dto.statusCode, requestCount: dto.requestCount ?? 1, billableUnits: dto.billableUnits ?? 1, latencyMs: dto.latencyMs, costAmount: dto.costAmount ?? 0, currency: dto.currency ?? 'USD', occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(), dimensions: dto.dimensions ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'api.usage.recorded', source: 'platform-governance', subject: { type: 'api_usage_record', id: record.id }, payload: { endpoint: record.endpoint, method: record.method, requestCount: record.requestCount, currency: record.currency }, actorUserId: this.context.context()?.userId });
    return record;
  }

  billings(status?: string, subscriptionId?: string) {
    return this.prisma.apiBilling.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, subscriptionId: subscriptionId ?? undefined, status: status ?? undefined, deletedAt: null },
      include: { apiPlan: true, subscription: true },
      orderBy: { periodEnd: 'desc' },
      take: 100,
    });
  }

  async createBilling(dto: CreateApiBillingDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.apiBilling.create({ data: { tenantId, workspaceId, apiPlanId: dto.apiPlanId, subscriptionId: dto.subscriptionId, billingKey: dto.billingKey ?? 'api-billing-' + randomUUID(), periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), usageUnits: dto.usageUnits ?? 0, subtotal: dto.subtotal ?? 0, taxAmount: dto.taxAmount ?? 0, totalAmount: dto.totalAmount ?? 0, currency: dto.currency ?? 'USD', status: dto.status ?? 'open', dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'api.billing.created', source: 'platform-governance', subject: { type: 'api_billing', id: record.id }, payload: { billingKey: record.billingKey, status: record.status, currency: record.currency }, actorUserId: this.context.context()?.userId });
    return record;
  }

  policies(policyType?: string, status?: string, enforcementMode?: string) {
    return this.prisma.governancePolicy.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, policyType: policyType ?? undefined, status: status ?? undefined, enforcementMode: enforcementMode ?? undefined, deletedAt: null },
      include: { dataContract: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createPolicy(dto: CreateGovernancePolicyDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.governancePolicy.create({ data: { tenantId, workspaceId, dataContractId: dto.dataContractId, policyKey: dto.policyKey ?? 'governance-policy-' + randomUUID(), name: dto.name, policyType: dto.policyType ?? 'platform', status: dto.status ?? 'active', enforcementMode: dto.enforcementMode ?? 'monitor', rules: dto.rules ?? [], approvalWorkflow: dto.approvalWorkflow ?? {}, ownerUserId: dto.ownerUserId, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'governance.policy.created', source: 'platform-governance', subject: { type: 'governance_policy', id: record.id }, payload: { policyKey: record.policyKey, policyType: record.policyType, enforcementMode: record.enforcementMode, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  quotas(apiProductId?: string, quotaType?: string, status?: string) {
    return this.prisma.apiQuota.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, apiProductId: apiProductId ?? undefined, quotaType: quotaType ?? undefined, status: status ?? undefined, deletedAt: null },
      include: { apiProduct: true, apiPlan: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createQuota(dto: CreateApiQuotaDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.apiQuota.create({ data: { tenantId, workspaceId, apiProductId: dto.apiProductId, apiPlanId: dto.apiPlanId, quotaKey: dto.quotaKey ?? 'api-quota-' + randomUUID(), quotaType: dto.quotaType ?? 'requests', limit: dto.limit ?? 0, period: dto.period ?? 'month', used: dto.used ?? 0, resetAt: dto.resetAt ? new Date(dto.resetAt) : undefined, status: dto.status ?? 'active', metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'api.quota.created', source: 'platform-governance', subject: { type: 'api_quota', id: record.id }, payload: { quotaKey: record.quotaKey, quotaType: record.quotaType, period: record.period, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  rateLimits(apiProductId?: string, scopeType?: string, status?: string) {
    return this.prisma.rateLimitPolicy.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, apiProductId: apiProductId ?? undefined, scopeType: scopeType ?? undefined, status: status ?? undefined, deletedAt: null },
      include: { apiProduct: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createRateLimit(dto: CreateRateLimitPolicyDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.rateLimitPolicy.create({ data: { tenantId, workspaceId, apiProductId: dto.apiProductId, policyKey: dto.policyKey ?? 'rate-limit-policy-' + randomUUID(), name: dto.name, scopeType: dto.scopeType ?? 'api_key', limit: dto.limit, windowSeconds: dto.windowSeconds, burstLimit: dto.burstLimit, status: dto.status ?? 'active', enforcementMode: dto.enforcementMode ?? 'enforce', metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'rate.limit.policy.created', source: 'platform-governance', subject: { type: 'rate_limit_policy', id: record.id }, payload: { policyKey: record.policyKey, scopeType: record.scopeType, limit: record.limit, windowSeconds: record.windowSeconds, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [usage, billings, policies, quotas, rateLimits] = await Promise.all([this.usage(), this.billings(), this.policies(), this.quotas(), this.rateLimits()]);
    const totalRequests = usage.reduce((sum: number, item: { requestCount: number }) => sum + item.requestCount, 0);
    const totalBilling = billings.reduce((sum: number, item: { totalAmount: unknown }) => sum + Number(item.totalAmount ?? 0), 0);
    const quotaLimit = quotas.reduce((sum: number, item: { limit: unknown }) => sum + Number(item.limit ?? 0), 0);
    const quotaUsed = quotas.reduce((sum: number, item: { used: unknown }) => sum + Number(item.used ?? 0), 0);
    return {
      usage,
      billings,
      policies,
      quotas,
      rateLimits,
      summary: {
        usageRecordCount: usage.length,
        totalRequests,
        openBillingCount: billings.filter((billing: { status: string }) => billing.status === 'open').length,
        totalBilling,
        activePolicyCount: policies.filter((policy: { status: string }) => policy.status === 'active').length,
        quotaUtilization: quotaLimit > 0 ? Math.round((quotaUsed / quotaLimit) * 100) : 0,
        rateLimitPolicyCount: rateLimits.length,
      },
    };
  }
}
