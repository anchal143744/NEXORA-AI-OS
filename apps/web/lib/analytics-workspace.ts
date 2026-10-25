import type { AiAnalyticsCommandResult, AnalyticsMetric, AnalyticsWorkspaceData, BiDashboard, CrossModuleInsight, DecisionScenario, ExecutiveIntelligenceSignal, ExecutiveScorecard, ForecastRecord, KpiRecord, ReportDefinition, StrategicInsight, TrendPoint, VisualizationOption } from '@/types/analytics-workspace';

export const analyticsNavigation = [
  { group: 'Analytics', items: ['Dashboards', 'Reports', 'KPIs'] },
  { group: 'Intelligence', items: ['Insights', 'Forecasts', 'Risks'] },
  { group: 'Executive', items: ['Scorecards', 'Strategic Center'] },
];

export const trends: TrendPoint[] = [
  { period: 'Jan', revenue: 720, customers: 66, workforce: 84, operations: 78 },
  { period: 'Feb', revenue: 760, customers: 69, workforce: 86, operations: 80 },
  { period: 'Mar', revenue: 815, customers: 73, workforce: 87, operations: 82 },
  { period: 'Apr', revenue: 860, customers: 76, workforce: 88, operations: 84 },
  { period: 'May', revenue: 912, customers: 81, workforce: 90, operations: 87 },
  { period: 'Jun', revenue: 970, customers: 84, workforce: 91, operations: 89 },
];

export const executiveSignals: ExecutiveIntelligenceSignal[] = [
  { id: 'health-score', label: 'Company Health Score', value: '88%', explanation: 'Revenue, customer growth and automation efficiency are healthy.', tone: 'healthy' },
  { id: 'growth-trends', label: 'Growth Trends', value: '+18%', explanation: 'Growth is led by enterprise pipeline and customer expansion.', tone: 'healthy' },
  { id: 'strategic-risks', label: 'Strategic Risks', value: '4', explanation: 'Risks are concentrated in collections, hiring capacity and support policy review.', tone: 'watch' },
  { id: 'opportunities', label: 'Opportunities', value: '7', explanation: 'AI automation, enterprise renewals and self-service adoption are strongest opportunities.', tone: 'healthy' },
  { id: 'recommendations', label: 'Executive Recommendations', value: '5', explanation: 'Recommended actions are ready for leadership review.', tone: 'healthy' },
];

export const dashboards: BiDashboard[] = [
  { id: 'dash-crm', domain: 'CRM', title: 'CRM Dashboard', metric: 'Pipeline value $2.8M', health: 91, summary: 'Pipeline is growing with strongest movement in enterprise opportunities.' },
  { id: 'dash-hr', domain: 'HR', title: 'HR Dashboard', metric: 'Workforce health 87%', health: 87, summary: 'Hiring and retention are healthy, with engineering capacity under watch.' },
  { id: 'dash-finance', domain: 'Finance', title: 'Finance Dashboard', metric: 'Cash flow +$315K', health: 84, summary: 'Finance is healthy, but collection timing needs executive attention.' },
  { id: 'dash-operations', domain: 'Operations', title: 'Operations Dashboard', metric: 'Workflow success 91%', health: 91, summary: 'Operations automation is improving task throughput and reliability.' },
  { id: 'dash-projects', domain: 'Projects', title: 'Projects Dashboard', metric: 'Delivery confidence 82%', health: 82, summary: 'Project delivery is stable with two initiatives requiring scope review.' },
  { id: 'dash-ai-agents', domain: 'AI Agents', title: 'AI Agents Dashboard', metric: '135h saved', health: 90, summary: 'Agent automations are saving time across revenue, finance and hiring.' },
  { id: 'dash-cs', domain: 'Customer Success', title: 'Customer Success Dashboard', metric: 'Churn risk 6%', health: 86, summary: 'Customer health is strong, with support escalations requiring follow-up.' },
];

export const kpis: KpiRecord[] = [
  { id: 'kpi-arr', name: 'Revenue Growth', owner: 'CFO', current: 88, target: 85, unit: '%', alert: 'Above target', performance: 'healthy' },
  { id: 'kpi-customer-growth', name: 'Customer Growth', owner: 'CRO', current: 84, target: 80, unit: '%', alert: 'Healthy expansion', performance: 'healthy' },
  { id: 'kpi-workforce', name: 'Workforce Health', owner: 'CHRO', current: 79, target: 82, unit: '%', alert: 'Capacity watch', performance: 'watch' },
  { id: 'kpi-budget', name: 'Budget Utilization', owner: 'Finance Ops', current: 86, target: 90, unit: '%', alert: 'Within plan', performance: 'healthy' },
  { id: 'kpi-automation', name: 'Automation Coverage', owner: 'COO', current: 72, target: 75, unit: '%', alert: 'Near target', performance: 'watch' },
];

