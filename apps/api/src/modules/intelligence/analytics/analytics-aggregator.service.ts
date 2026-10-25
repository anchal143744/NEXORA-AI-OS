import { Injectable } from '@nestjs/common';
import { MetricsRepository } from '../repositories/metrics.repository';
@Injectable()
export class AnalyticsAggregator { constructor(private readonly metrics: MetricsRepository) {} historical(tenantId: string, metricKey: string, from: Date, to: Date) { return this.metrics.metricValues(tenantId, metricKey, from, to); } comparative(current: number, previous: number) { return { current, previous, delta: current - previous, deltaPercent: previous === 0 ? 0 : Number((((current - previous) / Math.abs(previous)) * 100).toFixed(2)) }; } growth(values: number[]) { const first = values[0] ?? 0; const last = values[values.length-1] ?? 0; return { first, last, growthPercent: first === 0 ? 0 : Number((((last-first)/Math.abs(first))*100).toFixed(2)) }; } }
