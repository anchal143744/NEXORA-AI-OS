import type { AgentAnalyticsMetric, AgentBuilderStep, AgentDeployment, AgentExecutionRecord, AgentMetric, AgentMonitoringSignal, AgentPermissionPolicy, AgentRecord, AgentTemplate, AgentWorkspaceData, AiAgentCommandResult, AiAgentInsight, EnterpriseAutomationSignal, MultiAgentFlow, WorkflowAutomation } from '@/types/agent-workspace';

export const agentNavigation = [
  { group: 'AI Agents', items: ['Agents', 'Templates', 'Deployments', 'Monitoring'] },
  { group: 'Automation', items: ['Workflows', 'Triggers', 'Executions'] },
  { group: 'Insights', items: ['Analytics', 'Savings', 'ROI'] },
];

export const agentTypes = ['Sales Agent', 'HR Agent', 'Finance Agent', 'Support Agent', 'Operations Agent', 'Executive Agent', 'Custom Agent'];

export const builderSteps: AgentBuilderStep[] = [
  { id: 'create-agent', label: 'Create Agent', description: 'Name the agent and choose a business owner.', businessQuestion: 'What business outcome should this agent own?' },
  { id: 'configure-agent', label: 'Configure Agent', description: 'Choose the agent type, workspace and operating mode.', businessQuestion: 'Which team will trust this agent daily?' },
  { id: 'define-goals', label: 'Define Goals', description: 'Set plain-language goals, success metrics and stop conditions.', businessQuestion: 'How will success be measured?' },
  { id: 'define-tools', label: 'Define Tools', description: 'Select approved tools across CRM, HR, Finance, Operations and Support.', businessQuestion: 'Which systems can the agent use?' },
  { id: 'define-permissions', label: 'Define Permissions', description: 'Apply workspace, module, data and approval boundaries.', businessQuestion: 'What should require human approval?' },
  { id: 'define-triggers', label: 'Define Triggers', description: 'Start agents from events, schedules, workflow steps or manual commands.', businessQuestion: 'When should this agent begin work?' },
];

export const agents: AgentRecord[] = [
  { id: 'agent-sales', name: 'Revenue Growth Agent', type: 'sales', status: 'active', owner: 'Revenue Ops', goal: 'Prioritize hot leads and recommend next actions.', tools: ['CRM', 'Email', 'Tasks'], triggers: ['lead.created', 'opportunity.updated'], successRate: 94, executionsToday: 128, savingsHours: 42, riskLevel: 'low' },
  { id: 'agent-hr', name: 'Hiring Assistant', type: 'hr', status: 'active', owner: 'People Team', goal: 'Screen candidates and prepare interview summaries.', tools: ['HR', 'Calendar', 'Documents'], triggers: ['candidate.applied', 'interview.completed'], successRate: 91, executionsToday: 64, savingsHours: 27, riskLevel: 'low' },
  { id: 'agent-finance', name: 'Invoice Processing Agent', type: 'finance', status: 'active', owner: 'Finance Ops', goal: 'Find invoice risks and route payment follow-ups.', tools: ['Finance', 'Notifications', 'Approvals'], triggers: ['invoice.created', 'invoice.overdue'], successRate: 88, executionsToday: 51, savingsHours: 19, riskLevel: 'medium' },
  { id: 'agent-support', name: 'Customer Support Agent', type: 'support', status: 'paused', owner: 'Support Ops', goal: 'Summarize conversations and suggest responses.', tools: ['Contact Center', 'Knowledge Search', 'Tickets'], triggers: ['ticket.created', 'conversation.escalated'], successRate: 86, executionsToday: 37, savingsHours: 14, riskLevel: 'medium' },
  { id: 'agent-ops', name: 'Operations Coordinator', type: 'operations', status: 'active', owner: 'Operations', goal: 'Coordinate tasks across workflows and field service.', tools: ['Workflows', 'Projects', 'Notifications'], triggers: ['task.overdue', 'workflow.failed'], successRate: 92, executionsToday: 96, savingsHours: 33, riskLevel: 'low' },
  { id: 'agent-exec', name: 'Executive Briefing Agent', type: 'executive', status: 'draft', owner: 'Executive Office', goal: 'Prepare daily operating summaries and risk briefs.', tools: ['Analytics', 'Finance', 'CRM', 'HR'], triggers: ['schedule.daily', 'risk.detected'], successRate: 0, executionsToday: 0, savingsHours: 0, riskLevel: 'low' },
];

