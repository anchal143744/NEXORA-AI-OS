import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateApiPlanDto, CreateApiProductDto, CreateApiSubscriptionDto, CreatePartnerAccessDto } from './dto/platform-governance.dto';

@Injectable()
export class ApiProductService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  products(category?: string, status?: string, visibility?: string) {
    return this.prisma.apiProduct.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, category: category ?? undefined, status: status ?? undefined, visibility: visibility ?? undefined, deletedAt: null },
      include: { dataContract: true, contractVersion: true, plans: true, subscriptions: true, quotas: true, rateLimitPolicies: true, partnerAccess: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createProduct(dto: CreateApiProductDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.apiProduct.create({ data: { tenantId, workspaceId, dataContractId: dto.dataContractId, contractVersionId: dto.contractVersionId, productKey: dto.productKey ?? 'api-product-' + randomUUID(), name: dto.name, description: dto.description, category: dto.category ?? 'platform', status: dto.status ?? 'draft', visibility: dto.visibility ?? 'private', basePath: dto.basePath, ownerUserId: dto.ownerUserId, tags: dto.tags ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'api.product.created', source: 'platform-governance', subject: { type: 'api_product', id: record.id }, payload: { productKey: record.productKey, category: record.category, status: record.status, visibility: record.visibility }, actorUserId: this.context.context()?.userId });
    return record;
  }

  plans(apiProductId?: string, status?: string, tier?: string) {
    return this.prisma.apiPlan.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, apiProductId: apiProductId ?? undefined, status: status ?? undefined, tier: tier ?? undefined, deletedAt: null },
      include: { apiProduct: true, quotas: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createPlan(dto: CreateApiPlanDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.apiPlan.create({ data: { tenantId, workspaceId, apiProductId: dto.apiProductId, planKey: dto.planKey ?? 'api-plan-' + randomUUID(), name: dto.name, tier: dto.tier ?? 'standard', status: dto.status ?? 'active', currency: dto.currency ?? 'USD', priceMonthly: dto.priceMonthly ?? 0, pricePerRequest: dto.pricePerRequest ?? 0, includedRequests: dto.includedRequests ?? 0, overagePrice: dto.overagePrice ?? 0, features: dto.features ?? [], limits: dto.limits ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'api.plan.created', source: 'platform-governance', subject: { type: 'api_plan', id: record.id }, payload: { planKey: record.planKey, tier: record.tier, currency: record.currency, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  subscriptions(status?: string, subscriberType?: string, apiProductId?: string) {
    return this.prisma.apiSubscription.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, apiProductId: apiProductId ?? undefined, subscriberType: subscriberType ?? undefined, status: status ?? undefined, deletedAt: null },
      include: { apiProduct: true, apiPlan: true, partnerAccess: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createSubscription(dto: CreateApiSubscriptionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.apiSubscription.create({ data: { tenantId, workspaceId, apiProductId: dto.apiProductId, apiPlanId: dto.apiPlanId, apiKeyId: dto.apiKeyId, subscriptionKey: dto.subscriptionKey ?? 'api-subscription-' + randomUUID(), subscriberType: dto.subscriberType ?? 'partner', subscriberId: dto.subscriberId, status: dto.status ?? 'active', startsAt: dto.startsAt ? new Date(dto.startsAt) : new Date(), endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'api.subscription.created', source: 'platform-governance', subject: { type: 'api_subscription', id: record.id }, payload: { subscriptionKey: record.subscriptionKey, subscriberType: record.subscriberType, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  partnerAccess(status?: string, partnerType?: string) {
    return this.prisma.partnerAccess.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, partnerType: partnerType ?? undefined, deletedAt: null },
      include: { apiProduct: true, subscription: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createPartnerAccess(dto: CreatePartnerAccessDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.partnerAccess.create({ data: { tenantId, workspaceId, apiProductId: dto.apiProductId, subscriptionId: dto.subscriptionId, partnerKey: dto.partnerKey ?? 'partner-access-' + randomUUID(), partnerName: dto.partnerName, partnerType: dto.partnerType ?? 'technology', status: dto.status ?? 'pending', accessLevel: dto.accessLevel ?? 'read', approvedByUserId: dto.approvedByUserId ?? this.context.context()?.userId, approvedAt: dto.approvedAt ? new Date(dto.approvedAt) : undefined, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, permissions: dto.permissions ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'partner.access.created', source: 'platform-governance', subject: { type: 'partner_access', id: record.id }, payload: { partnerKey: record.partnerKey, partnerName: record.partnerName, status: record.status, accessLevel: record.accessLevel }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async marketplace() {
    const [products, plans, subscriptions, partners] = await Promise.all([this.products(), this.plans(), this.subscriptions(), this.partnerAccess()]);
    return {
      products,
      plans,
      subscriptions,
      partners,
      summary: {
        productCount: products.length,
        publicProductCount: products.filter((product: { visibility: string }) => product.visibility === 'public').length,
        activePlanCount: plans.filter((plan: { status: string }) => plan.status === 'active').length,
        activeSubscriptionCount: subscriptions.filter((subscription: { status: string }) => subscription.status === 'active').length,
        partnerAccessCount: partners.length,
      },
    };
  }
}
