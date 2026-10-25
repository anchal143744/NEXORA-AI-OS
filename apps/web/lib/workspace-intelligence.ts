import type {
  AiBusinessProfile,
  AiReadinessScore,
  DiscoveryAnswerMap,
  IndustryDetectionResult,
  SoftwareDiscoveryResult,
  TeamIntelligenceResult,
  WorkspaceBlueprint,
  WorkspaceGenerationResult,
  WorkspaceRecommendation,
} from '@/types/discovery';

const industryKeywords: Record<string, string[]> = {
  SaaS: ['subscription', 'software', 'platform', 'product', 'users', 'trial'],
  Agency: ['client', 'campaign', 'creative', 'retainer', 'service'],
  Ecommerce: ['store', 'orders', 'cart', 'fulfillment', 'shopify'],
  Retail: ['storefront', 'pos', 'inventory', 'locations', 'stock'],
  Healthcare: ['patient', 'clinic', 'care', 'appointment', 'compliance'],
  Manufacturing: ['production', 'factory', 'bom', 'quality', 'machine'],
  Finance: ['portfolio', 'risk', 'compliance', 'invoice', 'reconciliation'],
  Logistics: ['shipment', 'fleet', 'warehouse', 'route', 'carrier'],
  Consulting: ['engagement', 'advisory', 'client', 'project', 'proposal'],
};

function normalize(values: string[]) {
  return values.join(' ').toLowerCase();
}

function recommendation(label: string, reason: string, priority: WorkspaceRecommendation['priority']): WorkspaceRecommendation {
  return { label, reason, priority };
}

export function detectIndustry(answers: DiscoveryAnswerMap): IndustryDetectionResult {
  const source = normalize([
    answers.businessModel,
    answers.primaryOffer,
    answers.industryHint,
    ...answers.currentSoftware,
    ...answers.operationalPain,
    ...answers.strategicGoals,
  ]);

  let bestIndustry = answers.industryHint || 'SaaS';
  let bestScore = 0;

  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    const score = keywords.reduce((total, keyword) => total + (source.includes(keyword.toLowerCase()) ? 1 : 0), 0);
    if (score > bestScore) {
      bestIndustry = industry;
      bestScore = score;
    }
  }

  const confidence = Math.min(96, Math.max(62, 58 + bestScore * 9 + (answers.industryHint === bestIndustry ? 12 : 0)));
  const signals = industryKeywords[bestIndustry]?.filter((keyword) => source.includes(keyword.toLowerCase())) ?? [];

  return {
    industry: bestIndustry,
    confidence,
    signals: signals.length ? signals : [answers.industryHint || answers.businessModel, answers.primaryOffer],
  };
}

export function analyzeTeam(answers: DiscoveryAnswerMap): TeamIntelligenceResult {
  const departmentCount = answers.departments.length;
  const sizeBand = answers.teamSize;
  const collaborationRisk = departmentCount >= 5 && (sizeBand === '51-200' || sizeBand === '201+') ? 'high' : departmentCount >= 3 ? 'medium' : 'low';
  const recommendedRoles = ['Organization Owner', 'Admin', 'Manager'];

  if (answers.departments.includes('Sales')) recommendedRoles.push('Sales Manager');
  if (answers.departments.includes('Finance')) recommendedRoles.push('Finance Approver');
  if (answers.departments.includes('Operations')) recommendedRoles.push('Operations Lead');
  if (answers.departments.includes('HR')) recommendedRoles.push('HR Manager');

  return {
    sizeBand,
    operatingModel: departmentCount > 4 ? 'Cross-functional enterprise' : 'Focused operating team',
    recommendedRoles: [...new Set(recommendedRoles)],
    collaborationRisk,
  };
}

export function discoverSoftware(answers: DiscoveryAnswerMap): SoftwareDiscoveryResult {
  const stack = answers.currentSoftware;
  const integrationPriorities = stack.filter((item) => ['Salesforce', 'HubSpot', 'QuickBooks', 'Slack', 'Microsoft 365', 'Google Workspace', 'Shopify', 'SAP'].includes(item));
  const replacementCandidates = stack.filter((item) => ['Spreadsheet tracking', 'Manual email follow-ups', 'Disconnected documents'].includes(item));

  return {
    detectedStack: stack,
    integrationPriorities: integrationPriorities.length ? integrationPriorities : ['Email', 'Calendar', 'Accounting'],
    replacementCandidates,
  };
}

export function buildAiBusinessProfile(answers: DiscoveryAnswerMap): AiBusinessProfile {
  const industry = detectIndustry(answers);
  const team = analyzeTeam(answers);
  const software = discoverSoftware(answers);
  const maturity = answers.dataMaturity === 'advanced' ? 'Data-ready' : answers.dataMaturity === 'developing' ? 'Workflow-ready' : 'Foundation-ready';

  return {
    industry,
    team,
    software,
    maturity,
    summary: 'Detected ' + industry.industry + ' operating model with ' + team.operatingModel.toLowerCase() + ' and ' + maturity.toLowerCase() + ' AI adoption path.',
  };
}

