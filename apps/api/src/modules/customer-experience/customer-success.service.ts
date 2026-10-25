import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateChurnPredictionDto, CreateCustomerEngagementScoreDto, CreateCustomerSuccessPlanDto, CreateRenewalOpportunityDto } from './dto/customer-experience.dto';

@Injectable()
export class CustomerSuccessService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  plans(customerIdentityId?: string, status?: string) {
    return this.prisma.customerSuccessPlan.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createPlan(dto: CreateCustomerSuccessPlanDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const plan = await this.prisma.customerSuccessPlan.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, planKey: dto.planKey ?? `success-plan-${randomUUID()}`, name: dto.name, description: dto.description, planType: dto.planType ?? 'success', status: dto.status ?? 'active', priority: dto.priority ?? 'normal', ownerUserId: dto.ownerUserId ?? this.context.context()?.userId, goals: dto.goals ?? [], playbooks: dto.playbooks ?? this.defaultPlaybooks(dto.planType), automations: dto.automations ?? [], adoptionTargets: dto.adoptionTargets ?? {}, renewalTargetAt: dto.renewalTargetAt ? new Date(dto.renewalTargetAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'customer.success.plan.created', source: 'customer-success', subject: { type: 'customer_success_plan', id: plan.id }, payload: { planType: plan.planType, priority: plan.priority, customerIdentityId: plan.customerIdentityId }, actorUserId: this.context.context()?.userId });
    return plan;
  }

  engagementScores(customerIdentityId?: string) {
    return this.prisma.customerEngagementScore.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 100 });
  }

  async createEngagementScore(dto: CreateCustomerEngagementScoreDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const score = await this.prisma.customerEngagementScore.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, scoreKey: dto.scoreKey ?? `engagement-${randomUUID()}`, score: dto.score, scoreBand: dto.scoreBand ?? this.engagementBand(dto.score), activityCount: dto.activityCount ?? 0, adoptionRate: dto.adoptionRate, communicationRate: dto.communicationRate, productUsage: dto.productUsage ?? {}, engagementSignals: dto.engagementSignals ?? [], recommendations: dto.recommendations ?? this.engagementRecommendations(dto.score), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'customer.engagement.scored', source: 'customer-success', subject: { type: 'customer_engagement_score', id: score.id }, payload: { score: score.score, scoreBand: score.scoreBand, customerIdentityId: score.customerIdentityId }, actorUserId: this.context.context()?.userId });
    return score;
  }

  churnPredictions(customerIdentityId?: string, riskBand?: string) {
    return this.prisma.churnPrediction.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, riskBand: riskBand ?? undefined, deletedAt: null }, orderBy: { predictedAt: 'desc' }, take: 100 });
  }

  async createChurnPrediction(dto: CreateChurnPredictionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const riskBand = dto.riskBand ?? this.churnBand(dto.probability);
    const prediction = await this.prisma.churnPrediction.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, predictionKey: dto.predictionKey ?? `churn-${randomUUID()}`, probability: dto.probability, riskBand, predictedReason: dto.predictedReason, riskDrivers: dto.riskDrivers ?? [], preventionActions: dto.preventionActions ?? this.preventionActions(riskBand), confidence: dto.confidence, predictionWindowDays: dto.predictionWindowDays ?? 90, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'churn.prediction.created', source: 'churn-prevention', subject: { type: 'churn_prediction', id: prediction.id }, payload: { probability: prediction.probability, riskBand: prediction.riskBand, customerIdentityId: prediction.customerIdentityId }, actorUserId: this.context.context()?.userId });
    return prediction;
  }

  renewals(customerIdentityId?: string, status?: string) {
    return this.prisma.renewalOpportunity.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { renewalDate: 'asc' }, take: 100 });
  }

  async createRenewal(dto: CreateRenewalOpportunityDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const renewal = await this.prisma.renewalOpportunity.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, opportunityKey: dto.opportunityKey ?? `renewal-${randomUUID()}`, title: dto.title, status: dto.status ?? 'open', priority: dto.priority ?? 'normal', renewalDate: dto.renewalDate ? new Date(dto.renewalDate) : undefined, contractValue: dto.contractValue, probability: dto.probability, ownerUserId: dto.ownerUserId ?? this.context.context()?.userId, nextStep: dto.nextStep, risks: dto.risks ?? [], recommendations: dto.recommendations ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'renewal.opportunity.created', source: 'renewal-tracking', subject: { type: 'renewal_opportunity', id: renewal.id }, payload: { title: renewal.title, renewalDate: renewal.renewalDate, priority: renewal.priority }, actorUserId: this.context.context()?.userId });
    return renewal;
  }

  automatedFollowUps(customerIdentityId?: string) {
    return { customerIdentityId, followUps: [{ channel: 'email', reason: 'health_check', priority: 'normal' }, { channel: 'task', reason: 'renewal_readiness', priority: 'high' }] };
  }

  adoptionMonitoring(customerIdentityId?: string) {
    return this.engagementScores(customerIdentityId).then((scores: Array<{ score: number; scoreBand: string; calculatedAt: Date }>) => ({ customerIdentityId, latestScore: scores[0] ?? null, adoptionRisk: scores[0] ? scores[0].score < 50 : false }));
  }

  churnPrevention(customerIdentityId?: string) {
    return this.churnPredictions(customerIdentityId).then((predictions: Array<{ riskBand: string; preventionActions: unknown }>) => ({ customerIdentityId, activePredictions: predictions, recommendedActions: predictions.flatMap((prediction) => Array.isArray(prediction.preventionActions) ? prediction.preventionActions : []) }));
  }

  renewalRecommendations(customerIdentityId?: string) {
    return this.renewals(customerIdentityId).then((renewals: Array<{ priority: string; title: string; renewalDate?: Date | null }>) => ({ customerIdentityId, recommendations: renewals.map((renewal) => ({ title: renewal.title, priority: renewal.priority, action: renewal.priority === 'high' ? 'schedule_executive_renewal_review' : 'send_value_recap', renewalDate: renewal.renewalDate })) }));
  }

  private defaultPlaybooks(planType?: string) { return [{ key: planType === 'onboarding' ? 'onboarding_automation' : 'success_review', status: 'ready' }]; }
  private engagementBand(score: number) { return score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low'; }
  private engagementRecommendations(score: number) { return score < 50 ? [{ action: 'launch_reengagement_sequence' }] : [{ action: 'continue_value_enablement' }]; }
  private churnBand(probability: number) { return probability >= 0.8 ? 'critical' : probability >= 0.6 ? 'high' : probability >= 0.35 ? 'medium' : 'low'; }
  private preventionActions(riskBand: string) { return ['high', 'critical'].includes(riskBand) ? [{ action: 'executive_save_plan' }, { action: 'support_audit' }] : [{ action: 'monitor_engagement' }]; }
}
