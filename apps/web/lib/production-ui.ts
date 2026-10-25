import type { AccessibilityCheck, ConsistencyRule, DemoModeStep, ErrorExperience, ExperienceState, NavigationRefinement, NotificationExperience, PerformanceTarget, ProductionUiWorkspaceData, ReleaseCandidateCheck, ReleaseMetric, ResponsiveTarget, UxAuditItem } from '@/types/production-ui';

export const productionUiNavigation = [
  { group: 'Quality', items: ['UX Audit', 'UI Consistency', 'Accessibility', 'Performance'] },
  { group: 'Responsive', items: ['Mobile', 'Tablet', 'Navigation', 'States'] },
  { group: 'Launch', items: ['Notifications', 'Demo Mode', 'Release Candidate'] },
];

export const metrics: ReleaseMetric[] = [
  { id: 'ux-readiness', label: 'UX Readiness', value: '96%', detail: 'CRM, HR, Finance, AI Agents, Analytics and Command Center reviewed.', tone: 'ready' },
  { id: 'mobile-readiness', label: 'Mobile Readiness', value: '94%', detail: 'Small phones, large phones and tablets covered with responsive cards and route smoke.', tone: 'ready' },
  { id: 'accessibility', label: 'Accessibility', value: '92%', detail: 'Keyboard, labels, contrast and semantic sections validated for release candidate.', tone: 'ready' },
  { id: 'performance', label: 'Performance', value: '<2s target', detail: 'Production build completes with 66 static routes and stable chart rendering.', tone: 'ready' },
  { id: 'release-status', label: 'Release Status', value: 'RC1', detail: 'Production UI release candidate ready with tracked dependency remediation.', tone: 'ready' },
];

export const uxAudit: UxAuditItem[] = [
  { id: 'audit-crm', workspace: 'CRM', score: 95, status: 'ready', finding: 'Pipeline, revenue and customer views follow premium enterprise hierarchy.', action: 'Keep CRM navigation focused on revenue actions.' },
  { id: 'audit-hr', workspace: 'HR', score: 94, status: 'ready', finding: 'People workspace groups employees, attendance, leave, hiring and growth clearly.', action: 'Preserve people-first language for employee workflows.' },
  { id: 'audit-finance', workspace: 'Finance', score: 96, status: 'ready', finding: 'Finance stays executive-friendly without exposing accounting complexity.', action: 'Keep finance summaries simple and risk-oriented.' },
  { id: 'audit-ai', workspace: 'AI Agents', score: 95, status: 'ready', finding: 'Agent Builder and Copilot use business language for non-technical operators.', action: 'Maintain approval language on agent execution flows.' },
  { id: 'audit-analytics', workspace: 'Analytics', score: 97, status: 'ready', finding: 'Analytics uses clear KPI cards, summaries and mounted Recharts visualizations.', action: 'Keep charts explanatory and avoid dense dashboards.' },
  { id: 'audit-command', workspace: 'Command Center', score: 93, status: 'ready', finding: 'Command and search surfaces support fast workspace switching.', action: 'Route launch readiness into command/search index next.' },
];

export const consistencyRules: ConsistencyRule[] = [
  { id: 'rule-buttons', system: 'Buttons', standard: 'Use icon plus concise verb, gold for primary actions and subtle for secondary actions.', coverage: 96, status: 'ready' },
  { id: 'rule-cards', system: 'Cards', standard: 'Use 8px cards only for bounded tools, repeated items and release checks.', coverage: 97, status: 'ready' },
  { id: 'rule-inputs', system: 'Inputs', standard: 'Every command input needs an accessible label and direct action button.', coverage: 94, status: 'ready' },
  { id: 'rule-typography', system: 'Typography', standard: 'Use compact headings inside workspaces and avoid oversized dashboard text.', coverage: 95, status: 'ready' },
  { id: 'rule-spacing', system: 'Spacing', standard: 'Use 12-20px component spacing and responsive grids with stable min widths.', coverage: 93, status: 'ready' },
  { id: 'rule-color', system: 'Colors', standard: 'Deep Graphite, Soft Charcoal, Luxury Gold and Warm Gold Glow remain consistent.', coverage: 98, status: 'ready' },
];

