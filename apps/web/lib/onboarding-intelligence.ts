import {
  buildAiBusinessProfile,
  calculateAiReadinessScore,
  generateWorkspaceBlueprint,
} from '@/lib/workspace-intelligence';
import type {
  AiBusinessProfile,
  AiReadinessScore,
  DiscoveryAnswerMap,
  WorkspaceBlueprint,
  WorkspaceRecommendation,
} from '@/types/discovery';

export type AiBusinessSetupProfile = {
  businessName: string;
  founder: string;
  businessEmail: string;
  phone: string;
  website: string;
  country: string;
  language: string;
  currency: string;
  timezone: string;
  industry: string;
  companySize: string;
  departments: string[];
  employees: string;
  taxSystem: string;
  accountingMethod: string;
  businessGoals: string[];
  aiPreferences: string[];
  futureExpansionPlans: string[];
};

export type LiveWorkspaceIntelligence = {
  discoveryAnswers: DiscoveryAnswerMap;
  profile: AiBusinessProfile;
  blueprint: WorkspaceBlueprint;
  readiness: AiReadinessScore;
  reports: WorkspaceRecommendation[];
  permissions: WorkspaceRecommendation[];
  summary: string;
};

export const defaultBusinessSetupProfile: AiBusinessSetupProfile = {
  businessName: '',
  founder: '',
  businessEmail: '',
  phone: '',
  website: '',
  country: 'United States',
  language: 'English',
  currency: 'USD',
  timezone: 'America/New_York',
  industry: 'SaaS',
  companySize: '11-50',
  departments: ['Sales', 'Operations', 'Finance'],
  employees: '',
  taxSystem: 'Sales Tax',
  accountingMethod: 'Accrual',
  businessGoals: ['Revenue growth', 'Operational automation'],
  aiPreferences: ['Recommendations first', 'Approval-based automation'],
  futureExpansionPlans: ['New customer segments'],
};

export const countries = [
  'United States',
  'India',
  'United Kingdom',
  'Canada',
  'United Arab Emirates',
  'Australia',
  'Singapore',
  'Germany',
  'France',
  'Japan',
];

export const languages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Arabic',
  'Hindi',
  'Chinese',
  'Japanese',
  'Portuguese',
];

export const currencies = ['USD', 'INR', 'GBP', 'CAD', 'AED', 'AUD', 'SGD', 'EUR', 'JPY'];

export const timezones = [
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Kolkata',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Singapore',
  'Australia/Sydney',
  'Asia/Tokyo',
];

export const industries = ['SaaS', 'Agency', 'Ecommerce', 'Retail', 'Healthcare', 'Manufacturing', 'Education', 'Finance', 'Logistics', 'Consulting'];

export const companySizes = ['1-10', '11-50', '51-200', '201-1000', '1000+'];

export const departmentOptions = ['Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Customer Success', 'Support', 'Product', 'IT', 'Legal'];

export const taxSystems = ['Sales Tax', 'VAT', 'GST', 'Corporate Tax', 'Mixed regional tax', 'Not sure yet'];

export const accountingMethods = ['Cash', 'Accrual', 'Hybrid', 'Not sure yet'];

export const businessGoalOptions = [
  'Revenue growth',
  'Operational automation',
  'Customer retention',
  'Cost optimization',
  'Global expansion',
  'Hiring and workforce planning',
  'Cash flow visibility',
  'Executive reporting',
];

export const aiPreferenceOptions = [
  'Recommendations first',
  'Approval-based automation',
  'Autonomous low-risk actions',
  'Executive summaries',
  'Workflow generation',
  'Risk detection',
  'Revenue forecasting',
];

export const expansionOptions = [
  'New countries',
  'New regions',
  'New industries',
  'New customer segments',
  'New sales channels',
  'More departments',
  'Partner ecosystem',
];

export function buildLiveWorkspaceIntelligence(input: AiBusinessSetupProfile): LiveWorkspaceIntelligence {
  const discoveryAnswers = toDiscoveryAnswers(input);
  const profile = buildAiBusinessProfile(discoveryAnswers);
  const baseBlueprint = generateWorkspaceBlueprint(discoveryAnswers);
  const blueprint = enrichBlueprint(baseBlueprint, input, profile);
  const readiness = calculateAiReadinessScore(discoveryAnswers, blueprint);
  const reports = recommendReports(input, profile);
  const permissions = recommendPermissions(input);
  const summary = buildSummary(input, profile, blueprint);

  return { discoveryAnswers, profile, blueprint, readiness, reports, permissions, summary };
}

export function toDiscoveryAnswers(input: AiBusinessSetupProfile): DiscoveryAnswerMap {
  return {
    businessModel: businessModelFor(input),
    primaryOffer: input.businessName ? input.businessName + ' operating model' : 'AI-ready business operating model',
    industryHint: input.industry,
    teamSize: input.companySize,
    departments: input.departments,
    currentSoftware: softwareSignalsFor(input),
    operationalPain: painSignalsFor(input),
    strategicGoals: input.businessGoals,
    automationComfort: input.aiPreferences.includes('Autonomous low-risk actions') ? 'high' : input.aiPreferences.includes('Approval-based automation') ? 'medium' : 'low',
    dataMaturity: input.departments.length >= 5 || input.companySize === '201-1000' || input.companySize === '1000+' ? 'advanced' : 'developing',
  };
}

