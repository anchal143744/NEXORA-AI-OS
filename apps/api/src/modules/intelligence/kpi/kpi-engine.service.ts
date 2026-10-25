import { Injectable } from '@nestjs/common';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { KpiPeriod } from './kpi.contracts';
import { KpiRegistry } from './kpi-registry.service';
import { KpiSnapshotService } from './kpi-snapshot.service';
@Injectable()
export class KpiEngine {
  constructor(private readonly context: TenantContextService, private readonly registry: KpiRegistry, private readonly snapshots: KpiSnapshotService) {}
  registrySnapshot() { return { categories: this.registry.categories(), kpis: this.registry.list(), periods: ['daily','weekly','monthly','quarterly','yearly'] }; }
  generate(period: KpiPeriod = 'monthly') { const range = periodRange(period); return this.snapshots.generate({ tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId(), period, periodStart: range.start, periodEnd: range.end }); }
}
export function periodRange(period: KpiPeriod, anchor = new Date()) { const end = anchor; const start = new Date(anchor); if (period === 'daily') start.setDate(start.getDate()-1); if (period === 'weekly') start.setDate(start.getDate()-7); if (period === 'monthly') start.setMonth(start.getMonth()-1); if (period === 'quarterly') start.setMonth(start.getMonth()-3); if (period === 'yearly') start.setFullYear(start.getFullYear()-1); return { start, end }; }
