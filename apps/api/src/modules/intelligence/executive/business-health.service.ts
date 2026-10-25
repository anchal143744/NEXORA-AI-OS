import { Injectable } from '@nestjs/common';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { KpiCalculationService } from '../kpi/kpi-calculation.service';
import { periodRange } from '../kpi/kpi-engine.service';
@Injectable()
export class BusinessHealthService { constructor(private readonly context: TenantContextService, private readonly kpis: KpiCalculationService) {} async score() { const tenantId = this.context.currentTenantId(); const workspaceId = this.context.currentWorkspaceId(); const range = periodRange('monthly'); const values = await this.kpis.calculate(tenantId, workspaceId, range.start, range.end); const score = Math.max(0, Math.min(100, Math.round((Number(values['finance.profit']) >= 0 ? 25 : 5) + Number(values['crm.conversion_rate']) * .25 + Number(values['hr.attendance_rate']) * .25 + Number(values['operations.workflow_success_rate']) * .25))); return { score, status: score >= 80 ? 'strong' : score >= 60 ? 'stable' : score >= 40 ? 'watch' : 'critical', values }; } }
