import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateDataPipelineDto, ExecuteDataPipelineDto } from './dto/data-platform.dto';

@Injectable()
export class DataPipelineService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  pipelines(status?: string, pipelineType?: string) {
    return this.prisma.dataPipeline.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, pipelineType: pipelineType ?? undefined, deletedAt: null }, include: { dataLake: true, warehouse: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createPipeline(dto: CreateDataPipelineDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.dataPipeline.create({ data: { tenantId, workspaceId, dataLakeId: dto.dataLakeId, warehouseId: dto.warehouseId, pipelineKey: dto.pipelineKey ?? `data-pipeline-${randomUUID()}`, name: dto.name, pipelineType: dto.pipelineType ?? 'ingestion', sourceSystem: dto.sourceSystem, targetSystem: dto.targetSystem, schedule: dto.schedule ?? 'manual', status: dto.status ?? 'active', transformationConfig: dto.transformationConfig ?? {}, qualityRules: dto.qualityRules ?? [], lastRunAt: dto.lastRunAt ? new Date(dto.lastRunAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'data.pipeline.created', source: 'data-platform', subject: { type: 'data_pipeline', id: record.id }, payload: { pipelineKey: record.pipelineKey, pipelineType: record.pipelineType, sourceSystem: record.sourceSystem, targetSystem: record.targetSystem }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async executePipeline(id: string, dto: ExecuteDataPipelineDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const pipeline = await this.prisma.dataPipeline.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!pipeline) throw new NotFoundException('Data pipeline not found');
    const record = await this.prisma.dataPipeline.update({ where: { id }, data: { status: dto.status ?? 'active', lastRunAt: new Date(), metadata: { ...(pipeline.metadata as Record<string, unknown>), lastExecution: { rowsProcessed: dto.rowsProcessed ?? 0, metrics: dto.metrics ?? {}, errorMessage: dto.errorMessage } } } });
    await this.events.publish({ tenantId, workspaceId, type: 'data.pipeline.executed', source: 'data-platform', subject: { type: 'data_pipeline', id: record.id }, payload: { pipelineKey: record.pipelineKey, status: record.status, rowsProcessed: dto.rowsProcessed ?? 0, metrics: dto.metrics ?? {} }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async health() {
    const pipelines = await this.pipelines();
    return { pipelines, health: { active: pipelines.filter((pipeline: { status: string }) => pipeline.status === 'active').length, paused: pipelines.filter((pipeline: { status: string }) => pipeline.status === 'paused').length, failed: pipelines.filter((pipeline: { status: string }) => pipeline.status === 'failed').length } };
  }

  async quality() {
    const pipelines = await this.pipelines();
    return { pipelines, rules: pipelines.flatMap((pipeline: { id: string; qualityRules: unknown }) => Array.isArray(pipeline.qualityRules) ? pipeline.qualityRules.map((rule) => ({ pipelineId: pipeline.id, rule })) : []) };
  }
}