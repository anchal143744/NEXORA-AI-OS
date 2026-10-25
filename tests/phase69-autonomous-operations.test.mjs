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

test('Phase 69 autonomous operations files exist', () => {
  [
    'apps/web/types/autonomous-operations.ts',
    'apps/web/lib/autonomous-operations.ts',
    'apps/web/services/autonomous-operations-api.ts',
    'apps/web/stores/autonomous-operations-store.ts',
    'apps/web/hooks/use-autonomous-operations-actions.ts',
    'apps/web/features/autonomous-operations/autonomous-operations-workspace.tsx',
    'scripts/autonomous-operations-readiness-check.mjs',
  ].forEach((file) => assert.equal(fs.existsSync(path.join(root, file)), true, file));
});

test('Autonomous operations data covers every requested module', () => {
  const lib = readFile('apps/web/lib/autonomous-operations.ts');
  [
    'Autonomous Execution Center',
    'Self-Healing Operations Engine',
    'Enterprise Monitoring Hub',
    'Operational Intelligence Center',
    'Incident Prediction Engine',
    'AI Governance Evolution Platform',
    'Compliance Automation Center',
    'Autonomous Workflow Recovery',
    'Enterprise Resilience Dashboard',
    'Executive Operations Copilot',
  ].forEach((marker) => assert.equal(lib.includes(marker), true, marker));
});

test('Autonomous operations data covers execution, healing, monitoring, governance and copilot commands', () => {
  const lib = readFile('apps/web/lib/autonomous-operations.ts');
  [
    'AI Task Coordination',
    'Cross-System Actions',
    'Execution Planning',
    'Approval Workflows',
    'Autonomous Recommendations',
    'Failure Detection',
    'Workflow Recovery',
    'Service Recovery Suggestions',
    'Process Correction Plans',
    'Operational Health Monitoring',
    'Application Health',
    'Business Process Health',
    'AI Agent Health',
    'Workflow Health',
    'Integration Health',
    'Bottlenecks',
    'Failure Patterns',
    'Operational Risks',
    'Productivity Issues',
    'Resource Constraints',
    'Service Failures',
    'Process Failures',
    'SLA Breaches',
    'Customer Impact Risks',
    'AI Policies',
    'AI Audits',
    'AI Compliance',
    'Model Monitoring',
    'Agent Governance',
    'Automated Checks',
    'Audit Preparation',
    'Policy Validation',
    'Governance Reporting',
    'Retry Strategies',
    'Recovery Suggestions',
    'Failure Escalation',
    'Recovery Analytics',
    'Reliability Scores',
    'Show operational health',
    'Generate executive operations report',
  ].forEach((marker) => assert.equal(lib.includes(marker), true, marker));
});

test('Phase 69 route files are physically created', () => {
  [
    'apps/web/app/autonomous-operations/page.tsx',
    'apps/web/app/autonomous-operations/execution-center/page.tsx',
    'apps/web/app/autonomous-operations/self-healing/page.tsx',
    'apps/web/app/autonomous-operations/monitoring-hub/page.tsx',
    'apps/web/app/autonomous-operations/operational-intelligence/page.tsx',
    'apps/web/app/autonomous-operations/incident-prediction/page.tsx',
    'apps/web/app/autonomous-operations/ai-governance-evolution/page.tsx',
    'apps/web/app/autonomous-operations/compliance-automation/page.tsx',
    'apps/web/app/autonomous-operations/workflow-recovery/page.tsx',
    'apps/web/app/autonomous-operations/resilience-dashboard/page.tsx',
    'apps/web/app/autonomous-operations/executive-copilot/page.tsx',
    'apps/web/app/workspace/autonomous-operations/page.tsx',
  ].forEach((file) => assert.equal(fs.existsSync(path.join(root, file)), true, file));
});

test('Workspace config registers Autonomous Operations through adaptive navigation metadata', () => {
  assertRegisteredWorkspaceModule('autonomous-operations', '/autonomous-operations', 'Autonomous Ops');
});

test('Phase 69 package versions are present', () => {
  const rootPackage = JSON.parse(readFile('package.json'));
  const apiPackage = JSON.parse(readFile('apps/api/package.json'));
  const webPackage = JSON.parse(readFile('apps/web/package.json'));
  assertReleaseVersions();


});