export const templates: AgentTemplate[] = [
  { id: 'tpl-lead-qualification', name: 'Lead Qualification Agent', category: 'sales', description: 'Scores leads, explains buying intent and recommends owner follow-up.', recommendedFor: 'Sales teams with high inbound volume', setupTime: '8 minutes', outcomes: ['Lead scoring', 'Next best action', 'CRM enrichment'] },
  { id: 'tpl-candidate-screening', name: 'Candidate Screening Agent', category: 'hr', description: 'Reviews candidate profiles and prepares interview-ready summaries.', recommendedFor: 'Hiring teams scaling interviews', setupTime: '10 minutes', outcomes: ['Candidate summary', 'Skill match', 'Interview plan'] },
  { id: 'tpl-invoice-processing', name: 'Invoice Processing Agent', category: 'finance', description: 'Monitors invoices, payment status and collection risks.', recommendedFor: 'Finance teams managing receivables', setupTime: '7 minutes', outcomes: ['Invoice risk', 'Payment follow-up', 'Approval routing'] },
  { id: 'tpl-customer-support', name: 'Customer Support Agent', category: 'support', description: 'Summarizes conversations and recommends response paths.', recommendedFor: 'Customer support and success teams', setupTime: '9 minutes', outcomes: ['Conversation summary', 'Escalation signal', 'Knowledge retrieval'] },
  { id: 'tpl-forecasting', name: 'Forecasting Agent', category: 'executive', description: 'Explains KPI movements and produces forecast updates.', recommendedFor: 'Executives and department leaders', setupTime: '12 minutes', outcomes: ['Forecast explanation', 'Risk alert', 'Scenario note'] },
  { id: 'tpl-reporting', name: 'Reporting Agent', category: 'operations', description: 'Generates recurring reports and routes them to stakeholders.', recommendedFor: 'Operations teams with weekly reporting', setupTime: '6 minutes', outcomes: ['Report generation', 'Stakeholder routing', 'Saved hours'] },
];

export const deployments: AgentDeployment[] = [
  { id: 'dep-sales-v3', agentName: 'Revenue Growth Agent', version: 'v3.2', environment: 'workspace', status: 'deployed', lastAction: 'Started lead qualification automation', approvalPolicy: 'manager' },
  { id: 'dep-hr-v2', agentName: 'Hiring Assistant', version: 'v2.4', environment: 'department', status: 'deployed', lastAction: 'Completed candidate summary batch', approvalPolicy: 'manager' },
  { id: 'dep-finance-v1', agentName: 'Invoice Processing Agent', version: 'v1.8', environment: 'workspace', status: 'deployed', lastAction: 'Escalated overdue invoice', approvalPolicy: 'executive' },
  { id: 'dep-support-v1', agentName: 'Customer Support Agent', version: 'v1.5', environment: 'department', status: 'paused', lastAction: 'Paused for response policy review', approvalPolicy: 'multi_step' },
];

export const monitoring: AgentMonitoringSignal[] = [
  { id: 'mon-sales', agentName: 'Revenue Growth Agent', liveStatus: 'running', executionHealth: 96, tokenUsage: 18420, runtimeMs: 980, errorRate: 1.2 },
  { id: 'mon-hr', agentName: 'Hiring Assistant', liveStatus: 'success', executionHealth: 93, tokenUsage: 9240, runtimeMs: 1120, errorRate: 1.8 },
  { id: 'mon-finance', agentName: 'Invoice Processing Agent', liveStatus: 'running', executionHealth: 88, tokenUsage: 11980, runtimeMs: 1420, errorRate: 3.1 },
  { id: 'mon-support', agentName: 'Customer Support Agent', liveStatus: 'failed', executionHealth: 74, tokenUsage: 7320, runtimeMs: 1880, errorRate: 7.4 },
];

