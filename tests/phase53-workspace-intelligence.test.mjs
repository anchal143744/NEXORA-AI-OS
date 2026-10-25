import { assertReleaseVersions } from './helpers/web-contracts.mjs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

const requiredFiles = [
  'apps/web/types/discovery.ts',
  'apps/web/lib/workspace-intelligence.ts',
  'apps/web/services/workspace-intelligence-api.ts',
  'apps/web/stores/discovery-store.ts',
  'apps/web/hooks/use-workspace-intelligence.ts',
  'apps/web/features/discovery/business-discovery-wizard.tsx',
  'apps/web/features/discovery/ai-business-profiling-engine.tsx',
  'apps/web/features/discovery/workspace-blueprint-generator.tsx',
  'apps/web/features/discovery/workspace-recommendation-panel.tsx',
  'apps/web/features/discovery/workspace-preview.tsx',
  'apps/web/features/discovery/one-click-workspace-generation.tsx',
  'apps/web/features/discovery/ai-readiness-scoring.tsx',
  'apps/web/features/discovery/workspace-intelligence-workspace.tsx',
  'apps/web/app/business-discovery/page.tsx',
  'apps/web/app/workspace-intelligence/page.tsx',
  'docs/phase-53-discovery-report.md',
  'docs/phase-53-ai-profiling-report.md',
  'docs/phase-53-workspace-intelligence-report.md',
  'docs/phase-53-ux-report.md',
  'docs/phase-53-accessibility-report.md',
  'docs/phase-53-animation-report.md',
];

test('Phase 53 required files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('Phase 53 release manifests remain synchronized', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const webPkg = JSON.parse(fs.readFileSync(path.join(root, 'apps/web/package.json'), 'utf8'));
  assertReleaseVersions();

});

test('Workspace intelligence engine exports required functions', () => {
  const source = fs.readFileSync(path.join(root, 'apps/web/lib/workspace-intelligence.ts'), 'utf8');
  for (const symbol of ['detectIndustry', 'buildAiBusinessProfile', 'recommendModules', 'recommendAgents', 'recommendAutomations', 'generateWorkspaceBlueprint', 'calculateAiReadinessScore']) {
    assert.match(source, new RegExp('function ' + symbol));
  }
});

test('Discovery store covers required Phase 53 steps', () => {
  const source = fs.readFileSync(path.join(root, 'apps/web/stores/discovery-store.ts'), 'utf8');
  for (const step of ['business', 'industry', 'team', 'software', 'goals', 'intelligence', 'preview', 'generate']) {
    assert.match(source, new RegExp(step));
  }
});
