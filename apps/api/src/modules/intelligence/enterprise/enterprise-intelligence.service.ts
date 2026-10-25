
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ActivityService } from '../../activity/activity.service';
import { EventBusService } from '../../events/event-bus.service';
import { EnterpriseGraphSyncService } from '../../knowledge-graph/graph/enterprise-graph-sync.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { UniversalCommandDto, UniversalSearchDto } from './enterprise-intelligence.dto';

type Insight = { type: string; severity: 'info' | 'warning' | 'critical' | 'opportunity'; title: string; evidence: Record<string, unknown>; recommendation?: string };

@Injectable()
export class EnterpriseIntelligenceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly activity: ActivityService, private readonly graph: EnterpriseGraphSyncService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId(input?: string) { return input ?? this.context.currentWorkspaceId(); }
  private userId() { return this.context.context()?.userId; }
  private n(value: unknown) { return Number((value as any)?.toString?.() ?? value ?? 0); }
  private now() { return new Date(); }

  async syncIntelligenceLayer(workspaceId?: string) {
    return this.graph.sync({ workspaceId: this.workspaceId(workspaceId), limit: 250 });
  }

  async universalSearch(dto: UniversalSearchDto) {
    const tenantId = this.tenantId();
    const workspaceId = this.workspaceId(dto.workspaceId);
    const limit = Math.min(Math.max(dto.limit ?? 25, 1), 100);
    const query = dto.query.trim();
    const modules = dto.modules?.length ? new Set(dto.modules) : null;
    const documentWhere: Record<string, any> = {
      tenantId,
      workspaceId: workspaceId ?? undefined,
      deletedAt: null,
      OR: query ? [{ title: { contains: query, mode: 'insensitive' } }, { summary: { contains: query, mode: 'insensitive' } }, { searchableText: { contains: query, mode: 'insensitive' } }] : undefined,
    };
    if (modules) documentWhere.moduleKey = { in: Array.from(modules) };
    const indexed = await this.prisma.searchIndexedDocument.findMany({ where: documentWhere, include: { index: true }, orderBy: { indexedAt: 'desc' }, take: limit });
    const live = await this.liveSearch(query, workspaceId, limit);
    const results = [
      ...indexed.map((doc: any, rank: number) => ({ rank: rank + 1, id: doc.id, title: doc.title, summary: doc.summary, moduleKey: doc.moduleKey, sourceType: doc.sourceType, sourceId: doc.sourceId, indexed: true, metadata: doc.metadata })),
      ...live.map((item, index) => ({ rank: indexed.length + index + 1, ...item, indexed: false })),
    ].slice(0, limit);
    await this.prisma.searchQueryLog.create({ data: { tenantId, workspaceId, userId: this.userId(), query, searchType: 'enterprise_universal', filters: { modules: dto.modules ?? [] }, resultCount: results.length, latencyMs: 0, sensitiveFilteredCount: 0, metadata: { source: 'phase-72-enterprise-intelligence' } } });
    return { query, workspaceId, resultCount: results.length, results };
  }

  async runCommand(dto: UniversalCommandDto) {
    const command = dto.command.trim();
    const normalized = command.toLowerCase();
    const limit = Math.min(Math.max(dto.limit ?? 25, 1), 100);
    let category: 'navigate' | 'analyze' | 'create' | 'orchestrate' = 'analyze';
    let intent = 'universal_search';
    let payload: Record<string, unknown>;
    let result = '';

    if (/overdue\s+invoices?|invoice.*overdue/.test(normalized)) {
      intent = 'overdue_invoices';
      payload = await this.overdueInvoices(dto.workspaceId, limit);
      result = `${(payload.records as unknown[]).length} overdue invoice records found.`;
    } else if (/top\s+opportunities|opportunities.*quarter|pipeline/.test(normalized)) {
      intent = 'top_opportunities';
      payload = await this.topOpportunitiesThisQuarter(dto.workspaceId, limit);
      result = `${(payload.records as unknown[]).length} opportunity records ranked by value.`;
    } else if (/projects?.*risk|at\s+risk.*projects?/.test(normalized)) {
      intent = 'projects_at_risk';
      payload = await this.projectsAtRisk(dto.workspaceId, limit);
      result = `${(payload.records as unknown[]).length} project risk records found.`;
    } else if (/revenue.*forecast|forecast.*revenue|next\s+month/.test(normalized)) {
      intent = 'revenue_forecast_next_month';
      payload = await this.revenueForecastNextMonth(dto.workspaceId);
      result = `Next-month revenue forecast is ${(payload.forecast as any).currency} ${(payload.forecast as any).amount} from real invoices, opportunities and contracts.`;
    } else if (/risks?|recommend|growth|cost|optimi[sz]e|insights?/.test(normalized)) {
      intent = 'decision_engine';
      payload = await this.decisionEngine(dto.workspaceId);
      result = `${(payload.risks as unknown[]).length} risks, ${(payload.recommendations as unknown[]).length} recommendations and ${(payload.growthOpportunities as unknown[]).length} growth opportunities generated from live data.`;
    } else {
      category = 'navigate';
      payload = await this.universalSearch({ query: command, workspaceId: dto.workspaceId, limit });
      result = `${(payload.results as unknown[]).length} enterprise search results found.`;
    }

    await this.activity.record({ tenantId: this.tenantId(), workspaceId: this.workspaceId(dto.workspaceId), userId: this.userId(), activityType: 'enterprise.command.executed', message: command, resourceType: 'enterprise_command', resourceId: intent, metadata: { intent, result } });
    await this.events.publish({ tenantId: this.tenantId(), workspaceId: this.workspaceId(dto.workspaceId), type: 'ai.insight.generated', source: 'universal-command-center', subject: { type: 'enterprise_command', id: intent }, payload: { command, intent, result }, actorUserId: this.userId() });

    return { id: `command-${randomUUID()}`, text: command, category, result, intent, payload, generatedAt: new Date().toISOString() };
  }

  async decisionEngine(workspaceId?: string) {
    const [overdue, opportunities, projects, workflows, contracts] = await Promise.all([
      this.overdueInvoices(workspaceId, 25),
      this.topOpportunitiesThisQuarter(workspaceId, 25),
      this.projectsAtRisk(workspaceId, 25),
      this.failedWorkflowExecutions(workspaceId, 25),
      this.contractRenewals(workspaceId, 25),
    ]);
    const risks: Insight[] = [];
    const recommendations: Insight[] = [];
    const growthOpportunities: Insight[] = [];
    const costOptimizationInsights: Insight[] = [];
    const revenueInsights: Insight[] = [];

    if (overdue.records.length) risks.push({ type: 'cash_collection', severity: 'warning', title: 'Overdue invoices are affecting cash timing', evidence: { count: overdue.records.length, totalDue: overdue.totalDue }, recommendation: 'Prioritize collection workflow and customer follow-up.' });
    if (projects.records.length) risks.push({ type: 'delivery_risk', severity: 'warning', title: 'Projects are overdue or blocked', evidence: { count: projects.records.length }, recommendation: 'Review owner capacity and unblock critical tasks.' });
    if (workflows.records.length) risks.push({ type: 'workflow_reliability', severity: 'critical', title: 'Workflow failures require review', evidence: { count: workflows.records.length }, recommendation: 'Inspect failed executions and retry safe workflows.' });
    if (opportunities.records.length) growthOpportunities.push({ type: 'pipeline_growth', severity: 'opportunity', title: 'High-value opportunities are active this quarter', evidence: { count: opportunities.records.length, pipelineValue: opportunities.totalValue }, recommendation: 'Focus executive follow-up on top pipeline opportunities.' });
    if (contracts.records.length) growthOpportunities.push({ type: 'renewal_expansion', severity: 'opportunity', title: 'Upcoming renewals can drive expansion', evidence: { count: contracts.records.length, renewalValue: contracts.totalValue }, recommendation: 'Prepare renewal and expansion playbooks.' });
    if (workflows.records.length) costOptimizationInsights.push({ type: 'automation_reliability', severity: 'warning', title: 'Failed automations can create manual work', evidence: { failedExecutions: workflows.records.length }, recommendation: 'Repair high-frequency failed workflows before scaling automation.' });

    const forecast = await this.revenueForecastNextMonth(workspaceId);
    revenueInsights.push({ type: 'revenue_forecast', severity: 'info', title: 'Next-month revenue forecast generated from live data', evidence: forecast.forecast, recommendation: 'Review forecast assumptions before executive reporting.' });

    if (risks.length) recommendations.push({ type: 'risk_response', severity: 'warning', title: 'Create an operating review for open risks', evidence: { riskCount: risks.length }, recommendation: 'Assign owners to cash, delivery and workflow reliability risks.' });
    if (growthOpportunities.length) recommendations.push({ type: 'growth_focus', severity: 'opportunity', title: 'Prioritize growth actions with measurable pipeline impact', evidence: { opportunityCount: growthOpportunities.length }, recommendation: 'Convert top opportunities and renewals into a weekly executive action plan.' });

    return { risks, recommendations, growthOpportunities, costOptimizationInsights, revenueInsights, generatedAt: new Date().toISOString() };
  }

  async executiveDashboard(workspaceId?: string) {
    const tenantId = this.tenantId();
    const scoped = this.workspaceWhere(workspaceId);
    const [invoices, opportunities, tasks, insights, workflows] = await Promise.all([
      this.prisma.invoice.findMany({ where: { tenantId, ...scoped, deletedAt: null }, take: 1000 }),
      this.prisma.crmOpportunity.findMany({ where: { tenantId, ...scoped, deletedAt: null }, take: 1000 }),
      this.prisma.task.findMany({ where: { tenantId, ...scoped, deletedAt: null }, take: 1000 }),
      this.decisionEngine(workspaceId),
      this.failedWorkflowExecutions(workspaceId, 100),
    ]);
    const revenue = invoices.reduce((sum: number, invoice: any) => sum + this.n(invoice.total), 0);
    const cashFlow = invoices.reduce((sum: number, invoice: any) => sum + this.n(invoice.amountPaid), 0);
    const pipeline = opportunities.filter((opportunity: any) => !/closed lost|lost/i.test(opportunity.stage ?? '')).reduce((sum: number, opportunity: any) => sum + this.n(opportunity.amount), 0);
    const completedTasks = tasks.filter((task: any) => task.status === 'DONE').length;
    const productivity = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
    return {
      workspaceId: this.workspaceId(workspaceId),
      generatedAt: new Date().toISOString(),
      metrics: {
        revenue,
        cashFlow,
        pipeline,
        productivity,
        failedWorkflowExecutions: workflows.records.length,
      },
      counts: {
        invoices: invoices.length,
        opportunities: opportunities.length,
        tasks: tasks.length,
        completedTasks,
      },
      aiInsights: insights,
    };
  }

  async activityStream(workspaceId?: string, limit = 100) {
    const tenantId = this.tenantId();
    const workspace = this.workspaceId(workspaceId);
    const [activities, events, workflowExecutions, aiActions] = await Promise.all([
      this.prisma.activityLog.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' }, take: limit }),
      this.prisma.event.findMany({ where: { tenantId, workspaceId: workspace ?? undefined }, orderBy: { createdAt: 'desc' }, take: limit }),
      this.prisma.workflowExecution.findMany({ where: { tenantId, workspaceId: workspace ?? undefined }, orderBy: { createdAt: 'desc' }, take: limit }),
      this.prisma.aiActionLog.findMany({ where: { tenantId, workspaceId: workspace ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: limit }),
    ]);
    const stream = [
      ...activities.map((item: any) => ({ id: item.id, type: 'user_activity', title: item.activityType, message: item.message, occurredAt: item.createdAt, resourceType: item.resourceType, resourceId: item.resourceId })),
      ...events.map((item: any) => ({ id: item.id, type: 'domain_event', title: item.type, message: item.source, occurredAt: item.createdAt, resourceType: item.subject?.type, resourceId: item.subject?.id })),
      ...workflowExecutions.map((item: any) => ({ id: item.id, type: 'workflow_execution', title: item.status, message: item.approvalStatus, occurredAt: item.createdAt, resourceType: 'workflow', resourceId: item.workflowId })),
      ...aiActions.map((item: any) => ({ id: item.id, type: 'ai_agent_activity', title: item.actionType, message: item.status, occurredAt: item.createdAt, resourceType: item.targetType, resourceId: item.targetId })),
    ].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()).slice(0, limit);
    return { workspaceId: workspace, count: stream.length, stream };
  }

  async notificationIntelligence(workspaceId?: string, limit = 100) {
    const tenantId = this.tenantId();
    const userId = this.userId();
    const notifications = await this.prisma.notification.findMany({ where: { tenantId, userId: userId ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: limit });
    const unread = notifications.filter((item: any) => item.status === 'UNREAD');
    return {
      workspaceId: this.workspaceId(workspaceId),
      total: notifications.length,
      unread: unread.length,
      approvals: notifications.filter((item: any) => /approval/i.test([item.title, item.body].filter(Boolean).join(' '))).length,
      risks: notifications.filter((item: any) => /risk|critical|warning/i.test([item.title, item.body].filter(Boolean).join(' '))).length,
      budgetAlerts: notifications.filter((item: any) => item.type === 'BILLING' || /budget|invoice|payment/i.test([item.title, item.body].filter(Boolean).join(' '))).length,
      workflowFailures: notifications.filter((item: any) => item.type === 'WORKFLOW' || /workflow.*fail/i.test([item.title, item.body].filter(Boolean).join(' '))).length,
      notifications,
    };
  }

  async launchPlan() {
    const workspaceId = this.context.currentWorkspaceId();
    const workspace = workspaceId ? await this.prisma.workspace.findFirst({ where: { tenantId: this.tenantId(), id: workspaceId, deletedAt: null }, include: { business: true } }) : null;
    const dashboard = await this.executiveDashboard(workspaceId);
    const modules = await this.prisma.searchIndexedDocument.findMany({ where: { tenantId: this.tenantId(), workspaceId: workspaceId ?? undefined, deletedAt: null }, distinct: ['moduleKey'], take: 20 });
    return {
      workspaceId: workspace?.id ?? workspaceId ?? 'unscoped',
      workspaceName: workspace?.name ?? 'Current workspace',
      industry: workspace?.business?.industry ?? 'unknown',
      readinessScore: this.readinessScore(dashboard),
      modules: modules.map((item: any) => item.moduleKey).filter(Boolean),
      agents: [],
      automations: [],
      tasks: [],
      source: 'database',
    };
  }

  async acknowledgeWorkspaceLaunch(plan: { workspaceId: string; [key: string]: unknown }) {
    const workspace = await this.prisma.workspace.updateMany({ where: { tenantId: this.tenantId(), id: plan.workspaceId, deletedAt: null }, data: { metadata: { commandCenterLaunch: { requestedAt: new Date().toISOString(), requestedBy: this.userId(), plan } } } });
    return { workspaceId: plan.workspaceId, status: workspace.count ? 'launch_requested' : 'workspace_not_found' };
  }

  private async overdueInvoices(workspaceId?: string, limit = 25) {
    const records = await this.prisma.invoice.findMany({ where: { tenantId: this.tenantId(), ...this.workspaceWhere(workspaceId), deletedAt: null, OR: [{ status: 'OVERDUE' }, { dueAt: { lt: this.now() }, status: { notIn: ['PAID', 'CANCELLED', 'REFUNDED', 'VOID'] } }] }, orderBy: [{ dueAt: 'asc' }, { updatedAt: 'desc' }], take: limit });
    return { records, totalDue: records.reduce((sum: number, invoice: any) => sum + this.n(invoice.amountDue), 0) };
  }

  private quarterRange() {
    const now = this.now();
    const quarter = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), quarter * 3, 1);
    const end = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
    return { start, end };
  }

  private async topOpportunitiesThisQuarter(workspaceId?: string, limit = 25) {
    const { start, end } = this.quarterRange();
    const records = await this.prisma.crmOpportunity.findMany({ where: { tenantId: this.tenantId(), ...this.workspaceWhere(workspaceId), deletedAt: null, expectedCloseDate: { gte: start, lte: end }, NOT: [{ stage: { contains: 'lost', mode: 'insensitive' } }] }, orderBy: [{ amount: 'desc' }, { updatedAt: 'desc' }], take: limit });
    return { range: { start, end }, records, totalValue: records.reduce((sum: number, opportunity: any) => sum + this.n(opportunity.amount), 0) };
  }

  private async projectsAtRisk(workspaceId?: string, limit = 25) {
    const records = await this.prisma.project.findMany({ where: { tenantId: this.tenantId(), ...this.workspaceWhere(workspaceId), deletedAt: null, OR: [{ status: 'ON_HOLD' }, { dueDate: { lt: this.now() }, status: { notIn: ['COMPLETED', 'CANCELED'] } }] }, include: { tasks: { where: { deletedAt: null, OR: [{ status: 'BLOCKED' }, { dueAt: { lt: this.now() }, status: { notIn: ['DONE', 'CANCELED'] } }] }, take: 20 } }, orderBy: [{ dueDate: 'asc' }, { updatedAt: 'desc' }], take: limit });
    return { records };
  }

  private async failedWorkflowExecutions(workspaceId?: string, limit = 25) {
    const records = await this.prisma.workflowExecution.findMany({ where: { tenantId: this.tenantId(), ...this.workspaceWhere(workspaceId), status: 'FAILED' }, orderBy: { createdAt: 'desc' }, take: limit });
    return { records };
  }

  private async contractRenewals(workspaceId?: string, limit = 25) {
    const end = new Date(this.now().getTime() + 90 * 24 * 60 * 60 * 1000);
    const records = await this.prisma.revenueContract.findMany({ where: { tenantId: this.tenantId(), ...this.workspaceWhere(workspaceId), deletedAt: null, renewalDate: { lte: end }, status: { notIn: ['cancelled', 'expired'] } }, orderBy: { renewalDate: 'asc' }, take: limit });
    return { records, totalValue: records.reduce((sum: number, contract: any) => sum + this.n(contract.annualRecurringRevenue || contract.contractValue), 0) };
  }

  private async revenueForecastNextMonth(workspaceId?: string) {
    const now = this.now();
    const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);
    const [invoices, opportunities, contracts] = await Promise.all([
      this.prisma.invoice.findMany({ where: { tenantId: this.tenantId(), ...this.workspaceWhere(workspaceId), deletedAt: null, dueAt: { gte: start, lte: end }, status: { notIn: ['CANCELLED', 'REFUNDED', 'VOID'] } }, take: 500 }),
      this.prisma.crmOpportunity.findMany({ where: { tenantId: this.tenantId(), ...this.workspaceWhere(workspaceId), deletedAt: null, expectedCloseDate: { gte: start, lte: end }, NOT: [{ stage: { contains: 'lost', mode: 'insensitive' } }] }, take: 500 }),
      this.prisma.revenueContract.findMany({ where: { tenantId: this.tenantId(), ...this.workspaceWhere(workspaceId), deletedAt: null, status: 'active' }, take: 500 }),
    ]);
    const invoiceAmount = invoices.reduce((sum: number, invoice: any) => sum + this.n(invoice.amountDue || invoice.total), 0);
    const opportunityAmount = opportunities.reduce((sum: number, opportunity: any) => sum + this.n(opportunity.amount), 0);
    const recurringAmount = contracts.reduce((sum: number, contract: any) => sum + this.n(contract.annualRecurringRevenue) / 12, 0);
    const currency = invoices[0]?.currency ?? opportunities[0]?.currency ?? contracts[0]?.currency ?? 'USD';
    return { range: { start, end }, forecast: { currency, amount: Math.round((invoiceAmount + opportunityAmount + recurringAmount) * 100) / 100, invoiceAmount, opportunityAmount, recurringAmount }, sources: { invoices: invoices.length, opportunities: opportunities.length, contracts: contracts.length } };
  }

  private async liveSearch(query: string, workspaceId?: string, limit = 25) {
    if (!query) return [];
    const tenantId = this.tenantId();
    const scoped = this.workspaceWhere(workspaceId);
    const contains = { contains: query, mode: 'insensitive' };
    const [customers, leads, opportunities, invoices, projects, tasks, employees] = await Promise.all([
      this.prisma.crmCustomerRecord.findMany({ where: { tenantId, ...scoped, deletedAt: null, OR: [{ name: contains }, { email: contains }, { company: contains }] }, take: limit }),
      this.prisma.crmLeadRecord.findMany({ where: { tenantId, ...scoped, deletedAt: null, OR: [{ firstName: contains }, { lastName: contains }, { email: contains }, { company: contains }] }, take: limit }),
      this.prisma.crmOpportunity.findMany({ where: { tenantId, ...scoped, deletedAt: null, name: contains }, take: limit }),
      this.prisma.invoice.findMany({ where: { tenantId, ...scoped, deletedAt: null, invoiceNumber: contains }, take: limit }),
      this.prisma.project.findMany({ where: { tenantId, ...scoped, deletedAt: null, name: contains }, take: limit }),
      this.prisma.task.findMany({ where: { tenantId, ...scoped, deletedAt: null, OR: [{ title: contains }, { description: contains }] }, take: limit }),
      this.prisma.employee.findMany({ where: { tenantId, ...scoped, deletedAt: null, OR: [{ name: contains }, { title: contains }, { description: contains }] }, take: limit }),
    ]);
    return [
      ...customers.map((r: any) => ({ id: r.id, title: r.name, summary: r.company, moduleKey: 'crm', sourceType: 'crm_customer', sourceId: r.id })),
      ...leads.map((r: any) => ({ id: r.id, title: [r.firstName, r.lastName].filter(Boolean).join(' '), summary: r.company, moduleKey: 'crm', sourceType: 'crm_lead', sourceId: r.id })),
      ...opportunities.map((r: any) => ({ id: r.id, title: r.name, summary: r.stage, moduleKey: 'crm', sourceType: 'crm_opportunity', sourceId: r.id })),
      ...invoices.map((r: any) => ({ id: r.id, title: r.invoiceNumber, summary: r.status, moduleKey: 'finance', sourceType: 'invoice', sourceId: r.id })),
      ...projects.map((r: any) => ({ id: r.id, title: r.name, summary: r.status, moduleKey: 'projects', sourceType: 'project', sourceId: r.id })),
      ...tasks.map((r: any) => ({ id: r.id, title: r.title, summary: r.status, moduleKey: 'projects', sourceType: 'task', sourceId: r.id })),
      ...employees.map((r: any) => ({ id: r.id, title: r.name ?? r.recordKey, summary: r.title, moduleKey: 'hr', sourceType: 'employee', sourceId: r.id })),
    ].slice(0, limit);
  }

  private workspaceWhere(workspaceId?: string) {
    const id = this.workspaceId(workspaceId);
    return id ? { workspaceId: id } : {};
  }

  private readinessScore(dashboard: any) {
    let score = 50;
    if (dashboard.counts.invoices) score += 10;
    if (dashboard.counts.opportunities) score += 10;
    if (dashboard.counts.tasks) score += 10;
    if (dashboard.metrics.failedWorkflowExecutions === 0) score += 10;
    if (dashboard.aiInsights.risks.length === 0) score += 10;
    return Math.max(0, Math.min(100, score));
  }
}
