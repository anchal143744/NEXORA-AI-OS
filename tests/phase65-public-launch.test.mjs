import { assertRegisteredWorkspaceModule } from './helpers/web-contracts.mjs';
import { assertReleaseVersions } from './helpers/web-contracts.mjs';
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('Phase 65 public launch files exist', () => {
  [
    'apps/web/types/public-launch.ts',
    'apps/web/lib/public-launch.ts',
    'apps/web/services/public-launch-api.ts',
    'apps/web/stores/public-launch-store.ts',
    'apps/web/hooks/use-public-launch-actions.ts',
    'apps/web/features/public-launch/public-launch-workspace.tsx',
    'apps/web/app/public-launch/page.tsx',
    'apps/web/app/workspace/public-launch/page.tsx',
    'apps/web/app/launch/page.tsx',
    'apps/web/app/contact-sales/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Public Launch workspace covers all requested modules', () => {
  const source = read('apps/web/features/public-launch/public-launch-workspace.tsx');
  [
    'LaunchCommandCenter',
    'PricingPackagingPlatform',
    'EnterpriseTrialExperience',
    'ProductMarketingCenter',
    'CustomerAcquisitionEngine',
    'EnterpriseSalesEnablement',
    'PublicLaunchWebsite',
    'CustomerSuccessLaunchHub',
    'GlobalReadinessValidation',
    'AdoptionIntelligenceCenter',
    'LaunchAnalyticsDashboard',
    'ExecutiveLaunchWarRoom',
    'AiLaunchCopilot',
  ].forEach((name) => assert.match(source, new RegExp(name)));
});

test('Public Launch data covers plans, website pages and AI launch commands', () => {
  const source = read('apps/web/lib/public-launch.ts');
  [
    'Starter',
    'Growth',
    'Business',
    'Enterprise',
    'AI Enterprise',
    'Home',
    'Product',
    'Solutions',
    'Industries',
    'Pricing',
    'Security',
    'Marketplace',
    'Developers',
    'Contact Sales',
    'Show launch readiness',
    'Analyze adoption',
    'Forecast revenue',
    'Show customer growth',
    'Identify launch risks',
    'Recommend next actions',
  ].forEach((token) => assert.ok(source.includes(token), token));
});

test('Phase 65 route files are physically created', () => {
  [
    'apps/web/app/public-launch/launch-command-center/page.tsx',
    'apps/web/app/public-launch/pricing-packaging/page.tsx',
    'apps/web/app/public-launch/enterprise-trial/page.tsx',
    'apps/web/app/public-launch/product-marketing/page.tsx',
    'apps/web/app/public-launch/customer-acquisition/page.tsx',
    'apps/web/app/public-launch/sales-enablement/page.tsx',
    'apps/web/app/public-launch/launch-website/page.tsx',
    'apps/web/app/public-launch/customer-success/page.tsx',
    'apps/web/app/public-launch/global-readiness/page.tsx',
    'apps/web/app/public-launch/adoption-intelligence/page.tsx',
    'apps/web/app/public-launch/launch-analytics/page.tsx',
    'apps/web/app/public-launch/executive-war-room/page.tsx',
    'apps/web/app/public-launch/copilot/page.tsx',
    'apps/web/app/product/page.tsx',
    'apps/web/app/pricing/page.tsx',
    'apps/web/app/marketplace/page.tsx',
    'apps/web/app/developers/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Workspace config registers Public Launch through adaptive navigation metadata', () => {
  assertRegisteredWorkspaceModule('public-launch', '/public-launch', 'Public Launch');
});

test('Phase 65 package versions are present', () => {
  const rootPkg = JSON.parse(read('package.json'));
  const webPkg = JSON.parse(read('apps/web/package.json'));
  const apiPkg = JSON.parse(read('apps/api/package.json'));
  assertReleaseVersions();


});
