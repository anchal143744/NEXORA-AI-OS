import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { DomainEventType } from '../events/contracts/domain-event.contract';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateProductionReadinessRecordDto } from './dto/production-readiness.dto';
import { ProductionReadinessEntity, getProductionReadinessEntity } from './production-readiness.entities';

type ProductionReadinessDelegate = {
  create(args: Record<string, unknown>): Promise<Record<string, unknown>>;
};

@Injectable()
export class ProductionReadinessCommandService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  private delegate(entity: ProductionReadinessEntity): ProductionReadinessDelegate {
    const definition = getProductionReadinessEntity(entity);
    return (this.prisma as unknown as Record<string, ProductionReadinessDelegate>)[definition.delegate];
  }

  private date(value?: string) { return value ? new Date(value) : undefined; }

  async create(entity: ProductionReadinessEntity, dto: CreateProductionReadinessRecordDto) {
    const definition = getProductionReadinessEntity(entity);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const data = {
      tenantId,
      workspaceId,
      recordKey: dto.recordKey ?? entity + '-' + randomUUID(),
      environment: dto.environment ?? 'production',
      releaseVersion: dto.releaseVersion ?? '1.0.0-RC1',
      releaseCandidate: dto.releaseCandidate ?? 'RC1',
      controlId: dto.controlId,
      checkId: dto.checkId,
      scenarioId: dto.scenarioId,
      runId: dto.runId,
      policyId: dto.policyId,
      findingId: dto.findingId,
      riskId: dto.riskId,
      evidenceId: dto.evidenceId,
      relatedEntityType: dto.relatedEntityType,
      relatedEntityId: dto.relatedEntityId,
      name: dto.name,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      type: dto.type,
      status: dto.status ?? 'active',
      stage: dto.stage,
      severity: dto.severity,
      priority: dto.priority ?? 'normal',
      riskLevel: dto.riskLevel,
      complianceStatus: dto.complianceStatus,
      validationStatus: dto.validationStatus,
      approvalStatus: dto.approvalStatus,
      ownerUserId: dto.ownerUserId,
      reviewerUserId: dto.reviewerUserId,
      approvedByUserId: dto.approvedByUserId,
      startedAt: this.date(dto.startedAt),
      completedAt: this.date(dto.completedAt),
      reviewedAt: this.date(dto.reviewedAt),
      approvedAt: this.date(dto.approvedAt),
      dueAt: this.date(dto.dueAt),
      score: dto.score ?? 0,
      readinessScore: dto.readinessScore ?? 0,
      securityScore: dto.securityScore ?? 0,
      performanceScore: dto.performanceScore ?? 0,
      reliabilityScore: dto.reliabilityScore ?? 0,
      documentationScore: dto.documentationScore ?? 0,
      coverageScore: dto.coverageScore ?? 0,
      riskScore: dto.riskScore ?? 0,
      confidence: dto.confidence ?? 0,
      p50LatencyMs: dto.p50LatencyMs ?? 0,
      p95LatencyMs: dto.p95LatencyMs ?? 0,
      p99LatencyMs: dto.p99LatencyMs ?? 0,
      throughputRps: dto.throughputRps ?? 0,
      errorRate: dto.errorRate ?? 0,
      successRate: dto.successRate ?? 0,
      uptimePercent: dto.uptimePercent ?? 0,
      rpoMinutes: dto.rpoMinutes ?? 0,
      rtoMinutes: dto.rtoMinutes ?? 0,
      targetUsers: dto.targetUsers ?? 0,
      concurrentUsers: dto.concurrentUsers ?? 0,
      durationMinutes: dto.durationMinutes ?? 0,
      totalChecks: dto.totalChecks ?? 0,
      passedChecks: dto.passedChecks ?? 0,
      failedChecks: dto.failedChecks ?? 0,
      openFindings: dto.openFindings ?? 0,
      remediatedFindings: dto.remediatedFindings ?? 0,
      criticalFindings: dto.criticalFindings ?? 0,
      highFindings: dto.highFindings ?? 0,
      moderateFindings: dto.moderateFindings ?? 0,
      lowFindings: dto.lowFindings ?? 0,
      isBlocking: dto.isBlocking ?? false,
      isAutomated: dto.isAutomated ?? true,
      requiresApproval: dto.requiresApproval ?? false,
      evidence: dto.evidence ?? [],
      metrics: dto.metrics ?? {},
      thresholds: dto.thresholds ?? {},
      remediationPlan: dto.remediationPlan ?? {},
      recommendations: dto.recommendations ?? [],
      payload: dto.payload ?? {},
      metadata: dto.metadata ?? {},
      createdByUserId: dto.createdByUserId ?? this.context.context()?.userId,
    };
    const record = await this.delegate(entity).create({ data });
    await this.events.publish({
      tenantId,
      workspaceId,
      type: definition.event as DomainEventType,
      source: 'production-readiness',
      subject: { type: definition.model, id: String(record.id) },
      payload: { entity, model: definition.model, releaseVersion: record.releaseVersion, status: record.status, validationStatus: record.validationStatus, readinessScore: record.readinessScore, riskLevel: record.riskLevel, isBlocking: record.isBlocking },
      actorUserId: this.context.context()?.userId,
    });
    return record;
  }
}
