import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateGrowthRecommendationDto } from './dto/product-intelligence.dto';
import { ExperimentationService } from './experimentation.service';
import { FunnelAnalyticsService } from './funnel-analytics.service';
import { ProductIntelligenceService } from './product-intelligence.service';
import { RetentionIntelligenceService } from './retention-intelligence.service';
import { UsageAnalyticsService } from './usage-analytics.service';

@Injectable()
export class GrowthInsightsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly product: ProductIntelligenceService, private readonly usage: UsageAnalyticsService, private readonly funnels: FunnelAnalyticsService, private readonly experiments: ExperimentationService, private readonly retention: RetentionIntelligenceService) {}

  recommendations(recommendationType?: string, status?: string) {
    return this.prisma.growthRecommendation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, recommendationType: recommendationType ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: [{ priority: 'asc' }, { updatedAt: 'desc' }], take: 150 });
  }

  async createRecommendation(dto: CreateGrowthRecommendationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const recommendation = await this.prisma.growthRecommendation.create({ data: { tenantId, workspaceId, recommendationKey: dto.recommendationKey ?? `growth-rec-${randomUUID()}`, recommendationType: dto.recommendationType, title: dto.title, description: dto.description, priority: dto.priority ?? 'normal', status: dto.status ?? 'open', impactScore: dto.impactScore, confidence: dto.confidence, source: dto.source ?? 'ai_product_copilot', targetType: dto.targetType, targetId: dto.targetId, evidence: dto.evidence ?? [], actions: dto.actions ?? [], ownerUserId: dto.ownerUserId ?? this.context.context()?.userId, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'growth.recommendation.created', source: 'ai-product-copilot', subject: { type: 'growth_recommendation', id: recommendation.id }, payload: { recommendationType: recommendation.recommendationType, priority: recommendation.priority, title: recommendation.title }, actorUserId: this.context.context()?.userId });
    return recommendation;
  }

  async productInsights(moduleKey?: string) {
    const [insights, risks, metrics] = await Promise.all([this.product.insights(moduleKey), this.product.riskDetection(moduleKey), this.product.successMetrics(moduleKey)]);
    return { moduleKey, insights, risks, metrics };
  }

  async adoptionRecommendations(moduleKey?: string) {
    const usage = await this.usage.featureUsage(moduleKey);
    const lowAdoption = usage.filter((item: { adoptionRate?: number | null }) => Number(item.adoptionRate ?? 0) < 0.35);
    return { moduleKey, lowAdoption, recommendations: lowAdoption.map((item: { featureKey: string }) => ({ featureKey: item.featureKey, action: 'launch_feature_enablement_experiment' })) };
  }

  async growthRecommendations() {
    const [dashboard, existing] = await Promise.all([this.product.dashboard(), this.recommendations(undefined, 'open')]);
    return { dashboard, existing, recommendations: [{ type: 'activation', action: 'optimize_onboarding_funnel' }, { type: 'retention', action: 'increase_weekly_stickiness' }, { type: 'experimentation', action: 'run_high_impact_ab_test' }] };
  }

  funnelOptimizationSuggestions(funnelId?: string) {
    return this.funnels.conversionRecommendations(funnelId);
  }

  retentionImprovementSuggestions() {
    return this.retention.retentionSuggestions();
  }

  experimentRecommendations() {
    return this.experiments.dashboard().then((dashboard: Record<string, unknown>) => ({ dashboard, recommendations: [{ action: 'prioritize_experiments_with_primary_metric' }, { action: 'stop_inconclusive_low_sample_tests' }] }));
  }
}
