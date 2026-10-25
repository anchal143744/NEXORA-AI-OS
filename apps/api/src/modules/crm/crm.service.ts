import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessAuditService } from '../audit/business-audit.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import {
  AiSalesCommandDto,
  CloseOpportunityDto,
  CreateCustomerDto,
  CreateLeadDto,
  CreateOpportunityDto,
  CreatePipelineDto,
  CRM_LEAD_STATUSES,
  CRM_OPPORTUNITY_STAGES,
  CRM_RISK_LEVELS,
  UpdateCustomerDto,
  UpdateLeadDto,
  UpdateOpportunityDto,
  UpdateOpportunityStageDto,
} from './dto/crm.dto';

type Metadata = Record<string, unknown>;
type LeadStatus = typeof CRM_LEAD_STATUSES[number];
type OpportunityStage = typeof CRM_OPPORTUNITY_STAGES[number];
type RiskLevel = typeof CRM_RISK_LEVELS[number];

type DbLead = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  source?: string | null;
  status: string;
  ownerUserId?: string | null;
  metadata?: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type DbCustomer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  lifecycleStage: string;
  ownerUserId?: string | null;
  metadata?: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type DbOpportunity = {
  id: string;
  pipelineId?: string | null;
  customerId?: string | null;
  name: string;
  stage: string;
  amount?: unknown;
  currency?: string | null;
  expectedCloseDate?: Date | null;
  closedAt?: Date | null;
  closeReason?: string | null;
  metadata?: unknown;
  customer?: DbCustomer | null;
  pipeline?: { id: string; name: string } | null;
  createdAt: Date;
  updatedAt: Date;
};

type DbActivity = {
  id: string;
  userId?: string | null;
  activityType: string;
  message: string;
  resourceType?: string | null;
  resourceId?: string | null;
  metadata?: unknown;
  createdAt: Date;
};

type WorkspaceLead = {
  id: string;
  name: string;
  company: string;
  role: string;
  source: string;
  owner: string;
  status: LeadStatus;
  score: number;
  conversionProbability: number;
  value: number;
  nextBestAction: string;
  lifecycle: string[];
  tags: string[];
};

type WorkspaceOpportunity = {
  id: string;
  accountId: string;
  accountName: string;
  title: string;
  owner: string;
  stage: OpportunityStage;
  value: number;
  probability: number;
  forecastClose: string;
  risk: RiskLevel;
  nextStep: string;
};

type WorkspaceMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: string;
  tone: 'healthy' | 'watch' | 'risk';
};

type WorkspaceContact = {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  segment: string;
  tags: string[];
  lastTouch: string;
  notes: string;
  communicationHistory: string[];
};

type WorkspaceAccount = {
  id: string;
  name: string;
  industry: string;
  region: string;
  health: number;
  revenue: number;
  openPipeline: number;
  owner: string;
  risk: string;
};

type WorkspaceActivity = {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  title: string;
  accountName: string;
  owner: string;
  due: string;
  outcome: string;
};

type WorkspaceTimelineEvent = {
  id: string;
  accountName: string;
  label: string;
  detail: string;
  timestamp: string;
  module: string;
};

type WorkspaceProposal = {
  id: string;
  accountName: string;
  title: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  approvalStatus: 'draft' | 'review' | 'approved';
  validUntil: string;
  lineItems: Array<{ id: string; label: string; quantity: number; price: number }>;
};

type WorkspaceForecast = {
  period: 'monthly' | 'quarterly' | 'annual';
  committed: number;
  bestCase: number;
  pipeline: number;
  weighted: number;
  accuracy: number;
};

type WorkspaceRevOpsMetric = {
  id: string;
  label: string;
  value: string;
  benchmark: string;
  signal: 'positive' | 'watch' | 'risk';
};

type WorkspaceInsight = {
  id: string;
  title: string;
  summary: string;
  severity: 'opportunity' | 'risk' | 'info';
  action: string;
};

type CrmWorkspaceSnapshot = {
  metrics: WorkspaceMetric[];
  leads: WorkspaceLead[];
  contacts: WorkspaceContact[];
  accounts: WorkspaceAccount[];
  opportunities: WorkspaceOpportunity[];
  activities: WorkspaceActivity[];
  timeline: WorkspaceTimelineEvent[];
  proposals: WorkspaceProposal[];
  forecasts: WorkspaceForecast[];
  revOps: WorkspaceRevOpsMetric[];
  insights: WorkspaceInsight[];
};