export const executions: AgentExecutionRecord[] = [
  { id: 'run-1001', agentName: 'Revenue Growth Agent', process: 'Lead prioritization', decision: 'Move Aurora lead to discovery', output: 'Created task and suggested meeting slot', status: 'success', startedAt: 'Today 09:10', duration: '24s' },
  { id: 'run-1002', agentName: 'Invoice Processing Agent', process: 'Overdue invoice detection', decision: 'Escalate Northstar collection risk', output: 'Notified Finance Ops and generated follow-up note', status: 'success', startedAt: 'Today 09:04', duration: '18s' },
  { id: 'run-1003', agentName: 'Customer Support Agent', process: 'Conversation response', decision: 'Human handoff required', output: 'Handoff queued for support lead', status: 'failed', startedAt: 'Today 08:52', duration: '31s', error: 'Knowledge policy requires review' },
  { id: 'run-1004', agentName: 'Hiring Assistant', process: 'Candidate screening', decision: 'Recommend interview', output: 'Generated interview plan', status: 'queued', startedAt: 'Today 08:44', duration: 'Queued' },
];

export const permissions: AgentPermissionPolicy[] = [
  { id: 'perm-sales', agentName: 'Revenue Growth Agent', workspaceAccess: 'Global Operations', moduleAccess: ['CRM', 'Tasks', 'Notifications'], dataAccess: 'Leads, contacts and opportunities', approvalPolicy: 'Manager approval for external messages' },
  { id: 'perm-hr', agentName: 'Hiring Assistant', workspaceAccess: 'People Workspace', moduleAccess: ['HR', 'Calendar', 'Documents'], dataAccess: 'Candidates, interviews and job records', approvalPolicy: 'HR approval before rejection or offer' },
  { id: 'perm-finance', agentName: 'Invoice Processing Agent', workspaceAccess: 'Finance Workspace', moduleAccess: ['Finance', 'Billing', 'Approvals'], dataAccess: 'Invoices, payments and billing plans', approvalPolicy: 'Executive approval for refunds and write-offs' },
  { id: 'perm-support', agentName: 'Customer Support Agent', workspaceAccess: 'Customer Experience', moduleAccess: ['Support', 'Knowledge', 'Notifications'], dataAccess: 'Customer conversations and service tickets', approvalPolicy: 'Human handoff for high-risk replies' },
];

export const collaborationFlows: MultiAgentFlow[] = [
  { id: 'flow-revenue-approval', name: 'Sales to Finance to Executive Approval', agents: ['Sales Agent', 'Finance Agent', 'Approval Agent', 'Executive Agent'], businessOutcome: 'Qualify expansion, validate billing and route approval.', status: 'active' },
  { id: 'flow-hiring-onboarding', name: 'HR to Operations Onboarding', agents: ['HR Agent', 'Operations Agent', 'Notification Agent'], businessOutcome: 'Move hired candidates into onboarding workflows.', status: 'active' },
  { id: 'flow-support-risk', name: 'Support to Customer Success Risk', agents: ['Support Agent', 'Customer Success Agent', 'Executive Agent'], businessOutcome: 'Escalate churn risk from service conversations.', status: 'needs_review' },
];

