import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

const requiredFiles = [
  'apps/web/features/workspace/integrated-module-workspace.tsx',
  'apps/web/app/workspace/inventory/page.tsx',
  'apps/web/app/workspace/projects/page.tsx',
  'apps/web/app/workspace/documents/page.tsx',
  'apps/web/app/workspace/workflows/page.tsx',
  'apps/web/app/workspace/integrations/page.tsx',
  'apps/web/features/settings/unified-settings-workspace.tsx',
  'apps/web/app/settings/page.tsx',
  'apps/web/services/search-service.ts',
  'apps/web/lib/notifications.ts',
  'scripts/web-lc1-integration-audit.mjs',
  'docs/frontend-phase-7-launch-candidate.md',
  'docs/frontend-lc1-integration-map.md',
];

test('LC1 files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('LC1 version remains at or beyond the 1.7.0 launch candidate baseline', () => {
  const pkg = readJson('package.json');
  const webPkg = readJson('apps/web/package.json');
  assert.ok(compareVersions(pkg.version, '1.7.0-lc.1') >= 0, pkg.version);
  assert.ok(compareVersions(webPkg.version, '1.7.0-lc.1') >= 0, webPkg.version);
  assert.equal(pkg.scripts['web:lc1'], 'node scripts/web-lc1-integration-audit.mjs');
});

test('Metadata-driven workspace navigation resolves to physical routes', () => {
  for (const route of ['inventory', 'projects', 'documents', 'workflows', 'integrations']) {
    const page = read('apps/web/app/workspace/' + route + '/page.tsx');
    assert.match(page, /IntegratedModuleWorkspace/);
  }
  const moduleWorkspace = read('apps/web/features/workspace/integrated-module-workspace.tsx');
  assert.match(moduleWorkspace, /workspace\.widgets/);
  assert.match(moduleWorkspace, /workspace\.reports/);
  assert.match(moduleWorkspace, /workspace\.aiAgents/);
});

test('Universal search is connected to workspace navigation, entities, recent items and settings', () => {
  const searchService = read('apps/web/services/search-service.ts');
  const globalSearch = read('apps/web/components/search/global-search.tsx');
  const commandPalette = read('apps/web/components/command/command-palette.tsx');
  assert.match(searchService, /buildEnterpriseSearchIndex/);
  assert.match(searchService, /businessEntityResults/);
  assert.match(searchService, /recentResults/);
  assert.match(searchService, /settingsResults/);
  assert.ok(!searchService.includes('return [];'));
  assert.match(globalSearch, /searchWorkspace/);
  assert.match(commandPalette, /Universal Search/);
});

test('Unified notifications and settings consume workspace context', () => {
  const notificationModel = read('apps/web/lib/notifications.ts');
  const notificationCenter = read('apps/web/components/shell/notification-center.tsx');
  const settings = read('apps/web/features/settings/unified-settings-workspace.tsx');
  assert.match(notificationModel, /WorkspaceConfiguration/);
  assert.match(notificationCenter, /buildUnifiedNotifications/);
  assert.ok(!notificationCenter.includes('Frontend build gate passed'));
  assert.match(settings, /useWorkspace/);
  assert.match(settings, /buildUnifiedNotifications/);
});

test('LC1 shell includes breadcrumbs, settings shortcut and permission-aware sidebar', () => {
  const shell = read('apps/web/layouts/enterprise-shell.tsx');
  const topNav = read('apps/web/components/shell/top-navigation.tsx');
  const sidebar = read('apps/web/components/shell/adaptive-sidebar.tsx');
  assert.match(shell, /Breadcrumbs/);
  assert.match(topNav, /Open settings/);
  assert.match(sidebar, /aria-current/);
});

test('LC1 documentation includes required deliverables', () => {
  const report = read('docs/frontend-phase-7-launch-candidate.md');
  for (const token of ['Navigation Audit', 'Module Integration Report', 'AI Integration Summary', 'Search Architecture', 'Notification Report', 'Settings Architecture', 'Cleanup Report', 'Validation Report', 'Launch Candidate Score', 'Next Phase Plan']) {
    assert.ok(report.includes(token), token + ' exists');
  }
});

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function compareVersions(actual, expected) {
  const normalize = (version) => version.split(/[-.]/).map((part) => {
    if (part === 'rc') return -2;
    if (part === 'lc') return -1;
    if (part === 'gm') return 0;
    return Number.parseInt(part, 10) || 0;
  });
  const left = normalize(actual);
  const right = normalize(expected);
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const diff = (left[index] ?? 0) - (right[index] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
