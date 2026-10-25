import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { telemetryRegistry, MetricLabels } from '../../../common/observability/telemetry-registry';

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async record(input: { tenantId?: string; name: string; value: number; unit?: string; tags?: Record<string, unknown> }) {
    telemetryRegistry.recordOperationalMetric(input.name, input.value, input.unit, { tenant_id: input.tenantId, ...(input.tags ?? {}) });
    if (process.env.METRICS_PERSISTENCE_ENABLED !== 'true') return { recorded: true, persisted: false };
    try { return await this.prisma.operationalMetric.create({ data: { tenantId: input.tenantId, name: input.name, value: input.value, unit: input.unit, tags: input.tags ?? {} } }); }
    catch (error) { telemetryRegistry.incrementCounter('nexora_metrics_persistence_errors_total', 1, { metric: input.name }); return { recorded: true, persisted: false, error: error instanceof Error ? error.message : 'unknown' }; }
  }

  incrementCounter(name: string, value = 1, labels: MetricLabels = {}) { telemetryRegistry.incrementCounter(name, value, labels); }
  setGauge(name: string, value: number, labels: MetricLabels = {}) { telemetryRegistry.setGauge(name, value, labels); }
  observeHistogram(name: string, value: number, labels: MetricLabels = {}) { telemetryRegistry.observeHistogram(name, value, labels); }
  prometheus() { return telemetryRegistry.renderPrometheus(); }

  async snapshot(tenantId?: string) {
    const since = new Date(Date.now() - 3600000); const registry = telemetryRegistry.summary();
    const [persistedMetrics, errors, workflow, ai, webhooks] = await Promise.all([
      this.prisma.operationalMetric.findMany({ where: { tenantId, name: { in: ['api.latency','api.throughput'] }, createdAt: { gte: since } }, take: 100, orderBy: { createdAt: 'desc' } }).catch(() => []),
      this.prisma.operationalMetric.count({ where: { tenantId, name: 'api.error', createdAt: { gte: since } } }).catch(() => 0),
      this.prisma.workflowExecution.count({ where: { tenantId, createdAt: { gte: since } } }).catch(() => 0),
      this.prisma.aiToolCall.count({ where: { tenantId, createdAt: { gte: since } } }).catch(() => 0),
      this.prisma.webhookDelivery.count({ where: { tenantId, createdAt: { gte: since } } }).catch(() => 0),
    ]);
    return { window: '1h', registry, persistedMetrics, errorRate: errors, workflowExecutions: workflow, aiExecutions: ai, webhookDeliveries: webhooks };
  }
}