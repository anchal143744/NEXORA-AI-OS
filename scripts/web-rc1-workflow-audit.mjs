import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('C:/Users/Acer/OneDrive/Desktop/NEXORA_AI');

const requiredRoutes = [
  'apps/web/app/auth/signup/page.tsx',
  'apps/web/app/auth/login/page.tsx',
  'apps/web/app/auth/forgot-password/page.tsx',
  'apps/web/app/auth/reset-password/page.tsx',
  'apps/web/app/auth/verify-email/page.tsx',
  'apps/web/app/onboarding/page.tsx',
  'apps/web/app/workspace-launcher/page.tsx',
  'apps/web/app/command-center/page.tsx',
  'apps/web/app/error.tsx',
  'apps/web/app/loading.tsx',
  'apps/web/app/not-found.tsx',
];

const missingRoutes = requiredRoutes.filter((file) => !existsSync(join(root, file)));
assert.deepEqual(missingRoutes, []);

const authApi = readFileSync(join(root, 'apps/web/services/auth-api.ts'), 'utf8');
for (const token of ['login:', 'signup:', 'logout:', 'forgotPassword:', 'resetPassword:', 'requestEmailVerification:', 'verifyEmail:', 'startOAuth:']) {
  assert.ok(authApi.includes(token), token + ' is wired');
}

const profileMenu = readFileSync(join(root, 'apps/web/components/shell/profile-menu.tsx'), 'utf8');
assert.match(profileMenu, /authApi\.logout/);
assert.match(profileMenu, /clearSession/);
assert.match(profileMenu, /Sign out/);

const appProviders = readFileSync(join(root, 'apps/web/providers/app-providers.tsx'), 'utf8');
assert.match(appProviders, /PersistentAiCopilot/);

const commandPalette = readFileSync(join(root, 'apps/web/components/command/command-palette.tsx'), 'utf8');
assert.match(commandPalette, /getSmartCommandItems/);
assert.match(commandPalette, /askCopilot/);

const businessCopyFiles = [
  'apps/web/components/shell/workspace-header.tsx',
  'apps/web/components/shell/adaptive-sidebar.tsx',
  'apps/web/features/workspace/dynamic-workspace-engine.tsx',
  'apps/web/features/workspace/dashboard-engine.tsx',
  'apps/web/features/auth/auth-layout.tsx',
  'apps/web/features/auth/signup-form.tsx',
];

const forbiddenPhrases = [
  'Premium Frontend Foundation',
  'dynamic dashboard engine',
  'Generated from workspace configuration',
  'Module registry',
  'AI context provider',
  'Signup Experience',
  'Create enterprise tenant',
];

const copyIssues = [];
for (const file of businessCopyFiles) {
  const text = readFileSync(join(root, file), 'utf8');
  for (const phrase of forbiddenPhrases) {
    if (text.includes(phrase)) copyIssues.push({ file, phrase });
  }
}
assert.deepEqual(copyIssues, []);

const docs = [
  'docs/frontend-phase-6-rc1-release-candidate.md',
  'docs/frontend-rc1-workflow-verification.md',
];
const missingDocs = docs.filter((file) => !existsSync(join(root, file)));
assert.deepEqual(missingDocs, []);

console.log(JSON.stringify({
  status: 'passed',
  routeChecks: requiredRoutes.length,
  authChecks: 8,
  copyFiles: businessCopyFiles.length,
  docs: docs.length,
  scope: 'rc1-workflow-readiness',
}, null, 2));
