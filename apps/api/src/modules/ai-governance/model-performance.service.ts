import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateModelPerformanceMetricDto } from './dto/ai-governance.dto';

@Injectable()
export class ModelPerformanceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  metrics(aiModelId?: string, metricType?: string, status?: string) {
    return this.prisma.modelPerformanceMetric.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, aiModelId: aiModelId ?? undefined, metricType: metricType ?? undefined, status: status ?? undefined, deletedAt: null }, include: { aiModel: true, modelVersion: true, deployment: true }, orderBy: { measuredAt: 'desc' }, take: 100 });
  }

  async recordMetric(dto: CreateModelPerformanceMetricDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const status = dto.status ?? this.status(dto.value, dto.threshold);
    const record = await this.prisma.modelPerformanceMetric.create({ data: { tenantId, workspaceId, aiModelId: dto.aiModelId, modelVersionId: dto.modelVersionId, deploymentId: dto.deploymentId, metricKey: dto.metricKey ?? `model-metric-${randomUUID()}`, metricName: dto.metricName, metricType: dto.metricType ?? 'quality', value: dto.value, unit: dto.unit ?? 'score', threshold: dto.threshold, status, periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined, periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined, dimensions: dto.dimensions ?? {}, measuredAt: dto.measuredAt ? new Date(dto.measuredAt) : new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'model.performance.metric.recorded', source: 'ai-governance', subject: { type: 'model_performance_metric', id: record.id }, payload: { aiModelId: record.aiModelId, metricName: record.metricName, metricType: record.metricType, value: record.value, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const metrics = await this.metrics();
    return { metrics, summary: { metricCount: metrics.length, alertCount: metrics.filter((metric: { status: string }) => ['warning', 'critical'].includes(metric.status)).length, averageValue: metrics.length ? metrics.reduce((sum: number, metric: { value: number }) => sum + metric.value, 0) / metrics.length : 0 } };
  }

  drift(aiModelId?: string) { return this.metrics(aiModelId, 'drift').then((metrics: Array<{ status: string }>) => ({ metrics, driftAlerts: metrics.filter((metric) => ['warning', 'critical'].includes(metric.status)) })); }

  private status(value: number, threshold?: number) { return threshold !== undefined && value < threshold ? 'warning' : 'ok'; }
}