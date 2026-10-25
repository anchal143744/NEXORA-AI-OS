export const WORKFLOW_COMPONENTS = ['trigger','condition','action','delay','approval','loop','branch','ai_decision','webhook','integration','notification'] as const;
export type WorkflowComponentType = (typeof WORKFLOW_COMPONENTS)[number];
export const WORKFLOW_TRIGGERS = ['user.created','lead.created','lead.converted','invoice.created','invoice.paid','task.created','task.completed','project.created','workflow.scheduled','manual.trigger','api.trigger','webhook.trigger'] as const;
export type WorkflowTriggerType = (typeof WORKFLOW_TRIGGERS)[number];
export const WORKFLOW_CONDITIONS = ['equals','contains','greater_than','less_than','between','exists','not_exists','ai_condition'] as const;
export type WorkflowConditionOperator = (typeof WORKFLOW_CONDITIONS)[number];
export const WORKFLOW_ACTIONS = ['create_task','create_project','create_notification','send_email','create_crm_record','create_finance_record','run_ai_analysis','call_webhook','generate_report','assign_employee','schedule_follow_up'] as const;
export type WorkflowActionType = (typeof WORKFLOW_ACTIONS)[number];
export interface WorkflowNodeDefinition { id: string; type: WorkflowComponentType; name?: string; config: Record<string, unknown>; next?: string | string[]; }
export interface WorkflowGraphDefinition { startNodeId: string; nodes: WorkflowNodeDefinition[]; }
export interface WorkflowTriggerDefinition { type: WorkflowTriggerType; config?: Record<string, unknown>; }
export interface WorkflowExecutionJob { tenantId: string; workspaceId?: string; workflowId: string; executionId: string; input: Record<string, unknown>; actorUserId?: string; correlationId?: string; }
