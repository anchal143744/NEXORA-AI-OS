import type {
  Industry,
  ModuleKey,
  Permission,
  WorkspaceAiAgent,
  WorkspaceAiContext,
  WorkspaceConfiguration,
  WorkspaceKpi,
  WorkspacePersonalization,
  WorkspaceReport,
  WorkspaceWidgetConfig,
} from '@/types/workspace';
import { buildLiveWorkspaceIntelligence, defaultBusinessSetupProfile, type AiBusinessSetupProfile } from '@/lib/onboarding-intelligence';
import { buildNavigation } from '@/features/navigation/navigation-engine';
import { resolveModulesForWorkspace } from './module-registry';

const onboardingStorageKey = 'nexora.phase3.ai-business-setup';
const generatedWorkspaceProfileStorageKey = 'nexora.workspace.generated-profile';
const defaultLayoutUpdatedAt = '2026-01-01T00:00:00.000Z';

export function createDefaultPersonalization(widgets: WorkspaceWidgetConfig[]): WorkspacePersonalization {
  return {
    pinnedWidgetIds: widgets.filter((widget) => widget.pinned).map((widget) => widget.id),
    favoriteModuleKeys: ['crm', 'finance', 'analytics', 'ai'],
    recentItemIds: ['workspace.command-center', 'report.executive-operating', 'agent.executive'],
    layoutOrder: widgets.sort((a, b) => a.order - b.order).map((widget) => widget.id),
    savedLayouts: [
      {
        id: 'executive-default',
        label: 'Executive operating view',
        widgetIds: widgets.sort((a, b) => a.order - b.order).map((widget) => widget.id),
        updatedAt: defaultLayoutUpdatedAt,
      },
    ],
  };
}

export function buildWorkspaceConfiguration(input: Partial<AiBusinessSetupProfile> = {}): WorkspaceConfiguration {
  const setupProfile = { ...defaultBusinessSetupProfile, ...input };
  const intelligence = buildLiveWorkspaceIntelligence(setupProfile);
  const industry = normalizeIndustry(setupProfile.industry);
  const workspaceName = intelligence.blueprint.workspaceName || setupProfile.businessName || 'Global Operations';
  const modules = resolveModulesForWorkspace(industry, setupProfile.departments);
  const enabledModules = modules.filter((module) => module.enabled);
  const kpis = buildKpis(setupProfile, enabledModules.map((module) => module.key));
  const widgets = buildWidgets(setupProfile, kpis, enabledModules.map((module) => module.key));
  const personalization = createDefaultPersonalization(widgets);

  const base: Omit<WorkspaceConfiguration, 'navigation'> = {
    workspaceId: 'foundation-workspace',
    workspaceName,
    organizationId: 'nexora-org',
    organizationName: setupProfile.businessName || 'NEXORA AI',
    tenantId: 'tenant-nexora',
    tenantName: setupProfile.businessName || 'NEXORA Tenant',
    businessType: intelligence.profile.maturity,
    industry,
    departments: setupProfile.departments,
    roles: ['owner', 'admin'],
    permissions: ['create', 'read', 'update', 'delete', 'manage', 'approve', 'execute'],
    modules,
    widgets,
    kpis,
    reports: buildReports(enabledModules.map((module) => module.key)),
    aiAgents: buildAgents(enabledModules.map((module) => module.key)),
    locale: localeFor(setupProfile.language),
    currency: setupProfile.currency,
    timezone: setupProfile.timezone,
    featureFlags: {
      dynamicWorkspace: true,
      dynamicNavigation: true,
      widgetRegistry: true,
      personalization: true,
      aiContextProvider: true,
      permissionAwareRendering: true,
    },
    personalization,
    currentUser: {
      id: 'user-founder',
      name: setupProfile.founder || 'Workspace Owner',
      email: setupProfile.businessEmail || 'owner@nexora.ai',
      role: 'owner',
      permissions: ['create', 'read', 'update', 'delete', 'manage', 'approve', 'execute'],
    },
    organization: {
      id: 'nexora-org',
      name: setupProfile.businessName || 'NEXORA AI',
      slug: slugify(setupProfile.businessName || 'nexora-ai'),
    },
    tenant: {
      id: 'tenant-nexora',
      name: setupProfile.businessName || 'NEXORA Tenant',
      slug: slugify(setupProfile.businessName || 'nexora-tenant'),
    },
    workspace: {
      id: 'foundation-workspace',
      name: workspaceName,
      slug: slugify(workspaceName),
    },
    selectedModuleKey: 'analytics',
    selectedFilters: {
      period: 'this-quarter',
      currency: setupProfile.currency,
      timezone: setupProfile.timezone,
    },
  };

  return {
    ...base,
    navigation: buildNavigation(base as WorkspaceConfiguration),
  };
}

