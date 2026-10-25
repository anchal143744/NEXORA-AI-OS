import type { AiRecommendation, ExecutiveBriefing } from '@/types/ai-copilot';
import type { WorkspaceAiContext } from '@/types/workspace';
import { resolveCopilotCommand } from './ai-command-registry';

const defaultBriefingGeneratedAt = '2026-01-01T00:00:00.000Z';

export function createExecutiveBriefing(context: WorkspaceAiContext): ExecutiveBriefing {
  const enabledModules = context.enabledModules.map((module) => module.label).join(', ');
  const topKpis = context.kpis.slice(0, 4);
  const score = calculateHealthScore(context);

  return {
    id: 'briefing-' + context.workspaceId,
    title: 'Executive briefing for ' + context.workspaceName,
    summary:
      context.organizationName +
      ' is operating as a ' +
      context.industry +
      ' workspace with ' +
      context.enabledModules.length +
      ' active modules. Current executive focus: ' +
      topKpis.map((kpi) => kpi.label + ' ' + kpi.value).join(', ') +
      '.',
    healthScore: score,
    highlights: [
      'Workspace context includes ' + context.kpis.length + ' KPIs, ' + context.enabledModules.length + ' modules and ' + context.currency + ' financial context.',
      'Enabled operating surface: ' + enabledModules + '.',
      'AI actions are scoped to current user permissions before navigation or workflow initiation.',
    ],
    risks: buildRisks(context),
    opportunities: buildOpportunities(context),
    generatedAt: defaultBriefingGeneratedAt,
    source: 'workspace-context',
  };
}

export function createRecommendations(context: WorkspaceAiContext): AiRecommendation[] {
  const recommendations: AiRecommendation[] = [
    {
      id: 'rec.executive-report',
      title: 'Generate an executive operating report',
      description: 'Create a concise business summary using workspace KPIs, enabled modules and active filters.',
      priority: 'high',
      impact: 'Improves leadership visibility across revenue, people, operations and AI automation.',
      moduleKey: 'analytics',
      action: resolveCopilotCommand('generate quarterly report', context)?.action,
    },
    {
      id: 'rec.automation-review',
      title: 'Review automation opportunities',
      description: 'Inspect repetitive work across CRM, Finance, HR and Projects before creating workflow drafts.',
      priority: 'medium',
      impact: 'Can reduce manual follow-up and improve operating cadence.',
      moduleKey: 'workflows',
      action: resolveCopilotCommand('create automation', context)?.action,
    },
  ];

  if (context.enabledModules.some((module) => module.key === 'crm')) {
    recommendations.push({
      id: 'rec.crm-workflow',
      title: 'Create a CRM workflow',
      description: 'Turn pipeline follow-up and opportunity risk checks into an approval-aware workflow.',
      priority: 'high',
      impact: 'Protects pipeline health and improves conversion follow-through.',
      moduleKey: 'crm',
      action: resolveCopilotCommand('create crm workflow', context)?.action,
    });
  }

  if (context.enabledModules.some((module) => module.key === 'finance')) {
    recommendations.push({
      id: 'rec.revenue-forecast',
      title: 'Forecast revenue',
      description: 'Use current finance and sales signals to prepare a near-term revenue forecast.',
      priority: 'high',
      impact: 'Helps executives detect cash, runway and growth risks earlier.',
      moduleKey: 'finance',
      action: resolveCopilotCommand('forecast revenue', context)?.action,
    });
  }

  return recommendations;
}

export function createCopilotAnswer(prompt: string, context: WorkspaceAiContext) {
  const command = resolveCopilotCommand(prompt, context);
  const briefing = createExecutiveBriefing(context);
  const recommendations = createRecommendations(context);

  if (command) {
    return {
      message:
        'I matched that to "' +
        command.label +
        '". I checked your workspace permissions and prepared the next enterprise action. ' +
        briefing.summary,
      actions: command.action ? [command.action] : [],
      recommendations,
      briefing,
    };
  }

  return {
    message:
      'Here is the executive readout for ' +
      context.workspaceName +
      ': health score ' +
      briefing.healthScore +
      '/100. ' +
      briefing.summary +
      ' Recommended next step: ' +
      recommendations[0].title +
      '.',
    actions: recommendations.flatMap((recommendation) => (recommendation.action ? [recommendation.action] : [])),
    recommendations,
    briefing,
  };
}

function calculateHealthScore(context: WorkspaceAiContext) {
  const moduleScore = Math.min(context.enabledModules.length * 6, 42);
  const kpiScore = Math.min(context.kpis.length * 5, 35);
  const permissionScore = context.permissions.includes('manage') ? 14 : 7;
  return Math.min(96, 45 + moduleScore + kpiScore + permissionScore);
}

function buildRisks(context: WorkspaceAiContext) {
  const risks = ['Forecast confidence depends on connected backend data freshness.'];
  if (!context.enabledModules.some((module) => module.key === 'finance')) risks.push('Finance module is not active, limiting cash and revenue insight depth.');
  if (!context.enabledModules.some((module) => module.key === 'crm')) risks.push('CRM module is not active, limiting pipeline intelligence.');
  return risks;
}

function buildOpportunities(context: WorkspaceAiContext) {
  const opportunities = ['Use AI recommendations to convert executive insights into routed workflows.'];
  if (context.enabledModules.some((module) => module.key === 'crm')) opportunities.push('Create a CRM workflow for deal risk and follow-up automation.');
  if (context.enabledModules.some((module) => module.key === 'finance')) opportunities.push('Generate a revenue forecast from current finance KPIs.');
  if (context.enabledModules.some((module) => module.key === 'hr')) opportunities.push('Review hiring and capacity signals for workforce planning.');
  return opportunities;
}
