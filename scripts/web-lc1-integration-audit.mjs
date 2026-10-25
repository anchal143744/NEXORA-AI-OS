import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('C:/Users/Acer/OneDrive/Desktop/NEXORA_AI');

const requiredFiles = [
  'apps/web/features/workspace/integrated-module-workspace.tsx',
  'apps/web/app/workspace/inventory/page.tsx',
  'apps/web/app/workspace/projects/page.tsx',
  'apps/web/app/workspace/documents/page.tsx',
  'apps/web/app/workspace/workflows/page.tsx',
  'apps/web/app/workspace/integrations/page.tsx',
  'apps/web/features/settings/unified-settings-workspace.tsx',
  'apps/web/app/settings/page.tsx',
  'apps/web/services/search-service.ts',
  'apps/web/lib/notifications.ts',
  'docs/frontend-phase-7-launch-candidate.md',
  'docs/frontend-lc1-integration-map.md',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) fail('Missing LC1 files', { missing });

const pkg = readJson('package.json');
const webPkg = readJson('apps/web/package.json');
if (compareVersions(pkg.version, '1.7.0-lc.1') < 0 || compareVersions(webPkg.version, '1.7.0-lc.1') < 0) {
  fail('LC1 version mismatch', { root: pkg.version, web: webPkg.version });
}
if (!pkg.scripts?.['web:lc1']) fail('Missing web:lc1 script', {});

assertIncludes('apps/web/services/search-service.ts', ['buildEnterpriseSearchIndex', 'searchWorkspace', 'businessEntityResults', 'recentResults', 'settingsResults']);
assertNotIncludes('apps/web/services/search-service.ts', ['return [];']);
assertIncludes('apps/web/components/search/global-search.tsx', ['searchWorkspace', 'role="search"', 'Search across NEXORA']);
assertIncludes('apps/web/components/command/command-palette.tsx', ['Universal Search', 'searchWorkspace', 'router.push']);
assertIncludes('apps/web/components/shell/notification-center.tsx', ['buildUnifiedNotifications', 'Notification Center', 'Approvals, risks and AI recommendations']);
assertNotIncludes('apps/web/components/shell/notification-center.tsx', ['Frontend build gate passed']);
assertIncludes('apps/web/layouts/enterprise-shell.tsx', ['Breadcrumbs', 'WorkspaceHeader']);
assertIncludes('apps/web/components/shell/top-navigation.tsx', ['/settings', 'Open settings']);
assertIncludes('apps/web/features/workspace/module-registry.ts', ['settings', '/settings']);

const docs = [
  'Navigation Audit',
  'Module Integration Report',
  'AI Integration Summary',
  'Search Architecture',
  'Notification Report',
  'Settings Architecture',
  'Cleanup Report',
  'Launch Candidate Score',
];
assertIncludes('docs/frontend-phase-7-launch-candidate.md', docs);

console.log(JSON.stringify({
  status: 'passed',
  requiredFiles: requiredFiles.length,
  routeChecks: 6,
  integrationChecks: 8,
  scope: 'frontend-launch-candidate-lc1',
}, null, 2));

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
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

function compareVersions(actual, expected) {
  const normalize = (version) => version.split(/[-.]/).map((part) => {
    if (part === 'rc') return -2;
    if (part === 'lc') return -1;
    if (part === 'gm') return 0;
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

function fail(message, details) {
  console.error(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exit(1);
}
