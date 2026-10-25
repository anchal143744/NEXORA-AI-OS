import { loadWebModule } from './helpers/web-contracts.mjs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

const requiredFiles = [
  'apps/web/features/onboarding/ai-business-setup-wizard.tsx',
  'apps/web/lib/onboarding-intelligence.ts',
  'apps/web/features/onboarding/onboarding-flow.tsx',
  'apps/web/services/workspace-intelligence-api.ts',
  'apps/web/types/discovery.ts',
  'docs/frontend-phase-3-ai-onboarding.md',
];

test('Phase 3 AI onboarding files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('Phase 3 version baseline remains at or above 1.3.0', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const webPkg = JSON.parse(fs.readFileSync(path.join(root, 'apps/web/package.json'), 'utf8'));
  assert.ok(compareVersions(pkg.version, '1.3.0') >= 0);
  assert.ok(compareVersions(webPkg.version, '1.3.0') >= 0);
});

function compareVersions(a, b) {
  const left = a.split(/[.-]/).map((part) => Number.parseInt(part, 10) || 0);
  const right = b.split(/[.-]/).map((part) => Number.parseInt(part, 10) || 0);
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const difference = (left[index] || 0) - (right[index] || 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

test('Onboarding route uses conversational AI setup instead of legacy setup panels', () => {
  const flow = fs.readFileSync(path.join(root, 'apps/web/features/onboarding/onboarding-flow.tsx'), 'utf8');
  assert.match(flow, /AiBusinessSetupWizard/);
  assert.doesNotMatch(flow, /from '.\/business-setup-wizard'/);
  assert.doesNotMatch(flow, /from '.\/organization-creation'/);
});

test('AI business setup collects the required business profile fields', () => {
  const wizard = fs.readFileSync(path.join(root, 'apps/web/features/onboarding/ai-business-setup-wizard.tsx'), 'utf8');
  for (const label of ['Business Name', 'Founder', 'Business Email', 'Phone', 'Website', 'Country', 'Language', 'Currency', 'Timezone', 'Industry', 'Company Size', 'Employees', 'Tax System', 'Accounting Method', 'Business Goals', 'AI Preferences', 'Future Expansion Plans']) {
    assert.ok(wizard.includes(label), label + ' is present');
  }
});

test('Workspace generation requires organization context and persisted backend identifiers', async () => {
  const blueprint = { workspaceName: 'Synthetic retail', profile: { industry: 'retail' }, modules: [], navigation: [], kpis: [], workflows: [], agents: [], automations: [] };
  let session = {}; let reply = {}; const calls = [];
  const service = loadWebModule('services/workspace-intelligence-api.ts', { '@/lib/api-client': { getStoredAuthSession: () => session, apiRequest: async (endpoint, options) => { calls.push({endpoint,options}); return reply; } } });
  await assert.rejects(service.workspaceIntelligenceApi.generateWorkspace(blueprint), /Organization context is required/);
  assert.equal(calls.length, 0);
  session = { session: { organizationId: 'synthetic-organization' } };
  await assert.rejects(service.workspaceIntelligenceApi.generateWorkspace(blueprint), /workspace ID/);
  reply = { workspaceId: 'synthetic-workspace' };
  await assert.rejects(service.workspaceIntelligenceApi.generateWorkspace(blueprint), /blueprint ID/);
  reply = { workspaceId: 'synthetic-workspace', blueprintId: 'synthetic-blueprint', generatedAt: '2026-10-16T00:00:00Z' };
  const result = await service.workspaceIntelligenceApi.generateWorkspace(blueprint);
  assert.equal(calls.at(-1).endpoint, '/v1/workspaces/generate');
  assert.equal(calls.at(-1).options.body.organizationId, 'synthetic-organization');
  assert.equal(result.workspaceId, reply.workspaceId); assert.equal(result.persisted, true);

});
