import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { DomainEventType } from '../events/contracts/domain-event.contract';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateMdmRecordDto } from './dto/mdm.dto';
import { MdmEntity, getMdmEntity } from './mdm.entities';

type MdmDelegate = {
  create(args: Record<string, unknown>): Promise<Record<string, unknown>>;
};

@Injectable()
export class MdmCommandService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  private delegate(entity: MdmEntity): MdmDelegate {
    const definition = getMdmEntity(entity);
    return (this.prisma as unknown as Record<string, MdmDelegate>)[definition.delegate];
  }

  private date(value?: string) { return value ? new Date(value) : undefined; }

  async create(entity: MdmEntity, dto: CreateMdmRecordDto) {
    const definition = getMdmEntity(entity);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const data = {
      tenantId,
      workspaceId,
      recordKey: dto.recordKey ?? entity + '-' + randomUUID(),
      dataDomainId: dto.dataDomainId,
      sourceSystemId: dto.sourceSystemId,
      sourceRecordId: dto.sourceRecordId,
      masterRecordId: dto.masterRecordId,
      goldenRecordId: dto.goldenRecordId,
      duplicateClusterId: dto.duplicateClusterId,
      resolutionRunId: dto.resolutionRunId,
      qualityRunId: dto.qualityRunId,
      lineageRecordId: dto.lineageRecordId,
      governancePolicyId: dto.governancePolicyId,
      stewardUserId: dto.stewardUserId,
      ownerUserId: dto.ownerUserId,
      reviewerUserId: dto.reviewerUserId,
      approvedByUserId: dto.approvedByUserId,
      relatedEntityType: dto.relatedEntityType,
      relatedEntityId: dto.relatedEntityId,
      domain: dto.domain,
      entityType: dto.entityType,
      entityId: dto.entityId,
      externalId: dto.externalId,
      name: dto.name,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      type: dto.type,
      status: dto.status ?? 'active',
      lifecycleStatus: dto.lifecycleStatus,
      qualityStatus: dto.qualityStatus,
      matchStatus: dto.matchStatus,
      governanceStatus: dto.governanceStatus,
      riskLevel: dto.riskLevel,
      priority: dto.priority ?? 'normal',
      countryCode: dto.countryCode,
      languageCode: dto.languageCode,
      version: dto.version ?? 1,
      sequence: dto.sequence ?? 0,
      confidence: dto.confidence ?? 0,
      matchScore: dto.matchScore ?? 0,
      qualityScore: dto.qualityScore ?? 0,
      completenessScore: dto.completenessScore ?? 0,
      accuracyScore: dto.accuracyScore ?? 0,
      consistencyScore: dto.consistencyScore ?? 0,
      timelinessScore: dto.timelinessScore ?? 0,
      uniquenessScore: dto.uniquenessScore ?? 0,
      riskScore: dto.riskScore ?? 0,
      trustScore: dto.trustScore ?? 0,
      mergeScore: dto.mergeScore ?? 0,
      sourcePriority: dto.sourcePriority ?? 0,
      totalRecords: dto.totalRecords ?? 0,
      failedRecords: dto.failedRecords ?? 0,
      duplicateCount: dto.duplicateCount ?? 0,
      resolvedCount: dto.resolvedCount ?? 0,
      isGolden: dto.isGolden ?? false,
      isCanonical: dto.isCanonical ?? false,
      isActive: dto.isActive ?? true,
      effectiveFrom: this.date(dto.effectiveFrom),
      effectiveTo: this.date(dto.effectiveTo),
      reviewedAt: this.date(dto.reviewedAt),
      approvedAt: this.date(dto.approvedAt),
      resolvedAt: this.date(dto.resolvedAt),
      mergedAt: this.date(dto.mergedAt),
      lastSyncedAt: this.date(dto.lastSyncedAt),
      attributes: dto.attributes ?? {},
      identifiers: dto.identifiers ?? [],
      relationships: dto.relationships ?? [],
      qualityDimensions: dto.qualityDimensions ?? {},
      survivorshipRules: dto.survivorshipRules ?? {},
      lineage: dto.lineage ?? [],
      sourcePayload: dto.sourcePayload ?? {},
      resolvedPayload: dto.resolvedPayload ?? {},
      recommendations: dto.recommendations ?? [],
      metadata: dto.metadata ?? {},
      createdByUserId: dto.createdByUserId ?? this.context.context()?.userId,
    };
    const record = await this.delegate(entity).create({ data });
    await this.events.publish({
      tenantId,
      workspaceId,
      type: definition.event as DomainEventType,
      source: 'mdm',
      subject: { type: definition.model, id: String(record.id) },
      payload: { entity, model: definition.model, recordKey: record.recordKey, status: record.status, qualityScore: record.qualityScore, matchScore: record.matchScore, riskLevel: record.riskLevel, isGolden: record.isGolden },
      actorUserId: this.context.context()?.userId,
    });
    return record;
  }
}
