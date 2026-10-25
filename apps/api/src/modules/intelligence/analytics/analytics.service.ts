import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { AnalyticsAggregator } from './analytics-aggregator.service';
import { ForecastEngine } from './forecast.engine';
import { TrendAnalysisEngine } from './trend-analysis.engine';

type AnalyticsMetric = {
  key: string;
  label: string;
  value: number;
  unit: 'count' | 'currency' | 'percent';
  source: string;
  scope: 'workspace';
};

type DecimalLike = { toNumber?: () => number };

const STAGE_PROBABILITY: Record<string, number> = {
  lead: 12,
  qualified: 28,
  discovery: 42,
  proposal: 64,
  negotiation: 78,
  closed_won: 100,
  closed_lost: 0,
  won: 100,
  lost: 0,
  open: 20,
};

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly context: TenantContextService,
    private readonly aggregator: AnalyticsAggregator,
    private readonly trend: TrendAnalysisEngine,
    private readonly forecastEngine: ForecastEngine,
    private readonly prisma: PrismaService,
  ) {}

  async metric(metricKey: string, days = 90) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.requireWorkspaceId();
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    const rows = await this.aggregator.historical(tenantId, metricKey, from, to);
    const values = rows.map((row: { value: unknown }) => toNumber(row.value));
    return {
      metricKey,
      scope: { tenantId, workspaceId },
      historical: rows,
      trend: this.trend.analyze(values),
      growth: this.aggregator.growth(values),
      forecast: await this.forecastEngine.forecast({ tenantId, workspaceId, metricKey, values }),
    };
  }

  async summary() {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.requireWorkspaceId();
    const workspaceScope = { tenantId, workspaceId, deletedAt: null };
    const employeeIdRows = await this.prisma.attendanceRecord.findMany({
      where: workspaceScope,
      distinct: ['employeeId'],
      select: { employeeId: true },
      take: 1000,
    });
    const workspaceEmployeeIds = employeeIdRows.map((row: { employeeId: string }) => row.employeeId);

    const [
      leadCount,
      customerCount,
      opportunities,
      invoiceCount,
      invoiceTotals,
      revenueTotals,
      expenseTotals,
      projectCount,
      taskCount,
      employeeCount,
      departmentCount,
      activityCount,
    ] = await Promise.all([
      this.prisma.crmLeadRecord.count({ where: workspaceScope }),
      this.prisma.crmCustomerRecord.count({ where: workspaceScope }),
      this.prisma.crmOpportunity.findMany({ where: workspaceScope, select: { amount: true, stage: true, metadata: true } }),
      this.prisma.invoice.count({ where: workspaceScope }),
      this.prisma.invoice.aggregate({ where: workspaceScope, _sum: { total: true, amountDue: true, amountPaid: true } }),
      this.prisma.financeRevenue.aggregate({ where: workspaceScope, _sum: { amount: true } }),
      this.prisma.financeExpense.aggregate({ where: workspaceScope, _sum: { amount: true } }),
      this.prisma.project.count({ where: workspaceScope }),
      this.prisma.task.count({ where: workspaceScope }),
      workspaceEmployeeIds.length ? this.prisma.employeeProfile.count({ where: { tenantId, id: { in: workspaceEmployeeIds }, deletedAt: null } }) : 0,
      this.prisma.department.count({ where: workspaceScope }),
      this.prisma.activityLog.count({ where: { tenantId, metadata: { path: ['workspaceId'], equals: workspaceId } } }),
    ]);

    const pipelineValue = opportunities
      .filter((opportunity: { stage: string | null }) => !['closed_won', 'closed_lost', 'won', 'lost'].includes(String(opportunity.stage)))
      .reduce((sum: number, opportunity: { amount: unknown }) => sum + toNumber(opportunity.amount), 0);
    const wonRevenue = opportunities
      .filter((opportunity: { stage: string | null }) => ['closed_won', 'won'].includes(String(opportunity.stage)))
      .reduce((sum: number, opportunity: { amount: unknown }) => sum + toNumber(opportunity.amount), 0);
    const weightedPipeline = opportunities.reduce((sum: number, opportunity: { amount: unknown; stage: string | null; metadata: unknown }) => {
      const metadata = metadataOf(opportunity.metadata);
      const probability = toNumber(metadata.probability) || STAGE_PROBABILITY[String(opportunity.stage)] || 0;
      return sum + toNumber(opportunity.amount) * (probability / 100);
    }, 0);
    const closedCount = opportunities.filter((opportunity: { stage: string | null }) => ['closed_won', 'closed_lost', 'won', 'lost'].includes(String(opportunity.stage))).length;
    const wonCount = opportunities.filter((opportunity: { stage: string | null }) => ['closed_won', 'won'].includes(String(opportunity.stage))).length;
    const winRate = closedCount ? Math.round((wonCount / closedCount) * 100) : 0;
    const revenue = toNumber(revenueTotals._sum.amount) + wonRevenue;
    const expenses = toNumber(expenseTotals._sum.amount);
    const outstandingInvoices = toNumber(invoiceTotals._sum.amountDue);

    const metrics: AnalyticsMetric[] = [
      { key: 'crm.leads', label: 'Leads', value: leadCount, unit: 'count', source: 'crmLeadRecord', scope: 'workspace' },
      { key: 'crm.customers', label: 'Customers', value: customerCount, unit: 'count', source: 'crmCustomerRecord', scope: 'workspace' },
      { key: 'crm.opportunities', label: 'Opportunities', value: opportunities.length, unit: 'count', source: 'crmOpportunity', scope: 'workspace' },
      { key: 'crm.pipeline_value', label: 'Pipeline Value', value: pipelineValue, unit: 'currency', source: 'crmOpportunity.amount', scope: 'workspace' },
      { key: 'crm.weighted_pipeline', label: 'Weighted Pipeline', value: Math.round(weightedPipeline), unit: 'currency', source: 'crmOpportunity.amount/probability', scope: 'workspace' },
      { key: 'crm.win_rate', label: 'Win Rate', value: winRate, unit: 'percent', source: 'crmOpportunity.stage', scope: 'workspace' },
      { key: 'finance.revenue', label: 'Revenue', value: revenue, unit: 'currency', source: 'financeRevenue + won crmOpportunity', scope: 'workspace' },
      { key: 'finance.expenses', label: 'Expenses', value: expenses, unit: 'currency', source: 'financeExpense', scope: 'workspace' },
      { key: 'finance.outstanding_invoices', label: 'Outstanding Invoices', value: outstandingInvoices, unit: 'currency', source: 'invoice.amountDue', scope: 'workspace' },
      { key: 'finance.invoice_count', label: 'Invoices', value: invoiceCount, unit: 'count', source: 'invoice', scope: 'workspace' },
      { key: 'hr.employees', label: 'Employees', value: employeeCount, unit: 'count', source: 'employeeProfile', scope: 'workspace' },
      { key: 'hr.departments', label: 'Departments', value: departmentCount, unit: 'count', source: 'department', scope: 'workspace' },
      { key: 'projects.projects', label: 'Projects', value: projectCount, unit: 'count', source: 'project', scope: 'workspace' },
      { key: 'projects.tasks', label: 'Tasks', value: taskCount, unit: 'count', source: 'task', scope: 'workspace' },
      { key: 'activity.volume', label: 'Activity Volume', value: activityCount, unit: 'count', source: 'activityLog', scope: 'workspace' },
    ];

    return {
      scope: { tenantId, workspaceId },
      generatedAt: new Date().toISOString(),
      empty: metrics.every((metric) => metric.value === 0),
      metrics,
      modules: {
        crm: { leads: leadCount, customers: customerCount, opportunities: opportunities.length, pipelineValue, weightedPipeline: Math.round(weightedPipeline), winRate },
        finance: { revenue, expenses, profit: revenue - expenses, invoices: invoiceCount, outstandingInvoices, paidInvoices: toNumber(invoiceTotals._sum.amountPaid), invoiceTotal: toNumber(invoiceTotals._sum.total) },
        hr: { employees: employeeCount, departments: departmentCount },
        projects: { projects: projectCount, tasks: taskCount },
        activity: { volume: activityCount },
      },
    };
  }

  private requireWorkspaceId() {
    const workspaceId = this.context.currentWorkspaceId();
    if (!workspaceId) throw new BadRequestException('Workspace context is required for analytics');
    return workspaceId;
  }
}

function metadataOf(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value);
  if (value && typeof value === 'object' && typeof (value as DecimalLike).toNumber === 'function') return (value as DecimalLike).toNumber?.() ?? 0;
  return 0;
}
