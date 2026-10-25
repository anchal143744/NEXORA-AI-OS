import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const sourceRoots = ['apps/api/src'];
const violations = [];
const allowedConsoleFiles = new Set(['apps/api/src/modules/operations/observability/logging.service.ts']);

for (const sourceRoot of sourceRoots) await scan(join(root, sourceRoot));

if (violations.length) {
  console.error(JSON.stringify({ status: 'failed', violations }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: 'passed', checked: sourceRoots, rules: ['no-console-outside-structured-logger', 'no-todo-placeholders'] }, null, 2));

async function scan(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { await scan(path); continue; }
    if (!entry.name.endsWith('.ts')) continue;
    const relative = path.replace(`${root}\\`, '').replaceAll('\\', '/');
    const text = await readFile(path, 'utf8');
    if (!allowedConsoleFiles.has(relative) && /console\.(log|warn|error|info|debug)/.test(text)) violations.push({ file: relative, rule: 'no-console-outside-structured-logger' });
    if (/TODO_PLACEHOLDER|mock service|fake placeholder/i.test(text)) violations.push({ file: relative, rule: 'no-placeholder-code' });
  }
}