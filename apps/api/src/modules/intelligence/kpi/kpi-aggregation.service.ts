import { Injectable } from '@nestjs/common';
import { MetricsRepository } from '../repositories/metrics.repository';
@Injectable()
export class KpiAggregationService {
  constructor(private readonly metrics: MetricsRepository) {}
  async aggregate(tenantId: string, keys: string[], from: Date, to: Date) { const result: Record<string, unknown> = {}; for (const key of keys) { const rows = await this.metrics.metricValues(tenantId, key, from, to); const values = rows.map((r: any) => Number(r.value)); result[key] = { count: values.length, sum: values.reduce((a: number,b: number)=>a+b,0), average: values.length ? values.reduce((a: number,b: number)=>a+b,0)/values.length : 0, min: values.length ? Math.min(...values) : 0, max: values.length ? Math.max(...values) : 0 }; } return result; }
}

