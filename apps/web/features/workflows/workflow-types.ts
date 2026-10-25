export type WorkflowNodeType = 'trigger' | 'condition' | 'ai_decision' | 'delay' | 'approval' | 'action' | 'notification' | 'webhook' | 'crm' | 'finance' | 'hr' | 'inventory';
export type ExecutionStatus = 'running' | 'queued' | 'failed' | 'approval' | 'ai';

export interface WorkflowBuilderNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  description: string;
  x: number;
  y: number;
  group?: string;
  risk?: 'low' | 'medium' | 'high' | 'critical';
}

export interface WorkflowBuilderEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  intent?: 'primary' | 'success' | 'warning' | 'approval';
}

export interface WorkflowNodeGroup {
  id: string;
  label: string;
  nodeIds: string[];
  tone: 'revenue' | 'risk' | 'operations';
}

export interface WorkflowTemplateBlueprint {
  industry: string;
  key: string;
  name: string;
  modules: string[];
  nodes: WorkflowBuilderNode[];
  edges: WorkflowBuilderEdge[];
}

export interface ExecutionQueueItem {
  id: string;
  workflow: string;
  status: ExecutionStatus;
  latencyMs: number;
  owner: string;
  updatedAt: string;
}

export interface WorkflowMetricCard {
  label: string;
  value: string;
  signal: 'healthy' | 'watch' | 'critical';
}
