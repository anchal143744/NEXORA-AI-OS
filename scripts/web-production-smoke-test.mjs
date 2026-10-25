import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('.');

const checks = [
  'apps/web/.next/server',
  'apps/web/.next/static',
  'apps/web/app/error.tsx',
  'apps/web/app/global-error.tsx',
  'apps/web/app/loading.tsx',
  'apps/web/app/not-found.tsx',
  'apps/web/components/production/production-shell-states.tsx',
  'apps/web/lib/env.ts',
  'apps/web/lib/frontend-error-handling.ts',
  'docs/frontend-phase-6-production-readiness.md',
  'docs/frontend-deployment-checklist.md',
];

const missing = checks.filter((file) => !existsSync(join(root, file)));
assert.deepEqual(missing, []);

const nextConfig = readFileSync(join(root, 'apps/web/next.config.ts'), 'utf8');
assert.match(nextConfig, /Content-Security-Policy/);
assert.match(nextConfig, /X-Frame-Options/);
assert.match(nextConfig, /optimizePackageImports/);

const providers = readFileSync(join(root, 'apps/web/providers/app-providers.tsx'), 'utf8');
assert.match(providers, /dynamic/);
assert.match(providers, /PersistentAiCopilot/);

const layout = readFileSync(join(root, 'apps/web/app/layout.tsx'), 'utf8');
assert.match(layout, /Skip to main content/);

console.log(JSON.stringify({ status: 'passed', checked: checks.length, scope: 'web-production-readiness' }, null, 2));
