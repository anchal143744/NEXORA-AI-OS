import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../events/event-bus.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateWorkflowTemplateDto } from '../dto/workflow-builder.dto';

interface TemplateSeed { industry: string; workflowKey: string; templateName: string; description: string; category: string; trigger: string; modules: string[]; nodes: string[]; }

@Injectable()
export class WorkflowTemplateService {
  private readonly seeds: TemplateSeed[] = [
    { industry: 'SaaS', workflowKey: 'saas-trial-conversion', templateName: 'Trial conversion command loop', description: 'Tracks product intent, routes AI scoring, creates sales follow-up, and notifies account owners.', category: 'growth', trigger: 'lead.created', modules: ['CRM', 'Projects', 'Analytics'], nodes: ['trigger', 'ai_decision', 'crm', 'notification'] },
    { industry: 'Retail', workflowKey: 'retail-low-stock-reorder', templateName: 'Low stock reorder control', description: 'Responds to inventory risk, creates finance review, and alerts operations.', category: 'operations', trigger: 'webhook.trigger', modules: ['Inventory', 'Finance', 'Tasks'], nodes: ['trigger', 'inventory', 'finance', 'approval', 'notification'] },
    { industry: 'Healthcare', workflowKey: 'healthcare-compliance-followup', templateName: 'Compliance follow-up workflow', description: 'Creates compliant follow-up tasks and approval gates for regulated workspace actions.', category: 'compliance', trigger: 'task.created', modules: ['HR', 'Documents', 'Compliance'], nodes: ['trigger', 'condition', 'approval', 'notification'] },
    { industry: 'Manufacturing', workflowKey: 'manufacturing-production-exception', templateName: 'Production exception response', description: 'Routes operational exceptions to task creation, inventory review, and executive notification.', category: 'operations', trigger: 'webhook.trigger', modules: ['Inventory', 'Projects', 'Analytics'], nodes: ['trigger', 'condition', 'inventory', 'action', 'notification'] },
    { industry: 'Logistics', workflowKey: 'logistics-delay-escalation', templateName: 'Delay escalation workflow', description: 'Detects delivery delay risk, opens tasks, and escalates customer notification.', category: 'customer-success', trigger: 'api.trigger', modules: ['Tasks', 'CRM', 'Analytics'], nodes: ['trigger', 'condition', 'crm', 'notification'] },
    { industry: 'Agency', workflowKey: 'agency-client-onboarding', templateName: 'Client onboarding automation', description: 'Creates project kickoff, assigns owner, and schedules client follow-up.', category: 'delivery', trigger: 'customer.created', modules: ['CRM', 'Projects', 'Tasks'], nodes: ['trigger', 'crm', 'action', 'notification'] },
    { industry: 'Education', workflowKey: 'education-enrollment-followup', templateName: 'Enrollment follow-up workflow', description: 'Scores enrollment intent, schedules follow-up, and alerts admissions leadership.', category: 'growth', trigger: 'lead.created', modules: ['CRM', 'Tasks', 'Analytics'], nodes: ['trigger', 'ai_decision', 'action', 'notification'] },
  ];

  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  async list(industry?: string) {
    await this.ensureGlobalTemplates();
    return this.prisma.workflowTemplate.findMany({ where: { industry: industry ?? undefined, enabled: true, deletedAt: null }, orderBy: [{ industry: 'asc' }, { templateName: 'asc' }] });
  }

  async get(id: string) {
    return this.prisma.workflowTemplate.findFirst({ where: { id, deletedAt: null }, include: { definitions: true } });
  }

  async create(dto: CreateWorkflowTemplateDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    const template = await this.prisma.workflowTemplate.create({ data: { tenantId, workspaceId, industry: dto.industry, workflowKey: dto.workflowKey, templateName: dto.templateName, description: dto.description, category: dto.category, template: dto.template, nodePalette: dto.nodePalette ?? [], monitoringProfile: dto.monitoringProfile ?? {}, enabled: dto.enabled ?? true } });
    await this.events.publish({ tenantId, workspaceId, type: 'workflow.template.created', source: 'workflow-template-service', subject: { type: 'workflow_template', id: template.id }, payload: { industry: dto.industry, workflowKey: dto.workflowKey } });
    return template;
  }

  async ensureGlobalTemplates() {
    await Promise.all(this.seeds.map((seed) => this.prisma.workflowTemplate.upsert({
      where: { industry_workflowKey: { industry: seed.industry, workflowKey: seed.workflowKey } },
      update: { templateName: seed.templateName, description: seed.description, category: seed.category, template: this.toTemplate(seed), nodePalette: this.toNodePalette(seed), monitoringProfile: this.toMonitoring(seed), enabled: true, status: 'active' },
      create: { industry: seed.industry, workflowKey: seed.workflowKey, templateName: seed.templateName, description: seed.description, category: seed.category, template: this.toTemplate(seed), nodePalette: this.toNodePalette(seed), monitoringProfile: this.toMonitoring(seed), enabled: true },
    })));
  }

  private toTemplate(seed: TemplateSeed) {
    const nodes = seed.nodes.map((type, index) => ({ nodeKey: `${type}-${index + 1}`, nodeType: type, label: this.labelFor(type), position: { x: 120 + index * 260, y: 140 + (index % 2) * 90 }, configuration: this.configFor(type, seed) }));
    const edges = nodes.slice(0, -1).map((node, index) => ({ edgeKey: `${seed.workflowKey}-edge-${index + 1}`, sourceNodeKey: node.nodeKey, targetNodeKey: nodes[index + 1].nodeKey, style: { intent: 'primary' } }));
    return { industry: seed.industry, modules: seed.modules, trigger: seed.trigger, nodes, edges, canvas: { version: 1, source: 'industry-template', supports: ['zoom', 'pan', 'groups'] } };
  }

  private toNodePalette(seed: TemplateSeed) { return seed.nodes.map((type) => ({ type, label: this.labelFor(type), recommendedFor: seed.modules })); }
  private toMonitoring(seed: TemplateSeed) { return { successRateTarget: 98, latencyBudgetMs: 5000, savingsModel: `${seed.category}-automation-hours`, aiDecisionTracking: seed.nodes.includes('ai_decision') }; }
  private labelFor(type: string) { const labels: Record<string, string> = { trigger: 'Trigger', condition: 'Condition', ai_decision: 'AI decision', delay: 'Delay', approval: 'Approval', action: 'Action', notification: 'Notification', webhook: 'Webhook', crm: 'CRM action', finance: 'Finance action', hr: 'HR action', inventory: 'Inventory action' }; return labels[type] ?? type; }
  private configFor(type: string, seed: TemplateSeed) {
    if (type === 'trigger') return { triggerType: seed.trigger };
    if (type === 'condition') return { operator: 'exists', field: 'input.signal' };
    if (type === 'action') return { action: 'create_task', title: seed.templateName };
    if (type === 'notification') return { title: seed.templateName, body: seed.description };
    if (type === 'crm') return { action: 'create_crm_record', source: seed.workflowKey };
    if (type === 'finance') return { action: 'create_finance_record', category: seed.category };
    if (type === 'approval') return { approverRole: 'Manager', risk: 'medium' };
    return { template: seed.workflowKey };
  }
}
