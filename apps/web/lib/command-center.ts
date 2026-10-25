import { defaultDiscoveryAnswers } from '@/stores/discovery-store';
import { calculateAiReadinessScore, generateWorkspaceBlueprint } from '@/lib/workspace-intelligence';
import type { AiCommand, AiInsight, ActivityTimelineEvent, CommandNotification, ExecutiveKpi, PersonalDashboard, WorkspaceLaunchPlan } from '@/types/command-center';

export function createWorkspaceLaunchPlan(): WorkspaceLaunchPlan {
  const blueprint = generateWorkspaceBlueprint(defaultDiscoveryAnswers);
  const readiness = calculateAiReadinessScore(defaultDiscoveryAnswers, blueprint);

  return {
    workspaceId: 'workspace-command-center',
    workspaceName: blueprint.workspaceName,
    industry: defaultDiscoveryAnswers.industryHint,
    readinessScore: readiness.score,
    modules: blueprint.modules.map((item) => item.label),
    agents: blueprint.agents.map((item) => item.label),
    automations: blueprint.automations.map((item) => item.label),
    tasks: [
      { id: 'task-blueprint', label: 'Validate workspace blueprint', stage: 'blueprint', status: 'complete', owner: 'Workspace Orchestrator' },
      { id: 'task-modules', label: 'Activate recommended modules', stage: 'module_activation', status: 'ready', owner: 'Operations Agent' },
      { id: 'task-context', label: 'Attach business context', stage: 'data_context', status: 'ready', owner: 'AI Copilot' },
      { id: 'task-agents', label: 'Configure recommended agents', stage: 'agent_setup', status: 'ready', owner: 'Executive Agent' },
      { id: 'task-launch', label: 'Open enterprise command center', stage: 'launch_ready', status: 'ready', owner: 'Organization Owner' },
    ],
  };
}

export function generateExecutiveKpis(plan: WorkspaceLaunchPlan): ExecutiveKpi[] {
  return [
    { id: 'health', label: 'Business Health', value: String(Math.min(96, plan.readinessScore + 6)), trend: '+6 pts', status: 'healthy' },
    { id: 'automation', label: 'Automation Coverage', value: String(plan.automations.length * 18) + '%', trend: '+12%', status: 'healthy' },
    { id: 'workspace', label: 'Workspace Readiness', value: String(plan.readinessScore) + '%', trend: 'launch-ready', status: plan.readinessScore > 70 ? 'healthy' : 'watch' },
    { id: 'risk', label: 'Open Risks', value: '3', trend: '-2 this week', status: 'watch' },
  ];
}

export function generateInsights(_plan: WorkspaceLaunchPlan): AiInsight[] {
  return [
    { id: 'insight-revenue', title: 'Revenue motion is ready for CRM activation', summary: 'CRM and Analytics should be launched first because the discovery profile prioritizes revenue growth.', severity: 'opportunity', action: 'Launch CRM workspace' },
    { id: 'insight-ops', title: 'Operations automation can remove manual handoffs', summary: 'Approval routing and weekly operating summaries are high-impact automations for this profile.', severity: 'info', action: 'Create automation queue' },
    { id: 'insight-risk', title: 'Manual software stack needs integration monitoring', summary: 'Spreadsheet tracking remains a reliability risk until integration sync monitoring is active.', severity: 'risk', action: 'Review integration plan' },
  ];
}

export function generateNotifications(plan: WorkspaceLaunchPlan): CommandNotification[] {
  return [
    { id: 'note-ready', title: 'Workspace blueprint ready', detail: plan.workspaceName + ' can be launched from the command center.', tone: 'success' },
    { id: 'note-agent', title: 'AI agents recommended', detail: String(plan.agents.length) + ' agents are mapped to the workspace profile.', tone: 'info' },
    { id: 'note-risk', title: 'Approval policy required', detail: 'Medium-risk AI actions should require manager approval.', tone: 'warning' },
  ];
}

export function generateActivityTimeline(): ActivityTimelineEvent[] {
  return [
    { id: 'activity-1', actor: 'AI Orchestrator', action: 'Generated workspace launch plan', timestamp: 'Today 09:10', module: 'Workspace' },
    { id: 'activity-2', actor: 'Executive Agent', action: 'Prepared command center KPIs', timestamp: 'Today 09:14', module: 'Analytics' },
    { id: 'activity-3', actor: 'Operations Agent', action: 'Queued module activation tasks', timestamp: 'Today 09:18', module: 'Automation' },
    { id: 'activity-4', actor: 'System', action: 'Published launch notifications', timestamp: 'Today 09:22', module: 'Notifications' },
  ];
}

export function generatePersonalDashboards(): PersonalDashboard[] {
  return [
    { id: 'owner', title: 'Owner Command View', role: 'Organization Owner', widgets: ['Business Health', 'Revenue Motion', 'Launch Risks'] },
    { id: 'ops', title: 'Operations Launch View', role: 'Operations Lead', widgets: ['Automation Queue', 'Task Velocity', 'Approvals'] },
    { id: 'finance', title: 'Finance Control View', role: 'Finance Approver', widgets: ['Cash Signals', 'Invoice Queue', 'Budget Watch'] },
  ];
}

export function runAiCommand(text: string): AiCommand {
  const normalized = text.toLowerCase();
  const category = normalized.includes('create') || normalized.includes('launch') ? 'create' : normalized.includes('show') || normalized.includes('open') ? 'navigate' : normalized.includes('analyze') || normalized.includes('risk') ? 'analyze' : 'orchestrate';
  const result = category === 'create'
    ? 'Workspace creation task queued with approval-aware execution.'
    : category === 'navigate'
      ? 'Opening the most relevant command center surface.'
      : category === 'analyze'
        ? 'AI analysis prepared across KPIs, insights and activity signals.'
        : 'AI orchestrator routed the command to workspace launch controls.';

  return {
    id: 'command-' + Date.now(),
    text,
    category,
    result,
  };
}
