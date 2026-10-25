import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateDataLakeDto } from './dto/data-platform.dto';

@Injectable()
export class DataLakeService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  lakes(status?: string, lakeType?: string) {
    return this.prisma.dataLake.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, lakeType: lakeType ?? undefined, deletedAt: null }, include: { warehouses: true, pipelines: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createLake(dto: CreateDataLakeDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.dataLake.create({ data: { tenantId, workspaceId, dataLakeKey: dto.dataLakeKey ?? `data-lake-${randomUUID()}`, name: dto.name, lakeType: dto.lakeType ?? 'enterprise', storageProvider: dto.storageProvider ?? 's3_compatible', storageUri: dto.storageUri, region: dto.region, status: dto.status ?? 'active', encryptionMode: dto.encryptionMode ?? 'managed', retentionPolicy: dto.retentionPolicy ?? {}, classification: dto.classification ?? 'internal', zones: dto.zones ?? this.defaultZones(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'data.lake.created', source: 'data-platform', subject: { type: 'data_lake', id: record.id }, payload: { dataLakeKey: record.dataLakeKey, storageProvider: record.storageProvider, classification: record.classification }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async overview() {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId() ?? undefined;
    const [lakes, warehouses, marts, pipelines] = await Promise.all([
      this.prisma.dataLake.findMany({ where: { tenantId, workspaceId, deletedAt: null }, take: 50 }),
      this.prisma.dataWarehouse.findMany({ where: { tenantId, workspaceId, deletedAt: null }, take: 50 }),
      this.prisma.dataMart.findMany({ where: { tenantId, workspaceId, deletedAt: null }, take: 50 }),
      this.prisma.dataPipeline.findMany({ where: { tenantId, workspaceId, deletedAt: null }, take: 50 }),
    ]);
    return { lakes, warehouses, marts, pipelines, summary: { lakeCount: lakes.length, warehouseCount: warehouses.length, dataMartCount: marts.length, pipelineCount: pipelines.length } };
  }

  zones() {
    return this.lakes().then((lakes: Array<{ id: string; zones: unknown }>) => ({ lakes, zones: lakes.flatMap((lake) => Array.isArray(lake.zones) ? lake.zones.map((zone) => ({ lakeId: lake.id, zone })) : []) }));
  }

  governance() {
    return this.lakes().then((lakes: Array<{ id: string; classification: string; retentionPolicy: unknown; encryptionMode: string }>) => ({ lakes, controls: lakes.map((lake) => ({ lakeId: lake.id, classification: lake.classification, retentionPolicy: lake.retentionPolicy, encryptionMode: lake.encryptionMode })) }));
  }

  private defaultZones() { return [{ name: 'raw', purpose: 'landing' }, { name: 'curated', purpose: 'validated' }, { name: 'analytics', purpose: 'warehouse-ready' }]; }
}