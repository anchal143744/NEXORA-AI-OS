import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateSemanticDimensionDto, CreateSemanticMetricDto } from './dto/data-platform.dto';

@Injectable()
export class SemanticLayerService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  metrics(category?: string, certified?: boolean) {
    return this.prisma.semanticMetric.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, category: category ?? undefined, certified: certified ?? undefined, deletedAt: null }, include: { dataMart: true, kpis: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createMetric(dto: CreateSemanticMetricDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.semanticMetric.create({ data: { tenantId, workspaceId, dataMartId: dto.dataMartId, metricKey: dto.metricKey ?? `semantic-metric-${randomUUID()}`, name: dto.name, metricType: dto.metricType ?? 'business', category: dto.category ?? 'general', formula: dto.formula, aggregation: dto.aggregation ?? 'sum', unit: dto.unit ?? 'count', certified: dto.certified ?? false, ownerUserId: dto.ownerUserId, dimensions: dto.dimensions ?? [], filters: dto.filters ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'semantic.metric.created', source: 'data-platform', subject: { type: 'semantic_metric', id: record.id }, payload: { metricKey: record.metricKey, category: record.category, certified: record.certified }, actorUserId: this.context.context()?.userId });
    return record;
  }

  dimensions(dimensionType?: string) {
    return this.prisma.semanticDimension.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, dimensionType: dimensionType ?? undefined, deletedAt: null }, include: { dataMart: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createDimension(dto: CreateSemanticDimensionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.semanticDimension.create({ data: { tenantId, workspaceId, dataMartId: dto.dataMartId, dimensionKey: dto.dimensionKey ?? `semantic-dimension-${randomUUID()}`, name: dto.name, dimensionType: dto.dimensionType ?? 'attribute', sourceField: dto.sourceField, hierarchy: dto.hierarchy ?? [], valuesPreview: dto.valuesPreview ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'semantic.dimension.created', source: 'data-platform', subject: { type: 'semantic_dimension', id: record.id }, payload: { dimensionKey: record.dimensionKey, dimensionType: record.dimensionType }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async manager() {
    const [metrics, dimensions, marts] = await Promise.all([this.metrics(), this.dimensions(), this.prisma.dataMart.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, take: 50 })]);
    return { metrics, dimensions, marts, summary: { metricCount: metrics.length, certifiedMetricCount: metrics.filter((metric: { certified: boolean }) => metric.certified).length, dimensionCount: dimensions.length, dataMartCount: marts.length } };
  }

  certifiedMetrics() { return this.metrics(undefined, true); }
}