export const crossModuleInsights: CrossModuleInsight[] = [
  { id: 'cross-revenue-hiring', title: 'Revenue growth is outpacing hiring capacity', modules: ['CRM', 'HR', 'Finance'], summary: 'Pipeline growth is strong, but delivery and onboarding capacity may need planning.', businessImpact: 'Protect revenue conversion by approving targeted hiring.' },
  { id: 'cross-ai-finance', title: 'AI Agents improve finance follow-up speed', modules: ['AI Agents', 'Finance', 'Operations'], summary: 'Finance automations are reducing manual collection follow-up work.', businessImpact: 'Increase automation coverage for high-value invoices.' },
  { id: 'cross-customer-ops', title: 'Customer success signals affect operations planning', modules: ['Customer Success', 'Operations', 'Projects'], summary: 'Escalated customers are linked to delayed implementation tasks.', businessImpact: 'Route project risks into customer success playbooks.' },
];

export const forecasts: ForecastRecord[] = [
  { id: 'forecast-revenue', type: 'revenue', period: 'Next quarter', value: '$1.12M', confidence: 84, explanation: 'Revenue forecast is driven by enterprise renewals and qualified pipeline.' },
  { id: 'forecast-hiring', type: 'hiring', period: 'Next quarter', value: '14 hires', confidence: 76, explanation: 'Hiring forecast recommends engineering and customer success capacity.' },
  { id: 'forecast-budget', type: 'budget', period: 'Next quarter', value: '86% used', confidence: 81, explanation: 'Budget remains controlled, with operations vendor spend under watch.' },
  { id: 'forecast-demand', type: 'demand', period: 'Next quarter', value: '+21%', confidence: 78, explanation: 'Demand is increasing in AI automation and executive analytics.' },
  { id: 'forecast-productivity', type: 'productivity', period: 'Next quarter', value: '+12%', confidence: 80, explanation: 'Productivity gains are expected from workflow and agent adoption.' },
];

export const strategicInsights: StrategicInsight[] = [
  { id: 'growth-opportunity', title: 'Growth opportunity in enterprise AI automation', severity: 'opportunity', summary: 'AI Agents and workflow automation are increasing adoption and saved hours.', recommendation: 'Package AI automation as an executive expansion play.' },
  { id: 'bottleneck-ops', title: 'Operational bottleneck in implementation capacity', severity: 'risk', summary: 'Customer growth and project load are increasing faster than delivery capacity.', recommendation: 'Prioritize hiring and automate implementation status reporting.' },
  { id: 'revenue-risk', title: 'Revenue risk in collection timing', severity: 'risk', summary: 'One large overdue invoice affects near-term cash timing.', recommendation: 'Route high-value collections to Finance Agent with executive visibility.' },
  { id: 'workforce-risk', title: 'Workforce risk in engineering load', severity: 'risk', summary: 'Engineering capacity is below target while demand continues to rise.', recommendation: 'Approve capacity plan and protect roadmap-critical work.' },
  { id: 'cost-optimization', title: 'Cost optimization in software and vendor spend', severity: 'opportunity', summary: 'Vendor consolidation can reduce outflows without slowing core teams.', recommendation: 'Start a finance-led vendor review workflow.' },
];

export const reports: ReportDefinition[] = [
  { id: 'report-executive', name: 'Executive Weekly Brief', format: 'PDF', schedule: 'Every Monday', sections: ['Company health', 'Risks', 'Opportunities', 'Recommendations'] },
  { id: 'report-finance', name: 'Finance Performance Report', format: 'Excel', schedule: 'Monthly', sections: ['Revenue', 'Cash flow', 'Budget', 'Forecast'] },
  { id: 'report-ops', name: 'Operations Automation Report', format: 'Dashboard', schedule: 'Weekly', sections: ['Workflows', 'Agents', 'Saved hours', 'Failures'] },
  { id: 'report-growth', name: 'Growth Analytics Report', format: 'PDF', schedule: 'Biweekly', sections: ['Pipeline', 'Customer growth', 'Conversion', 'Expansion'] },
];

export const visualizationOptions: VisualizationOption[] = [
  { id: 'viz-line', label: 'Line Charts', useCase: 'Revenue and trend analysis' },
  { id: 'viz-bar', label: 'Bar Charts', useCase: 'Department and module comparison' },
  { id: 'viz-pie', label: 'Pie Charts', useCase: 'Portfolio mix and budget allocation' },
  { id: 'viz-heat', label: 'Heat Maps', useCase: 'Risk concentration and module health' },
  { id: 'viz-kpi', label: 'KPI Cards', useCase: 'Executive summary metrics' },
  { id: 'viz-trend', label: 'Trend Analysis', useCase: 'Forecast direction and momentum' },
];

