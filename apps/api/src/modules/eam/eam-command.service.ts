import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { DomainEventType } from '../events/contracts/domain-event.contract';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateEamRecordDto } from './dto/eam.dto';
import { EamEntity, getEamEntity } from './eam.entities';

type EamDelegate = {
  create(args: Record<string, unknown>): Promise<Record<string, unknown>>;
};

@Injectable()
export class EamCommandService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  private delegate(entity: EamEntity): EamDelegate {
    const definition = getEamEntity(entity);
    return (this.prisma as unknown as Record<string, EamDelegate>)[definition.delegate];
  }

  private date(value?: string) { return value ? new Date(value) : undefined; }

  async create(entity: EamEntity, dto: CreateEamRecordDto) {
    const definition = getEamEntity(entity);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const data = {
      tenantId,
      workspaceId,
      recordKey: dto.recordKey ?? entity + '-' + randomUUID(),
      assetId: dto.assetId,
      parentAssetId: dto.parentAssetId,
      equipmentId: dto.equipmentId,
      locationId: dto.locationId,
      categoryId: dto.categoryId,
      workOrderId: dto.workOrderId,
      maintenancePlanId: dto.maintenancePlanId,
      contractId: dto.contractId,
      warrantyId: dto.warrantyId,
      vendorId: dto.vendorId,
      assignedToUserId: dto.assignedToUserId,
      departmentId: dto.departmentId,
      costCenterId: dto.costCenterId,
      iotDeviceId: dto.iotDeviceId,
      relatedEntityType: dto.relatedEntityType,
      relatedEntityId: dto.relatedEntityId,
      assetNumber: dto.assetNumber,
      serialNumber: dto.serialNumber,
      name: dto.name,
      title: dto.title,
      description: dto.description,
      assetType: dto.assetType,
      status: dto.status ?? 'active',
      conditionStatus: dto.conditionStatus,
      lifecycleStage: dto.lifecycleStage,
      priority: dto.priority ?? 'normal',
      riskLevel: dto.riskLevel,
      healthScore: dto.healthScore ?? 0,
      utilizationRate: dto.utilizationRate ?? 0,
      reliabilityScore: dto.reliabilityScore ?? 0,
      confidence: dto.confidence ?? 0,
      currency: dto.currency ?? 'USD',
      acquisitionCost: dto.acquisitionCost ?? 0,
      maintenanceCost: dto.maintenanceCost ?? 0,
      replacementCost: dto.replacementCost ?? 0,
      totalCost: dto.totalCost ?? ((dto.acquisitionCost ?? 0) + (dto.maintenanceCost ?? 0) + (dto.replacementCost ?? 0)),
      acquiredAt: this.date(dto.acquiredAt),
      commissionedAt: this.date(dto.commissionedAt),
      retiredAt: this.date(dto.retiredAt),
      startAt: this.date(dto.startAt),
      dueAt: this.date(dto.dueAt),
      completedAt: this.date(dto.completedAt),
      expiresAt: this.date(dto.expiresAt),
      lastServiceAt: this.date(dto.lastServiceAt),
      nextServiceAt: this.date(dto.nextServiceAt),
      telemetry: dto.telemetry ?? {},
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
      source: 'eam',
      subject: { type: definition.model, id: String(record.id) },
      payload: { entity, model: definition.model, recordKey: record.recordKey, status: record.status, riskLevel: record.riskLevel, healthScore: record.healthScore },
      actorUserId: this.context.context()?.userId,
    });
    return record;
  }
}