const CRM_RESOURCE_TYPES = ['crm.lead', 'crm.customer', 'crm.opportunity', 'crm.pipeline', 'crm.proposal'];
const STAGE_LABELS: Record<OpportunityStage, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  discovery: 'Discovery',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
};
const STAGE_PROBABILITY: Record<OpportunityStage, number> = {
  lead: 12,
  qualified: 28,
  discovery: 42,
  proposal: 64,
  negotiation: 78,
  closed_won: 100,
  closed_lost: 0,
};

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly audit: BusinessAuditService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId() { const id = this.context.currentWorkspaceId(); if (!id) throw new NotFoundException('Workspace context is required'); return id; }
  private userId() { return this.context.context()?.userId; }
  private record(action: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXECUTE', type: string, id: string, message: string, metadata?: Metadata) {
    return this.audit.record({ tenantId: this.tenantId(), workspaceId: this.workspaceId(), userId: this.userId(), action, resourceType: type, resourceId: id, message, metadata });
  }

  async createLead(dto: CreateLeadDto) {
    const row = await this.prisma.crmLeadRecord.create({
      data: {
        tenantId: this.tenantId(),
        workspaceId: this.workspaceId(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        company: dto.company,
        source: dto.source,
        status: normalizeLeadStatus(dto.status),
        ownerUserId: dto.ownerUserId,
        metadata: leadMetadata(dto),
      },
    });
    await this.record('CREATE', 'crm.lead', row.id, 'Lead created', { company: row.company, source: row.source });
    return row;
  }

  listLeads() {
    return this.prisma.crmLeadRecord.findMany({ where: { tenantId: this.tenantId(), workspaceId: this.workspaceId(), deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async updateLead(id: string, dto: UpdateLeadDto) {
    const lead = await this.prisma.crmLeadRecord.findFirst({ where: { id, tenantId: this.tenantId(), workspaceId: this.workspaceId(), deletedAt: null } });
    if (!lead) throw new NotFoundException('Lead not found');
    const updated = await this.prisma.crmLeadRecord.update({
      where: { id },
      data: {
        firstName: dto.firstName ?? undefined,
        lastName: dto.lastName ?? undefined,
        email: dto.email ?? undefined,
        phone: dto.phone ?? undefined,
        company: dto.company ?? undefined,
        source: dto.source ?? undefined,
        status: dto.status ? normalizeLeadStatus(dto.status) : undefined,
        ownerUserId: dto.ownerUserId ?? undefined,
        metadata: mergeMetadata(metadataOf(lead.metadata), leadMetadata(dto)),
      },
    });
    await this.record('UPDATE', 'crm.lead', id, 'Lead updated', { company: updated.company, status: updated.status });
    return updated;
  }

  async deleteLead(id: string) {
    const r = await this.prisma.crmLeadRecord.updateMany({ where: { id, tenantId: this.tenantId(), workspaceId: this.workspaceId(), deletedAt: null }, data: { deletedAt: new Date() } });
    if (!r.count) throw new NotFoundException('Lead not found');
    await this.record('DELETE', 'crm.lead', id, 'Lead deleted');
    return { deleted: true };
  }

  async createCustomer(dto: CreateCustomerDto) {
    const row = await this.prisma.crmCustomerRecord.create({
      data: {
        tenantId: this.tenantId(),
        workspaceId: this.workspaceId(),
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        company: dto.company,
        lifecycleStage: dto.lifecycleStage ?? 'customer',
        ownerUserId: dto.ownerUserId,
        metadata: customerMetadata(dto),
      },
    });
    await this.record('CREATE', 'crm.customer', row.id, 'Customer created', { company: row.company, lifecycleStage: row.lifecycleStage });
    return row;
  }

  listCustomers() {
    return this.prisma.crmCustomerRecord.findMany({ where: { tenantId: this.tenantId(), workspaceId: this.workspaceId(), deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto) {
    const customer = await this.prisma.crmCustomerRecord.findFirst({ where: { id, tenantId: this.tenantId(), workspaceId: this.workspaceId(), deletedAt: null } });
    if (!customer) throw new NotFoundException('Customer not found');
    const updated = await this.prisma.crmCustomerRecord.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        email: dto.email ?? undefined,
        phone: dto.phone ?? undefined,
        company: dto.company ?? undefined,
        lifecycleStage: dto.lifecycleStage ?? undefined,
        ownerUserId: dto.ownerUserId ?? undefined,
        metadata: mergeMetadata(metadataOf(customer.metadata), customerMetadata(dto)),
      },
    });
    await this.record('UPDATE', 'crm.customer', id, 'Customer updated', { company: updated.company, lifecycleStage: updated.lifecycleStage });
    return updated;
  }

  async deleteCustomer(id: string) {
    const r = await this.prisma.crmCustomerRecord.updateMany({ where: { id, tenantId: this.tenantId(), workspaceId: this.workspaceId(), deletedAt: null }, data: { deletedAt: new Date() } });
    if (!r.count) throw new NotFoundException('Customer not found');
    await this.record('DELETE', 'crm.customer', id, 'Customer deleted');
    return { deleted: true };
  }

  async createPipeline(dto: CreatePipelineDto) {
    const row = await this.prisma.crmPipeline.create({ data: { tenantId: this.tenantId(), workspaceId: this.workspaceId(), name: dto.name, stages: CRM_OPPORTUNITY_STAGES.map((id) => ({ id, label: STAGE_LABELS[id] })) } });
    await this.record('CREATE', 'crm.pipeline', row.id, 'Pipeline created', { name: row.name });
    return row;
  }

  async createOpportunity(dto: CreateOpportunityDto) {
    const row = await this.prisma.crmOpportunity.create({
      data: {
        tenantId: this.tenantId(),
        workspaceId: this.workspaceId(),
        pipelineId: dto.pipelineId,
        customerId: dto.customerId,
        name: dto.name,
        stage: normalizeOpportunityStage(dto.stage),
        amount: dto.amount,
        currency: dto.currency ?? 'USD',
        expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : undefined,
        metadata: opportunityMetadata(dto),
      },
    });
    await this.record('CREATE', 'crm.opportunity', row.id, 'Opportunity created', { name: row.name, stage: row.stage, amount: dto.amount });
    return row;
  }

  async updateOpportunity(id: string, dto: UpdateOpportunityDto) {
    const opportunity = await this.prisma.crmOpportunity.findFirst({ where: { id, tenantId: this.tenantId(), workspaceId: this.workspaceId(), deletedAt: null } });
    if (!opportunity) throw new NotFoundException('Opportunity not found');
    const stage = dto.stage ? normalizeOpportunityStage(dto.stage) : undefined;
    const updated = await this.prisma.crmOpportunity.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        stage,
        amount: dto.amount ?? undefined,
        currency: dto.currency ?? undefined,
        expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : undefined,
        closedAt: stage === 'closed_won' || stage === 'closed_lost' ? new Date() : undefined,
        metadata: mergeMetadata(metadataOf(opportunity.metadata), opportunityMetadata(dto)),
      },
      include: { customer: true, pipeline: true },
    });
    await this.record('UPDATE', 'crm.opportunity', id, 'Opportunity updated', { name: updated.name, stage: updated.stage, amount: toNumber(updated.amount) });
    return updated;
  }

  async updateOpportunityStage(id: string, dto: UpdateOpportunityStageDto) {
    const row = await this.updateOpportunity(id, { stage: dto.stage });
    return this.mapOpportunity(row);
  }

  async closeOpportunity(id: string, dto: CloseOpportunityDto) {
    const row = await this.updateOpportunity(id, { stage: dto.stage });
    await this.record('UPDATE', 'crm.opportunity', id, 'Opportunity closed', { stage: dto.stage, closeReason: dto.closeReason });
    return row;
  }

  async getWorkspace(): Promise<CrmWorkspaceSnapshot> {
    const tenantId = this.tenantId();
    const workspaceId = this.workspaceId();
    const [leads, customers, opportunities] = await Promise.all([
      this.prisma.crmLeadRecord.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 200 }),
      this.prisma.crmCustomerRecord.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 200 }),
      this.prisma.crmOpportunity.findMany({ where: { tenantId, workspaceId, deletedAt: null }, include: { customer: true, pipeline: true }, orderBy: { updatedAt: 'desc' }, take: 200 }),
    ]);
    const crmResourceIds = [...leads.map((lead: DbLead) => lead.id), ...customers.map((customer: DbCustomer) => customer.id), ...opportunities.map((opportunity: DbOpportunity) => opportunity.id)];
    const activityLogs = await this.prisma.activityLog.findMany({
      where: {
        tenantId,
        resourceType: { in: CRM_RESOURCE_TYPES },
        OR: [
          { resourceId: { in: crmResourceIds } },
          { metadata: { path: ['workspaceId'], equals: workspaceId } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const mappedLeads = leads.map((lead: DbLead) => this.mapLead(lead));
    const mappedOpportunities = opportunities.map((opportunity: DbOpportunity) => this.mapOpportunity(opportunity));
    const mappedContacts = customers.map((customer: DbCustomer) => this.mapContact(customer, activityLogs));
    const mappedAccounts = this.mapAccounts(customers, opportunities);
    const mappedActivities = activityLogs.slice(0, 25).map((activity: DbActivity) => this.mapActivity(activity));
    const mappedTimeline = activityLogs.slice(0, 40).map((activity: DbActivity) => this.mapTimelineEvent(activity));
    const forecasts = createForecasts(mappedOpportunities);

    return {
      metrics: createCrmMetrics(mappedOpportunities),
      leads: mappedLeads,
      contacts: mappedContacts,
      accounts: mappedAccounts,
      opportunities: mappedOpportunities,
      activities: mappedActivities,
      timeline: mappedTimeline,
      proposals: this.mapProposals(opportunities),
      forecasts,
      revOps: createRevOpsMetrics(mappedOpportunities),
      insights: createAiSalesInsights(mappedLeads, mappedOpportunities),
    };
  }

  async runSalesCommand(dto: AiSalesCommandDto) {
    const data = await this.getWorkspace();
    const normalized = dto.command.toLowerCase();
    const hotLeads = [...data.leads].sort((a, b) => b.score - a.score).slice(0, 3);
    const atRisk = data.opportunities.filter((item) => item.risk !== 'low');
    const quarterly = data.forecasts.find((item) => item.period === 'quarterly') ?? data.forecasts[0];
    let response = 'I reviewed live CRM records, pipeline, activity, account health and revenue operations signals.';
    let recommendedActions = data.insights.map((item) => item.action);

    if (data.leads.length === 0 && data.opportunities.length === 0) {
      response = 'No CRM records exist yet for this workspace. Create or import leads first, then NEXORA will calculate lead priority, pipeline health and forecast risk from the database.';
      recommendedActions = ['Create the first lead', 'Import CRM records from CSV', 'Connect a CRM integration'];
    } else if (normalized.includes('hot lead')) {
      response = hotLeads.length ? 'Hot leads from live CRM data: ' + hotLeads.map((lead) => `${lead.company} (${lead.score})`).join(', ') + '.' : 'There are no active leads to score yet.';
      recommendedActions = hotLeads.map((lead) => lead.nextBestAction);
    } else if (normalized.includes('forecast')) {
      response = 'Quarter forecast is ' + currency(quarterly.weighted) + ' weighted and ' + currency(quarterly.committed) + ' committed from live opportunities.';
      recommendedActions = ['Review negotiation blockers', 'Update expected close dates', 'Confirm next steps on proposal-stage opportunities'];
    } else if (normalized.includes('risk')) {
      response = atRisk.length ? String(atRisk.length) + ' opportunities need attention: ' + atRisk.map((deal) => deal.accountName).join(', ') + '.' : 'No medium or high risk opportunities are currently open.';
      recommendedActions = atRisk.length ? atRisk.map((deal) => deal.nextStep) : ['Keep close dates current', 'Review stalled opportunities weekly'];
    } else if (normalized.includes('pipeline health')) {
      response = 'Pipeline health is based on ' + currency(calculatePipelineValue(data.opportunities)) + ' open pipeline and ' + currency(calculateWeightedPipeline(data.opportunities)) + ' weighted forecast.';
      recommendedActions = ['Advance qualified deals', 'Create next activities for stalled opportunities', 'Refresh lead scores'];
    } else if (normalized.includes('next action')) {
      response = 'Next actions are prioritized by lead score, opportunity risk and forecast impact from the current workspace.';
      recommendedActions = data.insights.map((item) => item.action);
    }

    const result = { id: 'sales-command-' + randomUUID(), command: dto.command, response, recommendedActions: recommendedActions.slice(0, 4) };
    await this.record('EXECUTE', 'crm.copilot', result.id, 'AI Sales Copilot command executed', { command: dto.command, response: result.response });
    return result;
  }

  async exportProposalPdf(proposalId: string) {
    const opportunity = await this.resolveProposalOpportunity(proposalId);
    await this.record('EXECUTE', 'crm.proposal', proposalId, 'Proposal PDF export requested', { opportunityId: opportunity.id });
    return { proposalId, opportunityId: opportunity.id, status: 'export_recorded' };
  }

  async requestProposalApproval(proposalId: string) {
    const opportunity = await this.resolveProposalOpportunity(proposalId);
    await this.record('EXECUTE', 'crm.proposal', proposalId, 'Proposal approval requested', { opportunityId: opportunity.id });
    return { proposalId, opportunityId: opportunity.id, status: 'approval_requested' };
  }

  private async resolveProposalOpportunity(proposalId: string) {
    const opportunityId = proposalId.startsWith('proposal-') ? proposalId.slice('proposal-'.length) : proposalId;
    const opportunity = await this.prisma.crmOpportunity.findFirst({ where: { id: opportunityId, tenantId: this.tenantId(), workspaceId: this.workspaceId(), deletedAt: null } });
    if (!opportunity) throw new NotFoundException('Proposal opportunity not found');
    return opportunity;
  }

  private mapLead(lead: DbLead) {
    const metadata = metadataOf(lead.metadata);
    const status = normalizeLeadStatus(lead.status);
    const score = numberFromMetadata(metadata, 'score') ?? scoreLead(status, lead);
    const conversionProbability = numberFromMetadata(metadata, 'conversionProbability') ?? Math.min(95, Math.round(score * 0.86));
    return {
      id: lead.id,
      name: [lead.firstName, lead.lastName].filter(Boolean).join(' '),
      company: lead.company ?? 'Unassigned company',
      role: stringFromMetadata(metadata, 'role') ?? 'Unspecified role',
      source: lead.source ?? 'Manual entry',
      owner: lead.ownerUserId ? 'Assigned owner' : 'Unassigned',
      status,
      score,
      conversionProbability,
      value: numberFromMetadata(metadata, 'estimatedValue') ?? 0,
      nextBestAction: stringFromMetadata(metadata, 'nextBestAction') ?? nextLeadAction(status, lead),
      lifecycle: createLeadLifecycle(status, lead),
      tags: stringListFromMetadata(metadata, 'tags'),
    };
  }

  private mapContact(customer: DbCustomer, activities: DbActivity[]) {
    const metadata = metadataOf(customer.metadata);
    const history = activities.filter((activity) => activity.resourceId === customer.id).slice(0, 4).map((activity) => activity.message);
    return {
      id: customer.id,
      name: customer.name,
      company: customer.company ?? customer.name,
      title: stringFromMetadata(metadata, 'title') ?? 'Customer contact',
      email: customer.email ?? 'No email on file',
      phone: customer.phone ?? 'No phone on file',
      segment: customer.lifecycleStage,
      tags: stringListFromMetadata(metadata, 'tags'),
      lastTouch: formatRelativeDate(customer.updatedAt),
      notes: stringFromMetadata(metadata, 'notes') ?? 'No notes recorded yet.',
      communicationHistory: stringListFromMetadata(metadata, 'communicationHistory').concat(history).slice(0, 6),
    };
  }

  private mapAccounts(customers: DbCustomer[], opportunities: DbOpportunity[]) {
    const groups = new Map<string, { customers: DbCustomer[]; opportunities: DbOpportunity[] }>();
    for (const customer of customers) {
      const key = customer.company ?? customer.name;
      const current = groups.get(key) ?? { customers: [], opportunities: [] };
      current.customers.push(customer);
      groups.set(key, current);
    }
    for (const opportunity of opportunities) {
      const key = opportunity.customer?.company ?? opportunity.customer?.name ?? 'Unassigned account';
      const current = groups.get(key) ?? { customers: [], opportunities: [] };
      current.opportunities.push(opportunity);
      groups.set(key, current);
    }

    return Array.from(groups.entries()).map(([name, group]) => {
      const firstCustomer = group.customers[0];
      const metadata = metadataOf(firstCustomer?.metadata);
      const mappedOpportunities = group.opportunities.map((opportunity) => this.mapOpportunity(opportunity));
      const openPipeline = calculatePipelineValue(mappedOpportunities);
      const revenue = mappedOpportunities.filter((opportunity) => opportunity.stage === 'closed_won').reduce((sum, opportunity) => sum + opportunity.value, 0);
      const riskCount = mappedOpportunities.filter((opportunity) => opportunity.risk !== 'low').length;
      return {
        id: firstCustomer?.id ?? 'account-' + stableKey(name),
        name,
        industry: stringFromMetadata(metadata, 'industry') ?? 'Unclassified industry',
        region: stringFromMetadata(metadata, 'region') ?? 'Global',
        health: numberFromMetadata(metadata, 'healthScore') ?? accountHealth(mappedOpportunities, firstCustomer),
        revenue: numberFromMetadata(metadata, 'annualRevenue') ?? revenue,
        openPipeline,
        owner: firstCustomer?.ownerUserId ? 'Assigned owner' : 'Unassigned',
        risk: riskCount ? `${riskCount} revenue risk signal${riskCount === 1 ? '' : 's'} require review.` : 'No active revenue risk signals.',
      };
    });
  }

  private mapOpportunity(opportunity: DbOpportunity) {
    const metadata = metadataOf(opportunity.metadata);
    const stage = normalizeOpportunityStage(opportunity.stage);
    const value = toNumber(opportunity.amount);
    const probability = numberFromMetadata(metadata, 'probability') ?? STAGE_PROBABILITY[stage];
    const risk = normalizeRisk(stringFromMetadata(metadata, 'risk') ?? inferRisk(stage, opportunity.expectedCloseDate, probability));
    return {
      id: opportunity.id,
      accountId: opportunity.customerId ?? 'unassigned',
      accountName: opportunity.customer?.company ?? opportunity.customer?.name ?? 'Unassigned account',
      title: opportunity.name,
      owner: stringFromMetadata(metadata, 'owner') ?? 'Unassigned',
      stage,
      value,
      probability,
      forecastClose: opportunity.expectedCloseDate ? opportunity.expectedCloseDate.toISOString().slice(0, 10) : 'No close date',
      risk,
      nextStep: stringFromMetadata(metadata, 'nextStep') ?? nextOpportunityAction(stage, risk),
    };
  }

  private mapActivity(activity: DbActivity) {
    return {
      id: activity.id,
      type: activityType(activity.activityType),
      title: activity.message,
      accountName: stringFromMetadata(metadataOf(activity.metadata), 'company') ?? stringFromMetadata(metadataOf(activity.metadata), 'name') ?? activity.resourceType ?? 'CRM',
      owner: activity.userId ? 'Current user' : 'System',
      due: formatRelativeDate(activity.createdAt),
      outcome: activity.message,
    };
  }

  private mapTimelineEvent(activity: DbActivity) {
    return {
      id: activity.id,
      accountName: stringFromMetadata(metadataOf(activity.metadata), 'company') ?? stringFromMetadata(metadataOf(activity.metadata), 'name') ?? 'CRM',
      label: activity.message,
      detail: `${activity.resourceType ?? 'crm'} ${activity.activityType}`,
      timestamp: formatRelativeDate(activity.createdAt),
      module: activity.resourceType ?? 'CRM',
    };
  }

  private mapProposals(opportunities: DbOpportunity[]): WorkspaceProposal[] {
    return opportunities.filter((opportunity) => ['proposal', 'negotiation'].includes(normalizeOpportunityStage(opportunity.stage))).map((opportunity) => {
      const metadata = metadataOf(opportunity.metadata);
      const amount = toNumber(opportunity.amount);
      const discount = numberFromMetadata(metadata, 'discount') ?? 0;
      const tax = numberFromMetadata(metadata, 'tax') ?? 0;
      const subtotal = amount + discount;
      return {
        id: 'proposal-' + opportunity.id,
        accountName: opportunity.customer?.company ?? opportunity.customer?.name ?? 'Unassigned account',
        title: opportunity.name + ' Proposal',
        subtotal,
        discount,
        tax,
        total: subtotal - discount + tax,
        approvalStatus: normalizeOpportunityStage(opportunity.stage) === 'negotiation' ? 'review' : 'draft',
        validUntil: opportunity.expectedCloseDate ? opportunity.expectedCloseDate.toISOString().slice(0, 10) : 'No close date',
        lineItems: [{ id: 'line-' + opportunity.id, label: opportunity.name, quantity: 1, price: amount }],
      };
    });
  }
}

function leadMetadata(dto: Partial<CreateLeadDto & UpdateLeadDto>): Metadata {
  return cleanMetadata({ role: dto.role, score: dto.score, conversionProbability: dto.conversionProbability, estimatedValue: dto.estimatedValue, nextBestAction: dto.nextBestAction, tags: dto.tags });
}

function customerMetadata(dto: Partial<CreateCustomerDto & UpdateCustomerDto>): Metadata {
  return cleanMetadata({ title: dto.title, industry: dto.industry, region: dto.region, healthScore: dto.healthScore, annualRevenue: dto.annualRevenue, tags: dto.tags, communicationHistory: dto.communicationHistory });
}

function opportunityMetadata(dto: Partial<CreateOpportunityDto & UpdateOpportunityDto>): Metadata {
  return cleanMetadata({ probability: dto.probability, risk: dto.risk, nextStep: dto.nextStep });
}

function cleanMetadata(input: Metadata): Metadata {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
}

function mergeMetadata(current: Metadata, next: Metadata): Metadata {
  return { ...current, ...cleanMetadata(next) };
}

function metadataOf(value: unknown): Metadata {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Metadata : {};
}

function stringFromMetadata(metadata: Metadata, key: string): string | undefined {
  const value = metadata[key];
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function stringListFromMetadata(metadata: Metadata, key: string): string[] {
  const value = metadata[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
}

function numberFromMetadata(metadata: Metadata, key: string): number | undefined {
  const value = metadata[key];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return undefined;
}

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value) || 0;
  if (value && typeof value === 'object' && 'toNumber' in value) {
    const candidate = value as { toNumber?: () => number };
    return typeof candidate.toNumber === 'function' ? candidate.toNumber() : 0;
  }
  return 0;
}

function normalizeLeadStatus(value?: string | null): LeadStatus {
  return CRM_LEAD_STATUSES.includes(value as LeadStatus) ? value as LeadStatus : 'new';
}

function normalizeOpportunityStage(value?: string | null): OpportunityStage {
  if (value === 'won') return 'closed_won';
  if (value === 'lost') return 'closed_lost';
  if (value === 'open') return 'lead';
  return CRM_OPPORTUNITY_STAGES.includes(value as OpportunityStage) ? value as OpportunityStage : 'lead';
}

function normalizeRisk(value?: string | null): RiskLevel {
  return CRM_RISK_LEVELS.includes(value as RiskLevel) ? value as RiskLevel : 'low';
}

function scoreLead(status: LeadStatus, lead: DbLead) {
  const completeness = [lead.email, lead.phone, lead.company, lead.source].filter(Boolean).length * 8;
  const statusBoost: Record<LeadStatus, number> = { new: 30, assigned: 46, qualified: 76, nurture: 52, converted: 95, disqualified: 5 };
  return Math.min(100, statusBoost[status] + completeness);
}

function nextLeadAction(status: LeadStatus, lead: DbLead) {
  if (!lead.email && !lead.phone) return 'Add a verified email or phone before routing this lead.';
  if (status === 'new') return 'Assign owner and qualify fit, intent and timing.';
  if (status === 'assigned') return 'Complete qualification call and update lifecycle status.';
  if (status === 'qualified') return 'Create opportunity and schedule discovery.';
  if (status === 'nurture') return 'Add to nurture sequence and monitor buying intent.';
  if (status === 'converted') return 'Review converted opportunity and handoff next action.';
  return 'Archive or revisit disqualification reason.';
}

function createLeadLifecycle(status: LeadStatus, lead: DbLead) {
  const lifecycle = ['Captured'];
  if (lead.email || lead.phone) lifecycle.push('Enriched');
  if (lead.ownerUserId || status !== 'new') lifecycle.push('Assigned');
  if (['qualified', 'converted'].includes(status)) lifecycle.push('Qualified');
  if (status === 'converted') lifecycle.push('Converted');
  return lifecycle;
}

function inferRisk(stage: OpportunityStage, expectedCloseDate: Date | null | undefined, probability: number) {
  if (stage === 'closed_lost') return 'high';
  if (stage === 'closed_won') return 'low';
  if (!expectedCloseDate) return 'medium';
  const daysUntilClose = Math.ceil((expectedCloseDate.getTime() - Date.now()) / 86_400_000);
  if (daysUntilClose < 0 && !['closed_won', 'closed_lost'].includes(stage)) return 'high';
  if (daysUntilClose <= 14 && probability < 60) return 'medium';
  return 'low';
}

function nextOpportunityAction(stage: OpportunityStage, risk: RiskLevel) {
  if (risk === 'high') return 'Escalate close plan, update risks and confirm executive owner.';
  if (stage === 'lead') return 'Qualify account fit and buying urgency.';
  if (stage === 'qualified') return 'Schedule discovery and map stakeholders.';
  if (stage === 'discovery') return 'Document pain, buying process and success criteria.';
  if (stage === 'proposal') return 'Review pricing, approval path and close timeline.';
  if (stage === 'negotiation') return 'Resolve legal, procurement and commercial blockers.';
  if (stage === 'closed_won') return 'Start onboarding handoff and expansion plan.';
  return 'Capture loss reason and improve qualification signals.';
}

function accountHealth(opportunities: WorkspaceOpportunity[], customer?: DbCustomer) {
  if (!customer && opportunities.length === 0) return 0;
  const riskPenalty = opportunities.filter((opportunity) => opportunity.risk !== 'low').length * 12;
  const openPipeline = opportunities.filter((opportunity) => !['closed_won', 'closed_lost'].includes(opportunity.stage)).length * 4;
  return Math.max(0, Math.min(100, 78 + openPipeline - riskPenalty));
}

function activityType(activityTypeValue: string): WorkspaceActivity['type'] {
  if (activityTypeValue.includes('email')) return 'email';
  if (activityTypeValue.includes('meeting')) return 'meeting';
  if (activityTypeValue.includes('call')) return 'call';
  if (activityTypeValue.includes('task')) return 'task';
  return 'note';
}

function formatRelativeDate(value: Date) {
  const diffDays = Math.floor((Date.now() - value.getTime()) / 86_400_000);
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return value.toISOString().slice(0, 10);
}

function stableKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'unassigned';
}

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function calculateWeightedPipeline(items: Array<{ stage: OpportunityStage; value: number; probability: number }>) {
  return items.filter((item) => item.stage !== 'closed_lost').reduce((sum, item) => sum + item.value * (item.probability / 100), 0);
}

function calculatePipelineValue(items: Array<{ stage: OpportunityStage; value: number }>) {
  return items.filter((item) => !['closed_lost', 'closed_won'].includes(item.stage)).reduce((sum, item) => sum + item.value, 0);
}

function createCrmMetrics(items: WorkspaceOpportunity[]): WorkspaceMetric[] {
  const openOpportunities = items.filter((item) => !['closed_won', 'closed_lost'].includes(item.stage));
  const won = items.filter((item) => item.stage === 'closed_won');
  const pipeline = calculatePipelineValue(items);
  const weighted = calculateWeightedPipeline(openOpportunities);
  return [
    { id: 'revenue', label: 'Revenue Overview', value: currency(won.reduce((sum, item) => sum + item.value, 0)), detail: 'Closed revenue from CRM opportunities', trend: won.length ? `${won.length} won deal${won.length === 1 ? '' : 's'}` : 'No closed revenue yet', tone: won.length ? 'healthy' : 'watch' },
    { id: 'pipeline', label: 'Pipeline Value', value: currency(pipeline), detail: String(openOpportunities.length) + ' active opportunities', trend: openOpportunities.length ? 'Live pipeline' : 'No open pipeline', tone: openOpportunities.length ? 'healthy' : 'watch' },
    { id: 'open', label: 'Open Opportunities', value: String(openOpportunities.length), detail: 'Active revenue conversations', trend: openOpportunities.some((item) => item.risk !== 'low') ? 'Risk review needed' : 'No active risk', tone: openOpportunities.some((item) => item.risk !== 'low') ? 'watch' : 'healthy' },
    { id: 'forecast', label: 'Forecast Revenue', value: currency(weighted), detail: 'Weighted by stage probability', trend: weighted ? 'Probability weighted' : 'Add opportunities', tone: weighted ? 'healthy' : 'watch' },
  ];
}

function createForecasts(items: WorkspaceOpportunity[]): WorkspaceForecast[] {
  const weighted = calculateWeightedPipeline(items);
  const committed = items.filter((item) => ['negotiation', 'closed_won'].includes(item.stage)).reduce((sum, item) => sum + item.value * (item.probability / 100), 0);
  const bestCase = items.filter((item) => item.stage !== 'closed_lost').reduce((sum, item) => sum + item.value, 0);
  const accuracy = items.length ? Math.min(92, 62 + items.filter((item) => item.forecastClose !== 'No close date').length * 4) : 0;
  return [
    { period: 'monthly', committed: Math.round(committed * 0.42), bestCase: Math.round(bestCase * 0.36), pipeline: Math.round(calculatePipelineValue(items) * 0.36), weighted: Math.round(weighted * 0.42), accuracy },
    { period: 'quarterly', committed: Math.round(committed), bestCase: Math.round(bestCase), pipeline: calculatePipelineValue(items), weighted: Math.round(weighted), accuracy },
    { period: 'annual', committed: Math.round(committed * 3.8), bestCase: Math.round(bestCase * 4.1), pipeline: Math.round(calculatePipelineValue(items) * 4.1), weighted: Math.round(weighted * 3.9), accuracy: items.length ? Math.max(45, accuracy - 8) : 0 },
  ];
}

function createRevOpsMetrics(items: WorkspaceOpportunity[]): WorkspaceRevOpsMetric[] {
  const open = items.filter((item) => !['closed_won', 'closed_lost'].includes(item.stage));
  const risks = open.filter((item) => item.risk !== 'low').length;
  const won = items.filter((item) => item.stage === 'closed_won').length;
  const lost = items.filter((item) => item.stage === 'closed_lost').length;
  const closed = won + lost;
  const winRate = closed ? Math.round((won / closed) * 100) : 0;
  const forecastAccuracy = items.length ? Math.min(92, 62 + items.filter((item) => item.forecastClose !== 'No close date').length * 4) : 0;
  const pipeline = calculatePipelineValue(items);
  const wonRevenue = items.filter((item) => item.stage === 'closed_won').reduce((sum, item) => sum + item.value, 0);
  return [
    { id: 'pipeline-health', label: 'Pipeline Health', value: risks ? 'Watch' : open.length ? 'Healthy' : 'Empty', benchmark: String(risks) + ' risk signals', signal: risks ? 'watch' : 'positive' },
    { id: 'win-rate', label: 'Win Rate', value: String(winRate) + '%', benchmark: closed ? String(closed) + ' closed opportunities' : 'No closed opportunities yet', signal: winRate >= 34 ? 'positive' : 'watch' },
    { id: 'forecast-accuracy', label: 'Forecast Accuracy', value: String(forecastAccuracy) + '%', benchmark: items.length ? 'Based on close date coverage' : 'Add opportunities to forecast', signal: forecastAccuracy >= 70 ? 'positive' : 'watch' },
    { id: 'growth', label: 'Revenue Growth', value: pipeline || wonRevenue ? currency(pipeline + wonRevenue) : currency(0), benchmark: 'Open pipeline plus won revenue', signal: pipeline || wonRevenue ? 'positive' : 'watch' },
  ];
}

function createAiSalesInsights(leads: WorkspaceLead[], opportunities: WorkspaceOpportunity[]): WorkspaceInsight[] {
  if (leads.length === 0 && opportunities.length === 0) {
    return [{ id: 'crm-empty', title: 'CRM is ready for live data', summary: 'Create or import leads and opportunities to activate pipeline health, forecast and customer recommendations.', severity: 'info', action: 'Create the first lead or import CRM records.' }];
  }
  const insights: WorkspaceInsight[] = [];
  const hotLead = [...leads].sort((a, b) => b.score - a.score)[0];
  const riskDeal = opportunities.find((item) => item.risk === 'high') ?? opportunities.find((item) => item.risk === 'medium');
  if (hotLead) insights.push({ id: 'hot-lead', title: hotLead.company + ' is the hottest lead', summary: hotLead.name + ' has a ' + String(hotLead.conversionProbability) + '% conversion probability from live lead data.', severity: 'opportunity', action: hotLead.nextBestAction });
  if (riskDeal) insights.push({ id: 'deal-risk', title: riskDeal.accountName + ' needs attention', summary: riskDeal.title + ' has a ' + riskDeal.risk + ' risk signal at ' + riskDeal.stage.replace('_', ' ') + ' stage.', severity: riskDeal.risk === 'high' ? 'risk' : 'info', action: riskDeal.nextStep });
  if (opportunities.length) insights.push({ id: 'pipeline-health', title: 'Pipeline forecast is calculated from live opportunities', summary: 'NEXORA weighs opportunity stage, probability, amount and close date coverage for forecast confidence.', severity: 'info', action: 'Keep opportunity amount, probability and close date current.' });
  return insights;
}
