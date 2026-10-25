import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateSecurityRiskDto, CreateSecurityScoreDto } from './dto/security-intelligence.dto';

@Injectable()
export class SecurityRiskService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  risks(riskType?: string, severity?: string, status?: string) {
    return this.prisma.securityRisk.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, riskType: riskType ?? undefined, severity: severity ?? undefined, status: status ?? undefined, deletedAt: null }, include: { threat: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createRisk(dto: CreateSecurityRiskDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const riskScore = dto.riskScore ?? Number((Number(dto.probability ?? 0.5) * Number(dto.impactScore ?? 0.5)).toFixed(4));
    const severity = dto.severity ?? this.severityFromScore(riskScore);
    const record = await this.prisma.securityRisk.create({ data: { tenantId, workspaceId, threatId: dto.threatId, riskKey: dto.riskKey ?? `security-risk-${randomUUID()}`, riskType: dto.riskType, severity, probability: dto.probability, impactScore: dto.impactScore, riskScore, status: dto.status ?? 'open', ownerUserId: dto.ownerUserId, mitigationPlan: dto.mitigationPlan ?? [{ action: `mitigate_${dto.riskType}`, status: 'planned' }], dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'security.risk.assessed', source: 'security-intelligence', subject: { type: 'security_risk', id: record.id }, payload: { riskKey: record.riskKey, riskType: record.riskType, severity: record.severity, riskScore: record.riskScore }, actorUserId: this.context.context()?.userId });
    return record;
  }

  scores(scopeType?: string, scoreBand?: string) {
    return this.prisma.securityScore.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, scopeType: scopeType ?? undefined, scoreBand: scoreBand ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 100 });
  }

  async createScore(dto: CreateSecurityScoreDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.securityScore.create({ data: { tenantId, workspaceId, scoreKey: dto.scoreKey ?? `security-score-${randomUUID()}`, scopeType: dto.scopeType ?? 'workspace', scopeId: dto.scopeId, score: dto.score, scoreBand: dto.scoreBand ?? this.scoreBand(dto.score), previousScore: dto.previousScore, trend: dto.trend ?? this.trend(dto.score, dto.previousScore), factors: dto.factors ?? [], recommendations: dto.recommendations ?? [], calculatedAt: dto.calculatedAt ? new Date(dto.calculatedAt) : new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'security.score.updated', source: 'security-intelligence', subject: { type: 'security_score', id: record.id }, payload: { score: record.score, scoreBand: record.scoreBand, trend: record.trend }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async assessment() {
    const [risks, scores] = await Promise.all([this.risks(), this.scores()]);
    return { risks, scores, summary: { openRiskCount: risks.filter((risk: { status: string }) => risk.status === 'open').length, criticalRiskCount: risks.filter((risk: { severity: string }) => risk.severity === 'critical').length, latestScore: scores[0]?.score ?? null, latestScoreBand: scores[0]?.scoreBand ?? 'unknown' } };
  }

  posture() {
    return this.assessment().then((assessment) => ({ ...assessment, zeroTrustMaturity: assessment.summary.latestScore !== null && assessment.summary.latestScore >= 80 ? 'advanced' : 'improving' }));
  }

  private severityFromScore(score: number) { return score >= 0.85 ? 'critical' : score >= 0.65 ? 'high' : score >= 0.35 ? 'medium' : 'low'; }
  private scoreBand(score: number) { return score >= 85 ? 'excellent' : score >= 70 ? 'healthy' : score >= 50 ? 'watch' : 'risk'; }
  private trend(score: number, previous?: number) { if (previous === undefined) return 'stable'; return score > previous ? 'up' : score < previous ? 'down' : 'stable'; }
}