export const scorecards: ExecutiveScorecard[] = [
  { id: 'score-revenue', label: 'Revenue Performance', value: '88%', detail: 'Above quarterly target', tone: 'healthy' },
  { id: 'score-customer', label: 'Customer Growth', value: '84%', detail: 'Expansion led growth', tone: 'healthy' },
  { id: 'score-workforce', label: 'Workforce Health', value: '79%', detail: 'Capacity watch', tone: 'watch' },
  { id: 'score-finance', label: 'Financial Health', value: '86%', detail: 'Healthy with collection risk', tone: 'healthy' },
  { id: 'score-strategy', label: 'Strategic Progress', value: '81%', detail: 'AI automation ahead of plan', tone: 'healthy' },
];

export const decisionScenarios: DecisionScenario[] = [
  { id: 'decision-hiring', title: 'Approve targeted hiring plan', expectedImpact: '+9% delivery confidence', riskAssessment: 'Medium cost impact, high capacity upside', recommendation: 'Approve customer success and engineering hiring wave.' },
  { id: 'decision-automation', title: 'Expand AI automation package', expectedImpact: '+$240K expansion pipeline', riskAssessment: 'Low operational risk with approval controls', recommendation: 'Launch AI automation expansion offer for enterprise customers.' },
  { id: 'decision-vendor', title: 'Consolidate vendor spend', expectedImpact: '$72K annual savings', riskAssessment: 'Low risk if migration is sequenced by department', recommendation: 'Start vendor consolidation workflow with Finance review.' },
];

export function createAnalyticsMetrics(): AnalyticsMetric[] {
  return [
    { id: 'revenue-trends', label: 'Revenue Trends', value: '+18%', detail: 'Six-month revenue growth trend', trend: 'Enterprise expansion leading growth', tone: 'healthy' },
    { id: 'workforce-metrics', label: 'Workforce Metrics', value: '79%', detail: 'Workforce capacity and health', trend: 'Engineering capacity under watch', tone: 'watch' },
    { id: 'customer-metrics', label: 'Customer Metrics', value: '84%', detail: 'Customer growth and health', trend: 'Expansion and retention healthy', tone: 'healthy' },
    { id: 'financial-metrics', label: 'Financial Metrics', value: '86%', detail: 'Budget, cash and profitability health', trend: 'Collection timing needs review', tone: 'healthy' },
    { id: 'operations-metrics', label: 'Operations Metrics', value: '89%', detail: 'Workflow and project performance', trend: 'Automation improving throughput', tone: 'healthy' },
  ];
}

export function createAnalyticsWorkspaceData(): AnalyticsWorkspaceData {
  return {
    metrics: createAnalyticsMetrics(),
    trends,
    executiveSignals,
    dashboards,
    kpis,
    crossModuleInsights,
    forecasts,
    strategicInsights,
    reports,
    visualizationOptions,
    scorecards,
    decisionScenarios,
  };
}

export function runAiAnalyticsCommand(command: string, data = createAnalyticsWorkspaceData()): AiAnalyticsCommandResult {
  const normalized = command.toLowerCase();
  let response = 'I reviewed company health, dashboards, KPIs, forecasts, risks, scorecards and strategic decisions.';
  let recommendedActions = data.strategicInsights.map((insight) => insight.recommendation);

  if (normalized.includes('company health')) {
    response = 'Company health is 88%. Revenue, customer growth and automation are healthy; workforce capacity needs attention.';
    recommendedActions = ['Review workforce scorecard', 'Protect enterprise pipeline', 'Continue AI automation expansion'];
  } else if (normalized.includes('forecast next quarter') || normalized.includes('next quarter')) {
    response = 'Next quarter forecast shows $1.12M revenue, 14 recommended hires, 86% budget utilization and +12% productivity growth.';
    recommendedActions = ['Approve hiring scenario', 'Review budget forecast', 'Track productivity uplift from AI agents'];
  } else if (normalized.includes('business risks') || normalized.includes('risks')) {
    response = 'Primary business risks are implementation capacity, collection timing, engineering load and support policy review.';
    recommendedActions = ['Approve capacity plan', 'Escalate high-value collections', 'Review support automation policy'];
  } else if (normalized.includes('growth opportunities') || normalized.includes('opportunities')) {
    response = 'Growth opportunities include enterprise AI automation, executive analytics expansion and customer success playbooks.';
    recommendedActions = ['Launch AI automation expansion play', 'Package executive analytics dashboard', 'Route customer risks into playbooks'];
  } else if (normalized.includes('kpi performance') || normalized.includes('kpi')) {
    response = 'KPI performance is strong in revenue and customer growth, while workforce health and automation coverage are near target but under watch.';
    recommendedActions = ['Set KPI alert for workforce capacity', 'Raise automation coverage target', 'Keep revenue growth target unchanged'];
  } else if (normalized.includes('strategic actions') || normalized.includes('recommend')) {
    response = 'Recommended strategic actions: approve targeted hiring, expand AI automation, consolidate vendor spend and prioritize collection timing.';
    recommendedActions = data.decisionScenarios.map((scenario) => scenario.recommendation);
  }

  return {
    id: 'analytics-command-' + Date.now(),
    command,
    response,
    recommendedActions: recommendedActions.slice(0, 4),
  };
}
