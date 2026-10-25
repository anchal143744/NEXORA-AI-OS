import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

const requiredFiles = [
  'scripts/web-rc1-workflow-audit.mjs',
  'docs/frontend-phase-6-rc1-release-candidate.md',
  'docs/frontend-rc1-workflow-verification.md',
  'apps/web/components/shell/profile-menu.tsx',
  'apps/web/app/layout.tsx',
];

test('RC1 release candidate files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('RC1 version remains at or beyond the 1.6.1 release candidate baseline', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const webPkg = JSON.parse(fs.readFileSync(path.join(root, 'apps/web/package.json'), 'utf8'));
  assert.ok(compareVersions(pkg.version, '1.6.1-rc.1') >= 0, pkg.version);
  assert.ok(compareVersions(webPkg.version, '1.6.1-rc.1') >= 0, webPkg.version);
});

test('Core auth workflow routes and actions are wired', () => {
  const authApi = fs.readFileSync(path.join(root, 'apps/web/services/auth-api.ts'), 'utf8');
  const profileMenu = fs.readFileSync(path.join(root, 'apps/web/components/shell/profile-menu.tsx'), 'utf8');
  for (const token of ['login:', 'signup:', 'logout:', 'forgotPassword:', 'resetPassword:', 'requestEmailVerification:', 'verifyEmail:']) {
    assert.ok(authApi.includes(token), token + ' exists');
  }
  assert.match(profileMenu, /authApi\.logout/);
  assert.match(profileMenu, /clearSession/);
});

test('RC1 removes technical implementation language from primary workspace surfaces', () => {
  const files = [
    'apps/web/components/shell/workspace-header.tsx',
    'apps/web/features/workspace/dynamic-workspace-engine.tsx',
    'apps/web/features/workspace/dashboard-engine.tsx',
    'apps/web/features/auth/signup-form.tsx',
  ];
  const forbidden = ['Premium Frontend Foundation', 'dynamic dashboard engine', 'Generated from workspace configuration', 'Module registry', 'AI context provider', 'Signup Experience'];
  for (const file of files) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    for (const phrase of forbidden) assert.ok(!text.includes(phrase), phrase + ' removed from ' + file);
  }
});

test('RC1 layout includes production viewport and skip navigation', () => {
  const layout = fs.readFileSync(path.join(root, 'apps/web/app/layout.tsx'), 'utf8');
  assert.match(layout, /viewport/);
  assert.match(layout, /viewportFit/);
  assert.match(layout, /Skip to main content/);
});

test('RC1 documentation includes required release reports', () => {
  const report = fs.readFileSync(path.join(root, 'docs/frontend-phase-6-rc1-release-candidate.md'), 'utf8');
  const workflow = fs.readFileSync(path.join(root, 'docs/frontend-rc1-workflow-verification.md'), 'utf8');
  for (const token of ['UX Audit Report', 'End-to-End Workflow Report', 'Performance Report', 'Accessibility Report', 'Security Review', 'Release Candidate Score']) {
    assert.ok(report.includes(token), token + ' exists');
  }
  assert.match(workflow, /Signup/);
  assert.match(workflow, /AI Copilot/);
});

function compareVersions(actual, expected) {
  const normalize = (version) => version.split(/[-.]/).map((part) => {
    if (part === 'rc') return -1;
    if (part === 'lc') return 0;
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
