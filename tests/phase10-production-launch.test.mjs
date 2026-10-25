import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const targetRelease = '2.0.0';
const currentRelease = '1.9.0-src.1';

const requiredFiles = [
  'scripts/production-launch-gate.mjs',
  'docs/frontend-phase-10-production-launch.md',
  'docs/production-launch-report.md',
  'docs/production-deployment-report.md',
  'docs/infrastructure-verification-report.md',
  'docs/production-smoke-test-report.md',
  'docs/production-performance-report.md',
  'docs/production-security-validation-report.md',
  'docs/monitoring-recovery-report.md',
  'docs/production-release-notes.md',
  'docs/portfolio-assets.md',
  'README.md',
  'CHANGELOG.md',
  'docs/roadmap.md',
  'docs/current-status.md',
  'docs/changelog.md',
];

test('Phase 10 production launch files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('Phase 10 keeps v2.0.0 unreleased until launch blockers are cleared', () => {
  const pkg = readJson('package.json');
  const apiPkg = readJson('apps/api/package.json');
  const webPkg = readJson('apps/web/package.json');
  assert.equal(pkg.version, currentRelease);
  assert.equal(apiPkg.version, currentRelease);
  assert.equal(webPkg.version, currentRelease);
  assert.notEqual(pkg.version, targetRelease);
  assert.equal(pkg.scripts['production:launch-gate'], 'node scripts/production-launch-gate.mjs');
});

test('Phase 10 documentation contains every requested report area', () => {
  const report = read('docs/frontend-phase-10-production-launch.md');
  for (const token of ['Production Deployment Report', 'Infrastructure Verification Report', 'Production Smoke Test Report', 'Performance Report', 'Security Validation Report', 'Monitoring & Recovery Report', 'Documentation Summary', 'Portfolio Asset Summary', 'Final Validation Report', 'Release Notes', 'Production Launch Score', 'Go / No-Go Recommendation']) {
    assert.ok(report.includes(token), token + ' exists');
  }
});

test('Production launch gate executes and returns an explicit release decision', () => {
  const result = spawnSync(process.execPath, ['scripts/production-launch-gate.mjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const gate = JSON.parse(result.stdout);
  assert.equal(gate.status, 'completed');
  assert.ok(['GO', 'NO_GO'].includes(gate.decision));
  assert.equal(gate.targetRelease, targetRelease);
  if (gate.decision === 'GO') {
    assert.deepEqual(gate.blockers, []);
  } else {
    assert.ok(gate.blockers.length > 0, 'No-Go decisions must identify blockers');
  }
});

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}
function readJson(relativePath) {
  return JSON.parse(read(relativePath).replace(/^\uFEFF/, ''));
}