export const workflows: WorkflowAutomation[] = [
  { id: 'wf-hot-lead', name: 'Hot lead qualification', trigger: 'lead.created', condition: 'Lead score greater than 80', action: 'Create task and notify sales owner', schedule: 'Event-based workflow', status: 'active' },
  { id: 'wf-invoice-risk', name: 'Invoice collection risk', trigger: 'invoice.overdue', condition: 'Amount greater than 10000', action: 'Run Finance Agent and request approval', schedule: 'Event-based workflow', status: 'active' },
  { id: 'wf-hiring-summary', name: 'Candidate interview preparation', trigger: 'interview.scheduled', condition: 'Candidate profile exists', action: 'Generate interview summary', schedule: 'Scheduled workflow', status: 'active' },
  { id: 'wf-weekly-brief', name: 'Executive operating brief', trigger: 'schedule.weekly', condition: 'Executive report window opens', action: 'Generate KPI and risk summary', schedule: 'Every Monday', status: 'draft' },
];

export function percent(value: number) {
  return String(value) + '%';
}

export function createAgentMetrics(items = agents): AgentMetric[] {
  const activeAgents = items.filter((agent) => agent.status === 'active').length;
  const executionsToday = items.reduce((sum, agent) => sum + agent.executionsToday, 0);
  const averageSuccess = Math.round(items.filter((agent) => agent.successRate > 0).reduce((sum, agent) => sum + agent.successRate, 0) / items.filter((agent) => agent.successRate > 0).length);
  const failedRuns = executions.filter((execution) => execution.status === 'failed').length;
  const savings = items.reduce((sum, agent) => sum + agent.savingsHours, 0);
  return [
    { id: 'active-agents', label: 'Active Agents', value: String(activeAgents), detail: 'Agents currently automating work', trend: '+3 this month', tone: 'healthy' },
    { id: 'executions-today', label: 'Executions Today', value: String(executionsToday), detail: 'Agent runs across CRM, HR, Finance, Operations and Support', trend: '+18% vs yesterday', tone: 'healthy' },
    { id: 'success-rate', label: 'Success Rate', value: percent(averageSuccess), detail: 'Completed runs without escalation', trend: 'Stable reliability', tone: 'healthy' },
    { id: 'failed-runs', label: 'Failed Runs', value: String(failedRuns), detail: 'Runs that need review', trend: '1 policy failure', tone: 'watch' },
    { id: 'automation-savings', label: 'Automation Savings', value: String(savings) + 'h', detail: 'Estimated team hours saved this week', trend: '$18.4K productivity impact', tone: 'healthy' },
  ];
}

export function createAgentAnalytics(): AgentAnalyticsMetric[] {
  return [
    { id: 'agent-utilization', label: 'Agent Utilization', value: '78%', signal: 'Sales and operations agents are driving the most volume.', tone: 'healthy' },
    { id: 'analytics-success-rate', label: 'Success Rate', value: '90%', signal: 'Most failures are policy review issues, not runtime issues.', tone: 'healthy' },
    { id: 'productivity-impact', label: 'Productivity Impact', value: '135h', signal: 'Automations saved time across revenue, hiring and finance.', tone: 'healthy' },
    { id: 'cost-savings', label: 'Cost Savings', value: '$18.4K', signal: 'Agent-led automation reduced repetitive operating work.', tone: 'healthy' },
    { id: 'roi', label: 'ROI', value: '4.8x', signal: 'Highest ROI is in lead qualification and invoice follow-up.', tone: 'healthy' },
  ];
}

export function createAutomationSignals(): EnterpriseAutomationSignal[] {
  return [
    { id: 'active-automations', label: 'Active Automations', value: '42', detail: 'Live event and scheduled workflows', tone: 'healthy' },
    { id: 'saved-hours', label: 'Saved Hours', value: '135h', detail: 'Weekly estimated time returned to teams', tone: 'healthy' },
    { id: 'completed-tasks', label: 'Completed Tasks', value: '824', detail: 'Agent-created or completed work items', tone: 'healthy' },
    { id: 'automation-performance', label: 'Automation Performance', value: '91%', detail: 'Workflow completion reliability', tone: 'healthy' },
  ];
}