export function loadWorkspaceConfiguration() {
  if (typeof window === 'undefined') return buildWorkspaceConfiguration();

  const raw = window.localStorage.getItem(generatedWorkspaceProfileStorageKey) ?? window.localStorage.getItem(onboardingStorageKey);
  if (!raw) return buildWorkspaceConfiguration();

  try {
    return buildWorkspaceConfiguration(JSON.parse(raw) as Partial<AiBusinessSetupProfile>);
  } catch {
    return buildWorkspaceConfiguration();
  }
}

export function saveGeneratedWorkspaceProfile(profile: AiBusinessSetupProfile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(generatedWorkspaceProfileStorageKey, JSON.stringify(profile));
}

export function createWorkspaceAiContext(config: WorkspaceConfiguration, currentModule?: ModuleKey, filters: Record<string, string> = {}): WorkspaceAiContext {
  return {
    workspaceId: config.workspaceId,
    workspaceName: config.workspaceName,
    organizationId: config.organizationId,
    organizationName: config.organizationName,
    tenantId: config.tenantId,
    industry: config.industry,
    locale: config.locale,
    currency: config.currency,
    timezone: config.timezone,
    currentModule: currentModule ?? config.selectedModuleKey,
    currentUser: config.currentUser,
    enabledModules: config.modules.filter((module) => module.enabled).map((module) => ({ key: module.key, label: module.label, route: module.route })),
    kpis: config.kpis,
    selectedFilters: { ...config.selectedFilters, ...filters },
    permissions: config.permissions,
  };
}

function buildKpis(profile: AiBusinessSetupProfile, enabledModules: ModuleKey[]): WorkspaceKpi[] {
  const kpis: WorkspaceKpi[] = [
    { id: 'kpi.company-health', label: 'Company Health', value: '86%', change: '+6 pts', trend: 'up', moduleKey: 'analytics', permissions: ['read'] },
    { id: 'kpi.ai-automation', label: 'AI Automation Coverage', value: '42%', change: '+11%', trend: 'up', moduleKey: 'ai', permissions: ['read'] },
  ];

  if (enabledModules.includes('crm')) kpis.push({ id: 'kpi.pipeline', label: 'Pipeline Value', value: profile.currency + ' 1.8M', change: '+14%', trend: 'up', moduleKey: 'crm', permissions: ['read'] });
  if (enabledModules.includes('finance')) kpis.push({ id: 'kpi.cashflow', label: 'Cash Flow Outlook', value: 'Stable', change: '+9%', trend: 'up', moduleKey: 'finance', permissions: ['read'] });
  if (enabledModules.includes('hr')) kpis.push({ id: 'kpi.workforce', label: 'Workforce Health', value: '91%', change: '+3%', trend: 'up', moduleKey: 'hr', permissions: ['read'] });
  if (enabledModules.includes('inventory')) kpis.push({ id: 'kpi.inventory-risk', label: 'Inventory Risk', value: 'Low', change: '-8%', trend: 'up', moduleKey: 'inventory', permissions: ['read'] });
  if (enabledModules.includes('projects')) kpis.push({ id: 'kpi.delivery', label: 'On-Time Delivery', value: '88%', change: '+4%', trend: 'up', moduleKey: 'projects', permissions: ['read'] });

  return kpis;
}

function buildReports(enabledModules: ModuleKey[]): WorkspaceReport[] {
  return [
    { id: 'report.executive-operating', label: 'Executive Operating Report', moduleKey: 'analytics', cadence: 'weekly', permissions: ['read'] },
    { id: 'report.ai-recommendations', label: 'AI Recommendation Report', moduleKey: 'ai', cadence: 'weekly', permissions: ['read'] },
    ...enabledModules.filter((moduleKey) => ['crm', 'finance', 'hr', 'projects', 'inventory'].includes(moduleKey)).map((moduleKey) => ({
      id: 'report.' + moduleKey + '.health',
      label: labelForModule(moduleKey) + ' Health Report',
      moduleKey,
      cadence: 'monthly' as const,
      permissions: ['read'] as Permission[],
    })),
  ];
}

