import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../events/event-bus.service';
import { KpiRegistry } from './kpi-registry.service';
import { KpiCalculationService } from './kpi-calculation.service';
import { MetricsRepository } from '../repositories/metrics.repository';
import { KpiPeriod } from './kpi.contracts';
@Injectable()
export class KpiSnapshotService {
  constructor(private readonly registry: KpiRegistry, private readonly calc: KpiCalculationService, private readonly metrics: MetricsRepository, private readonly events: EventBusService) {}
  async generate(input: { tenantId: string; workspaceId?: string; period: KpiPeriod; periodStart: Date; periodEnd: Date }) { const values = await this.calc.calculate(input.tenantId, input.workspaceId, input.periodStart, input.periodEnd); for (const def of this.registry.list()) { const metric = await this.metrics.ensureMetric({ tenantId: input.tenantId, key: def.key, name: def.name, unit: def.unit, calculation: { category: def.category, description: def.description } }); await this.metrics.recordValue({ tenantId: input.tenantId, metricId: metric.id, value: Number((values as any)[def.key] ?? 0), observedAt: input.periodEnd, dimensions: { period: input.period, workspaceId: input.workspaceId } }); } const healthScore = Math.max(0, Math.min(100, Math.round((Number(values['finance.profit']) >= 0 ? 25 : 5) + Number(values['crm.conversion_rate']) * .25 + Number(values['hr.attendance_rate']) * .25 + Number(values['operations.workflow_success_rate']) * .25))); const snapshot = await this.metrics.createSnapshot({ ...input, values, healthScore }); await this.events.publish({ tenantId: input.tenantId, workspaceId: input.workspaceId, type: 'kpi.generated', source: 'kpi-engine', subject: { type: 'kpiSnapshot', id: snapshot.id }, payload: { period: input.period, healthScore } }); return snapshot; }
}
