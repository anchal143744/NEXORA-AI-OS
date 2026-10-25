import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const release = '1.9.0-src.1';

const requiredFiles = [
  'docker-compose.staging.yml',
  'infra/env/.env.staging.example',
  'ops/staging/staging-demo-data.json',
  'ops/staging/staging-environment-checklist.md',
  'scripts/staging-demo-seed.mjs',
  'scripts/staging-e2e-user-journey.mjs',
  'scripts/staging-load-test.mjs',
  'scripts/staging-release-candidate-audit.mjs',
  'docs/frontend-phase-9-staging-release-candidate.md',
  'docs/staging-deployment-report.md',
  'docs/staging-e2e-qa-report.md',
  'docs/staging-security-report.md',
  'docs/staging-performance-report.md',
  'docs/staging-lighthouse-report.md',
  'docs/staging-load-test-report.md',
  'docs/staging-bug-triage-report.md',
  'docs/staging-release-readiness-report.md',
];

test('SRC files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('SRC version and validation scripts are registered', () => {
  const pkg = readJson('package.json');
  const webPkg = readJson('apps/web/package.json');
  assert.equal(pkg.version, release);
  assert.equal(webPkg.version, release);
  assert.equal(pkg.scripts['web:src'], 'node scripts/staging-release-candidate-audit.mjs');
  assert.equal(pkg.scripts['staging:e2e'], 'node scripts/staging-e2e-user-journey.mjs');
  assert.equal(pkg.scripts['staging:load'], 'node scripts/staging-load-test.mjs');
  assert.equal(pkg.scripts['staging:seed'], 'node scripts/staging-demo-seed.mjs');
});

test('Staging configuration covers production-like services and env', () => {
  const compose = read('docker-compose.staging.yml');
  for (const token of ['nexora-api-staging', 'nexora-web-staging', 'nexora-worker-staging', 'nexora-ai-worker-staging', 'postgres', 'redis', 'minio', 'nginx']) {
    assert.ok(compose.includes(token), token + ' is configured');
  }
  const env = read('infra/env/.env.staging.example');
  for (const token of ['NODE_ENV=staging', 'DATABASE_URL=', 'REDIS_URL=', 'NEXT_PUBLIC_API_URL=', 'CORS_ORIGINS=', 'JWT_ACCESS_SECRET=', 'JWT_REFRESH_SECRET=']) {
    assert.ok(env.includes(token), token + ' exists');
  }
});

test('Representative staging seed fixture covers multiple industries', () => {
  const fixture = readJson('ops/staging/staging-demo-data.json');
  assert.equal(fixture.version, release);
  assert.ok(fixture.organizations.length >= 5);
  const industries = new Set(fixture.organizations.map((organization) => organization.profile.industry));
  for (const industry of ['saas', 'retail', 'manufacturing', 'healthcare', 'agency']) {
    assert.ok(industries.has(industry), industry + ' seed coverage exists');
  }
  for (const organization of fixture.organizations) {
    assert.ok(organization.modules.length >= 4);
    assert.ok(organization.kpis.length >= 4);
    assert.ok(Object.keys(organization.sampleRecords).length >= 4);
  }
});

test('SRC documentation includes all requested release reports', () => {
  const report = read('docs/frontend-phase-9-staging-release-candidate.md');
  for (const token of ['Staging Deployment Report', 'End-to-End QA Report', 'Security Report', 'Performance Report', 'Lighthouse Report', 'Load Test Report', 'Bug Triage Report', 'Validation Summary', 'Release Readiness Score', 'Go / No-Go Recommendation']) {
    assert.ok(report.includes(token), token + ' exists');
  }
});

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}
function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}
