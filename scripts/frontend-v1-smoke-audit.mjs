import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('.');

const v1Routes = [
  ['/', 'apps/web/app/page.tsx'],
  ['/auth/login', 'apps/web/app/auth/login/page.tsx'],
  ['/auth/signup', 'apps/web/app/auth/signup/page.tsx'],
  ['/onboarding', 'apps/web/app/onboarding/page.tsx'],
  ['/dashboard', 'apps/web/app/dashboard/page.tsx'],
  ['/crm', 'apps/web/app/crm/page.tsx'],
  ['/finance', 'apps/web/app/finance/page.tsx'],
  ['/people', 'apps/web/app/people/page.tsx'],
  ['/hr', 'apps/web/app/hr/page.tsx'],
  ['/projects', 'apps/web/app/projects/page.tsx'],
  ['/analytics', 'apps/web/app/analytics/page.tsx'],
  ['/ai', 'apps/web/app/ai/page.tsx'],
  ['/settings', 'apps/web/app/settings/page.tsx'],
];

const missingRoutes = v1Routes
  .filter(([, file]) => !existsSync(join(root, file)))
  .map(([route, file]) => ({ route, file }));
assert.deepEqual(missingRoutes, [], 'Every V1 route must have a Next.js page file.');

const nextConfig = read('apps/web/next.config.ts');
assert.match(nextConfig, /source: publicApiBasePath \+ '\/:path\*'/, 'Next.js must proxy browser API requests through /api/*.');
assert.match(nextConfig, /destination: internalApiBaseUrl \+ '\/:path\*'/, 'Next.js API rewrite must target the internal backend API URL.');

const apiClient = read('apps/web/lib/api-client.ts');
assert.match(apiClient, /const apiBaseUrl = publicRuntimeEnv\.apiBaseUrl/, 'API client must use public runtime API base configuration.');
assert.doesNotMatch(apiClient, /localhost:4000/, 'Browser API client must not hardcode the backend port.');
assert.equal([...apiClient.matchAll(/function normalizeApiEndpoint/g)].length, 1, 'API endpoint normalization must have exactly one implementation.');

