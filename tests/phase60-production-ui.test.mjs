import { assertRegisteredWorkspaceModule } from './helpers/web-contracts.mjs';
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('Phase 60 production UI files exist', () => {
  [
    'apps/web/types/production-ui.ts',
    'apps/web/lib/production-ui.ts',
    'apps/web/components/ui/production-states.tsx',
    'apps/web/features/production-ui/production-ui-workspace.tsx',
    'apps/web/app/launch-readiness/page.tsx',
    'apps/web/app/workspace/launch-readiness/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Production UI covers all requested modules', () => {
  const source = read('apps/web/features/production-ui/production-ui-workspace.tsx');
  ['GlobalUxAudit', 'UiConsistencyEngine', 'MobileExperienceOptimization', 'TabletExperienceOptimization', 'AccessibilityEnhancement', 'PerformanceOptimization', 'NavigationRefinement', 'EmptyLoadingStates', 'ErrorHandlingExperience', 'NotificationExperience', 'EnterpriseDemoMode', 'ProductionUiReleaseCandidate'].forEach((name) => {
    assert.match(source, new RegExp(name));
  });
});

test('Release readiness data covers target workspaces and UX standards', () => {
  const source = read('apps/web/lib/production-ui.ts');
  ['CRM', 'HR', 'Finance', 'AI Agents', 'Analytics', 'Command Center', 'Buttons', 'Cards', 'Inputs', 'Small Phones', 'Large Phones', 'Tablets', 'WCAG', 'Keyboard Navigation', 'Screen Reader Support'].forEach((label) => {
    assert.match(source, new RegExp(label));
  });
});

test('Production states provide empty, loading and error experiences', () => {
  const source = read('apps/web/components/ui/production-states.tsx');
  ['PremiumEmptyState', 'PremiumErrorState', 'PremiumLoadingPanel'].forEach((name) => {
    assert.match(source, new RegExp(name));
  });
});

test('Sidebar navigation is route-aware and launch readiness is metadata-driven', () => {
  assertRegisteredWorkspaceModule('launch-readiness', '/launch-readiness', 'Launch RC');
  const sidebar = read('apps/web/components/shell/adaptive-sidebar.tsx');
  assert.match(sidebar, /usePathname/);
  assert.match(sidebar, /pathname === item.route/);
});

test('Production UI routes are physically created', () => {
  [
    'apps/web/app/launch-readiness/ux-audit/page.tsx',
    'apps/web/app/launch-readiness/ui-consistency/page.tsx',
    'apps/web/app/launch-readiness/mobile/page.tsx',
    'apps/web/app/launch-readiness/tablet/page.tsx',
    'apps/web/app/launch-readiness/accessibility/page.tsx',
    'apps/web/app/launch-readiness/performance/page.tsx',
    'apps/web/app/launch-readiness/navigation/page.tsx',
    'apps/web/app/launch-readiness/states/page.tsx',
    'apps/web/app/launch-readiness/errors/page.tsx',
    'apps/web/app/launch-readiness/notifications/page.tsx',
    'apps/web/app/launch-readiness/demo-mode/page.tsx',
    'apps/web/app/launch-readiness/release-candidate/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});