function enrichBlueprint(base: WorkspaceBlueprint, input: AiBusinessSetupProfile, profile: AiBusinessProfile): WorkspaceBlueprint {
  const workspaceName = (input.businessName || profile.industry.industry) + ' AI Operating Workspace';
  const navigation = ['Command Center', ...base.modules.map((module) => module.label), 'Reports', 'AI Copilot', 'Settings'];

  return {
    ...base,
    workspaceName,
    navigation: [...new Set(navigation)],
    profile: {
      industry: normalizeIndustry(input.industry),
      businessType: normalizeBusinessType(input.companySize),
      teamSize: normalizeTeamSize(input.companySize),
      revenueRange: '1m_10m',
      growthStage: input.futureExpansionPlans.length >= 2 ? 'scale' : 'growth',
      country: countryCode(input.country),
      goals: input.businessGoals,
      language: input.language,
      currency: input.currency,
      timezone: input.timezone,
      taxSystem: input.taxSystem,
      accountingMethod: input.accountingMethod,
      departments: input.departments,
      aiPreferences: input.aiPreferences,
      expansionPlans: input.futureExpansionPlans,
    },
  };
}

function recommendReports(input: AiBusinessSetupProfile, profile: AiBusinessProfile): WorkspaceRecommendation[] {
  const reports: WorkspaceRecommendation[] = [
    { label: 'Executive Operating Report', reason: 'Gives leadership a single weekly view of revenue, cash, team and workflow health.', priority: 'critical' },
    { label: 'AI Recommendation Report', reason: 'Tracks recommended tasks, automations, risks and decisions from the AI operating layer.', priority: 'high' },
  ];

  if (input.businessGoals.includes('Cash flow visibility')) reports.push({ label: 'Cash Flow Intelligence Report', reason: 'Connects revenue, invoices, expenses and runway signals.', priority: 'high' });
  if (input.departments.includes('HR')) reports.push({ label: 'Workforce Health Report', reason: 'Summarizes attendance, hiring, performance and learning needs.', priority: 'medium' });
  if (profile.industry.industry === 'Manufacturing' || profile.industry.industry === 'Retail') reports.push({ label: 'Inventory and Fulfillment Report', reason: 'Shows stock, demand, movement and shipment risk.', priority: 'high' });

  return reports;
}

function recommendPermissions(input: AiBusinessSetupProfile): WorkspaceRecommendation[] {
  const permissions: WorkspaceRecommendation[] = [
    { label: 'Organization Owner', reason: 'Controls workspace generation, billing, tenant security and critical approvals.', priority: 'critical' },
    { label: 'Admin', reason: 'Manages modules, users, roles and operating policies.', priority: 'high' },
    { label: 'Manager', reason: 'Approves team work, reviews AI recommendations and owns department execution.', priority: 'high' },
    { label: 'Employee', reason: 'Works in assigned modules with scoped workspace access.', priority: 'medium' },
  ];

  if (input.departments.includes('Finance')) permissions.push({ label: 'Finance Approver', reason: 'Approves invoices, expenses, budgets and financial actions.', priority: 'high' });
  if (input.departments.includes('HR')) permissions.push({ label: 'HR Manager', reason: 'Controls employee, hiring, performance and learning workflows.', priority: 'high' });

  return permissions;
}

function buildSummary(input: AiBusinessSetupProfile, profile: AiBusinessProfile, blueprint: WorkspaceBlueprint) {
  const businessName = input.businessName || 'Your business';
  return businessName + ' is being configured as a ' + profile.industry.industry + ' workspace with ' + blueprint.modules.length + ' modules, ' + blueprint.kpis.length + ' KPIs, ' + blueprint.agents.length + ' AI agents and ' + input.country + ' localization context.';
}

function businessModelFor(input: AiBusinessSetupProfile) {
  return input.businessName + ' operates in ' + input.industry + ' with ' + input.companySize + ' team size, ' + input.accountingMethod + ' accounting and goals: ' + input.businessGoals.join(', ');
}

function softwareSignalsFor(input: AiBusinessSetupProfile) {
  const base = ['Google Workspace', 'Microsoft 365'];
  if (input.departments.includes('Sales')) base.push('HubSpot');
  if (input.departments.includes('Finance')) base.push('QuickBooks');
  if (input.industry === 'Ecommerce' || input.industry === 'Retail') base.push('Shopify');
  if (input.industry === 'Manufacturing') base.push('SAP');
  return [...new Set(base)];
}

function painSignalsFor(input: AiBusinessSetupProfile) {
  const pain = ['Disconnected reporting'];
  if (input.businessGoals.includes('Operational automation')) pain.push('Manual follow-up');
  if (input.departments.length >= 4) pain.push('Slow approvals');
  if (input.futureExpansionPlans.length >= 2) pain.push('Poor handoffs');
  return pain;
}

function normalizeIndustry(value: string) {
  return value.toLowerCase();
}

function normalizeBusinessType(size: string) {
  if (size === '1-10') return 'startup';
  if (size === '11-50') return 'small_business';
  if (size === '51-200') return 'enterprise';
  return 'global_organization';
}

function normalizeTeamSize(size: string) {
  if (size === '1-10') return '2_10';
  if (size === '11-50') return '11_50';
  if (size === '51-200') return '51_200';
  return '201_1000';
}

function countryCode(country: string) {
  const codes: Record<string, string> = {
    'United States': 'US',
    India: 'IN',
    'United Kingdom': 'GB',
    Canada: 'CA',
    'United Arab Emirates': 'AE',
    Australia: 'AU',
    Singapore: 'SG',
    Germany: 'DE',
    France: 'FR',
    Japan: 'JP',
  };
  return codes[country] ?? 'US';
}
