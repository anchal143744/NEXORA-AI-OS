import { assertRegisteredWorkspaceModule } from './helpers/web-contracts.mjs';
import { assertReleaseVersions } from './helpers/web-contracts.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();

function readFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('Phase 68 enterprise digital twin files exist', () => {
  [
    'apps/web/types/enterprise-digital-twin.ts',
    'apps/web/lib/enterprise-digital-twin.ts',
    'apps/web/services/enterprise-digital-twin-api.ts',
    'apps/web/stores/enterprise-digital-twin-store.ts',
    'apps/web/hooks/use-enterprise-digital-twin-actions.ts',
    'apps/web/features/enterprise-digital-twin/enterprise-digital-twin-workspace.tsx',
    'scripts/enterprise-digital-twin-readiness-check.mjs',
  ].forEach((file) => assert.equal(fs.existsSync(path.join(root, file)), true, file));
});

test('Digital twin data covers every requested module', () => {
  const lib = readFile('apps/web/lib/enterprise-digital-twin.ts');
  [
    'Enterprise Digital Twin Engine',
    'Business Simulation Center',
    'Strategic Planning Workspace',
    'Scenario Intelligence Engine',
    'Forecast Simulation Platform',
    'Risk Simulation Center',
    'Resource Allocation Simulator',
    'Revenue Simulation Engine',
    'Market Expansion Simulator',
    'Executive Strategy Copilot',
  ].forEach((marker) => assert.equal(lib.includes(marker), true, marker));
});

test('Digital twin data covers entities, simulations, forecasts, risks and copilot commands', () => {
  const lib = readFile('apps/web/lib/enterprise-digital-twin.ts');
  [
    'Organization',
    'Workforce',
    'Revenue',
    'Customers',
    'Operations',
    'Projects',
    'Assets',
    'Financial Systems',
    'Growth Scenarios',
    'Revenue Changes',
    'Hiring Plans',
    'Budget Adjustments',
    'Product Launches',
    'Market Expansion',
    'Annual Planning',
    'Quarterly Planning',
    'OKR Planning',
    'Best Case',
    'Expected Case',
    'Worst Case',
    'Profitability',
    'Customer Growth',
    'Team Expansion',
    'Market Share',
    'Financial Risk',
    'Operational Risk',
    'Compliance Risk',
    'Workforce Risk',
    'Vendor Risk',
    'Teams',
    'Budget',
    'Infrastructure',
    'MRR',
    'ARR',
    'Expansion Revenue',
    'Enterprise Contracts',
    'New Countries',
    'New Regions',
    'New Industries',
    'New Customer Segments',
    'Create strategic plan',
    'Generate board-level insights',
  ].forEach((marker) => assert.equal(lib.includes(marker), true, marker));
});

test('Phase 68 route files are physically created', () => {
  [
    'apps/web/app/enterprise-digital-twin/page.tsx',
    'apps/web/app/enterprise-digital-twin/digital-twin-engine/page.tsx',
    'apps/web/app/enterprise-digital-twin/business-simulation/page.tsx',
    'apps/web/app/enterprise-digital-twin/strategic-planning/page.tsx',
    'apps/web/app/enterprise-digital-twin/scenario-intelligence/page.tsx',
    'apps/web/app/enterprise-digital-twin/forecast-simulation/page.tsx',
    'apps/web/app/enterprise-digital-twin/risk-simulation/page.tsx',
    'apps/web/app/enterprise-digital-twin/resource-allocation/page.tsx',
    'apps/web/app/enterprise-digital-twin/revenue-simulation/page.tsx',
    'apps/web/app/enterprise-digital-twin/market-expansion/page.tsx',
    'apps/web/app/enterprise-digital-twin/executive-strategy-copilot/page.tsx',
    'apps/web/app/workspace/enterprise-digital-twin/page.tsx',
  ].forEach((file) => assert.equal(fs.existsSync(path.join(root, file)), true, file));
});

test('Workspace config registers Enterprise Digital Twin through adaptive navigation metadata', () => {
  assertRegisteredWorkspaceModule('enterprise-digital-twin', '/enterprise-digital-twin', 'Digital Twin');
});

test('Phase 68 package versions are present', () => {
  const rootPackage = JSON.parse(readFile('package.json'));
  const apiPackage = JSON.parse(readFile('apps/api/package.json'));
  const webPackage = JSON.parse(readFile('apps/web/package.json'));
  assertReleaseVersions();


});
