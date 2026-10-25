import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateRevenueOpportunityDto, CreateRevenueRiskDto } from './dto/customer-experience.dto';

@Injectable()
export class RevenueEngagementService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  revenueOpportunities(customerIdentityId?: string, opportunityType?: string) {
    return this.prisma.revenueOpportunity.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, opportunityType: opportunityType ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createRevenueOpportunity(dto: CreateRevenueOpportunityDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const opportunity = await this.prisma.revenueOpportunity.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, opportunityKey: dto.opportunityKey ?? `revenue-${randomUUID()}`, opportunityType: dto.opportunityType ?? 'expansion', title: dto.title, status: dto.status ?? 'open', priority: dto.priority ?? 'normal', estimatedValue: dto.estimatedValue, probability: dto.probability, expectedCloseAt: dto.expectedCloseAt ? new Date(dto.expectedCloseAt) : undefined, source: dto.source ?? 'ai', signals: dto.signals ?? [], recommendations: dto.recommendations ?? this.defaultRecommendations(dto.opportunityType), ownerUserId: dto.ownerUserId ?? this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'revenue.opportunity.created', source: 'revenue-engagement', subject: { type: 'revenue_opportunity', id: opportunity.id }, payload: { opportunityType: opportunity.opportunityType, title: opportunity.title, priority: opportunity.priority }, actorUserId: this.context.context()?.userId });
    return opportunity;
  }

  async createUpsellOpportunity(dto: CreateRevenueOpportunityDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const upsell = await this.prisma.upsellOpportunity.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, opportunityKey: dto.opportunityKey ?? `upsell-${randomUUID()}`, title: dto.title, productOrService: dto.opportunityType, status: dto.status ?? 'open', priority: dto.priority ?? 'normal', estimatedValue: dto.estimatedValue, probability: dto.probability, triggerSignals: dto.signals ?? [], recommendedActions: dto.recommendations ?? this.defaultRecommendations('upsell'), ownerUserId: dto.ownerUserId ?? this.context.context()?.userId, expectedCloseAt: dto.expectedCloseAt ? new Date(dto.expectedCloseAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'revenue.opportunity.created', source: 'upsell-engine', subject: { type: 'upsell_opportunity', id: upsell.id }, payload: { title: upsell.title, priority: upsell.priority }, actorUserId: this.context.context()?.userId });
    return upsell;
  }

  upsellOpportunities(customerIdentityId?: string) {
    return this.prisma.upsellOpportunity.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createCrossSellOpportunity(dto: CreateRevenueOpportunityDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const crossSell = await this.prisma.crossSellOpportunity.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, opportunityKey: dto.opportunityKey ?? `cross-sell-${randomUUID()}`, title: dto.title, productOrService: dto.opportunityType, status: dto.status ?? 'open', priority: dto.priority ?? 'normal', estimatedValue: dto.estimatedValue, probability: dto.probability, complementSignals: dto.signals ?? [], recommendedActions: dto.recommendations ?? this.defaultRecommendations('cross_sell'), ownerUserId: dto.ownerUserId ?? this.context.context()?.userId, expectedCloseAt: dto.expectedCloseAt ? new Date(dto.expectedCloseAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'revenue.opportunity.created', source: 'cross-sell-engine', subject: { type: 'cross_sell_opportunity', id: crossSell.id }, payload: { title: crossSell.title, priority: crossSell.priority }, actorUserId: this.context.context()?.userId });
    return crossSell;
  }

  crossSellOpportunities(customerIdentityId?: string) {
    return this.prisma.crossSellOpportunity.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  revenueRisks(customerIdentityId?: string, severity?: string) {
    return this.prisma.revenueRisk.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, severity: severity ?? undefined, deletedAt: null }, orderBy: { detectedAt: 'desc' }, take: 100 });
  }

  async createRevenueRisk(dto: CreateRevenueRiskDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const risk = await this.prisma.revenueRisk.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, riskKey: dto.riskKey ?? `revenue-risk-${randomUUID()}`, riskType: dto.riskType ?? 'renewal', severity: dto.severity ?? 'medium', status: dto.status ?? 'open', atRiskValue: dto.atRiskValue, probability: dto.probability, drivers: dto.drivers ?? [], mitigationActions: dto.mitigationActions ?? [], ownerUserId: dto.ownerUserId ?? this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'revenue.risk.detected', source: 'revenue-risk-engine', subject: { type: 'revenue_risk', id: risk.id }, payload: { riskType: risk.riskType, severity: risk.severity, atRiskValue: risk.atRiskValue }, actorUserId: this.context.context()?.userId });
    return risk;
  }

  async growthRecommendations(customerIdentityId?: string) {
    const [opportunities, upsells, crossSells, risks] = await Promise.all([this.revenueOpportunities(customerIdentityId), this.upsellOpportunities(customerIdentityId), this.crossSellOpportunities(customerIdentityId), this.revenueRisks(customerIdentityId)]);
    return { customerIdentityId, opportunities, upsells, crossSells, risks, recommendations: [{ action: 'prioritize_high_probability_expansion', count: opportunities.filter((item: { probability?: number | null }) => (item.probability ?? 0) > 0.6).length }, { action: 'mitigate_open_revenue_risks', count: risks.filter((risk: { status: string }) => risk.status === 'open').length }] };
  }

  customerValuePrediction(customerIdentityId?: string) {
    return this.revenueOpportunities(customerIdentityId).then((opportunities: Array<{ estimatedValue?: unknown; probability?: number | null }>) => {
      const predictedValue = opportunities.reduce((sum, item) => sum + Number(item.estimatedValue ?? 0) * Number(item.probability ?? 0.5), 0);
      return { customerIdentityId, predictedExpansionValue: predictedValue, opportunityCount: opportunities.length };
    });
  }

  private defaultRecommendations(type?: string) { return [{ action: type === 'cross_sell' ? 'map_adjacent_need' : 'prepare_value_case' }, { action: 'schedule_revenue_review' }]; }
}
