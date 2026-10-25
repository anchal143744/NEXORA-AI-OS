export const FOUNDATION_AGENTS = ['crm','sales','finance','hr','operations','analytics','customer_success','executive'] as const;
export type FoundationAgentKey = (typeof FOUNDATION_AGENTS)[number];
export const AGENT_CAPABILITIES = ['read_workspace_context','read_events','read_workflow_state','generate_recommendations','trigger_workflows','generate_reports','create_tasks','create_alerts'] as const;
export type AgentCapability = (typeof AGENT_CAPABILITIES)[number];
export interface AgentExecutionJob { tenantId: string; workspaceId?: string; agentKey: FoundationAgentKey; objective: string; input: Record<string, unknown>; actorUserId?: string; correlationId?: string; }