export function createAgentInsights(): AiAgentInsight[] {
  return [
    { id: 'insight-sales', title: 'Sales Agent can qualify expansion leads faster', summary: 'The Revenue Growth Agent has strong success and should receive one-click deployment for enterprise expansion plays.', severity: 'opportunity', action: 'Deploy expansion lead workflow.' },
    { id: 'insight-support', title: 'Support Agent needs response policy review', summary: 'Recent failures are policy-driven and should be reviewed before restarting autonomous replies.', severity: 'risk', action: 'Review support response policy.' },
    { id: 'insight-finance', title: 'Finance Agent is improving collection focus', summary: 'Invoice risk detection is routing overdue accounts to Finance Ops before cash timing becomes urgent.', severity: 'info', action: 'Keep finance approvals enabled.' },
    { id: 'insight-workflows', title: 'Multi-agent flows are ready for deeper automation', summary: 'Sales to Finance to Executive approval can remove manual handoffs while preserving approval controls.', severity: 'opportunity', action: 'Activate multi-agent approval workflow.' },
  ];
}

export function createAgentWorkspaceData(): AgentWorkspaceData {
  return {
    metrics: createAgentMetrics(),
    agents,
    templates,
    deployments,
    monitoring,
    executions,
    permissions,
    collaborationFlows,
    workflows,
    analytics: createAgentAnalytics(),
    automationSignals: createAutomationSignals(),
    insights: createAgentInsights(),
    builderSteps,
  };
}

export function runAiAgentCommand(command: string, data = createAgentWorkspaceData()): AiAgentCommandResult {
  const normalized = command.toLowerCase();
  const failingAgents = data.monitoring.filter((signal) => signal.liveStatus === 'failed' || signal.errorRate >= 5);
  let response = 'I reviewed agents, deployments, executions, permissions, workflows, savings and ROI.';
  let recommendedActions = data.insights.map((insight) => insight.action);

  if (normalized.includes('create a sales agent') || normalized.includes('sales agent')) {
    response = 'Create a Sales Agent with CRM access, lead scoring goals, task creation tools and manager approval for external communication.';
    recommendedActions = ['Choose Lead Qualification Agent template', 'Set trigger to lead.created', 'Require manager approval for external messages'];
  } else if (normalized.includes('deploy an hr assistant') || normalized.includes('hr assistant')) {
    response = 'Deploy the HR assistant from the Candidate Screening Agent template with People Workspace access and HR approval rules.';
    recommendedActions = ['Select Candidate Screening Agent template', 'Enable candidate.applied trigger', 'Require HR approval before rejection'];
  } else if (normalized.includes('failing agents') || normalized.includes('failed agents')) {
    response = 'One agent needs attention: ' + failingAgents.map((agent) => agent.agentName).join(', ') + '.';
    recommendedActions = failingAgents.map((agent) => 'Review ' + agent.agentName + ' error policy');
  } else if (normalized.includes('optimize workflows')) {
    response = 'Workflow optimization should focus on invoice collection risk, support policy review and executive briefing activation.';
    recommendedActions = ['Review failed support workflow', 'Activate weekly executive brief', 'Connect finance approval workflow'];
  } else if (normalized.includes('automation savings') || normalized.includes('savings')) {
    response = 'Automation has saved 135 hours this week with an estimated $18.4K productivity impact.';
    recommendedActions = ['Expand lead qualification automation', 'Deploy reporting agent', 'Measure saved hours by department'];
  } else if (normalized.includes('recommend new automations') || normalized.includes('new automations')) {
    response = 'Recommended automations: expansion lead qualification, invoice follow-up, candidate interview summary and executive weekly brief.';
    recommendedActions = ['Deploy expansion lead workflow', 'Deploy invoice follow-up workflow', 'Draft weekly executive brief workflow'];
  }

  return {
    id: 'agent-command-' + Date.now(),
    command,
    response,
    recommendedActions: recommendedActions.slice(0, 4),
  };
}
