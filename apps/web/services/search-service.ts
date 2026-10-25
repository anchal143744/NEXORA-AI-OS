import { buildNavigation } from '@/features/navigation/navigation-engine';
import { defaultWorkspaceConfig } from '@/features/workspace/workspace-config';
import type { WorkspaceConfiguration } from '@/types/workspace';

export const searchDomains = ['modules', 'pages', 'customers', 'projects', 'tasks', 'invoices', 'employees', 'reports', 'ai', 'recent', 'settings'] as const;

export type SearchDomain = (typeof searchDomains)[number];
export type SearchRequest = { query: string; domains?: readonly SearchDomain[] };
export type SearchResult = {
  id: string;
  title: string;
  domain: SearchDomain;
  href: string;
  summary?: string;
  keywords: string[];
  priority: number;
};

export function buildEnterpriseSearchIndex(config: WorkspaceConfiguration = defaultWorkspaceConfig): SearchResult[] {
  const navigationResults = buildNavigation(config).map<SearchResult>((item) => ({
    id: 'module.' + item.key,
    title: item.label,
    domain: 'modules',
    href: item.route,
    summary: 'Open ' + item.label + ' in the adaptive workspace.',
    keywords: [item.key, item.label, item.group, item.moduleKey, item.route],
    priority: 90 - item.order / 10,
  }));

  const kpiResults = config.kpis.map<SearchResult>((kpi) => ({
    id: kpi.id,
    title: kpi.label,
    domain: 'pages',
    href: moduleRoute(config, kpi.moduleKey),
    summary: 'Current value: ' + kpi.value + ' (' + kpi.change + ')',
    keywords: [kpi.label, kpi.value, kpi.change, kpi.moduleKey, 'kpi', 'metric'],
    priority: 78,
  }));

  const reportResults = config.reports.map<SearchResult>((report) => ({
    id: report.id,
    title: report.label,
    domain: 'reports',
    href: '/analytics/reports',
    summary: 'Open ' + report.cadence + ' report for ' + report.moduleKey + '.',
    keywords: [report.label, report.cadence, report.moduleKey, 'report', 'export'],
    priority: 76,
  }));

  const aiResults = config.aiAgents.map<SearchResult>((agent) => ({
    id: agent.id,
    title: agent.label,
    domain: 'ai',
    href: '/ai-agents/copilot',
    summary: agent.status === 'active' ? 'Active AI assistant for this workspace.' : 'Recommended AI assistant for this workspace.',
    keywords: [agent.label, agent.status, agent.moduleKey, 'ai', 'agent', 'copilot'],
    priority: agent.status === 'active' ? 82 : 68,
  }));

  return [
    ...navigationResults,
    ...businessEntityResults(config),
    ...kpiResults,
    ...reportResults,
    ...aiResults,
    ...recentResults(config),
    ...settingsResults(config),
  ].sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title));
}

