import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateDataLocationDto, CreateDataRegionDto, CreateJurisdictionRuleDto } from './dto/data-residency.dto';

@Injectable()
export class DataRegionService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  regions(countryCode?: string, jurisdiction?: string, status?: string) {
    return this.prisma.dataRegion.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, countryCode: countryCode ?? undefined, jurisdiction: jurisdiction ?? undefined, status: status ?? undefined, deletedAt: null }, include: { jurisdictionRules: true, dataLocations: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createRegion(dto: CreateDataRegionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.dataRegion.create({ data: { tenantId, workspaceId, regionKey: dto.regionKey ?? `data-region-${randomUUID()}`, name: dto.name, countryCode: dto.countryCode, regionCode: dto.regionCode, jurisdiction: dto.jurisdiction, cloudProvider: dto.cloudProvider, dataResidencyTier: dto.dataResidencyTier ?? 'standard', status: dto.status ?? 'active', allowedDataClasses: dto.allowedDataClasses ?? [], restrictedDataClasses: dto.restrictedDataClasses ?? [], encryptionRequirements: dto.encryptionRequirements ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'data.region.created', source: 'data-residency', subject: { type: 'data_region', id: record.id }, payload: { regionKey: record.regionKey, countryCode: record.countryCode, jurisdiction: record.jurisdiction, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  jurisdictionRules(jurisdiction?: string, countryCode?: string, status?: string) {
    return this.prisma.jurisdictionRule.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, jurisdiction: jurisdiction ?? undefined, countryCode: countryCode ?? undefined, status: status ?? undefined, deletedAt: null }, include: { dataRegion: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createJurisdictionRule(dto: CreateJurisdictionRuleDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.jurisdictionRule.create({ data: { tenantId, workspaceId, dataRegionId: dto.dataRegionId, ruleKey: dto.ruleKey ?? `jurisdiction-rule-${randomUUID()}`, jurisdiction: dto.jurisdiction, countryCode: dto.countryCode, ruleType: dto.ruleType ?? 'data_processing', status: dto.status ?? 'active', requirements: dto.requirements ?? [], restrictions: dto.restrictions ?? [], penalties: dto.penalties ?? [], effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date(), effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'jurisdiction.rule.created', source: 'data-residency', subject: { type: 'jurisdiction_rule', id: record.id }, payload: { jurisdiction: record.jurisdiction, countryCode: record.countryCode, ruleType: record.ruleType, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  dataLocations(dataObjectType?: string, residencyState?: string, countryCode?: string) {
    return this.prisma.dataLocation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, dataObjectType: dataObjectType ?? undefined, residencyState: residencyState ?? undefined, countryCode: countryCode ?? undefined, deletedAt: null }, include: { dataRegion: true }, orderBy: { lastVerifiedAt: 'desc' }, take: 100 });
  }

  async createDataLocation(dto: CreateDataLocationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.dataLocation.create({ data: { tenantId, workspaceId, dataRegionId: dto.dataRegionId, locationKey: dto.locationKey ?? `data-location-${randomUUID()}`, dataObjectType: dto.dataObjectType, dataObjectId: dto.dataObjectId, storageProvider: dto.storageProvider, storageRegion: dto.storageRegion, countryCode: dto.countryCode, residencyState: dto.residencyState ?? 'compliant', encryptionState: dto.encryptionState ?? 'encrypted', lastVerifiedAt: dto.lastVerifiedAt ? new Date(dto.lastVerifiedAt) : new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'data.location.recorded', source: 'data-residency', subject: { type: 'data_location', id: record.id }, payload: { dataObjectType: record.dataObjectType, storageProvider: record.storageProvider, storageRegion: record.storageRegion, residencyState: record.residencyState }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [regions, jurisdictionRules, locations] = await Promise.all([this.regions(), this.jurisdictionRules(), this.dataLocations()]);
    return { regions, jurisdictionRules, locations, summary: { regionCount: regions.length, activeRegionCount: regions.filter((region: { status: string }) => region.status === 'active').length, jurisdictionRuleCount: jurisdictionRules.length, nonCompliantLocationCount: locations.filter((location: { residencyState: string }) => location.residencyState !== 'compliant').length } };
  }
}