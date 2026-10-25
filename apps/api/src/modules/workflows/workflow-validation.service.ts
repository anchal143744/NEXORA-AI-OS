import { BadRequestException, Injectable } from '@nestjs/common';
import { WORKFLOW_ACTIONS, WORKFLOW_COMPONENTS, WORKFLOW_CONDITIONS, WORKFLOW_TRIGGERS, WorkflowGraphDefinition, WorkflowNodeDefinition, WorkflowTriggerDefinition } from './contracts/workflow-definition.contract';
@Injectable()
export class WorkflowValidationService {
  validateTrigger(trigger: WorkflowTriggerDefinition) { if (!WORKFLOW_TRIGGERS.includes(trigger.type)) throw new BadRequestException(`Unsupported workflow trigger: ${trigger.type}`); }
  validateGraph(graph: unknown): WorkflowGraphDefinition {
    const definition = graph as WorkflowGraphDefinition;
    if (!definition || typeof definition !== 'object' || !definition.startNodeId || !Array.isArray(definition.nodes)) throw new BadRequestException('Workflow graph must include startNodeId and nodes');
    const nodeIds = new Set<string>();
    for (const node of definition.nodes) this.validateNode(node, nodeIds);
    if (!nodeIds.has(definition.startNodeId)) throw new BadRequestException('Workflow startNodeId must reference an existing node');
    for (const node of definition.nodes) this.validateLinks(node, nodeIds);
    return definition;
  }
  private validateNode(node: WorkflowNodeDefinition, nodeIds: Set<string>) {
    if (!node.id || nodeIds.has(node.id)) throw new BadRequestException('Workflow nodes require unique ids');
    nodeIds.add(node.id);
    if (!WORKFLOW_COMPONENTS.includes(node.type)) throw new BadRequestException(`Unsupported workflow node type: ${node.type}`);
    if (!node.config || typeof node.config !== 'object') throw new BadRequestException(`Workflow node ${node.id} requires config`);
    if (node.type === 'condition' && !WORKFLOW_CONDITIONS.includes(String(node.config.operator) as any)) throw new BadRequestException(`Unsupported condition operator on node ${node.id}`);
    if (node.type === 'action' && !WORKFLOW_ACTIONS.includes(String(node.config.action) as any)) throw new BadRequestException(`Unsupported action on node ${node.id}`);
  }
  private validateLinks(node: WorkflowNodeDefinition, nodeIds: Set<string>) { const next = Array.isArray(node.next) ? node.next : node.next ? [node.next] : []; for (const nextId of next) if (!nodeIds.has(nextId)) throw new BadRequestException(`Workflow node ${node.id} references missing node ${nextId}`); }
}
