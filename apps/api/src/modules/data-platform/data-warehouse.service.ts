import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateDataMartDto, CreateDataWarehouseDto, CreateWarehouseJobDto } from './dto/data-platform.dto';

@Injectable()
export class DataWarehouseService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  warehouses(status?: string, warehouseType?: string) {
    return this.prisma.dataWarehouse.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, warehouseType: warehouseType ?? undefined, deletedAt: null }, include: { dataMarts: true, jobs: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createWarehouse(dto: CreateDataWarehouseDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.dataWarehouse.create({ data: { tenantId, workspaceId, dataLakeId: dto.dataLakeId, warehouseKey: dto.warehouseKey ?? `warehouse-${randomUUID()}`, name: dto.name, warehouseType: dto.warehouseType ?? 'analytics', engine: dto.engine ?? 'postgresql', status: dto.status ?? 'active', schemaName: dto.schemaName, refreshCadence: dto.refreshCadence ?? 'hourly', storageBytes: dto.storageBytes ?? 0, queryEndpoint: dto.queryEndpoint, governance: dto.governance ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'data.warehouse.created', source: 'data-platform', subject: { type: 'data_warehouse', id: record.id }, payload: { warehouseKey: record.warehouseKey, engine: record.engine, warehouseType: record.warehouseType }, actorUserId: this.context.context()?.userId });
    return record;
  }

  dataMarts(domain?: string, status?: string) {
    return this.prisma.dataMart.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, domain: domain ?? undefined, status: status ?? undefined, deletedAt: null }, include: { metrics: true, dimensions: true, dashboards: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createDataMart(dto: CreateDataMartDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.dataMart.create({ data: { tenantId, workspaceId, warehouseId: dto.warehouseId, dataMartKey: dto.dataMartKey ?? `data-mart-${randomUUID()}`, name: dto.name, martType: dto.martType ?? 'department', domain: dto.domain, status: dto.status ?? 'active', ownerTeamId: dto.ownerTeamId, refreshCadence: dto.refreshCadence ?? 'daily', sourceTables: dto.sourceTables ?? [], semanticModels: dto.semanticModels ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'data.mart.created', source: 'data-platform', subject: { type: 'data_mart', id: record.id }, payload: { dataMartKey: record.dataMartKey, domain: record.domain, martType: record.martType }, actorUserId: this.context.context()?.userId });
    return record;
  }

  jobs(warehouseId?: string, status?: string) {
    return this.prisma.warehouseJob.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, warehouseId: warehouseId ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async createJob(dto: CreateWarehouseJobDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.warehouseJob.create({ data: { tenantId, workspaceId, warehouseId: dto.warehouseId, jobKey: dto.jobKey ?? `warehouse-job-${randomUUID()}`, jobType: dto.jobType, status: dto.status ?? 'queued', startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined, finishedAt: dto.finishedAt ? new Date(dto.finishedAt) : undefined, durationMs: dto.durationMs, rowsProcessed: dto.rowsProcessed ?? 0, errorMessage: dto.errorMessage, metrics: dto.metrics ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'warehouse.job.created', source: 'data-platform', subject: { type: 'warehouse_job', id: record.id }, payload: { jobType: record.jobType, status: record.status, rowsProcessed: record.rowsProcessed }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async explorer() {
    const [warehouses, marts, jobs] = await Promise.all([this.warehouses(), this.dataMarts(), this.jobs()]);
    return { warehouses, marts, jobs, summary: { warehouseCount: warehouses.length, dataMartCount: marts.length, jobCount: jobs.length } };
  }

  architecture() {
    return this.dataMarts().then((marts: Array<{ id: string; domain: string; metrics: unknown[]; dimensions: unknown[] }>) => ({ marts, domains: [...new Set(marts.map((mart) => mart.domain))], semanticCoverage: marts.map((mart) => ({ dataMartId: mart.id, metricCount: mart.metrics.length, dimensionCount: mart.dimensions.length })) }));
  }
}