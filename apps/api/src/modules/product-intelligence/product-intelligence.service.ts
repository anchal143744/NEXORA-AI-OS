import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateProductHealthScoreDto } from './dto/product-intelligence.dto';

@Injectable()
export class ProductIntelligenceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  async dashboard(productKey?: string) {
    const where = { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, productKey: productKey ?? undefined, deletedAt: null };
    const [healthScores, usageMetrics, featureUsage, funnelResults, experiments, retention, recommendations] = await Promise.all([
      this.prisma.productHealthScore.findMany({ where, orderBy: { calculatedAt: 'desc' }, take: 20 }),
      this.prisma.productUsageMetric.findMany({ where, orderBy: { periodEnd: 'desc' }, take: 30 }),
      this.prisma.featureUsage.findMany({ where, orderBy: { periodEnd: 'desc' }, take: 30 }),
      this.prisma.funnelResult.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 10 }),
      this.prisma.experiment.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 10 }),
      this.prisma.retentionCohort.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 10 }),
      this.prisma.growthRecommendation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: 'open', deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 15 }),
    ]);
    return { healthScores, usageMetrics, featureUsage, funnelResults, experiments, retention, recommendations, summary: { latestHealth: healthScores[0] ?? null, openRecommendationCount: recommendations.length, activeExperimentCount: experiments.filter((experiment: { status: string }) => experiment.status === 'running').length } };
  }

  healthScores(moduleKey?: string, scoreBand?: string) {
    return this.prisma.productHealthScore.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, moduleKey: moduleKey ?? undefined, scoreBand: scoreBand ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 100 });
  }

  async createHealthScore(dto: CreateProductHealthScoreDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const scoreBand = dto.scoreBand ?? this.healthBand(dto.score);
    const record = await this.prisma.productHealthScore.create({ data: { tenantId, workspaceId, scoreKey: dto.scoreKey ?? `product-health-${randomUUID()}`, productKey: dto.productKey ?? 'nexora', moduleKey: dto.moduleKey, score: dto.score, scoreBand, previousScore: dto.previousScore, trend: dto.trend ?? this.trend(dto.score, dto.previousScore), drivers: dto.drivers ?? [], risks: dto.risks ?? [], successMetrics: dto.successMetrics ?? {}, recommendations: dto.recommendations ?? this.defaultRecommendations(scoreBand), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'product.health.scored', source: 'product-intelligence', subject: { type: 'product_health_score', id: record.id }, payload: { productKey: record.productKey, moduleKey: record.moduleKey, score: record.score, scoreBand: record.scoreBand }, actorUserId: this.context.context()?.userId });
    return record;
  }

  latestHealth(moduleKey?: string) {
    return this.prisma.productHealthScore.findFirst({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, moduleKey: moduleKey ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' } });
  }

  async insights(moduleKey?: string) {
    const [health, metrics, featureUsage, recommendations] = await Promise.all([this.latestHealth(moduleKey), this.prisma.productUsageMetric.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, moduleKey: moduleKey ?? undefined, deletedAt: null }, orderBy: { periodEnd: 'desc' }, take: 20 }), this.prisma.featureUsage.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, moduleKey: moduleKey ?? undefined, deletedAt: null }, orderBy: { periodEnd: 'desc' }, take: 20 }), this.prisma.growthRecommendation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, targetType: moduleKey ? 'module' : undefined, targetId: moduleKey ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 20 })]);
    return { moduleKey, health, metrics, featureUsage, recommendations, insight: health ? `Product health is ${health.scoreBand} with score ${health.score}.` : 'No product health score has been calculated yet.' };
  }

  async riskDetection(moduleKey?: string) {
    const [healthScores, funnelResults, retention] = await Promise.all([this.healthScores(moduleKey), this.prisma.funnelResult.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 50 }), this.prisma.retentionCohort.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 50 })]);
    return { healthRisks: healthScores.filter((score: { scoreBand: string }) => ['at_risk', 'critical'].includes(score.scoreBand)), funnelRisks: funnelResults.filter((result: { dropOffRate?: number | null }) => Number(result.dropOffRate ?? 0) > 0.35), retentionRisks: retention.filter((cohort: { churnRate?: number | null }) => Number(cohort.churnRate ?? 0) > 0.25) };
  }

  async successMetrics(moduleKey?: string) {
    const usage = await this.prisma.featureUsage.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, moduleKey: moduleKey ?? undefined, deletedAt: null }, orderBy: { periodEnd: 'desc' }, take: 100 });
    const totalUsage = usage.reduce((sum: number, item: { usageCount: number }) => sum + item.usageCount, 0);
    const averageAdoption = usage.length ? usage.reduce((sum: number, item: { adoptionRate?: number | null }) => sum + Number(item.adoptionRate ?? 0), 0) / usage.length : 0;
    return { moduleKey, featureCount: usage.length, totalUsage, averageAdoption };
  }

  private healthBand(score: number) { return score >= 85 ? 'excellent' : score >= 70 ? 'healthy' : score >= 50 ? 'watch' : score >= 30 ? 'at_risk' : 'critical'; }
  private trend(score: number, previous?: number) { if (previous === undefined) return 'flat'; return score > previous ? 'up' : score < previous ? 'down' : 'flat'; }
  private defaultRecommendations(scoreBand: string) { return ['at_risk', 'critical'].includes(scoreBand) ? [{ action: 'run_product_bottleneck_review' }, { action: 'open_growth_recommendation' }] : [{ action: 'continue_adoption_monitoring' }]; }
}
