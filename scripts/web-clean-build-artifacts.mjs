import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const webRoot = path.join(repoRoot, 'apps', 'web');

const targets = [
  path.join(webRoot, '.next'),
  path.join(webRoot, 'tsconfig.tsbuildinfo'),
];

async function removeWithRetry(target, attempts = 5) {
  const resolved = path.resolve(target);
  if (!targets.includes(resolved)) throw new Error('Refusing to remove anything except the exact Next build artifacts in apps/web');
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await fs.rm(target, { recursive: true, force: true, maxRetries: 2, retryDelay: 150 });
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 250));
    }
  }
}

async function removeBackupFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') return;
      await removeBackupFiles(fullPath);
      return;
    }
    if (entry.name.includes('.ux-refinement-') || entry.name.endsWith('.bak')) {
      await removeWithRetry(fullPath);
    }
  }));
}

await Promise.all(targets.map((target) => removeWithRetry(target)));
// Source backup files are preserved. Cleanup is limited to generated build artifacts.

console.log('[NEXORA] Cleaned web build artifacts before production build.');
