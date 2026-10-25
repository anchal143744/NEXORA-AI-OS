import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

const requiredFiles = [
  'apps/web/features/workspace/permission-engine.ts',
  'apps/web/features/workspace/module-registry.ts',
  'apps/web/features/workspace/workspace-config-engine.ts',
  'apps/web/features/workspace/workspace-personalization.ts',
  'apps/web/features/workspace/widget-registry.tsx',
  'apps/web/features/workspace/dashboard-engine.tsx',
  'apps/web/features/workspace/ai-workspace-context.ts',
  'apps/web/features/workspace/dynamic-workspace-engine.tsx',
  'docs/frontend-phase-4-dynamic-workspace-engine.md',
];

test('Phase 4 dynamic workspace files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('Phase 4 version baseline remains at or above 1.4.0', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const webPkg = JSON.parse(fs.readFileSync(path.join(root, 'apps/web/package.json'), 'utf8'));
  assert.ok(compareVersions(pkg.version, '1.4.0') >= 0);
  assert.ok(compareVersions(webPkg.version, '1.4.0') >= 0);
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

test('Command center now uses the dynamic workspace engine', () => {
  const commandCenter = fs.readFileSync(path.join(root, 'apps/web/features/command-center/enterprise-command-center.tsx'), 'utf8');
  assert.match(commandCenter, /DynamicWorkspaceEngine/);
  assert.doesNotMatch(commandCenter, /ExecutiveDashboard/);
  assert.doesNotMatch(commandCenter, /WorkspaceCreationEngine/);
});

test('Module registry exposes metadata, routes, permissions and widgets', () => {
  const registry = fs.readFileSync(path.join(root, 'apps/web/features/workspace/module-registry.ts'), 'utf8');
  for (const token of ['registeredWorkspaceModules', 'moduleRegistry', 'resolveModulesForWorkspace', 'permissions', 'route', 'widgets', 'metadata']) {
    assert.ok(registry.includes(token), token + ' is present');
  }
});

test('Widget registry supports all required dynamic dashboard widget types', () => {
  const widgets = fs.readFileSync(path.join(root, 'apps/web/features/workspace/widget-registry.tsx'), 'utf8');
  for (const token of ['kpi', 'revenue', 'sales', 'inventory', 'tasks', 'calendar', 'activity', 'ai-insights', 'notifications', 'analytics']) {
    assert.ok(widgets.includes(token), token + ' widget is registered');
  }
});

test('Navigation and dashboard rendering share the permission engine', () => {
  const navigation = fs.readFileSync(path.join(root, 'apps/web/features/navigation/navigation-engine.ts'), 'utf8');
  const dashboard = fs.readFileSync(path.join(root, 'apps/web/features/workspace/dashboard-engine.tsx'), 'utf8');
  assert.match(navigation, /filterNavigationByPermissions/);
  assert.match(dashboard, /filterWidgetsByPermissions/);
});

test('AI context includes workspace, tenant, KPIs, filters and permissions', () => {
  const context = fs.readFileSync(path.join(root, 'apps/web/features/workspace/ai-workspace-context.ts'), 'utf8');
  const config = fs.readFileSync(path.join(root, 'apps/web/features/workspace/workspace-config-engine.ts'), 'utf8');
  for (const token of ['tenantId', 'workspaceId', 'kpis', 'selectedFilters', 'permissions']) {
    assert.ok(config.includes(token), token + ' is included in config engine');
  }
  assert.match(context, /buildAiWorkspaceContext/);
});

test('Phase 4 documentation contains the required diagrams and reports', () => {
  const doc = fs.readFileSync(path.join(root, 'docs/frontend-phase-4-dynamic-workspace-engine.md'), 'utf8');
  for (const token of ['Workspace Engine Diagram', 'Dashboard Engine Diagram', 'Navigation Engine Diagram', 'Manual Browser Verification Checklist', 'Product Evolution Report']) {
    assert.ok(doc.includes(token), token + ' is documented');
  }
});