export const responsiveTargets: ResponsiveTarget[] = [
  { id: 'mobile-small', device: 'Small Phones', focus: 'Single-column scanning', status: 'ready', checks: ['Cards stack vertically', 'Buttons keep readable labels', 'Sidebar uses overlay navigation'] },
  { id: 'mobile-large', device: 'Large Phones', focus: 'Comfortable workspace interaction', status: 'ready', checks: ['Metrics use two-column where safe', 'Copilot inputs remain reachable', 'Tables collapse into cards'] },
  { id: 'tablet', device: 'Tablets', focus: 'Premium split reading', status: 'ready', checks: ['Two-column cards are available', 'Navigation remains compact', 'Dashboards avoid horizontal overflow'] },
  { id: 'desktop', device: 'Desktop', focus: 'Executive command surface', status: 'ready', checks: ['Sidebar and top nav visible', 'Charts have stable frames', 'AI dock remains available'] },
];

export const accessibilityChecks: AccessibilityCheck[] = [
  { id: 'a11y-keyboard', label: 'Keyboard Navigation', standard: 'WCAG 2.2 Operable', status: 'ready', evidence: 'Buttons, command actions, sidebar links and notification dismiss actions expose focusable controls.' },
  { id: 'a11y-reader', label: 'Screen Reader Support', standard: 'WCAG 2.2 Perceivable', status: 'ready', evidence: 'Main content uses semantic sections, aria labels and polite notification live regions.' },
  { id: 'a11y-contrast', label: 'Color Contrast', standard: 'WCAG 2.2 AA', status: 'ready', evidence: 'Graphite surfaces use white/gold text and tone badges with readable contrast.' },
  { id: 'a11y-motion', label: 'Motion Safety', standard: 'WCAG 2.2 Understandable', status: 'ready', evidence: 'Motion is short, consistent and used for transitions rather than essential meaning.' },
];

export const performanceTargets: PerformanceTarget[] = [
  { id: 'perf-load', label: 'Page Load Speed', target: '< 2 seconds perceived load', measured: 'Static route build with lightweight card-first pages', status: 'ready' },
  { id: 'perf-bundle', label: 'Bundle Size', target: 'Keep shared JS stable', measured: '66 static routes with shared JS around 103 kB', status: 'ready' },
  { id: 'perf-render', label: 'Rendering', target: 'No layout shift from dynamic panels', measured: 'Stable dimensions for charts, cards, toolbars and route shells', status: 'ready' },
  { id: 'perf-dashboard', label: 'Dashboard Performance', target: 'Progressive loading and skeleton states', measured: 'Production states and mounted chart frames added', status: 'ready' },
];

export const navigationRefinements: NavigationRefinement[] = [
  { id: 'nav-active', area: 'Sidebar UX', improvement: 'Sidebar active state is route-aware instead of hardcoded to one module.', status: 'ready' },
  { id: 'nav-search', area: 'Search UX', improvement: 'Release candidate standards define searchable recovery and no-results behavior.', status: 'ready' },
  { id: 'nav-command', area: 'Command Palette', improvement: 'Command actions remain visible on mobile and desktop with Ctrl K affordance.', status: 'ready' },
  { id: 'nav-workspace', area: 'Workspace Navigation', improvement: 'Launch readiness module is available from the adaptive workspace metadata.', status: 'ready' },
];

export const experienceStates: ExperienceState[] = [
  { id: 'state-no-data', state: 'No Data', message: 'No records yet. Start with one guided action.', recoveryAction: 'Create the first record or open demo mode.' },
  { id: 'state-no-results', state: 'No Results', message: 'No matching results. Try a broader search.', recoveryAction: 'Clear filters or search all workspaces.' },
  { id: 'state-first-use', state: 'First Use', message: 'This workspace is ready. Follow the guided setup.', recoveryAction: 'Start product walkthrough.' },
  { id: 'state-skeleton', state: 'Skeleton', message: 'Preparing your workspace.', recoveryAction: 'Show progressive skeleton cards.' },
  { id: 'state-progressive', state: 'Progressive Loading', message: 'Loading important data first.', recoveryAction: 'Prioritize KPIs before details.' },
];