export function recommendModules(profile: AiBusinessProfile, answers: DiscoveryAnswerMap): WorkspaceRecommendation[] {
  const modules: WorkspaceRecommendation[] = [
    recommendation('Analytics', 'Every adaptive workspace needs KPI intelligence and executive visibility.', 'critical'),
    recommendation('Tasks & Projects', 'Turns discovery outcomes into accountable operating work.', 'high'),
    recommendation('Documents', 'Centralizes policies, knowledge and setup artifacts.', 'medium'),
  ];

  if (['SaaS', 'Agency', 'Consulting'].includes(profile.industry.industry)) modules.push(recommendation('CRM', 'Revenue and customer workflows are core to this business model.', 'critical'));
  if (['Retail', 'Ecommerce', 'Manufacturing', 'Logistics'].includes(profile.industry.industry)) modules.push(recommendation('Inventory', 'Stock, fulfillment and supply movement are operational drivers.', 'critical'));
  if (answers.departments.includes('Finance') || profile.industry.industry === 'Finance') modules.push(recommendation('Finance', 'Financial workflows and approval control are required early.', 'high'));
  if (answers.departments.includes('HR') || profile.team.sizeBand === '201+') modules.push(recommendation('HR', 'Team scale needs people operations and role governance.', 'high'));

  return modules;
}

export function recommendAgents(profile: AiBusinessProfile, answers: DiscoveryAnswerMap): WorkspaceRecommendation[] {
  const agents = [
    recommendation('Executive Agent', 'Summarizes business health, risks and strategic next moves.', 'critical'),
    recommendation('Operations Agent', 'Coordinates tasks, workflows and cross-team execution.', 'high'),
  ];

  if (answers.strategicGoals.includes('Revenue growth')) agents.push(recommendation('Sales Agent', 'Focuses pipeline, conversion and expansion opportunities.', 'high'));
  if (answers.departments.includes('Finance')) agents.push(recommendation('Finance Agent', 'Watches revenue, cashflow and budget signals.', 'high'));
  if (answers.departments.includes('HR')) agents.push(recommendation('HR Agent', 'Supports talent, onboarding and workforce signals.', 'medium'));
  if (profile.industry.industry === 'Ecommerce' || profile.industry.industry === 'Retail') agents.push(recommendation('Customer Success Agent', 'Tracks customer health, service and retention signals.', 'medium'));

  return agents;
}

export function recommendAutomations(profile: AiBusinessProfile, answers: DiscoveryAnswerMap): WorkspaceRecommendation[] {
  const automations = [
    recommendation('Executive weekly operating summary', 'Keeps leadership aligned without manual reporting.', 'high'),
    recommendation('New customer onboarding workflow', 'Standardizes first value delivery and accountability.', 'high'),
  ];

  if (answers.operationalPain.includes('Manual follow-up')) automations.push(recommendation('AI follow-up assistant', 'Reduces manual reminders and missed customer touchpoints.', 'critical'));
  if (answers.operationalPain.includes('Slow approvals')) automations.push(recommendation('Approval routing', 'Routes decisions by role, risk and workspace policy.', 'high'));
  if (profile.software.integrationPriorities.length) automations.push(recommendation('Integration sync monitoring', 'Protects data continuity across the discovered software stack.', 'medium'));

  return automations;
}

export function generateWorkspaceBlueprint(answers: DiscoveryAnswerMap): WorkspaceBlueprint {
  const profile = buildAiBusinessProfile(answers);
  const modules = recommendModules(profile, answers);
  const agents = recommendAgents(profile, answers);
  const automations = recommendAutomations(profile, answers);
  const kpis = [
    recommendation('Business Health Score', 'Unifies growth, execution, finance and customer signals.', 'critical'),
    recommendation('Automation Coverage', 'Tracks how much operating work is handled by workflows and AI.', 'high'),
    recommendation('Team Execution Velocity', 'Shows delivery momentum by team and department.', 'medium'),
  ];
  const workflows = [
    recommendation('Lead to revenue workflow', 'Connects sales motion to finance and customer success.', 'high'),
    recommendation('Issue to resolution workflow', 'Creates accountability across support and operations.', 'medium'),
    recommendation('AI insight review workflow', 'Requires human approval before sensitive AI actions.', 'critical'),
  ];

  return {
    workspaceName: profile.industry.industry + ' Intelligence Workspace',
    navigation: ['Command Center', ...modules.map((item) => item.label), 'AI Copilot', 'Automations', 'Reports'],
    modules,
    kpis,
    workflows,
    agents,
    automations,
  };
}

export function calculateAiReadinessScore(answers: DiscoveryAnswerMap, blueprint: WorkspaceBlueprint): AiReadinessScore {
  const score =
    34 +
    answers.departments.length * 4 +
    answers.currentSoftware.length * 3 +
    answers.strategicGoals.length * 4 +
    (answers.automationComfort === 'high' ? 12 : answers.automationComfort === 'medium' ? 8 : 3) +
    (answers.dataMaturity === 'advanced' ? 14 : answers.dataMaturity === 'developing' ? 8 : 3);

  const normalized = Math.min(96, score);
  const level = normalized >= 88 ? 'Autonomous-ready' : normalized >= 74 ? 'Intelligent' : normalized >= 58 ? 'Operational' : 'Foundation';

  return {
    score: normalized,
    level,
    strengths: [
      blueprint.modules.length + ' recommended modules identified',
      blueprint.agents.length + ' AI agents mapped',
      blueprint.automations.length + ' automation opportunities found',
    ],
    gaps: [
      answers.dataMaturity === 'early' ? 'Centralize operational data before autonomous workflows.' : 'Define measurable policy gates for AI execution.',
      answers.automationComfort === 'low' ? 'Start with recommendations before enabling execution.' : 'Prepare approval rules for medium-risk actions.',
    ],
  };
}

export function generateWorkspace(blueprint: WorkspaceBlueprint): WorkspaceGenerationResult {
  return {
    blueprintId: 'blueprint-' + blueprint.workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    status: 'ready',
    workspaceName: blueprint.workspaceName,
    generatedAt: new Date().toISOString(),
  };
}
