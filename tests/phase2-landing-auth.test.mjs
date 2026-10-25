import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { loadWebModule } from './helpers/web-contracts.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

const requiredFiles = [
  'apps/web/features/marketing/landing-page.tsx',
  'apps/web/app/page.tsx',
  'apps/web/app/auth/login/page.tsx',
  'apps/web/app/auth/signup/page.tsx',
  'apps/web/app/auth/forgot-password/page.tsx',
  'apps/web/app/auth/reset-password/page.tsx',
  'apps/web/app/auth/verify-email/page.tsx',
  'apps/web/features/auth/forgot-password-form.tsx',
  'apps/web/features/auth/reset-password-form.tsx',
  'apps/web/features/auth/email-verification-panel.tsx',
  'docs/frontend-phase-2-landing-auth.md',
];

test('Phase 2 landing and authentication files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('Phase 2 version remains at or beyond the 1.2.0 landing-auth baseline', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const webPkg = JSON.parse(fs.readFileSync(path.join(root, 'apps/web/package.json'), 'utf8'));
  const [rootMajor, rootMinor] = pkg.version.split('.').map(Number);
  const [webMajor, webMinor] = webPkg.version.split('.').map(Number);
  assert.equal(rootMajor, 1);
  assert.equal(webMajor, 1);
  assert.ok(rootMinor >= 2);
  assert.ok(webMinor >= 2);
});

test('Retail entry point renders the real shop workspace and preserves historical marketing', () => {
  const home = fs.readFileSync(path.join(root, 'apps/web/app/page.tsx'), 'utf8');
  const shop = fs.readFileSync(path.join(root, 'apps/web/features/shop/shop-workspace.tsx'), 'utf8');
  assert.match(home, /ShopWorkspace/); assert.doesNotMatch(home, /EnterpriseCommandCenter/);
  assert.match(shop, /<ShopNavigation/);
  const { shopNavigation } = loadWebModule('features/shop/shop-navigation.tsx', { './shop-auth': {} });
  const entries = shopNavigation.flatMap(section => section.branches.flatMap(branch => branch.entries ?? [branch]));
  for (const view of ['overview', 'customers', 'followups', 'inventory', 'sales', 'expenses', 'reports', 'settings']) assert.ok(entries.some(entry => entry.view === view), `${view} must remain reachable`);
  assert.ok(fs.existsSync(path.join(root, 'apps/web/features/marketing/landing-page.tsx')));

});

test('Authentication client covers production auth entry points', () => {
  const authApi = fs.readFileSync(path.join(root, 'apps/web/services/auth-api.ts'), 'utf8');
  assert.match(authApi, /forgotPassword/);
  assert.match(authApi, /resetPassword/);
  assert.match(authApi, /requestEmailVerification/);
  assert.match(authApi, /verifyEmail/);
  assert.match(authApi, /startOAuth/);
});
