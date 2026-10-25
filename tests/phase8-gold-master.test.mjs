import { hasUnfinishedComment } from '../scripts/release-marker-scan.mjs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

const requiredFiles = [
  'scripts/web-gold-master-audit.mjs',
  'docs/frontend-phase-8-gold-master.md',
  'docs/frontend-gold-master-demo-guide.md',
  'docs/frontend-gold-master-qa-matrix.md',
  'docs/frontend-gold-master-release-notes.md',
  'tests/phase8-gold-master.test.mjs',
  'README.md',
  'CHANGELOG.md',
];

test('Gold Master files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('Gold Master version and validation script are registered', () => {
  const pkg = readJson('package.json');
  const webPkg = readJson('apps/web/package.json');
  const allowedReleases = new Set(['1.8.0-gm.1', '1.9.0-src.1']);
  assert.ok(allowedReleases.has(pkg.version));
  assert.ok(allowedReleases.has(webPkg.version));
  assert.equal(pkg.scripts['web:gm'], 'node scripts/web-gold-master-audit.mjs');
});

test('Gold Master preserves production shell, search, notifications, settings and profile flows', () => {
  assert.match(read('apps/web/app/layout.tsx'), /Skip to main content/);
  assert.match(read('apps/web/components/search/global-search.tsx'), /Search across NEXORA/);
  assert.match(read('apps/web/components/shell/notification-center.tsx'), /buildUnifiedNotifications/);
  assert.match(read('apps/web/features/settings/unified-settings-workspace.tsx'), /One control center for this workspace/);
  assert.match(read('apps/web/components/shell/profile-menu.tsx'), /authApi\.logout/);
  assert.match(read('apps/web/features/ai/persistent-ai-copilot.tsx'), /Persistent AI Copilot/);
});

test('Gold Master production config keeps security and performance controls', () => {
  const nextConfig = read('apps/web/next.config.ts');
  for (const token of ['reactStrictMode', 'typedRoutes', 'compress', 'optimizePackageImports', 'Content-Security-Policy', 'image/avif']) {
    assert.ok(nextConfig.includes(token), token + ' exists');
  }
});

test('Gold Master documentation includes required release reports', () => {
  const report = read('docs/frontend-phase-8-gold-master.md');
  for (const token of ['UX Review Report', 'Pixel Perfect Audit', 'Regression Test Report', 'Performance Benchmark', 'Accessibility Report', 'Cross-Browser Notes', 'Documentation Summary', 'Demo Guide', 'Gold Master Score', 'Final Launch Recommendation']) {
    assert.ok(report.includes(token), token + ' exists');
  }
  assert.match(read('docs/frontend-gold-master-demo-guide.md'), /Happy Path/);
  assert.match(read('docs/frontend-gold-master-qa-matrix.md'), /Regression Matrix/);
  assert.match(read('docs/frontend-gold-master-release-notes.md'), /1\.8\.0-gm\.1/);
});

test('Gold Master source cleanup has no release-blocking markers', () => {
  const findings = scanSourceForReleaseBlockers();
  assert.deepEqual(findings, []);
});

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function scanSourceForReleaseBlockers() {
  const sourceRoots = ['apps/web/app', 'apps/web/components', 'apps/web/features', 'apps/web/layouts', 'apps/web/lib', 'apps/web/providers', 'apps/web/services', 'apps/web/stores', 'apps/web/types'];
  const patterns = [
    { label: 'debug logging', regex: /\bconsole\.(log|debug|warn|error|info|table|trace)\b/ },
    { label: 'debugger statement', regex: /\bdebugger\b/ },
    { label: 'unfinished marker', test: hasUnfinishedComment },
    { label: 'placeholder language', regex: /placeholder-only|mock widget|sample enterprise/i },
  ];
  const findings = [];

  for (const sourceRoot of sourceRoots) {
    const absoluteRoot = path.join(root, sourceRoot);
    if (!fs.existsSync(absoluteRoot)) continue;
    walk(absoluteRoot, (file) => {
      if (!/\.(ts|tsx)$/.test(file)) return;
      const text = fs.readFileSync(file, 'utf8');
      for (const pattern of patterns) {
        if (pattern.test ? pattern.test(text, file) : pattern.regex.test(text)) findings.push({ file: path.relative(root, file), issue: pattern.label });
      }
    });
  }

  return findings;
}

function walk(directory, visit) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath, visit);
    else visit(fullPath);
  }
}
