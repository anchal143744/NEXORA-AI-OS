import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { DomainEventType } from '../events/contracts/domain-event.contract';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreatePlanningRecordDto } from './dto/planning.dto';
import { PlanningEntity, getPlanningEntity } from './planning.entities';

type PlanningDelegate = {
  create(args: Record<string, unknown>): Promise<Record<string, unknown>>;
};

@Injectable()
export class PlanningCommandService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  private delegate(entity: PlanningEntity): PlanningDelegate {
    const definition = getPlanningEntity(entity);
    return (this.prisma as unknown as Record<string, PlanningDelegate>)[definition.delegate];
  }

  private date(value?: string) { return value ? new Date(value) : undefined; }

  async create(entity: PlanningEntity, dto: CreatePlanningRecordDto) {
    const definition = getPlanningEntity(entity);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const data = {
      tenantId,
      workspaceId,
      recordKey: dto.recordKey ?? entity + '-' + randomUUID(),
      cycleId: dto.cycleId,
      planId: dto.planId,
      objectiveId: dto.objectiveId,
      keyResultId: dto.keyResultId,
      initiativeId: dto.initiativeId,
      portfolioId: dto.portfolioId,
      programId: dto.programId,
      projectId: dto.projectId,
      resourcePoolId: dto.resourcePoolId,
      capacityPlanId: dto.capacityPlanId,
      budgetPlanId: dto.budgetPlanId,
      scenarioId: dto.scenarioId,
      dashboardId: dto.dashboardId,
      metricId: dto.metricId,
      ownerUserId: dto.ownerUserId,
      sponsorUserId: dto.sponsorUserId,
      teamId: dto.teamId,
      departmentId: dto.departmentId,
      businessUnitId: dto.businessUnitId,
      relatedEntityType: dto.relatedEntityType,
      relatedEntityId: dto.relatedEntityId,
      name: dto.name,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      type: dto.type,
      status: dto.status ?? 'active',
      stage: dto.stage,
      priority: dto.priority ?? 'normal',
      horizon: dto.horizon,
      cadence: dto.cadence,
      confidenceLevel: dto.confidenceLevel,
      riskLevel: dto.riskLevel,
      healthStatus: dto.healthStatus,
      alignmentStatus: dto.alignmentStatus,
      fiscalYear: dto.fiscalYear,
      quarter: dto.quarter,
      sequence: dto.sequence ?? 0,
      startDate: this.date(dto.startDate),
      endDate: this.date(dto.endDate),
      dueAt: this.date(dto.dueAt),
      reviewedAt: this.date(dto.reviewedAt),
      approvedAt: this.date(dto.approvedAt),
      completedAt: this.date(dto.completedAt),
      targetValue: dto.targetValue ?? 0,
      actualValue: dto.actualValue ?? 0,
      baselineValue: dto.baselineValue ?? 0,
      progressPercent: dto.progressPercent ?? 0,
      weight: dto.weight ?? 0,
      score: dto.score ?? 0,
      confidence: dto.confidence ?? 0,
      impactScore: dto.impactScore ?? 0,
      effortScore: dto.effortScore ?? 0,
      capacityHours: dto.capacityHours ?? 0,
      demandHours: dto.demandHours ?? 0,
      allocatedHours: dto.allocatedHours ?? 0,
      utilizationRate: dto.utilizationRate ?? 0,
      scenarioProbability: dto.scenarioProbability ?? 0,
      currency: dto.currency ?? 'USD',
      plannedBudget: dto.plannedBudget ?? 0,
      approvedBudget: dto.approvedBudget ?? 0,
      actualSpend: dto.actualSpend ?? 0,
      forecastSpend: dto.forecastSpend ?? 0,
      varianceAmount: dto.varianceAmount ?? ((dto.actualSpend ?? 0) - (dto.plannedBudget ?? 0)),
      isStrategic: dto.isStrategic ?? false,
      requiresApproval: dto.requiresApproval ?? false,
      assumptions: dto.assumptions ?? {},
      metrics: dto.metrics ?? {},
      dependencies: dto.dependencies ?? [],
      constraints: dto.constraints ?? [],
      insights: dto.insights ?? {},
      recommendations: dto.recommendations ?? [],
      payload: dto.payload ?? {},
      metadata: dto.metadata ?? {},
      createdByUserId: dto.createdByUserId ?? this.context.context()?.userId,
      approvedByUserId: dto.approvedByUserId,
    };
    const record = await this.delegate(entity).create({ data });
    await this.events.publish({
      tenantId,
      workspaceId,
      type: definition.event as DomainEventType,
      source: 'planning',
      subject: { type: definition.model, id: String(record.id) },
      payload: { entity, model: definition.model, recordKey: record.recordKey, status: record.status, progressPercent: record.progressPercent, healthStatus: record.healthStatus, riskLevel: record.riskLevel },
      actorUserId: this.context.context()?.userId,
    });
    return record;
  }
}