function buildAgents(enabledModules: ModuleKey[]): WorkspaceAiAgent[] {
  return [
    { id: 'agent.executive', label: 'Executive Advisor', moduleKey: 'analytics', status: 'active', permissions: ['read', 'execute'] },
    { id: 'agent.automation', label: 'Automation Optimizer', moduleKey: 'workflows', status: 'active', permissions: ['read', 'execute'] },
    ...enabledModules.filter((moduleKey) => ['crm', 'finance', 'hr', 'inventory', 'projects'].includes(moduleKey)).map((moduleKey) => ({
      id: 'agent.' + moduleKey,
      label: labelForModule(moduleKey) + ' Copilot',
      moduleKey,
      status: 'recommended' as const,
      permissions: ['read', 'execute'] as Permission[],
    })),
  ];
}

function buildWidgets(profile: AiBusinessSetupProfile, kpis: WorkspaceKpi[], enabledModules: ModuleKey[]): WorkspaceWidgetConfig[] {
  const widgets: WorkspaceWidgetConfig[] = [
    {
      id: 'widget.executive.kpi',
      type: 'kpi',
      title: 'Executive KPI Stack',
      description: 'Permission-aware KPIs generated from the workspace profile.',
      moduleKey: 'analytics',
      permissions: ['read'],
      order: 10,
      size: 'lg',
      pinned: true,
      data: { kpiIds: kpis.slice(0, 4).map((kpi) => kpi.id) },
    },
    {
      id: 'widget.ai.insights',
      type: 'ai-insights',
      title: 'AI Operating Insights',
      description: 'Recommendations built from modules, goals and business context.',
      moduleKey: 'ai',
      permissions: ['read', 'execute'],
      order: 20,
      size: 'md',
      pinned: true,
      data: {
        insights: [
          'Prioritize ' + profile.businessGoals[0] + ' with automated weekly executive review.',
          'Enable approval-based automations for finance and operations decisions.',
          'Create a unified workspace report across ' + profile.departments.slice(0, 3).join(', ') + '.',
        ],
      },
    },
    {
      id: 'widget.activity.stream',
      type: 'activity',
      title: 'Enterprise Activity Stream',
      description: 'Recent workspace events across users, workflows and AI agents.',
      moduleKey: 'workflows',
      permissions: ['read'],
      order: 30,
      size: 'md',
      data: {
        events: [
          { title: 'Workspace configuration synchronized', description: profile.industry + ' module map refreshed', time: 'Now' },
          { title: 'AI context assembled', description: kpis.length + ' KPIs and ' + enabledModules.length + ' modules available', time: '2 min ago' },
          { title: 'Navigation regenerated', description: 'Permission-aware menu published to the shell', time: '5 min ago' },
        ],
      },
    },
    {
      id: 'widget.notifications',
      type: 'notifications',
      title: 'Notification Center',
      description: 'Approvals, risks and operating alerts for this workspace.',
      moduleKey: 'analytics',
      permissions: ['read'],
      order: 40,
      size: 'sm',
      data: {
        notifications: [
          { label: 'Budget review ready', level: 'warning' },
          { label: 'Pipeline risk decreased', level: 'success' },
          { label: 'AI workflow recommendation available', level: 'info' },
        ],
      },
    },
    {
      id: 'widget.analytics.cross-module',
      type: 'analytics',
      title: 'Cross-Module Analytics',
      description: 'Unified operating signal across revenue, workforce and execution.',
      moduleKey: 'analytics',
      permissions: ['read'],
      order: 50,
      size: 'xl',
      data: {
        metrics: [
          { label: 'Revenue Momentum', value: '78%' },
          { label: 'Workflow Success', value: '94%' },
          { label: 'Team Productivity', value: '87%' },
          { label: 'AI Confidence', value: '91%' },
        ],
      },
    },
  ];

  if (enabledModules.includes('crm')) widgets.push({
    id: 'widget.crm.sales',
    type: 'sales',
    title: 'Sales Pipeline',
    description: 'Revenue stages and conversion focus for the active workspace.',
    moduleKey: 'crm',
    permissions: ['read'],
    order: 60,
    size: 'md',
    data: {
      stages: [
        { label: 'Qualified', value: profile.currency + ' 420K' },
        { label: 'Proposal', value: profile.currency + ' 690K' },
        { label: 'Negotiation', value: profile.currency + ' 310K' },
      ],
    },
  });

  if (enabledModules.includes('finance')) widgets.push({
    id: 'widget.finance.revenue',
    type: 'revenue',
    title: 'Revenue Intelligence',
    description: 'Workspace revenue trend and cash flow posture.',
    moduleKey: 'finance',
    permissions: ['read'],
    order: 70,
    size: 'md',
    data: {
      currency: profile.currency,
      current: profile.currency + ' 286K',
      trend: ['62', '74', '81', '88', '96'],
    },
  });

  if (enabledModules.includes('inventory')) widgets.push({
    id: 'widget.inventory.status',
    type: 'inventory',
    title: 'Inventory Planning',
    description: 'Stock health, replenishment signals and movement visibility.',
    moduleKey: 'inventory',
    permissions: ['read'],
    order: 80,
    size: 'md',
    data: {
      stock: [
        { label: 'Available Stock', value: '82%' },
        { label: 'Safety Stock', value: 'Healthy' },
        { label: 'Replenishment Risk', value: 'Low' },
      ],
    },
  });

  if (enabledModules.includes('projects')) widgets.push({
    id: 'widget.projects.tasks',
    type: 'tasks',
    title: 'Execution Board',
    description: 'Open work, blocked work and high-priority assignments.',
    moduleKey: 'projects',
    permissions: ['read'],
    order: 90,
    size: 'md',
    data: {
      tasks: [
        { label: 'Due This Week', value: '18' },
        { label: 'Blocked', value: '3' },
        { label: 'AI Suggested', value: '7' },
      ],
    },
  });

  widgets.push({
    id: 'widget.calendar.operating',
    type: 'calendar',
    title: 'Operating Calendar',
    description: 'Planning, review and follow-up events for the workspace.',
    moduleKey: enabledModules.includes('hr') ? 'hr' : 'projects',
    permissions: ['read'],
    order: 100,
    size: 'sm',
    data: {
      events: [
        { label: 'Executive review', time: 'Today 3:00 PM' },
        { label: 'Forecast update', time: 'Tomorrow 10:00 AM' },
        { label: 'Automation approvals', time: 'Friday 2:30 PM' },
      ],
    },
  });

  return widgets;
}

