import { assertReleaseVersions } from './helpers/web-contracts.mjs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

const requiredFiles = [
  'apps/web/app/page.tsx',
  'apps/web/app/welcome/page.tsx',
  'apps/web/app/auth/login/page.tsx',
  'apps/web/app/auth/signup/page.tsx',
  'apps/web/app/onboarding/page.tsx',
  'apps/web/app/invite/page.tsx',
  'apps/web/services/auth-api.ts',
  'apps/web/services/onboarding-api.ts',
  'apps/web/stores/auth-store.ts',
  'apps/web/stores/onboarding-store.ts',
  'apps/web/features/welcome/welcome-experience.tsx',
  'apps/web/features/auth/login-form.tsx',
  'apps/web/features/auth/signup-form.tsx',
  'apps/web/features/onboarding/onboarding-flow.tsx',
  'apps/web/features/onboarding/business-setup-wizard.tsx',
  'apps/web/features/onboarding/ai-setup-experience.tsx',
  'apps/web/features/onboarding/workspace-auto-generation.tsx',
  'docs/phase-52-welcome-flow-report.md',
  'docs/phase-52-authentication-report.md',
  'docs/phase-52-onboarding-report.md',
  'docs/phase-52-ux-report.md',
  'docs/phase-52-accessibility-report.md',
  'docs/phase-52-animation-report.md',
];

test('Phase 52 required files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('Phase 52 release manifests remain synchronized', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const webPkg = JSON.parse(fs.readFileSync(path.join(root, 'apps/web/package.json'), 'utf8'));
  assertReleaseVersions();

});

test('Auth API contains enterprise providers and session endpoints', () => {
  const source = fs.readFileSync(path.join(root, 'apps/web/services/auth-api.ts'), 'utf8');
  assert.match(source, /login/);
  assert.match(source, /signup/);
  assert.match(source, /google/);
  assert.match(source, /microsoft/);
  assert.match(source, /sso/);
  assert.match(source, /refresh/);
});

test('Onboarding store covers required flow modules', () => {
  const source = fs.readFileSync(path.join(root, 'apps/web/stores/onboarding-store.ts'), 'utf8');
  for (const step of ['welcome', 'auth', 'organization', 'business', 'ai', 'workspace', 'invite', 'roles', 'finish']) {
    assert.match(source, new RegExp(step));
  }
});
