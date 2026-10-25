import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateAIDecisionDto, CreateAIDecisionReasonDto, CreateAIDecisionRiskDto } from './dto/ai-governance.dto';

@Injectable()
export class DecisionIntelligenceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  decisions(decisionType?: string, riskLevel?: string, humanReviewed?: boolean) {
    return this.prisma.aIDecision.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, decisionType: decisionType ?? undefined, riskLevel: riskLevel ?? undefined, humanReviewed: humanReviewed ?? undefined, deletedAt: null }, include: { reasons: true, risks: true, explainabilityRecords: true }, orderBy: { decidedAt: 'desc' }, take: 100 });
  }

  async createDecision(dto: CreateAIDecisionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.aIDecision.create({ data: { tenantId, workspaceId, aiModelId: dto.aiModelId, modelVersionId: dto.modelVersionId, deploymentId: dto.deploymentId, decisionKey: dto.decisionKey ?? `ai-decision-${randomUUID()}`, decisionType: dto.decisionType, subjectType: dto.subjectType, subjectId: dto.subjectId, outcome: dto.outcome, confidence: dto.confidence, riskLevel: dto.riskLevel ?? this.riskFromConfidence(dto.confidence), inputSummary: dto.inputSummary ?? {}, outputSummary: dto.outputSummary ?? {}, policyChecks: dto.policyChecks ?? [], humanReviewed: dto.humanReviewed ?? false, decidedAt: dto.decidedAt ? new Date(dto.decidedAt) : new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'ai.decision.recorded', source: 'ai-governance', subject: { type: 'ai_decision', id: record.id }, payload: { decisionType: record.decisionType, outcome: record.outcome, riskLevel: record.riskLevel, confidence: record.confidence }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async addReason(dto: CreateAIDecisionReasonDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    await this.ensureDecision(dto.decisionId, tenantId, workspaceId);
    const record = await this.prisma.aIDecisionReason.create({ data: { tenantId, workspaceId, decisionId: dto.decisionId, reasonKey: dto.reasonKey ?? `ai-decision-reason-${randomUUID()}`, reasonType: dto.reasonType ?? 'model', description: dto.description, weight: dto.weight, evidence: dto.evidence ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'ai.decision.reason.created', source: 'ai-governance', subject: { type: 'ai_decision_reason', id: record.id }, payload: { decisionId: record.decisionId, reasonType: record.reasonType, weight: record.weight }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async addRisk(dto: CreateAIDecisionRiskDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    await this.ensureDecision(dto.decisionId, tenantId, workspaceId);
    const severity = dto.severity ?? this.severity(dto.probability, dto.impactScore);
    const record = await this.prisma.aIDecisionRisk.create({ data: { tenantId, workspaceId, decisionId: dto.decisionId, riskKey: dto.riskKey ?? `ai-decision-risk-${randomUUID()}`, riskType: dto.riskType, severity, probability: dto.probability, impactScore: dto.impactScore, mitigation: dto.mitigation ?? [{ action: `mitigate_${dto.riskType}` }], status: dto.status ?? 'open', metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'ai.decision.risk.created', source: 'ai-governance', subject: { type: 'ai_decision_risk', id: record.id }, payload: { decisionId: record.decisionId, riskType: record.riskType, severity: record.severity }, actorUserId: this.context.context()?.userId });
    return record;
  }

  reasons(decisionId?: string) { return this.prisma.aIDecisionReason.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, decisionId: decisionId ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 }); }
  risks(decisionId?: string, severity?: string, status?: string) { return this.prisma.aIDecisionRisk.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, decisionId: decisionId ?? undefined, severity: severity ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 }); }

  async dashboard() {
    const [decisions, risks] = await Promise.all([this.decisions(), this.risks()]);
    return { decisions, risks, summary: { decisionCount: decisions.length, humanReviewedCount: decisions.filter((decision: { humanReviewed: boolean }) => decision.humanReviewed).length, openRiskCount: risks.filter((risk: { status: string }) => risk.status === 'open').length, criticalRiskCount: risks.filter((risk: { severity: string }) => risk.severity === 'critical').length } };
  }

  private riskFromConfidence(confidence?: number) { return confidence !== undefined && confidence < 0.55 ? 'high' : 'medium'; }
  private severity(probability?: number, impact?: number) { const score = Number(probability ?? 0) * Number(impact ?? 0); return score >= 0.75 ? 'critical' : score >= 0.5 ? 'high' : score >= 0.25 ? 'medium' : 'low'; }
  private async ensureDecision(id: string, tenantId: string, workspaceId?: string | null) {
    const record = await this.prisma.aIDecision.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!record) throw new NotFoundException('AI decision not found');
  }
}