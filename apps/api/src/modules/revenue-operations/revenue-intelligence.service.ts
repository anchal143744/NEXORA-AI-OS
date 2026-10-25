
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateAccountHealthScoreDto, CreateChurnSignalDto, CreateExpansionOpportunityDto, CreateRevenueEventDto, CreateRevenueForecastDto } from './dto/revenue-operations.dto';

@Injectable()
export class RevenueIntelligenceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  churnSignals(severity?: string, status?: string, revenueAccountId?: string) {
    return this.prisma.churnSignal.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, severity: severity ?? undefined, status: status ?? undefined, revenueAccountId: revenueAccountId ?? undefined, deletedAt: null },
      include: { revenueAccount: true },
      orderBy: { detectedAt: 'desc' },
      take: 100,
    });
  }

  async createChurnSignal(dto: CreateChurnSignalDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.churnSignal.create({
      data: {
        tenantId,
        workspaceId,
        revenueAccountId: dto.revenueAccountId,
        signalKey: dto.signalKey ?? 'churn-signal-' + randomUUID(),
        signalType: dto.signalType,
        severity: dto.severity ?? 'medium',
        status: dto.status ?? 'open',
        source: dto.source ?? 'revenue_ops',
        confidence: dto.confidence,
        detectedAt: dto.detectedAt ? new Date(dto.detectedAt) : undefined,
        signalPayload: dto.signalPayload ?? {},
        recommendedActions: dto.recommendedActions ?? [],
        metadata: dto.metadata ?? {},
      },
    });
    await this.events.publish({ tenantId, workspaceId, type: 'churn.signal.created', source: 'revenue-operations', subject: { type: 'churn_signal', id: record.id }, payload: { signalKey: record.signalKey, severity: record.severity, signalType: record.signalType }, actorUserId: this.context.context()?.userId });
    return record;
  }

  churnPredictions(riskBand?: string, status?: string, customerIdentityId?: string) {
    return this.prisma.churnPrediction.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, riskBand: riskBand ?? undefined, status: status ?? undefined, customerIdentityId: customerIdentityId ?? undefined, deletedAt: null },
      orderBy: { predictedAt: 'desc' },
      take: 100,
    });
  }

  expansionOpportunities(status?: string, opportunityType?: string, revenueAccountId?: string) {
    return this.prisma.expansionOpportunity.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, opportunityType: opportunityType ?? undefined, revenueAccountId: revenueAccountId ?? undefined, deletedAt: null },
      include: { revenueAccount: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createExpansionOpportunity(dto: CreateExpansionOpportunityDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.expansionOpportunity.create({
      data: {
        tenantId,
        workspaceId,
        revenueAccountId: dto.revenueAccountId,
        opportunityKey: dto.opportunityKey ?? 'expansion-opportunity-' + randomUUID(),
        title: dto.title,
        opportunityType: dto.opportunityType ?? 'upsell',
        status: dto.status ?? 'open',
        priority: dto.priority ?? 'normal',
        estimatedValue: dto.estimatedValue ?? 0,
        probability: dto.probability,
        expectedCloseAt: dto.expectedCloseAt ? new Date(dto.expectedCloseAt) : undefined,
        ownerUserId: dto.ownerUserId,
        signals: dto.signals ?? [],
        recommendations: dto.recommendations ?? [],
        metadata: dto.metadata ?? {},
      },
    });
    await this.events.publish({ tenantId, workspaceId, type: 'expansion.opportunity.created', source: 'revenue-operations', subject: { type: 'expansion_opportunity', id: record.id }, payload: { opportunityKey: record.opportunityKey, status: record.status, opportunityType: record.opportunityType }, actorUserId: this.context.context()?.userId });
    return record;
  }

  accountHealthScores(scoreBand?: string, trend?: string, revenueAccountId?: string) {
    return this.prisma.accountHealthScore.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, scoreBand: scoreBand ?? undefined, trend: trend ?? undefined, revenueAccountId: revenueAccountId ?? undefined, deletedAt: null },
      include: { revenueAccount: true },
      orderBy: { calculatedAt: 'desc' },
      take: 100,
    });
  }

  async createAccountHealthScore(dto: CreateAccountHealthScoreDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.accountHealthScore.create({
      data: {
        tenantId,
        workspaceId,
        revenueAccountId: dto.revenueAccountId,
        scoreKey: dto.scoreKey ?? 'account-health-' + randomUUID(),
        score: dto.score,
        scoreBand: dto.scoreBand ?? 'medium',
        previousScore: dto.previousScore,
        trend: dto.trend ?? 'stable',
        calculatedAt: dto.calculatedAt ? new Date(dto.calculatedAt) : undefined,
        drivers: dto.drivers ?? [],
        risks: dto.risks ?? [],
        recommendations: dto.recommendations ?? [],
        metadata: dto.metadata ?? {},
      },
    });
    await this.events.publish({ tenantId, workspaceId, type: 'account.health.scored', source: 'revenue-operations', subject: { type: 'account_health_score', id: record.id }, payload: { scoreKey: record.scoreKey, score: record.score, scoreBand: record.scoreBand }, actorUserId: this.context.context()?.userId });
    return record;
  }

  revenueForecasts(forecastType?: string, modelVersion?: string, revenueAccountId?: string) {
    return this.prisma.revenueForecast.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, forecastType: forecastType ?? undefined, modelVersion: modelVersion ?? undefined, revenueAccountId: revenueAccountId ?? undefined, deletedAt: null },
      include: { revenueAccount: true },
      orderBy: { periodStart: 'desc' },
      take: 100,
    });
  }

  async createRevenueForecast(dto: CreateRevenueForecastDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.revenueForecast.create({
      data: {
        tenantId,
        workspaceId,
        revenueAccountId: dto.revenueAccountId,
        forecastKey: dto.forecastKey ?? 'revenue-forecast-' + randomUUID(),
        forecastType: dto.forecastType ?? 'revenue',
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
        forecastAmount: dto.forecastAmount ?? 0,
        committedAmount: dto.committedAmount ?? 0,
        upsideAmount: dto.upsideAmount ?? 0,
        downsideAmount: dto.downsideAmount ?? 0,
        probability: dto.probability,
        confidence: dto.confidence,
        modelVersion: dto.modelVersion ?? 'nexora-revops-v1',
        assumptions: dto.assumptions ?? {},
        drivers: dto.drivers ?? [],
        metadata: dto.metadata ?? {},
      },
    });
    await this.events.publish({ tenantId, workspaceId, type: 'revenue.forecast.created', source: 'revenue-operations', subject: { type: 'revenue_forecast', id: record.id }, payload: { forecastKey: record.forecastKey, forecastType: record.forecastType, forecastAmount: record.forecastAmount }, actorUserId: this.context.context()?.userId });
    return record;
  }

  revenueRisks(severity?: string, status?: string, customerIdentityId?: string) {
    return this.prisma.revenueRisk.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, severity: severity ?? undefined, status: status ?? undefined, customerIdentityId: customerIdentityId ?? undefined, deletedAt: null },
      orderBy: { detectedAt: 'desc' },
      take: 100,
    });
  }

  revenueEvents(eventType?: string, severity?: string, revenueAccountId?: string) {
    return this.prisma.revenueEvent.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, eventType: eventType ?? undefined, severity: severity ?? undefined, revenueAccountId: revenueAccountId ?? undefined, deletedAt: null },
      include: { revenueAccount: true, revenueContract: true },
      orderBy: { occurredAt: 'desc' },
      take: 100,
    });
  }

  async createRevenueEvent(dto: CreateRevenueEventDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.revenueEvent.create({
      data: {
        tenantId,
        workspaceId,
        revenueAccountId: dto.revenueAccountId,
        revenueContractId: dto.revenueContractId,
        eventKey: dto.eventKey ?? 'revenue-event-' + randomUUID(),
        eventType: dto.eventType,
        source: dto.source ?? 'revenue_ops',
        severity: dto.severity ?? 'info',
        subjectType: dto.subjectType,
        subjectId: dto.subjectId,
        payload: dto.payload ?? {},
        occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : undefined,
        processedAt: dto.processedAt ? new Date(dto.processedAt) : undefined,
        metadata: dto.metadata ?? {},
      },
    });
    await this.events.publish({ tenantId, workspaceId, type: 'revenue.event.created', source: 'revenue-operations', subject: { type: 'revenue_event', id: record.id }, payload: { eventKey: record.eventKey, eventType: record.eventType, severity: record.severity }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async churnDashboard() {
    const [signals, predictions] = await Promise.all([this.churnSignals(), this.churnPredictions()]);
    return {
      signals,
      predictions,
      summary: {
        signalCount: signals.length,
        criticalSignalCount: signals.filter((signal: { severity: string }) => signal.severity === 'critical').length,
        predictionCount: predictions.length,
        highRiskPredictionCount: predictions.filter((prediction: { riskBand: string }) => prediction.riskBand === 'high' || prediction.riskBand === 'critical').length,
      },
    };
  }

  async expansionDashboard() {
    const opportunities = await this.expansionOpportunities();
    return {
      opportunities,
      summary: {
        opportunityCount: opportunities.length,
        openOpportunityCount: opportunities.filter((opportunity: { status: string }) => opportunity.status === 'open').length,
        priorityOpportunityCount: opportunities.filter((opportunity: { priority: string }) => opportunity.priority === 'high' || opportunity.priority === 'critical').length,
      },
    };
  }

  async healthDashboard() {
    const scores = await this.accountHealthScores();
    return {
      scores,
      summary: {
        scoreCount: scores.length,
        lowHealthCount: scores.filter((score: { scoreBand: string }) => score.scoreBand === 'low' || score.scoreBand === 'critical').length,
        improvingCount: scores.filter((score: { trend: string }) => score.trend === 'improving').length,
      },
    };
  }

  async forecastingDashboard() {
    const forecasts = await this.revenueForecasts();
    return {
      forecasts,
      summary: {
        forecastCount: forecasts.length,
        revenueForecastCount: forecasts.filter((forecast: { forecastType: string }) => forecast.forecastType === 'revenue').length,
        expansionForecastCount: forecasts.filter((forecast: { forecastType: string }) => forecast.forecastType === 'expansion').length,
      },
    };
  }

  async riskDashboard() {
    const [risks, events] = await Promise.all([this.revenueRisks(), this.revenueEvents()]);
    return {
      risks,
      events,
      summary: {
        riskCount: risks.length,
        criticalRiskCount: risks.filter((risk: { severity: string }) => risk.severity === 'critical').length,
        revenueEventCount: events.length,
        unresolvedRiskCount: risks.filter((risk: { status: string }) => risk.status !== 'closed').length,
      },
    };
  }
}
