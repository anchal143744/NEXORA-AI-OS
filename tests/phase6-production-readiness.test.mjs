import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

const requiredFiles = [
  'apps/web/app/error.tsx',
  'apps/web/app/global-error.tsx',
  'apps/web/app/loading.tsx',
  'apps/web/app/not-found.tsx',
  'apps/web/components/production/production-shell-states.tsx',
  'apps/web/lib/env.ts',
  'apps/web/lib/frontend-error-handling.ts',
  'scripts/web-production-smoke-test.mjs',
  'docs/frontend-phase-6-production-readiness.md',
  'docs/frontend-deployment-checklist.md',
];

test('Phase 6 production readiness files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('Phase 6 version baseline remains at or above 1.6.0', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const webPkg = JSON.parse(fs.readFileSync(path.join(root, 'apps/web/package.json'), 'utf8'));
  assert.ok(compareVersions(pkg.version, '1.6.0') >= 0);
  assert.ok(compareVersions(webPkg.version, '1.6.0') >= 0);
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

test('Next config includes security headers and performance optimizations', () => {
  const config = fs.readFileSync(path.join(root, 'apps/web/next.config.ts'), 'utf8');
  for (const token of ['Content-Security-Policy', 'X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'optimizePackageImports', 'compress']) {
    assert.ok(config.includes(token), token + ' is configured');
  }
});

test('App-level resilience exposes retry, accessible loading and missing-page boundaries', () => {
  const error = fs.readFileSync(path.join(root, 'apps/web/app/error.tsx'), 'utf8');
  const loading = fs.readFileSync(path.join(root, 'apps/web/app/loading.tsx'), 'utf8');
  assert.match(error, /onClick={reset}/); assert.match(error, /Try again/);
  assert.match(loading, /aria-busy="true"/); assert.match(loading, /aria-label=/);
  assert.match(fs.readFileSync(path.join(root, 'apps/web/app/global-error.tsx'), 'utf8'), /ProductionErrorScreen/);
  assert.match(fs.readFileSync(path.join(root, 'apps/web/app/not-found.tsx'), 'utf8'), /ProductionNotFoundScreen/);

});

test('Root layout includes production metadata and skip navigation', () => {
  const layout = fs.readFileSync(path.join(root, 'apps/web/app/layout.tsx'), 'utf8');
  assert.match(layout, /metadataBase/);
  assert.match(layout, /Skip to main content/);
});

test('Heavy global surfaces are lazy loaded', () => {
  const providers = fs.readFileSync(path.join(root, 'apps/web/providers/app-providers.tsx'), 'utf8');
  const topNavigation = fs.readFileSync(path.join(root, 'apps/web/components/shell/top-navigation.tsx'), 'utf8');
  assert.match(providers, /dynamic/);
  assert.match(providers, /ssr: false/);
  assert.match(topNavigation, /dynamic/);
});

test('Deployment documentation includes release checklist and readiness score', () => {
  const doc = fs.readFileSync(path.join(root, 'docs/frontend-phase-6-production-readiness.md'), 'utf8');
  const checklist = fs.readFileSync(path.join(root, 'docs/frontend-deployment-checklist.md'), 'utf8');
  for (const token of ['Performance Report', 'Accessibility Report', 'Security Review', 'Release Readiness Score']) {
    assert.ok(doc.includes(token), token + ' is documented');
  }
  assert.match(checklist, /Production Deployment Checklist/);
});
