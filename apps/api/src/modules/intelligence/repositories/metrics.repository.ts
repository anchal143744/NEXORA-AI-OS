import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
@Injectable()
export class MetricsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async ensureMetric(input: { tenantId: string; key: string; name: string; unit?: string; calculation: Record<string, unknown> }) {
    const existing = await this.prisma.kpiMetric.findFirst({ where: { tenantId: input.tenantId, key: input.key, deletedAt: null } });
    if (existing) return existing;
    return this.prisma.kpiMetric.create({ data: { tenantId: input.tenantId, key: input.key, name: input.name, unit: input.unit, calculation: input.calculation } });
  }
  recordValue(input: { tenantId: string; metricId: string; value: number; observedAt: Date; dimensions?: Record<string, unknown> }) { return this.prisma.metricValue.create({ data: { tenantId: input.tenantId, metricId: input.metricId, value: input.value, observedAt: input.observedAt, dimensions: input.dimensions ?? {} } }); }
  metricValues(tenantId: string, metricKey: string, from: Date, to: Date) { return this.prisma.metricValue.findMany({ where: { tenantId, metric: { key: metricKey }, observedAt: { gte: from, lte: to } }, orderBy: { observedAt: 'asc' } }); }
  latestMetricValues(tenantId: string, keys: string[]) { return this.prisma.metricValue.findMany({ where: { tenantId, metric: { key: { in: keys } } }, orderBy: { observedAt: 'desc' }, take: keys.length * 5, include: { metric: true } }); }
  createSnapshot(input: { tenantId: string; workspaceId?: string; period: string; periodStart: Date; periodEnd: Date; values: Record<string, unknown>; healthScore?: number }) { return this.prisma.kpiSnapshot.create({ data: { tenantId: input.tenantId, workspaceId: input.workspaceId, period: input.period, periodStart: input.periodStart, periodEnd: input.periodEnd, values: input.values, healthScore: input.healthScore } }); }
}
