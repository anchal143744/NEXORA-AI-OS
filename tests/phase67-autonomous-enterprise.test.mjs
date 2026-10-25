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

test('Phase 67 autonomous enterprise files exist', () => {
  [
    'apps/web/types/autonomous-enterprise.ts',
    'apps/web/lib/autonomous-enterprise.ts',
    'apps/web/services/autonomous-enterprise-api.ts',
    'apps/web/stores/autonomous-enterprise-store.ts',
    'apps/web/hooks/use-autonomous-enterprise-actions.ts',
    'apps/web/features/autonomous-enterprise/autonomous-enterprise-workspace.tsx',
    'scripts/autonomous-enterprise-readiness-check.mjs',
  ].forEach((file) => assert.equal(fs.existsSync(path.join(root, file)), true, file));
});

test('Autonomous enterprise data covers every requested module', () => {
  const lib = readFile('apps/web/lib/autonomous-enterprise.ts');
  [
    'Autonomous Enterprise Command Center',
    'Advanced Reasoning Engine',
    'Multi-Agent Collaboration Network',
    'AI Executive Advisor',
    'Autonomous Workflow Optimization',
    'Predictive Decision Intelligence',
    'Business Simulation Engine',
    'Goal Driven Enterprise Automation',
    'Self Optimizing Operations Layer',
    'Enterprise Knowledge Reasoning Graph',
    'AI Strategy Planner',
    'Executive Copilot Workspace',
  ].forEach((marker) => assert.equal(lib.includes(marker), true, marker));
});

test('Autonomous enterprise data covers reasoning, advisors, predictions, simulations and copilot commands', () => {
  const lib = readFile('apps/web/lib/autonomous-enterprise.ts');
  [
    'Enterprise Health',
    'Strategic Recommendations',
    'Opportunity Detection',
    'Risk Detection',
    'Autonomous Insights',
    'Chain Of Thought Planning',
    'Multi Step Decision Trees',
    'Scenario Analysis',
    'Strategic Reasoning',
    'Business Logic Reasoning',
    'Agent Communication',
    'Shared Memory',
    'Agent Teams',
    'Task Delegation',
    'Goal Coordination',
    'CEO Advisor',
    'CFO Advisor',
    'COO Advisor',
    'CRO Advisor',
    'CTO Advisor',
    'Bottleneck Detection',
    'Cost Reduction Recommendations',
    'Capacity Requirements',
    'What If Analysis',
    'Goal Assignment',
    'Continuous Improvement',
    'Relationship Discovery',
    'Quarterly Planning',
    'Show business risks',
    'Forecast business performance',
    'Recommend strategic actions',
  ].forEach((marker) => assert.equal(lib.includes(marker), true, marker));
});

test('Phase 67 route files are physically created', () => {
  [
    'apps/web/app/autonomous-enterprise/page.tsx',
    'apps/web/app/autonomous-enterprise/command-center/page.tsx',
    'apps/web/app/autonomous-enterprise/reasoning-engine/page.tsx',
    'apps/web/app/autonomous-enterprise/multi-agent-network/page.tsx',
    'apps/web/app/autonomous-enterprise/executive-advisor/page.tsx',
    'apps/web/app/autonomous-enterprise/workflow-optimization/page.tsx',
    'apps/web/app/autonomous-enterprise/decision-intelligence/page.tsx',
    'apps/web/app/autonomous-enterprise/simulation-engine/page.tsx',
    'apps/web/app/autonomous-enterprise/goal-automation/page.tsx',
    'apps/web/app/autonomous-enterprise/self-optimizing-operations/page.tsx',
    'apps/web/app/autonomous-enterprise/knowledge-reasoning-graph/page.tsx',
    'apps/web/app/autonomous-enterprise/strategy-planner/page.tsx',
    'apps/web/app/autonomous-enterprise/executive-copilot/page.tsx',
    'apps/web/app/workspace/autonomous-enterprise/page.tsx',
  ].forEach((file) => assert.equal(fs.existsSync(path.join(root, file)), true, file));
});

test('Workspace config registers Autonomous AI through adaptive navigation metadata', () => {
  assertRegisteredWorkspaceModule('autonomous-enterprise', '/autonomous-enterprise', 'Autonomous AI');
});

test('Phase 67 package versions are present', () => {
  const rootPackage = JSON.parse(readFile('package.json'));
  const apiPackage = JSON.parse(readFile('apps/api/package.json'));
  const webPackage = JSON.parse(readFile('apps/web/package.json'));
  assertReleaseVersions();


});