const moduleRegistry = read('apps/web/features/workspace/module-registry.ts');
assert.match(moduleRegistry, /createModule\('projects', 'Projects', '\/projects'/, 'Projects V1 navigation must point to /projects.');
assert.match(moduleRegistry, /createModule\('ai', 'AI Agents', '\/ai'/, 'AI V1 navigation must point to /ai.');
assert.doesNotMatch(moduleRegistry, /NEXT_PUBLIC_NEXORA_SHOW_V2_MODULES === 'true'[\s\S]*v1NavigationModuleKeys\.has\(module\.key\)[\s\S]*\/workspace\/projects/, 'V1 registry must not route Projects through /workspace/projects.');

const onboarding = read('apps/web/features/onboarding/ai-business-setup-wizard.tsx');
assert.match(onboarding, /router\.push\('\/dashboard'/, 'Successful onboarding must redirect to the V1 dashboard.');
assert.doesNotMatch(onboarding, /router\.push\('\/command-center'/, 'Successful onboarding must not redirect to command-center.');

const onboardingApi = read('apps/web/services/onboarding-api.ts');
assert.match(onboardingApi, /\/v1\/tenants\/businesses/, 'Business profile persistence must use the backend tenant business API.');
assert.match(onboardingApi, /\/v1\/workspaces\/generate/, 'Workspace generation must use the backend adaptive workspace API.');
assert.doesNotMatch(onboardingApi, /apiRequest<any/, 'Onboarding API calls must use explicit backend response types.');
assert.doesNotMatch(onboardingApi, /workspace-generated|pending-api-workspace|saved: true \}\)/, 'Onboarding must not return fake successful workspace or business profile responses.');

const legacyWorkspaceGeneration = read('apps/web/features/onboarding/workspace-auto-generation.tsx');
assert.doesNotMatch(legacyWorkspaceGeneration, /fallbackResult|pending-api-workspace|onSettled/, 'Legacy workspace generation must not advance after API failures.');

const financeHooks = read('apps/web/hooks/use-finance-workspace-actions.ts');
assert.doesNotMatch(financeHooks, /createFinanceWorkspaceData|runAiFinanceCommand/, 'Finance V1 hooks must not fake API failures with local data.');
assert.match(financeHooks, /financeWorkspaceApi\.getWorkspace/, 'Finance V1 hooks must load the backend workspace API.');

const peopleHooks = read('apps/web/hooks/use-people-workspace-actions.ts');
assert.doesNotMatch(peopleHooks, /createPeopleWorkspaceData|runAiHrCommand/, 'People V1 hooks must not fake API failures with local data.');
assert.match(peopleHooks, /peopleWorkspaceApi\.getWorkspace/, 'People V1 hooks must load the backend workspace API.');

const financeStore = read('apps/web/stores/finance-workspace-store.ts');
assert.doesNotMatch(financeStore, /createFinanceMetrics|createAnalytics|createExecutiveSignals|createFinanceInsights/, 'Finance V1 store must not regenerate local static metrics after backend mutations.');

const peopleStore = read('apps/web/stores/people-workspace-store.ts');
assert.doesNotMatch(peopleStore, /createPeopleMetrics|createWorkforceMetrics|createHrInsights/, 'People V1 store must not regenerate local static metrics after backend mutations.');

const financeApi = read('apps/web/services/finance-workspace-api.ts');
assert.doesNotMatch(financeApi, /exportInvoicePdf|approveBudget/, 'Finance V1 API client must not expose endpoints that are not implemented by the backend.');

const projectsPage = read('apps/web/app/projects/page.tsx');
assert.match(projectsPage, /ProjectsWorkspace/, 'Projects V1 route must render the API-backed Projects workspace.');
const projectsApi = read('apps/web/services/projects-workspace-api.ts');
assert.match(projectsApi, /\/v1\/projects/, 'Projects V1 API client must call the backend Projects endpoints.');

const analyticsPage = read('apps/web/app/analytics/page.tsx');
assert.match(analyticsPage, /V1AnalyticsWorkspace/, 'Analytics V1 route must render the backend-backed analytics summary.');
const analyticsSummaryApi = read('apps/web/services/analytics-summary-api.ts');
assert.match(analyticsSummaryApi, /\/v1\/analytics\/summary/, 'Analytics V1 must call the backend summary endpoint.');

const aiService = read('apps/web/features/ai/ai-copilot-service.ts');
assert.doesNotMatch(aiService, /createCopilotAnswer|createExecutiveBriefing/, 'AI V1 service must not fake backend failures with local answers.');
assert.match(aiService, /\/v1\/ai\/chat/, 'AI V1 service must call the backend chat endpoint.');
assert.match(aiService, /message: request\.prompt/, 'AI V1 service must map frontend prompt to backend message contract.');

const aiPage = read('apps/web/app/ai/page.tsx');
assert.match(aiPage, /V1AiWorkspace/, 'AI V1 route must render the backend-backed AI workspace.');
const aiV1Api = read('apps/web/services/ai-v1-api.ts');
assert.match(aiV1Api, /\/v1\/ai\/providers/, 'AI V1 route must load backend provider status.');

const settingsPage = read('apps/web/app/settings/page.tsx');
assert.match(settingsPage, /V1SettingsWorkspace/, 'Settings V1 route must render the account-backed settings workspace.');
const accountProfileHook = read('apps/web/hooks/use-account-profile.ts');
assert.match(accountProfileHook, /authApi\.me/, 'Settings V1 must load the authenticated backend profile.');

const releaseReport = 'NEXORA_FRONTEND_RELEASE_REPORT.md';
const v1ReleaseReport = 'NEXORA_FRONTEND_V1_RELEASE_REPORT.md';
const routeMatrix = 'NEXORA_FRONTEND_ROUTE_MATRIX.md';
assert.equal(existsSync(join(root, releaseReport)), true, 'Frontend release report must exist.');
assert.equal(existsSync(join(root, v1ReleaseReport)), true, 'Frontend V1 release report must exist.');
assert.equal(existsSync(join(root, routeMatrix)), true, 'Frontend route matrix must exist.');

console.log(JSON.stringify({
  status: 'passed',
  scope: 'frontend-v1',
  routesChecked: v1Routes.length,
  checks: [
    'v1-route-files',
    'single-origin-api-proxy',
    'api-client-normalization',
    'v1-navigation-boundary',
    'onboarding-dashboard-redirect',
    'onboarding-real-business-profile-api',
    'onboarding-real-workspace-generation-api',
    'onboarding-no-generated-id-fallback',
    'finance-no-fake-fallback',
    'people-no-fake-fallback',
    'finance-no-static-metric-recompute',
    'people-no-static-metric-recompute',
    'projects-api-backed-route',
    'analytics-api-backed-route',
    'ai-no-fake-fallback',
    'ai-provider-status',
    'settings-account-profile',
    'release-documents',
  ],
}, null, 2));

function read(file) {
  return readFileSync(join(root, file), 'utf8');
}
