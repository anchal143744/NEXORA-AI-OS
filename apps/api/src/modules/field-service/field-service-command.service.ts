import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { DomainEventType } from '../events/contracts/domain-event.contract';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateFieldServiceRecordDto } from './dto/field-service.dto';
import { FieldServiceEntity, getFieldServiceEntity } from './field-service.entities';

type FieldServiceDelegate = {
  create(args: Record<string, unknown>): Promise<Record<string, unknown>>;
};

@Injectable()
export class FieldServiceCommandService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  private delegate(entity: FieldServiceEntity): FieldServiceDelegate {
    const definition = getFieldServiceEntity(entity);
    return (this.prisma as unknown as Record<string, FieldServiceDelegate>)[definition.delegate];
  }

  private date(value?: string) { return value ? new Date(value) : undefined; }

  async create(entity: FieldServiceEntity, dto: CreateFieldServiceRecordDto) {
    const definition = getFieldServiceEntity(entity);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const data = {
      tenantId,
      workspaceId,
      recordKey: dto.recordKey ?? entity + '-' + randomUUID(),
      serviceRequestId: dto.serviceRequestId,
      serviceCaseId: dto.serviceCaseId,
      appointmentId: dto.appointmentId,
      workOrderId: dto.workOrderId,
      customerId: dto.customerId,
      contactId: dto.contactId,
      assetId: dto.assetId,
      technicianId: dto.technicianId,
      teamId: dto.teamId,
      dispatcherUserId: dto.dispatcherUserId,
      assignedToUserId: dto.assignedToUserId,
      routePlanId: dto.routePlanId,
      routeStopId: dto.routeStopId,
      territoryId: dto.territoryId,
      regionId: dto.regionId,
      slaPolicyId: dto.slaPolicyId,
      mobileDeviceId: dto.mobileDeviceId,
      relatedEntityType: dto.relatedEntityType,
      relatedEntityId: dto.relatedEntityId,
      name: dto.name,
      title: dto.title,
      description: dto.description,
      serviceType: dto.serviceType,
      status: dto.status ?? 'active',
      stage: dto.stage,
      priority: dto.priority ?? 'normal',
      severity: dto.severity,
      riskLevel: dto.riskLevel,
      countryCode: dto.countryCode,
      timezone: dto.timezone,
      latitude: dto.latitude,
      longitude: dto.longitude,
      distanceKm: dto.distanceKm ?? 0,
      estimatedDurationMinutes: dto.estimatedDurationMinutes ?? 0,
      actualDurationMinutes: dto.actualDurationMinutes ?? 0,
      slaMinutes: dto.slaMinutes ?? 0,
      slaRemainingMinutes: dto.slaRemainingMinutes ?? 0,
      score: dto.score ?? 0,
      confidence: dto.confidence ?? 0,
      utilizationRate: dto.utilizationRate ?? 0,
      firstTimeFixRate: dto.firstTimeFixRate ?? 0,
      currency: dto.currency ?? 'USD',
      serviceCost: dto.serviceCost ?? 0,
      travelCost: dto.travelCost ?? 0,
      partsCost: dto.partsCost ?? 0,
      totalCost: dto.totalCost ?? ((dto.serviceCost ?? 0) + (dto.travelCost ?? 0) + (dto.partsCost ?? 0)),
      scheduledAt: this.date(dto.scheduledAt),
      dispatchAt: this.date(dto.dispatchAt),
      enRouteAt: this.date(dto.enRouteAt),
      arrivedAt: this.date(dto.arrivedAt),
      startedAt: this.date(dto.startedAt),
      completedAt: this.date(dto.completedAt),
      dueAt: this.date(dto.dueAt),
      breachedAt: this.date(dto.breachedAt),
      payload: dto.payload ?? {},
      routeData: dto.routeData ?? {},
      mobileState: dto.mobileState ?? {},
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
      source: 'field-service',
      subject: { type: definition.model, id: String(record.id) },
      payload: { entity, model: definition.model, recordKey: record.recordKey, status: record.status, priority: record.priority, riskLevel: record.riskLevel, slaRemainingMinutes: record.slaRemainingMinutes },
      actorUserId: this.context.context()?.userId,
    });
    return record;
  }
}

