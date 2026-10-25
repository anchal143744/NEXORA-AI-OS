import { assertReleaseVersions } from './helpers/web-contracts.mjs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

const requiredFiles = [
  'apps/web/types/command-center.ts',
  'apps/web/lib/command-center.ts',
  'apps/web/services/command-center-api.ts',
  'apps/web/stores/command-center-store.ts',
  'apps/web/hooks/use-command-center-actions.ts',
  'apps/web/features/command-center/enterprise-command-center.tsx',
  'apps/web/features/command-center/workspace-creation-engine.tsx',
  'apps/web/features/command-center/ai-command-bar.tsx',
  'apps/web/features/command-center/workspace-launcher.tsx',
  'apps/web/features/command-center/executive-dashboard.tsx',
  'apps/web/features/command-center/smart-kpi-engine.tsx',
  'apps/web/features/command-center/ai-insight-center.tsx',
  'apps/web/features/command-center/command-notification-center.tsx',
  'apps/web/features/command-center/command-global-search.tsx',
  'apps/web/features/command-center/activity-timeline.tsx',
  'apps/web/features/command-center/personal-dashboards.tsx',
  'apps/web/features/command-center/ai-workspace-orchestrator.tsx',
  'apps/web/app/command-center/page.tsx',
  'apps/web/app/workspace-launcher/page.tsx',
  'apps/web/app/executive-dashboard/page.tsx',
  'docs/phase-54-workspace-creation-report.md',
  'docs/phase-54-command-center-report.md',
  'docs/phase-54-dashboard-report.md',
  'docs/phase-54-ai-experience-report.md',
  'docs/phase-54-ux-report.md',
  'docs/phase-54-accessibility-report.md',
];

test('Phase 54 required files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('Phase 54 release manifests remain synchronized', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const webPkg = JSON.parse(fs.readFileSync(path.join(root, 'apps/web/package.json'), 'utf8'));
  assertReleaseVersions();

});

test('Command center engine exports orchestration functions', () => {
  const source = fs.readFileSync(path.join(root, 'apps/web/lib/command-center.ts'), 'utf8');
  for (const symbol of ['createWorkspaceLaunchPlan', 'generateExecutiveKpis', 'generateInsights', 'generateNotifications', 'generateActivityTimeline', 'generatePersonalDashboards', 'runAiCommand']) {
    assert.match(source, new RegExp('function ' + symbol));
  }
});

test('Enterprise command center composes its workspace and dashboard engines', () => {
  const wrapper = fs.readFileSync(path.join(root, 'apps/web/features/command-center/enterprise-command-center.tsx'), 'utf8');
  const engine = fs.readFileSync(path.join(root, 'apps/web/features/workspace/dynamic-workspace-engine.tsx'), 'utf8');
  assert.match(wrapper, /<EnterpriseShell>/); assert.match(wrapper, /<DynamicWorkspaceEngine/);
  assert.match(engine, /<DashboardEngine/); assert.match(engine, /buildNavigation\(workspace\)/);
  assert.match(engine, /workspace\.modules\.filter/);

});
