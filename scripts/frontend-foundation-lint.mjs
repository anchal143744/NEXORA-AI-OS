import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {hasDisallowedSourceMarkers} from './source-markers.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const webRoot = join(root, 'apps', 'web');

const requiredFiles = [
  'components/ui/alert.tsx',
  'components/ui/progress.tsx',
  'components/ui/stepper.tsx',
  'components/ui/empty-state.tsx',
  'components/ui/error-state.tsx',
  'components/ui/index.ts',
  'components/ai/ai-avatar.tsx',
  'components/ai/ai-message.tsx',
  'components/ai/ai-insight-card.tsx',
  'components/ai/ai-recommendation-card.tsx',
  'components/ai/ai-typing-indicator.tsx',
  'components/ai/ai-loading-state.tsx',
  'components/dashboard/kpi-card.tsx',
  'components/dashboard/analytics-card.tsx',
  'components/dashboard/activity-card.tsx',
  'components/dashboard/chart-container.tsx',
  'components/dashboard/task-card.tsx',
  'components/dashboard/calendar-card.tsx',
  'components/navigation/breadcrumbs.tsx',
  'components/navigation/navigation-config.ts',
  'layouts/public-layout.tsx',
  'layouts/auth-layout.tsx',
  'layouts/setup-wizard-layout.tsx',
  'layouts/workspace-layout.tsx',
  'layouts/dashboard-layout.tsx',
  'styles/tokens.ts',
  'lib/design-system.ts',
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(join(webRoot, file))) {
    failures.push({ file: join('apps/web', file), rule: 'required-foundation-file' });
  }
}

for (const file of walk(webRoot)) {
  const relativeFile = relative(root, file).replace(/\\/g, '/');
  if (!/\.(ts|tsx)$/.test(file)) continue;
  if (relativeFile.includes('/node_modules/') || relativeFile.includes('/.next/')) continue;
  const text = readFileSync(file, 'utf8');
  if (hasDisallowedSourceMarkers(text)) {
    failures.push({ file: relativeFile, rule: 'no-todo-fixme-debugger' });
  }
  if (/console\.(log|debug|trace)\(/.test(text)) {
    failures.push({ file: relativeFile, rule: 'no-console-debug' });
  }
}

if (failures.length > 0) {
  console.error(JSON.stringify({ status: 'failed', failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'passed', checked: requiredFiles.length, scope: 'apps/web' }, null, 2));

function walk(dir) {
  const entries = readdirSync(dir).map((entry) => join(dir, entry));
  return entries.flatMap((entry) => statSync(entry).isDirectory() ? walk(entry) : [entry]);
}


