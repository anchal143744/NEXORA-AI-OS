'use client';

export type AgentType = 'sales' | 'hr' | 'finance' | 'support' | 'operations' | 'executive' | 'custom';
export type AgentStatus = 'active' | 'paused' | 'draft' | 'failed';
export type DeploymentStatus = 'deployed' | 'paused' | 'stopped' | 'draft';
export type ExecutionStatus = 'success' | 'failed' | 'running' | 'queued';
export type RiskLevel = 'low' | 'medium' | 'high';
export type Tone = 'healthy' | 'watch' | 'risk';

export interface AgentMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: string;
  tone: Tone;
}

export interface AgentRecord {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  owner: string;
  goal: string;
  tools: string[];
  triggers: string[];
  successRate: number;
  executionsToday: number;
  savingsHours: number;
  riskLevel: RiskLevel;
}

export interface AgentTemplate {
  id: string;
  name: string;
  category: AgentType;
  description: string;
  recommendedFor: string;
  setupTime: string;
  outcomes: string[];
}

export interface AgentDeployment {
  id: string;
  agentName: string;
  version: string;
  environment: 'workspace' | 'department' | 'organization';
  status: DeploymentStatus;
  lastAction: string;
  approvalPolicy: 'auto' | 'manager' | 'executive' | 'multi_step';
}

export interface AgentMonitoringSignal {
  id: string;
  agentName: string;
  liveStatus: ExecutionStatus;
  executionHealth: number;
  tokenUsage: number;
  runtimeMs: number;
  errorRate: number;
}

export interface AgentExecutionRecord {
  id: string;
  agentName: string;
  process: string;
  decision: string;
  output: string;
  status: ExecutionStatus;
  startedAt: string;
  duration: string;
  error?: string;
}

export interface AgentPermissionPolicy {
  id: string;
  agentName: string;
  workspaceAccess: string;
  moduleAccess: string[];
  dataAccess: string;
  approvalPolicy: string;
}

export interface MultiAgentFlow {
  id: string;
  name: string;
  agents: string[];
  businessOutcome: string;
  status: 'active' | 'draft' | 'needs_review';
}

export interface WorkflowAutomation {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  schedule: string;
  status: 'active' | 'paused' | 'draft';
}

export interface AgentAnalyticsMetric {
  id: string;
  label: string;
  value: string;
  signal: string;
  tone: Tone;
}

export interface EnterpriseAutomationSignal {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}

export interface AiAgentInsight {
  id: string;
  title: string;
  summary: string;
  severity: 'opportunity' | 'risk' | 'info';
  action: string;
}

export interface AiAgentCommandResult {
  id: string;
  command: string;
  response: string;
  recommendedActions: string[];
}

export interface AgentBuilderStep {
  id: string;
  label: string;
  description: string;
  businessQuestion: string;
}

export interface AgentWorkspaceData {
  metrics: AgentMetric[];
  agents: AgentRecord[];
  templates: AgentTemplate[];
  deployments: AgentDeployment[];
  monitoring: AgentMonitoringSignal[];
  executions: AgentExecutionRecord[];
  permissions: AgentPermissionPolicy[];
  collaborationFlows: MultiAgentFlow[];
  workflows: WorkflowAutomation[];
  analytics: AgentAnalyticsMetric[];
  automationSignals: EnterpriseAutomationSignal[];
  insights: AiAgentInsight[];
  builderSteps: AgentBuilderStep[];
}
