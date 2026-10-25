import { assertRegisteredWorkspaceModule } from './helpers/web-contracts.mjs';
import { assertReleaseVersions } from './helpers/web-contracts.mjs';
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('Phase 62 public beta files exist', () => {
  [
    'apps/web/types/public-beta.ts',
    'apps/web/lib/public-beta.ts',
    'apps/web/services/public-beta-api.ts',
    'apps/web/stores/public-beta-store.ts',
    'apps/web/hooks/use-public-beta-actions.ts',
    'apps/web/features/public-beta/public-beta-workspace.tsx',
    'apps/web/app/public-beta/page.tsx',
    'apps/web/app/workspace/public-beta/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Public Beta workspace covers all requested modules', () => {
  const source = read('apps/web/features/public-beta/public-beta-workspace.tsx');
  [
    'PublicBetaManagement',
    'CustomerOnboardingCenter',
    'GuidedProductTours',
    'FeedbackIntelligencePlatform',
    'CustomerSuccessWorkspace',
    'ProductAdoptionAnalytics',
    'FeatureRequestPortal',
    'InAppFeedbackSystem',
    'NpsCustomerSatisfaction',
    'BetaCommunityHub',
    'GoToMarketReadinessCenter',
    'AiCustomerSuccessCopilot',
  ].forEach((name) => assert.match(source, new RegExp(name)));
});

test('Public Beta data includes onboarding, feedback, adoption and GTM readiness signals', () => {
  const source = read('apps/web/lib/public-beta.ts');
  [
    'under ten minutes',
    'CRM Tour',
    'HR Tour',
    'Finance Tour',
    'AI Agents Tour',
    'Analytics Tour',
    'Feature Requests',
    'Bug Reports',
    'NPS Score',
    'Product positioning',
    'Show onboarding progress',
  ].forEach((token) => assert.match(source, new RegExp(token.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'))));
});

test('Public Beta route files are physically created', () => {
  [
    'apps/web/app/public-beta/beta-management/page.tsx',
    'apps/web/app/public-beta/onboarding/page.tsx',
    'apps/web/app/public-beta/product-tours/page.tsx',
    'apps/web/app/public-beta/feedback-intelligence/page.tsx',
    'apps/web/app/public-beta/customer-success/page.tsx',
    'apps/web/app/public-beta/adoption-analytics/page.tsx',
    'apps/web/app/public-beta/feature-requests/page.tsx',
    'apps/web/app/public-beta/in-app-feedback/page.tsx',
    'apps/web/app/public-beta/nps/page.tsx',
    'apps/web/app/public-beta/community/page.tsx',
    'apps/web/app/public-beta/go-to-market/page.tsx',
    'apps/web/app/public-beta/copilot/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Workspace config registers Public Beta through adaptive navigation metadata', () => {
  assertRegisteredWorkspaceModule('public-beta', '/public-beta', 'Public Beta');
});

test('Phase 62 package versions are present', () => {
  const rootPkg = JSON.parse(read('package.json'));
  const webPkg = JSON.parse(read('apps/web/package.json'));
  const apiPkg = JSON.parse(read('apps/api/package.json'));
  assertReleaseVersions();


});
