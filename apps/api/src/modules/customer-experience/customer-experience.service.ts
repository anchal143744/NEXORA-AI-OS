import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateCustomerFeedbackDto, CreateCustomerHealthScoreDto, CreateCustomerJourneyDto, UpdateJourneyStageDto } from './dto/customer-experience.dto';

@Injectable()
export class CustomerExperienceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  async dashboard(customerIdentityId?: string) {
    const where = { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, deletedAt: null };
    const [healthScores, journeys, feedback, tickets, churnPredictions, revenueOpportunities] = await Promise.all([
      this.prisma.customerHealthScore.findMany({ where, orderBy: { calculatedAt: 'desc' }, take: 20 }),
      this.prisma.customerJourney.findMany({ where, orderBy: { updatedAt: 'desc' }, take: 20 }),
      this.prisma.customerFeedback.findMany({ where, orderBy: { receivedAt: 'desc' }, take: 20 }),
      this.prisma.serviceTicket.findMany({ where, orderBy: { updatedAt: 'desc' }, take: 20 }),
      this.prisma.churnPrediction.findMany({ where, orderBy: { predictedAt: 'desc' }, take: 10 }),
      this.prisma.revenueOpportunity.findMany({ where, orderBy: { updatedAt: 'desc' }, take: 10 }),
    ]);
    return { healthScores, journeys, feedback, tickets, churnPredictions, revenueOpportunities, summary: { healthScoreCount: healthScores.length, openTicketCount: tickets.filter((ticket: { status: string }) => ticket.status !== 'closed').length, riskCount: churnPredictions.filter((prediction: { riskBand: string }) => ['high', 'critical'].includes(prediction.riskBand)).length } };
  }

  healthScores(customerIdentityId?: string, scoreBand?: string) {
    return this.prisma.customerHealthScore.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, scoreBand: scoreBand ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 100 });
  }

  async createHealthScore(dto: CreateCustomerHealthScoreDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const scoreBand = dto.scoreBand ?? this.healthBand(dto.score);
    const score = await this.prisma.customerHealthScore.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, accountName: dto.accountName, scoreKey: dto.scoreKey ?? `health-${randomUUID()}`, score: dto.score, scoreBand, previousScore: dto.previousScore, trend: dto.trend ?? this.trend(dto.score, dto.previousScore), drivers: dto.drivers ?? [], risks: dto.risks ?? [], recommendations: dto.recommendations ?? this.defaultHealthRecommendations(scoreBand), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'customer.health.scored', source: 'customer-experience', subject: { type: 'customer_health_score', id: score.id }, payload: { customerIdentityId: score.customerIdentityId, score: score.score, scoreBand: score.scoreBand }, actorUserId: this.context.context()?.userId });
    return score;
  }

  latestHealth(customerIdentityId: string) {
    return this.prisma.customerHealthScore.findFirst({ where: { tenantId: this.context.currentTenantId(), customerIdentityId, deletedAt: null }, orderBy: { calculatedAt: 'desc' } });
  }

  journeys(customerIdentityId?: string, lifecycleStage?: string) {
    return this.prisma.customerJourney.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, lifecycleStage: lifecycleStage ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createJourney(dto: CreateCustomerJourneyDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const journey = await this.prisma.customerJourney.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, journeyKey: dto.journeyKey ?? `journey-${randomUUID()}`, lifecycleStage: dto.lifecycleStage ?? 'prospect', previousStage: dto.previousStage, journeyStatus: dto.journeyStatus ?? 'active', touchpoints: dto.touchpoints ?? [], milestones: dto.milestones ?? [], blockers: dto.blockers ?? [], ownerUserId: dto.ownerUserId ?? this.context.context()?.userId, lastTouchAt: dto.lastTouchAt ? new Date(dto.lastTouchAt) : undefined, nextStepAt: dto.nextStepAt ? new Date(dto.nextStepAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'customer.journey.updated', source: 'customer-experience', subject: { type: 'customer_journey', id: journey.id }, payload: { lifecycleStage: journey.lifecycleStage, journeyStatus: journey.journeyStatus }, actorUserId: this.context.context()?.userId });
    return journey;
  }

  async updateJourneyStage(id: string, dto: UpdateJourneyStageDto) {
    const journey = await this.requireJourney(id);
    const touchpoints = Array.isArray(journey.touchpoints) ? journey.touchpoints : [];
    const updated = await this.prisma.customerJourney.update({ where: { id }, data: { previousStage: journey.lifecycleStage, lifecycleStage: dto.lifecycleStage, journeyStatus: dto.journeyStatus ?? journey.journeyStatus, lastTouchAt: new Date(), touchpoints: dto.touchpoint ? [...touchpoints, dto.touchpoint] : touchpoints } });
    await this.events.publish({ tenantId: this.context.currentTenantId(), workspaceId: updated.workspaceId ?? undefined, type: 'customer.journey.updated', source: 'customer-experience', subject: { type: 'customer_journey', id: updated.id }, payload: { lifecycleStage: updated.lifecycleStage, previousStage: updated.previousStage }, actorUserId: this.context.context()?.userId });
    return updated;
  }

  feedback(customerIdentityId?: string, sentiment?: string) {
    return this.prisma.customerFeedback.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, sentiment: sentiment ?? undefined, deletedAt: null }, orderBy: { receivedAt: 'desc' }, take: 100 });
  }

  async createFeedback(dto: CreateCustomerFeedbackDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const feedback = await this.prisma.customerFeedback.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, feedbackKey: dto.feedbackKey ?? `feedback-${randomUUID()}`, feedbackType: dto.feedbackType ?? 'survey', source: dto.source ?? 'manual', rating: dto.rating, sentiment: dto.sentiment ?? this.feedbackSentiment(dto.rating, dto.npsScore), npsScore: dto.npsScore, csatScore: dto.csatScore, cesScore: dto.cesScore, title: dto.title, comments: dto.comments, tags: dto.tags ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'customer.feedback.created', source: 'feedback-engine', subject: { type: 'customer_feedback', id: feedback.id }, payload: { feedbackType: feedback.feedbackType, sentiment: feedback.sentiment, rating: feedback.rating }, actorUserId: this.context.context()?.userId });
    return feedback;
  }

  async satisfaction(customerIdentityId?: string) {
    const items = await this.feedback(customerIdentityId);
    const csatValues = items.map((item: { csatScore?: number | null; rating?: number | null }) => item.csatScore ?? item.rating).filter((value: number | null | undefined): value is number => typeof value === 'number');
    const npsValues = items.map((item: { npsScore?: number | null }) => item.npsScore).filter((value: number | null | undefined): value is number => typeof value === 'number');
    return { feedbackCount: items.length, averageCsat: csatValues.length ? csatValues.reduce((sum: number, value: number) => sum + value, 0) / csatValues.length : null, averageNps: npsValues.length ? npsValues.reduce((sum: number, value: number) => sum + value, 0) / npsValues.length : null };
  }

  async riskDetection(customerIdentityId?: string) {
    const [health, churn, tickets, revenueRisks] = await Promise.all([
      this.healthScores(customerIdentityId),
      this.prisma.churnPrediction.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, status: 'open', deletedAt: null }, orderBy: { predictedAt: 'desc' }, take: 50 }),
      this.prisma.serviceTicket.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, status: { in: ['open', 'waiting', 'escalated'] }, deletedAt: null }, take: 100 }),
      this.prisma.revenueRisk.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, status: 'open', deletedAt: null }, take: 50 }),
    ]);
    return { healthRisks: health.filter((item: { scoreBand: string }) => ['at_risk', 'critical'].includes(item.scoreBand)), churn, openServiceRisks: tickets.filter((ticket: { priority: string; severity: string }) => ['high', 'critical'].includes(ticket.priority) || ['high', 'critical'].includes(ticket.severity)), revenueRisks };
  }

  lifecycleMonitoring() {
    return this.prisma.customerJourney.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, journeyStatus: 'active', deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 150 });
  }

  private healthBand(score: number) { return score >= 85 ? 'excellent' : score >= 70 ? 'healthy' : score >= 50 ? 'watch' : score >= 30 ? 'at_risk' : 'critical'; }
  private trend(score: number, previous?: number) { if (previous === undefined) return 'flat'; return score > previous ? 'up' : score < previous ? 'down' : 'flat'; }
  private defaultHealthRecommendations(scoreBand: string) { return scoreBand === 'critical' || scoreBand === 'at_risk' ? [{ action: 'schedule_executive_check_in' }, { action: 'open_churn_prevention_playbook' }] : [{ action: 'continue_adoption_monitoring' }]; }
  private feedbackSentiment(rating?: number, nps?: number) { if ((nps ?? 0) >= 9 || (rating ?? 0) >= 4) return 'positive'; if ((nps ?? 10) <= 6 || (rating ?? 5) <= 2) return 'negative'; return 'neutral'; }

  private async requireJourney(id: string) {
    const journey = await this.prisma.customerJourney.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!journey) throw new NotFoundException('Customer journey not found');
    return journey;
  }
}