export function searchWorkspace(request: SearchRequest, config: WorkspaceConfiguration = defaultWorkspaceConfig): SearchResult[] {
  const query = request.query.trim().toLowerCase();
  const domains = new Set(request.domains ?? searchDomains);
  const index = buildEnterpriseSearchIndex(config).filter((result) => domains.has(result.domain));

  if (!query) return index.slice(0, 12);

  return index
    .map((result) => ({ result, score: scoreResult(result, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.result.priority - a.result.priority)
    .map((entry) => entry.result)
    .slice(0, 20);
}

export async function globalSearch(request: SearchRequest, config: WorkspaceConfiguration = defaultWorkspaceConfig): Promise<SearchResult[]> {
  return searchWorkspace(request, config);
}

function scoreResult(result: SearchResult, query: string) {
  const haystack = [result.title, result.summary ?? '', result.domain, ...result.keywords].join(' ').toLowerCase();
  if (result.title.toLowerCase() === query) return 1000 + result.priority;
  if (result.title.toLowerCase().startsWith(query)) return 700 + result.priority;
  if (haystack.includes(query)) return 300 + result.priority;

  const terms = query.split(/\s+/).filter(Boolean);
  const matchedTerms = terms.filter((term) => haystack.includes(term)).length;
  return matchedTerms ? matchedTerms * 100 + result.priority : 0;
}

function businessEntityResults(config: WorkspaceConfiguration): SearchResult[] {
  const currency = config.currency;
  return [
    result('entity.customers', 'Customers', 'customers', '/crm', 'Accounts, contacts, customer health and relationship history.', ['accounts', 'contacts', 'customer health', 'crm'], 74),
    result('entity.leads', 'Leads', 'customers', '/crm/leads', 'Lead scoring, qualification and revenue handoff.', ['lead scoring', 'qualification', 'sales'], 73),
    result('entity.opportunities', 'Opportunities', 'customers', '/crm/opportunities', 'Pipeline stages, deal risk and next actions.', ['pipeline', 'deals', 'forecast'], 73),
    result('entity.invoices', 'Invoices', 'invoices', '/finance/invoices', 'Invoice status, due dates and payment follow-up.', ['billing', 'payments', currency], 73),
    result('entity.employees', 'Employees', 'employees', '/people/employees', 'Directory, skills, documents and AI HR context.', ['people', 'directory', 'skills'], 72),
    result('entity.projects', 'Projects', 'projects', '/workspace/projects', 'Project health, tasks and delivery execution.', ['delivery', 'tasks', 'operations'], 72),
    result('entity.tasks', 'Tasks', 'tasks', '/workspace/projects', 'Assignments, blockers and execution status.', ['assignments', 'blocked', 'due'], 70),
    result('entity.workflows', 'Workflows', 'pages', '/workspace/workflows', 'Workflow health, approvals and automation execution.', ['automation', 'approvals', 'execution'], 72),
    result('entity.notifications', 'Notifications', 'pages', '/launch-readiness/notifications', 'Approvals, risks, reminders and AI recommendations.', ['alerts', 'approvals', 'risks'], 70),
  ];
}

function recentResults(config: WorkspaceConfiguration): SearchResult[] {
  const labels: Record<string, SearchResult> = {
    'workspace.command-center': result('recent.command-center', 'Command Center', 'recent', '/command-center', 'Return to the current operating command center.', ['workspace', 'dashboard', 'home'], 86),
    'report.executive-operating': result('recent.executive-report', 'Executive Operating Report', 'recent', '/analytics/reports', 'Review the weekly executive operating report.', ['executive', 'report', 'analytics'], 84),
    'agent.executive': result('recent.executive-agent', 'Executive Advisor', 'recent', '/ai-agents/copilot', 'Ask the executive AI advisor for risks, opportunities and next actions.', ['ai', 'advisor', 'copilot'], 84),
  };

  return config.personalization.recentItemIds.map((id) => labels[id]).filter(Boolean);
}

function settingsResults(config: WorkspaceConfiguration): SearchResult[] {
  return [
    result('settings.workspace', 'Workspace settings', 'settings', '/settings', 'Manage workspace identity, locale, currency, timezone and enabled capabilities.', [config.workspaceName, config.locale, config.currency, config.timezone], 88),
    result('settings.security', 'Security and access', 'settings', '/settings', 'Review role permissions, protected actions and session guidance.', ['rbac', 'permissions', 'security', config.currentUser.role], 86),
    result('settings.notifications', 'Notification preferences', 'settings', '/settings', 'Tune approvals, risks, reminders and AI recommendation notifications.', ['alerts', 'approvals', 'reminders'], 84),
    result('settings.ai', 'AI preferences', 'settings', '/settings', 'Configure AI context, copilot behavior and agent visibility.', ['ai', 'copilot', 'agents'], 84),
  ];
}

function moduleRoute(config: WorkspaceConfiguration, moduleKey: string) {
  return config.modules.find((module) => module.key === moduleKey)?.route ?? '/command-center';
}

function result(id: string, title: string, domain: SearchDomain, href: string, summary: string, keywords: string[], priority: number): SearchResult {
  return { id, title, domain, href, summary, keywords: [title, domain, ...keywords], priority };
}