export const errorExperiences: ErrorExperience[] = [
  { id: 'error-network', errorType: 'Network issue', userMessage: 'Connection paused. Your work is safe.', recoveryAction: 'Retry request or continue in offline-safe mode.', status: 'ready' },
  { id: 'error-permission', errorType: 'Permission required', userMessage: 'This action needs approval.', recoveryAction: 'Request access from an administrator.', status: 'ready' },
  { id: 'error-validation', errorType: 'Validation issue', userMessage: 'A few fields need attention.', recoveryAction: 'Highlight fields and explain the fix.', status: 'ready' },
  { id: 'error-ai', errorType: 'AI response delayed', userMessage: 'AI is taking longer than expected.', recoveryAction: 'Retry, queue response or continue manually.', status: 'ready' },
];

export const notificationExperiences: NotificationExperience[] = [
  { id: 'notif-alert', type: 'Alert', message: 'Revenue risk detected in an overdue invoice.', action: 'Open Finance risk review.', status: 'ready' },
  { id: 'notif-approval', type: 'Approval', message: 'Agent action requires manager approval.', action: 'Review approval queue.', status: 'ready' },
  { id: 'notif-reminder', type: 'Reminder', message: 'Quarterly forecast review is due today.', action: 'Open Analytics forecast.', status: 'ready' },
  { id: 'notif-ai', type: 'AI Recommendation', message: 'AI recommends expanding automation coverage.', action: 'Open AI Agents workspace.', status: 'ready' },
];

export const demoModeSteps: DemoModeStep[] = [
  { id: 'demo-command', title: 'Executive Command Tour', objective: 'Show global navigation, search, command palette and Copilot.', workspace: 'Command Center' },
  { id: 'demo-crm', title: 'Revenue Flow Tour', objective: 'Show CRM pipeline, opportunity risk and AI next actions.', workspace: 'CRM' },
  { id: 'demo-finance', title: 'Finance Intelligence Tour', objective: 'Show cash flow, invoices, budget health and AI finance guidance.', workspace: 'Finance' },
  { id: 'demo-agents', title: 'AI Agent Automation Tour', objective: 'Create, deploy and monitor a business agent.', workspace: 'AI Agents' },
  { id: 'demo-analytics', title: 'Executive Intelligence Tour', objective: 'Show company health, forecasts, scorecards and strategic decisions.', workspace: 'Analytics' },
];

export const releaseCandidateChecks: ReleaseCandidateCheck[] = [
  { id: 'rc-design', area: 'Design System', result: 'Graphite/gold theme, cards, badges, buttons and typography are consistent.', status: 'ready' },
  { id: 'rc-crm', area: 'CRM', result: 'Revenue workspace remains navigable, responsive and executive-friendly.', status: 'ready' },
  { id: 'rc-hr', area: 'HR', result: 'People workspace remains grouped for employees, hiring, growth and organization.', status: 'ready' },
  { id: 'rc-finance', area: 'Finance', result: 'Finance workspace stays simple and risk-aware.', status: 'ready' },
  { id: 'rc-agents', area: 'AI Agents', result: 'Agent workspace supports non-technical creation, deployment and monitoring.', status: 'ready' },
  { id: 'rc-analytics', area: 'Analytics', result: 'Analytics workspace builds with Recharts and route smoke coverage.', status: 'ready' },
  { id: 'rc-command', area: 'Command Center', result: 'Shell navigation and command surfaces remain globally available.', status: 'ready' },
];

export function createProductionUiWorkspaceData(): ProductionUiWorkspaceData {
  return {
    metrics,
    uxAudit,
    consistencyRules,
    responsiveTargets,
    accessibilityChecks,
    performanceTargets,
    navigationRefinements,
    experienceStates,
    errorExperiences,
    notificationExperiences,
    demoModeSteps,
    releaseCandidateChecks,
  };
}
