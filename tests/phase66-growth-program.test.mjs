import { assertRegisteredWorkspaceModule } from './helpers/web-contracts.mjs';
import { assertReleaseVersions } from './helpers/web-contracts.mjs';
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('Phase 66 growth program files exist', () => {
  [
    'apps/web/types/growth-program.ts',
    'apps/web/lib/growth-program.ts',
    'apps/web/services/growth-program-api.ts',
    'apps/web/stores/growth-program-store.ts',
    'apps/web/hooks/use-growth-program-actions.ts',
    'apps/web/features/growth-program/growth-program-workspace.tsx',
    'apps/web/app/growth-program/page.tsx',
    'apps/web/app/workspace/growth-program/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Growth Program workspace covers all requested modules', () => {
  const source = read('apps/web/features/growth-program/growth-program-workspace.tsx');
  [
    'GrowthCommandCenter',
    'ProductAdoptionIntelligence',
    'CustomerExpansionEngine',
    'EnterpriseAccountManagement',
    'AiExpansionPlatform',
    'MultiAgentIntelligenceNetwork',
    'UsageAnalyticsCenter',
    'RevenueExpansionIntelligence',
    'CustomerRetentionCenter',
    'GlobalScaleReadiness',
    'EnterpriseSuccessDashboard',
    'ExecutiveGrowthIntelligence',
  ].forEach((name) => assert.match(source, new RegExp(name)));
});

test('Growth Program data covers metrics, AI expansion, global scale and executive commands', () => {
  const source = read('apps/web/lib/growth-program.ts');
  [
    'Active Organizations',
    'Active Users',
    'Revenue Growth',
    'Expansion Revenue',
    'Churn Risk',
    'Feature Adoption Tracking',
    'Time To Value Analysis',
    'Upsell Opportunities',
    'Cross-Sell Opportunities',
    'Strategic Accounts',
    'AI Skills Library',
    'Agent-to-Agent Communication',
    'DAU',
    'WAU',
    'MAU',
    'ARR',
    'Customer Lifetime Value',
    'Churn Prediction',
    'Multi-Region Support',
    'Localization Readiness',
    'Currency Support',
    'Time Zone Support',
    'Show growth trends',
    'Identify expansion opportunities',
    'Predict churn',
    'Forecast ARR',
    'Recommend growth actions',
    'Show enterprise health',
  ].forEach((token) => assert.ok(source.includes(token), token));
});

test('Phase 66 route files are physically created', () => {
  [
    'apps/web/app/growth-program/growth-command-center/page.tsx',
    'apps/web/app/growth-program/product-adoption/page.tsx',
    'apps/web/app/growth-program/customer-expansion/page.tsx',
    'apps/web/app/growth-program/account-management/page.tsx',
    'apps/web/app/growth-program/ai-expansion/page.tsx',
    'apps/web/app/growth-program/multi-agent-network/page.tsx',
    'apps/web/app/growth-program/usage-analytics/page.tsx',
    'apps/web/app/growth-program/revenue-expansion/page.tsx',
    'apps/web/app/growth-program/customer-retention/page.tsx',
    'apps/web/app/growth-program/global-scale/page.tsx',
    'apps/web/app/growth-program/enterprise-success/page.tsx',
    'apps/web/app/growth-program/executive-growth/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Workspace config registers Growth Program through adaptive navigation metadata', () => {
  assertRegisteredWorkspaceModule('growth-program', '/growth-program', 'Growth Program');
});

test('Phase 66 package versions are present', () => {
  const rootPkg = JSON.parse(read('package.json'));
  const webPkg = JSON.parse(read('apps/web/package.json'));
  const apiPkg = JSON.parse(read('apps/api/package.json'));
  assertReleaseVersions();


});
