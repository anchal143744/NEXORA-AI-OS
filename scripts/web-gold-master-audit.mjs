import { hasUnfinishedComment } from './release-marker-scan.mjs';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('C:/Users/Acer/OneDrive/Desktop/NEXORA_AI');

const requiredFiles = [
  'README.md',
  'CHANGELOG.md',
  'ARCHITECTURE.md',
  'INSTALLATION.md',
  'DEPLOYMENT.md',
  'apps/web/app/layout.tsx',
  'apps/web/app/page.tsx',
  'apps/web/app/auth/login/page.tsx',
  'apps/web/app/auth/signup/page.tsx',
  'apps/web/app/auth/forgot-password/page.tsx',
  'apps/web/app/auth/reset-password/page.tsx',
  'apps/web/app/auth/verify-email/page.tsx',
  'apps/web/app/onboarding/page.tsx',
  'apps/web/app/workspace-launcher/page.tsx',
  'apps/web/app/settings/page.tsx',
  'apps/web/components/search/global-search.tsx',
  'apps/web/components/shell/notification-center.tsx',
  'apps/web/components/shell/profile-menu.tsx',
  'apps/web/features/ai/persistent-ai-copilot.tsx',
  'docs/frontend-phase-8-gold-master.md',
  'docs/frontend-gold-master-demo-guide.md',
  'docs/frontend-gold-master-qa-matrix.md',
  'docs/frontend-gold-master-release-notes.md',
  'tests/phase8-gold-master.test.mjs',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) fail('Missing Gold Master files', { missing });

const pkg = readJson('package.json');
const webPkg = readJson('apps/web/package.json');
const allowedReleases = new Set(['1.8.0-gm.1', '1.9.0-src.1']);
if (!allowedReleases.has(pkg.version) || !allowedReleases.has(webPkg.version)) {
  fail('Gold Master version mismatch', { root: pkg.version, web: webPkg.version, allowed: Array.from(allowedReleases) });
}
if (pkg.scripts?.['web:gm'] !== 'node scripts/web-gold-master-audit.mjs') fail('Missing web:gm script', {});

assertIncludes('apps/web/next.config.ts', ['reactStrictMode', 'typedRoutes', 'compress', 'optimizePackageImports', 'image/avif', 'Content-Security-Policy']);
assertIncludes('apps/web/app/layout.tsx', ['viewport', 'viewportFit', 'Skip to main content']);
assertIncludes('apps/web/components/search/global-search.tsx', ['role="search"', 'Search across NEXORA', 'searchWorkspace']);
assertIncludes('apps/web/components/shell/notification-center.tsx', ['buildUnifiedNotifications', 'Approvals, risks and AI recommendations']);
assertNotIncludes('apps/web/components/shell/notification-center.tsx', ['Frontend build gate passed']);
assertIncludes('apps/web/components/shell/profile-menu.tsx', ['authApi.logout', 'clearSession', 'Sign out']);
assertIncludes('apps/web/features/ai/persistent-ai-copilot.tsx', ['Persistent AI Copilot', 'Open NEXORA AI Copilot']);

const docsTokens = [
  'UX Review Report',
  'Pixel Perfect Audit',
  'Regression Test Report',
  'Performance Benchmark',
  'Accessibility Report',
  'Cross-Browser Notes',
  'Documentation Summary',
  'Demo Guide',
  'Gold Master Score',
  'Final Launch Recommendation',
];
assertIncludes('docs/frontend-phase-8-gold-master.md', docsTokens);
assertIncludes('docs/frontend-gold-master-demo-guide.md', ['Demo Narrative', 'Happy Path', 'Presenter Checklist']);
assertIncludes('docs/frontend-gold-master-qa-matrix.md', ['Regression Matrix', 'Accessibility Matrix', 'Cross-Browser Matrix']);
assertIncludes('docs/frontend-gold-master-release-notes.md', ['Gold Master Release Notes', 'Version', 'Validation']);

const cleanupFindings = scanSourceForReleaseBlockers();
if (cleanupFindings.length) fail('Source cleanup blockers found', { cleanupFindings: cleanupFindings.slice(0, 20) });

console.log(JSON.stringify({
  status: 'passed',
  requiredFiles: requiredFiles.length,
  sourceCleanupFindings: cleanupFindings.length,
  routeFilesChecked: 10,
  release: pkg.version,
  buildManifest: readBuildManifestSummary(),
  scope: 'frontend-gold-master',
}, null, 2));

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assertIncludes(relativePath, tokens) {
  const text = read(relativePath);
  const missingTokens = tokens.filter((token) => !text.includes(token));
  if (missingTokens.length) fail('Missing expected tokens in ' + relativePath, { missingTokens });
}

function assertNotIncludes(relativePath, tokens) {
  const text = read(relativePath);
  const presentTokens = tokens.filter((token) => text.includes(token));
  if (presentTokens.length) fail('Unexpected tokens in ' + relativePath, { presentTokens });
}

function scanSourceForReleaseBlockers() {
  const roots = ['apps/web/app', 'apps/web/components', 'apps/web/features', 'apps/web/layouts', 'apps/web/lib', 'apps/web/providers', 'apps/web/services', 'apps/web/stores', 'apps/web/types'];
  const findings = [];
  const patterns = [
    { label: 'debug logging', regex: /\bconsole\.(log|debug|warn|error|info|table|trace)\b/ },
    { label: 'debugger statement', regex: /\bdebugger\b/ },
    { label: 'unfinished marker', test: hasUnfinishedComment },
    { label: 'placeholder language', regex: /placeholder-only|mock widget|sample enterprise/i },
  ];

  for (const relativeRoot of roots) {
    const absoluteRoot = path.join(root, relativeRoot);
    if (!fs.existsSync(absoluteRoot)) continue;
    walk(absoluteRoot, (file) => {
      if (!/\.(ts|tsx)$/.test(file)) return;
      const text = fs.readFileSync(file, 'utf8');
      for (const pattern of patterns) {
        if (pattern.test ? pattern.test(text, file) : pattern.regex.test(text)) {
          findings.push({ file: path.relative(root, file), issue: pattern.label });
        }
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

function readBuildManifestSummary() {
  const manifestPath = path.join(root, 'apps/web/.next/server/app-paths-manifest.json');
  if (!fs.existsSync(manifestPath)) return { available: false };
  const manifest = readJson('apps/web/.next/server/app-paths-manifest.json');
  return { available: true, appPaths: Object.keys(manifest).length };
}

function fail(message, details) {
  console.error(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exit(1);
}
