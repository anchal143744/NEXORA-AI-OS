import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../events/event-bus.service';
import { AiService } from '../../ai/ai.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { GenerateWorkflowDto, WorkflowEdgeDto, WorkflowNodeDto } from '../dto/workflow-builder.dto';
import { WorkflowTemplateService } from '../templates/workflow-template.service';

@Injectable()
export class WorkflowAiService {
  constructor(private readonly ai: AiService, private readonly templates: WorkflowTemplateService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  async generate(dto: GenerateWorkflowDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    const providerResponse = await this.ai.complete({ tenantId, model: 'gpt-4.1-mini', temperature: 0.2, messages: [{ role: 'system', content: 'You convert enterprise business automation requests into executable NEXORA workflow blueprints. Return concise JSON guidance.' }, { role: 'user', content: JSON.stringify(dto) }] });
    const blueprint = this.toBlueprint(dto);
    await this.events.publish({ tenantId, workspaceId, type: 'workflow.ai.generated', source: 'workflow-ai-service', subject: { type: 'workflow_blueprint', id: blueprint.slug }, payload: { instruction: dto.instruction, industry: dto.industry, nodeCount: blueprint.nodes.length, provider: providerResponse.model }, actorUserId: this.context.context()?.userId });
    return { providerResponse, blueprint, recommendations: await this.recommend(dto.industry, dto.goals) };
  }

  async recommend(industry?: string, goals: string[] = []) {
    const templates = await this.templates.list(industry);
    return templates.slice(0, 5).map((template: Record<string, unknown>) => ({ templateId: template.id, workflowKey: template.workflowKey, templateName: template.templateName, industry: template.industry, fitScore: this.fitScore(String(template.category ?? ''), goals), reason: `Recommended for ${template.industry} workspaces with ${template.category ?? 'automation'} goals.` }));
  }

  private toBlueprint(dto: GenerateWorkflowDto) {
    const instruction = dto.instruction.toLowerCase();
    const slug = dto.instruction.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 64) || 'ai-generated-workflow';
    const nodes: WorkflowNodeDto[] = [
      { nodeKey: 'trigger-1', nodeType: 'trigger', label: this.triggerLabel(instruction), position: { x: 80, y: 140 }, configuration: { triggerType: this.triggerFor(instruction) } },
      { nodeKey: 'decision-1', nodeType: instruction.includes('if') || instruction.includes('when') ? 'condition' : 'ai_decision', label: instruction.includes('if') ? 'Evaluate condition' : 'AI decision', position: { x: 360, y: 140 }, configuration: instruction.includes('if') ? { operator: 'exists', field: 'input.signal' } : { system: 'Decide the best next business action from workspace context.' } },
      this.domainNode(instruction),
      { nodeKey: 'approval-1', nodeType: 'approval', label: 'Risk approval', position: { x: 910, y: 210 }, configuration: { approverRole: dto.role ?? 'Manager', risk: instruction.includes('invoice') || instruction.includes('payment') ? 'high' : 'medium' } },
      { nodeKey: 'notification-1', nodeType: 'notification', label: 'Notify stakeholders', position: { x: 1190, y: 140 }, configuration: { title: 'Workflow automation update', body: dto.instruction } },
    ];
    const edges: WorkflowEdgeDto[] = nodes.slice(0, -1).map((node, index) => ({ edgeKey: `ai-edge-${index + 1}`, sourceNodeKey: node.nodeKey, targetNodeKey: nodes[index + 1].nodeKey, style: { intent: index === 2 ? 'approval' : 'primary' } }));
    return { name: this.titleCase(slug), slug, description: dto.instruction, industry: dto.industry, canvas: { version: 1, generatedBy: 'workflow-ai-service', supports: ['drag', 'drop', 'zoom', 'pan', 'groups'] }, nodes, edges, nodeGroups: [{ groupKey: 'approval-path', label: 'Approval path', nodeKeys: ['approval-1'] }], metadata: { goals: dto.goals ?? [], context: dto.context ?? {} } };
  }

  private domainNode(instruction: string): WorkflowNodeDto {
    if (instruction.includes('invoice') || instruction.includes('payment') || instruction.includes('cash')) return { nodeKey: 'finance-1', nodeType: 'finance', label: 'Finance action', position: { x: 640, y: 140 }, configuration: { action: 'create_finance_record', category: 'workflow-ai' } };
    if (instruction.includes('lead') || instruction.includes('customer') || instruction.includes('sales')) return { nodeKey: 'crm-1', nodeType: 'crm', label: 'CRM action', position: { x: 640, y: 140 }, configuration: { action: 'create_crm_record', source: 'ai-workflow-generator' } };
    if (instruction.includes('employee') || instruction.includes('hr') || instruction.includes('hiring')) return { nodeKey: 'hr-1', nodeType: 'hr', label: 'HR action', position: { x: 640, y: 140 }, configuration: { action: 'assign_employee' } };
    if (instruction.includes('stock') || instruction.includes('inventory') || instruction.includes('supplier')) return { nodeKey: 'inventory-1', nodeType: 'inventory', label: 'Inventory action', position: { x: 640, y: 140 }, configuration: { action: 'create_task', title: 'Review inventory signal' } };
    return { nodeKey: 'action-1', nodeType: 'action', label: 'Create task', position: { x: 640, y: 140 }, configuration: { action: 'create_task', title: 'AI generated workflow task' } };
  }

  private triggerFor(instruction: string) {
    if (instruction.includes('lead')) return 'lead.created';
    if (instruction.includes('invoice') && instruction.includes('paid')) return 'invoice.paid';
    if (instruction.includes('invoice')) return 'invoice.created';
    if (instruction.includes('task')) return 'task.created';
    if (instruction.includes('project')) return 'project.created';
    if (instruction.includes('webhook')) return 'webhook.trigger';
    return 'manual.trigger';
  }

  private triggerLabel(instruction: string) { return this.triggerFor(instruction).replace('.', ' '); }
  private fitScore(category: string, goals: string[]) { return Math.min(98, 72 + goals.filter((goal) => category.includes(goal.toLowerCase())).length * 8 + (goals.length ? 6 : 0)); }
  private titleCase(slug: string) { return slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' '); }
}
