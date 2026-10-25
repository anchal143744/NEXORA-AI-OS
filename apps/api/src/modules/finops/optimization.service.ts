import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateEfficiencyScoreDto, CreateOptimizationRecommendationDto, CreateSavingsOpportunityDto } from './dto/finops.dto';

@Injectable()
export class OptimizationService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  recommendations(recommendationType?: string, priority?: string, status?: string) {
    return this.prisma.optimizationRecommendation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, recommendationType: recommendationType ?? undefined, priority: priority ?? undefined, status: status ?? undefined, deletedAt: null }, include: { costCenter: true, savingsOpportunities: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createRecommendation(dto: CreateOptimizationRecommendationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.optimizationRecommendation.create({ data: { tenantId, workspaceId, costCenterId: dto.costCenterId, recommendationKey: dto.recommendationKey ?? `optimization-recommendation-${randomUUID()}`, recommendationType: dto.recommendationType, title: dto.title, description: dto.description, priority: dto.priority ?? 'medium', status: dto.status ?? 'open', estimatedSavings: dto.estimatedSavings, currency: dto.currency ?? 'USD', confidence: dto.confidence, effort: dto.effort ?? 'medium', impact: dto.impact ?? {}, actions: dto.actions ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'optimization.recommendation.created', source: 'finops', subject: { type: 'optimization_recommendation', id: record.id }, payload: { recommendationType: record.recommendationType, priority: record.priority, estimatedSavings: record.estimatedSavings, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  efficiencyScores(scopeType?: string, scoreBand?: string) {
    return this.prisma.efficiencyScore.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, scopeType: scopeType ?? undefined, scoreBand: scoreBand ?? undefined, deletedAt: null }, include: { costCenter: true }, orderBy: { calculatedAt: 'desc' }, take: 100 });
  }

  async createEfficiencyScore(dto: CreateEfficiencyScoreDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.efficiencyScore.create({ data: { tenantId, workspaceId, costCenterId: dto.costCenterId, scoreKey: dto.scoreKey ?? `efficiency-score-${randomUUID()}`, scopeType: dto.scopeType ?? 'workspace', scopeId: dto.scopeId, score: dto.score, scoreBand: dto.scoreBand ?? this.scoreBand(dto.score), previousScore: dto.previousScore, trend: dto.trend ?? this.trend(dto.score, dto.previousScore), costEfficiency: dto.costEfficiency, performanceEfficiency: dto.performanceEfficiency, utilizationEfficiency: dto.utilizationEfficiency, factors: dto.factors ?? [], recommendations: dto.recommendations ?? [], calculatedAt: dto.calculatedAt ? new Date(dto.calculatedAt) : new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'efficiency.score.updated', source: 'finops', subject: { type: 'efficiency_score', id: record.id }, payload: { score: record.score, scoreBand: record.scoreBand, trend: record.trend }, actorUserId: this.context.context()?.userId });
    return record;
  }

  savingsOpportunities(opportunityType?: string, status?: string, priority?: string) {
    return this.prisma.savingsOpportunity.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, opportunityType: opportunityType ?? undefined, status: status ?? undefined, priority: priority ?? undefined, deletedAt: null }, include: { costCenter: true, recommendation: true }, orderBy: { identifiedAt: 'desc' }, take: 100 });
  }

  async createSavingsOpportunity(dto: CreateSavingsOpportunityDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.savingsOpportunity.create({ data: { tenantId, workspaceId, costCenterId: dto.costCenterId, recommendationId: dto.recommendationId, opportunityKey: dto.opportunityKey ?? `savings-opportunity-${randomUUID()}`, opportunityType: dto.opportunityType, title: dto.title, description: dto.description, estimatedSavings: dto.estimatedSavings, realizedSavings: dto.realizedSavings, currency: dto.currency ?? 'USD', confidence: dto.confidence, status: dto.status ?? 'open', priority: dto.priority ?? 'medium', identifiedAt: dto.identifiedAt ? new Date(dto.identifiedAt) : new Date(), targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'savings.opportunity.created', source: 'finops', subject: { type: 'savings_opportunity', id: record.id }, payload: { opportunityType: record.opportunityType, estimatedSavings: record.estimatedSavings, status: record.status, priority: record.priority }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [recommendations, scores, savings] = await Promise.all([this.recommendations(), this.efficiencyScores(), this.savingsOpportunities()]);
    const estimatedSavings = savings.reduce((sum: number, item: { estimatedSavings: number }) => sum + Number(item.estimatedSavings), 0);
    return { recommendations, scores, savings, summary: { recommendationCount: recommendations.length, openRecommendationCount: recommendations.filter((item: { status: string }) => item.status === 'open').length, latestEfficiencyScore: scores[0]?.score ?? null, savingsOpportunityCount: savings.length, estimatedSavings } };
  }

  private scoreBand(score: number) { return score >= 90 ? 'excellent' : score >= 75 ? 'healthy' : score >= 60 ? 'watch' : 'risk'; }
  private trend(score: number, previous?: number) { if (previous === undefined) return 'stable'; return score > previous ? 'up' : score < previous ? 'down' : 'stable'; }
}