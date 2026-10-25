import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { AssignDataOwnerDto, ClassifyDataDto, CreateDataAssetDto, CreateLineageDto, CreateQualityCheckDto } from '../dto/governance.dto';

@Injectable()
export class DataGovernanceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  catalog(assetType?: string, classification?: string) {
    return this.prisma.dataCatalogAsset.findMany({ where: { tenantId: this.context.currentTenantId(), assetType: assetType ?? undefined, classification: classification ?? undefined, deletedAt: null }, include: { classificationEvents: { where: { deletedAt: null }, orderBy: { classifiedAt: 'desc' }, take: 3 }, ownershipAssignments: { where: { deletedAt: null } }, qualityChecks: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 3 } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createAsset(dto: CreateDataAssetDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const asset = await this.prisma.dataCatalogAsset.create({ data: { tenantId, workspaceId, assetKey: dto.assetKey ?? `asset-${randomUUID()}`, name: dto.name, assetType: dto.assetType, sourceSystem: dto.sourceSystem, entityType: dto.entityType, classification: dto.classification ?? 'internal', sensitivityLevel: dto.sensitivityLevel ?? 'medium', ownerUserId: dto.ownerUserId, stewardUserId: dto.stewardUserId, businessUnit: dto.businessUnit, lineageStatus: 'registered', metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'data.governance.asset.created', source: 'data-governance-engine', subject: { type: 'data_catalog_asset', id: asset.id }, payload: { assetKey: asset.assetKey, assetType: asset.assetType, classification: asset.classification }, actorUserId: this.context.context()?.userId });
    return asset;
  }

  async classify(dto: ClassifyDataDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    if (dto.assetId) await this.requireAsset(dto.assetId);
    const event = await this.prisma.dataClassificationEvent.create({ data: { tenantId, workspaceId, assetId: dto.assetId, entityType: dto.entityType, entityId: dto.entityId, classification: dto.classification, sensitivityLevel: dto.sensitivityLevel, classifier: dto.classifier ?? 'manual', confidence: dto.confidence, policyKey: dto.policyKey, evidence: dto.evidence ?? {}, metadata: dto.metadata ?? {} } });
    if (dto.assetId) await this.prisma.dataCatalogAsset.update({ where: { id: dto.assetId }, data: { classification: dto.classification, sensitivityLevel: dto.sensitivityLevel } });
    await this.events.publish({ tenantId, workspaceId, type: 'data.classified', source: 'data-governance-engine', subject: { type: 'data_classification_event', id: event.id }, payload: { entityType: dto.entityType, entityId: dto.entityId, classification: dto.classification, sensitivityLevel: dto.sensitivityLevel }, actorUserId: this.context.context()?.userId });
    return event;
  }

  async assignOwner(dto: AssignDataOwnerDto) {
    const tenantId = this.context.currentTenantId();
    if (dto.assetId) await this.requireAsset(dto.assetId);
    const assignment = await this.prisma.dataOwnershipAssignment.create({ data: { tenantId, workspaceId: this.context.currentWorkspaceId(), assetId: dto.assetId, ownerUserId: dto.ownerUserId, stewardUserId: dto.stewardUserId, departmentId: dto.departmentId, ownershipType: dto.ownershipType ?? 'business_owner', status: dto.status ?? 'active', assignedByUserId: this.context.context()?.userId, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, metadata: dto.metadata ?? {} } });
    if (dto.assetId) await this.prisma.dataCatalogAsset.update({ where: { id: dto.assetId }, data: { ownerUserId: dto.ownerUserId, stewardUserId: dto.stewardUserId } });
    return assignment;
  }

  lineage(assetId?: string) {
    return this.prisma.dataLineageEdge.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null, OR: assetId ? [{ sourceAssetId: assetId }, { targetAssetId: assetId }] : undefined }, include: { sourceAsset: true, targetAsset: true }, orderBy: { observedAt: 'desc' }, take: 150 });
  }

  async createLineage(dto: CreateLineageDto) {
    const tenantId = this.context.currentTenantId();
    const [source, target] = await Promise.all([this.requireAsset(dto.sourceAssetId), this.requireAsset(dto.targetAssetId)]);
    const edge = await this.prisma.dataLineageEdge.create({ data: { tenantId, workspaceId: this.context.currentWorkspaceId(), sourceAssetId: source.id, targetAssetId: target.id, lineageKey: dto.lineageKey ?? `lineage-${randomUUID()}`, transformType: dto.transformType, transformationKey: dto.transformationKey, direction: dto.direction ?? 'downstream', confidence: dto.confidence, metadata: dto.metadata ?? {} }, include: { sourceAsset: true, targetAsset: true } });
    await Promise.all([this.prisma.dataCatalogAsset.update({ where: { id: source.id }, data: { lineageStatus: 'mapped' } }), this.prisma.dataCatalogAsset.update({ where: { id: target.id }, data: { lineageStatus: 'mapped' } })]);
    await this.events.publish({ tenantId, workspaceId: edge.workspaceId ?? undefined, type: 'data.lineage.recorded', source: 'data-governance-engine', subject: { type: 'data_lineage_edge', id: edge.id }, payload: { sourceAssetId: edge.sourceAssetId, targetAssetId: edge.targetAssetId, transformType: edge.transformType }, actorUserId: this.context.context()?.userId });
    return edge;
  }

  quality(status?: string) { return this.prisma.dataQualityCheck.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, deletedAt: null }, include: { asset: true }, orderBy: { createdAt: 'desc' }, take: 100 }); }

  async runQualityCheck(dto: CreateQualityCheckDto) {
    const tenantId = this.context.currentTenantId();
    if (dto.assetId) await this.requireAsset(dto.assetId);
    const threshold = dto.threshold ?? 90;
    const score = dto.score ?? 100;
    const status = score >= threshold ? 'passed' : 'failed';
    const check = await this.prisma.dataQualityCheck.create({ data: { tenantId, workspaceId: this.context.currentWorkspaceId(), assetId: dto.assetId, checkKey: dto.checkKey ?? `quality-${randomUUID()}`, checkType: dto.checkType, status, score, threshold, issues: dto.issues ?? [], result: dto.result ?? { score, threshold, status }, executedAt: new Date(), metadata: dto.metadata ?? {} }, include: { asset: true } });
    if (dto.assetId) await this.prisma.dataCatalogAsset.update({ where: { id: dto.assetId }, data: { qualityScore: score } });
    await this.events.publish({ tenantId, workspaceId: check.workspaceId ?? undefined, type: 'data.quality.checked', source: 'data-governance-engine', subject: { type: 'data_quality_check', id: check.id }, payload: { checkType: check.checkType, status: check.status, score }, actorUserId: this.context.context()?.userId });
    return check;
  }

  private async requireAsset(id: string) {
    const asset = await this.prisma.dataCatalogAsset.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!asset) throw new NotFoundException('Data catalog asset not found');
    return asset;
  }
}