function normalizeIndustry(value: string): Industry {
  const normalized = value.toLowerCase();
  if (normalized === 'ecommerce') return 'ecommerce';
  if (normalized === 'retail') return 'retail';
  if (normalized === 'saas') return 'saas';
  if (normalized === 'agency') return 'agency';
  if (normalized === 'manufacturing') return 'manufacturing';
  if (normalized === 'healthcare') return 'healthcare';
  if (normalized === 'education') return 'education';
  if (normalized === 'finance') return 'finance';
  if (normalized === 'logistics') return 'logistics';
  if (normalized === 'consulting') return 'consulting';
  return 'enterprise';
}

function localeFor(language: string) {
  const locales: Record<string, string> = {
    English: 'en-US',
    Spanish: 'es-ES',
    French: 'fr-FR',
    German: 'de-DE',
    Arabic: 'ar-AE',
    Hindi: 'hi-IN',
    Chinese: 'zh-CN',
    Japanese: 'ja-JP',
    Portuguese: 'pt-BR',
  };
  return locales[language] ?? 'en-US';
}

function labelForModule(moduleKey: ModuleKey) {
  const labels: Record<ModuleKey, string> = {
    crm: 'CRM',
    finance: 'Finance',
    hr: 'People',
    inventory: 'Inventory',
    projects: 'Projects',
    tasks: 'Tasks',
    documents: 'Documents',
    analytics: 'Analytics',
    workflows: 'Workflows',
    integrations: 'Integrations',
    ai: 'AI Agents',
    'launch-readiness': 'Launch',
    'production-deployment': 'Production',
    'public-beta': 'Beta',
    'enterprise-trust': 'Trust',
    'ecosystem-marketplace': 'Marketplace',
    'public-launch': 'Public Launch',
    'growth-program': 'Growth',
    'autonomous-enterprise': 'Autonomous AI',
    'enterprise-digital-twin': 'Digital Twin',
    'autonomous-operations': 'Autonomous Ops',
    'enterprise-agi': 'Enterprise AGI',
    settings: 'Settings',
  };
  return labels[moduleKey];
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'workspace';
}
