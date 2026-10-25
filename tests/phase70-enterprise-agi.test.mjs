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

test('Phase 70 enterprise AGI files exist', () => {
  [
    'apps/web/types/enterprise-agi.ts',
    'apps/web/lib/enterprise-agi.ts',
    'apps/web/services/enterprise-agi-api.ts',
    'apps/web/stores/enterprise-agi-store.ts',
    'apps/web/hooks/use-enterprise-agi-actions.ts',
    'apps/web/features/enterprise-agi/enterprise-agi-workspace.tsx',
    'scripts/enterprise-agi-readiness-check.mjs',
  ].forEach((file) => assert.equal(fs.existsSync(path.join(root, file)), true, file));
});

test('Enterprise AGI data covers every requested module', () => {
  const lib = readFile('apps/web/lib/enterprise-agi.ts');
  [
    'Enterprise AGI Core',
    'Unified Intelligence Fabric',
    'Cross-Module Coordination Engine',
    'Enterprise Knowledge Graph',
    'Autonomous Business Ecosystem',
    'Multi-Agent Command Network',
    'Enterprise Context Engine',
    'Organizational Intelligence Layer',
    'Executive AGI Workspace',
    'Strategic Coordination Hub',
  ].forEach((marker) => assert.equal(lib.includes(marker), true, marker));
});

test('Enterprise AGI data covers requested capabilities and executive commands', () => {
  const lib = readFile('apps/web/lib/enterprise-agi.ts');
  [
    'Enterprise-wide reasoning',
    'Multi-domain intelligence',
    'Strategic planning',
    'Business understanding',
    'Goal orchestration',
    'CRM',
    'Finance',
    'HR',
    'Projects',
    'Inventory',
    'Marketing',
    'Customer Success',
    'Analytics',
    'AI Agents',
    'Workflow synchronization',
    'Shared context',
    'Cross-domain execution',
    'Organizational alignment',
    'Customers',
    'Employees',
    'Vendors',
    'Assets',
    'Revenue',
    'Operations',
    'AI-driven collaboration',
    'Business process orchestration',
    'Organizational intelligence',
    'Enterprise automation',
    'Agent hierarchy',
    'Agent coordination',
    'Agent communication',
    'Shared memory',
    'Collective execution',
    'Organizational memory',
    'Business history',
    'Strategic context',
    'Operational context',
    'Performance',
    'Productivity',
    'Growth',
    'Risk',
    'Opportunities',
    'Show enterprise health',
    'Recommend growth strategy',
    'Optimize organization',
    'Predict future risks',
    'Generate board report',
    'Coordinate business execution',
    'Enterprise objectives',
    'Strategic initiatives',
    'Execution tracking',
  ].forEach((marker) => assert.equal(lib.includes(marker), true, marker));
});

test('Phase 70 route files are physically created', () => {
  [
    'apps/web/app/enterprise-agi/page.tsx',
    'apps/web/app/enterprise-agi/core/page.tsx',
    'apps/web/app/enterprise-agi/intelligence-fabric/page.tsx',
    'apps/web/app/enterprise-agi/cross-module-coordination/page.tsx',
    'apps/web/app/enterprise-agi/knowledge-graph/page.tsx',
    'apps/web/app/enterprise-agi/business-ecosystem/page.tsx',
    'apps/web/app/enterprise-agi/multi-agent-network/page.tsx',
    'apps/web/app/enterprise-agi/context-engine/page.tsx',
    'apps/web/app/enterprise-agi/organizational-intelligence/page.tsx',
    'apps/web/app/enterprise-agi/executive-workspace/page.tsx',
    'apps/web/app/enterprise-agi/strategic-coordination/page.tsx',
    'apps/web/app/workspace/enterprise-agi/page.tsx',
  ].forEach((file) => assert.equal(fs.existsSync(path.join(root, file)), true, file));
});

test('Workspace config registers Enterprise AGI through adaptive navigation metadata', () => {
  assertRegisteredWorkspaceModule('enterprise-agi', '/enterprise-agi', 'Enterprise AGI');
});

test('Phase 70 package versions are present', () => {
  const rootPackage = JSON.parse(readFile('package.json'));
  const apiPackage = JSON.parse(readFile('apps/api/package.json'));
  const webPackage = JSON.parse(readFile('apps/web/package.json'));
  assertReleaseVersions();


});
