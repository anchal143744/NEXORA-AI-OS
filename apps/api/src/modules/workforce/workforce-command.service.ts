import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { DomainEventType } from '../events/contracts/domain-event.contract';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateWorkforceRecordDto } from './dto/workforce.dto';
import { getWorkforceEntity, WorkforceEntity } from './workforce.entities';

type WorkforceDelegate = {
  create(args: Record<string, unknown>): Promise<Record<string, unknown>>;
};

@Injectable()
export class WorkforceCommandService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  private delegate(entity: WorkforceEntity): WorkforceDelegate {
    const definition = getWorkforceEntity(entity);
    return (this.prisma as unknown as Record<string, WorkforceDelegate>)[definition.delegate];
  }

  private date(value?: string) {
    return value ? new Date(value) : undefined;
  }

  async create(entity: WorkforceEntity, dto: CreateWorkforceRecordDto) {
    const definition = getWorkforceEntity(entity);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const data = {
      tenantId,
      workspaceId,
      recordKey: dto.recordKey ?? entity + '-' + randomUUID(),
      employeeId: dto.employeeId,
      subjectEmployeeId: dto.subjectEmployeeId,
      userId: dto.userId,
      departmentId: dto.departmentId,
      managerEmployeeId: dto.managerEmployeeId,
      candidateId: dto.candidateId,
      jobRequisitionId: dto.jobRequisitionId,
      jobPostingId: dto.jobPostingId,
      courseId: dto.courseId,
      cycleId: dto.cycleId,
      planId: dto.planId,
      teamId: dto.teamId,
      relatedEntityType: dto.relatedEntityType,
      relatedEntityId: dto.relatedEntityId,
      name: dto.name,
      title: dto.title,
      description: dto.description,
      status: dto.status ?? 'active',
      category: dto.category,
      stage: dto.stage,
      priority: dto.priority ?? 'normal',
      countryCode: dto.countryCode,
      currency: dto.currency ?? 'USD',
      amount: dto.amount ?? 0,
      score: dto.score ?? 0,
      confidence: dto.confidence ?? 0,
      riskLevel: dto.riskLevel,
      effectiveAt: this.date(dto.effectiveAt),
      startAt: this.date(dto.startAt),
      endAt: this.date(dto.endAt),
      dueAt: this.date(dto.dueAt),
      completedAt: this.date(dto.completedAt),
      payload: dto.payload ?? {},
      metrics: dto.metrics ?? {},
      recommendations: dto.recommendations ?? [],
      metadata: dto.metadata ?? {},
      createdByUserId: dto.createdByUserId ?? this.context.context()?.userId,
      approvedByUserId: dto.approvedByUserId,
    };
    const record = await this.delegate(entity).create({ data });
    await this.events.publish({
      tenantId,
      workspaceId,
      type: definition.event as DomainEventType,
      source: 'workforce',
      subject: { type: definition.model, id: String(record.id) },
      payload: { entity, model: definition.model, recordKey: record.recordKey, status: record.status, stage: record.stage, riskLevel: record.riskLevel },
      actorUserId: this.context.context()?.userId,
    });
    return record;
  }
}

