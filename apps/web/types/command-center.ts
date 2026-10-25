export type WorkspaceCreationStage = 'blueprint' | 'module_activation' | 'data_context' | 'agent_setup' | 'launch_ready';

export type WorkspaceCreationTask = {
  id: string;
  label: string;
  stage: WorkspaceCreationStage;
  status: 'ready' | 'running' | 'complete' | 'blocked';
  owner: string;
};

export type WorkspaceLaunchPlan = {
  workspaceId: string;
  workspaceName: string;
  industry: string;
  readinessScore: number;
  modules: string[];
  agents: string[];
  automations: string[];
  tasks: WorkspaceCreationTask[];
};

export type AiCommand = {
  id: string;
  text: string;
  category: 'navigate' | 'analyze' | 'create' | 'orchestrate';
  result: string;
};

export type ExecutiveKpi = {
  id: string;
  label: string;
  value: string;
  trend: string;
  status: 'healthy' | 'watch' | 'risk';
};

export type AiInsight = {
  id: string;
  title: string;
  summary: string;
  severity: 'info' | 'opportunity' | 'risk';
  action: string;
};

export type CommandNotification = {
  id: string;
  title: string;
  detail: string;
  tone: 'info' | 'success' | 'warning';
};

export type ActivityTimelineEvent = {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  module: string;
};

export type PersonalDashboard = {
  id: string;
  title: string;
  role: string;
  widgets: string[];
};
