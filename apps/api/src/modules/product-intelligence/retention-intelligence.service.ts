import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateEngagementScoreDto, CreateRetentionCohortDto } from './dto/product-intelligence.dto';

@Injectable()
export class RetentionIntelligenceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  cohorts(cohortType?: string) {
    return this.prisma.retentionCohort.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, cohortType: cohortType ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 100 });
  }

  async createCohort(dto: CreateRetentionCohortDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const userCount = dto.userCount ?? 0;
    const retainedUsers = dto.retainedUsers ?? 0;
    const retentionRate = dto.retentionRate ?? (userCount ? retainedUsers / userCount : 0);
    const churnRate = dto.churnRate ?? Math.max(0, 1 - retentionRate);
    const cohort = await this.prisma.retentionCohort.create({ data: { tenantId, workspaceId, cohortKey: dto.cohortKey ?? `retention-cohort-${randomUUID()}`, name: dto.name, cohortType: dto.cohortType ?? 'weekly', periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), userCount, retainedUsers, retentionRate, churnRate, segments: dto.segments ?? {}, churnSignals: dto.churnSignals ?? this.churnSignalsFor(churnRate), recommendations: dto.recommendations ?? this.retentionRecommendations(churnRate), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'retention.cohort.generated', source: 'retention-intelligence', subject: { type: 'retention_cohort', id: cohort.id }, payload: { cohortType: cohort.cohortType, retentionRate: cohort.retentionRate, churnRate: cohort.churnRate }, actorUserId: this.context.context()?.userId });
    return cohort;
  }

  engagementScores(userId?: string, scoreBand?: string) {
    return this.prisma.engagementScore.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, userId: userId ?? undefined, scoreBand: scoreBand ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 100 });
  }

  async createEngagementScore(dto: CreateEngagementScoreDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const scoreBand = dto.scoreBand ?? this.band(dto.score);
    const score = await this.prisma.engagementScore.create({ data: { tenantId, workspaceId, scoreKey: dto.scoreKey ?? `engagement-${randomUUID()}`, userId: dto.userId ?? this.context.context()?.userId, customerIdentityId: dto.customerIdentityId, teamId: dto.teamId, score: dto.score, scoreBand, stickiness: dto.stickiness, activityCount: dto.activityCount ?? 0, activeDays: dto.activeDays ?? 0, signals: dto.signals ?? [], recommendations: dto.recommendations ?? this.engagementRecommendations(scoreBand), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'engagement.score.created', source: 'retention-intelligence', subject: { type: 'engagement_score', id: score.id }, payload: { score: score.score, scoreBand: score.scoreBand, userId: score.userId }, actorUserId: this.context.context()?.userId });
    return score;
  }

  churnSignals() {
    return this.cohorts().then((cohorts: Array<{ churnSignals: unknown; churnRate?: number | null }>) => ({ cohorts: cohorts.length, signals: cohorts.flatMap((cohort) => Array.isArray(cohort.churnSignals) ? cohort.churnSignals : []), highChurnCohorts: cohorts.filter((cohort) => Number(cohort.churnRate ?? 0) > 0.25) }));
  }

  stickiness() {
    return this.engagementScores().then((scores: Array<{ stickiness?: number | null; score: number }>) => ({ averageStickiness: scores.length ? scores.reduce((sum: number, score) => sum + Number(score.stickiness ?? 0), 0) / scores.length : 0, averageEngagement: scores.length ? scores.reduce((sum: number, score) => sum + score.score, 0) / scores.length : 0 }));
  }

  retentionSuggestions() {
    return this.churnSignals().then((signals: Record<string, unknown>) => ({ ...signals, recommendations: [{ action: 'launch_reactivation_experiment' }, { action: 'review_low_stickiness_segments' }] }));
  }

  private band(score: number) { return score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low'; }
  private churnSignalsFor(churnRate: number) { return churnRate > 0.25 ? [{ signal: 'high_churn_rate', value: churnRate }] : []; }
  private retentionRecommendations(churnRate: number) { return churnRate > 0.25 ? [{ action: 'run_retention_playbook' }] : [{ action: 'continue_retention_monitoring' }]; }
  private engagementRecommendations(scoreBand: string) { return scoreBand === 'low' ? [{ action: 'trigger_reactivation_journey' }] : [{ action: 'continue_engagement_tracking' }]; }
}
