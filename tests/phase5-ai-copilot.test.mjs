import { loadWebModule } from './helpers/web-contracts.mjs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

const requiredFiles = [
  'apps/web/types/ai-copilot.ts',
  'apps/web/features/ai/ai-context-engine.ts',
  'apps/web/features/ai/ai-command-registry.ts',
  'apps/web/features/ai/ai-copilot-service.ts',
  'apps/web/features/ai/executive-briefing.tsx',
  'apps/web/features/ai/ai-recommendations.tsx',
  'apps/web/features/ai/persistent-ai-copilot.tsx',
  'docs/frontend-phase-5-ai-copilot.md',
];

test('Phase 5 AI copilot files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('Phase 5 version baseline remains at or above 1.5.0', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const webPkg = JSON.parse(fs.readFileSync(path.join(root, 'apps/web/package.json'), 'utf8'));
  assert.ok(compareVersions(pkg.version, '1.5.0') >= 0);
  assert.ok(compareVersions(webPkg.version, '1.5.0') >= 0);
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

test('Persistent AI copilot is mounted from the root app providers', () => {
  const providers = fs.readFileSync(path.join(root, 'apps/web/providers/app-providers.tsx'), 'utf8');
  assert.match(providers, /PersistentAiCopilot/);
  assert.match(providers, /AiProvider/);
});

test('AI provider owns history, briefing, recommendations and ask flow', () => {
  const provider = fs.readFileSync(path.join(root, 'apps/web/providers/ai-provider.tsx'), 'utf8');
  for (const token of ['conversationStorageKey', 'messages', 'recommendations', 'briefing', 'askCopilot', 'refreshExecutiveBriefing']) {
    assert.ok(provider.includes(token), token + ' exists');
  }
});

test('AI service propagates backend failure instead of inventing fallback results', async () => {
  const service = loadWebModule('features/ai/ai-copilot-service.ts', { '@/lib/api-client': { apiRequest: async () => { throw new Error('Synthetic unavailable provider'); } } });
  const request = { prompt: 'Synthetic question', history: [], context: { workspaceId: 'synthetic', currentUser: { role: 'Owner' }, locale: 'en-IN' } };
  await assert.rejects(service.sendCopilotPrompt(request), /Synthetic unavailable provider/);

});

test('AI command registry supports required natural-language commands', () => {
  const registry = fs.readFileSync(path.join(root, 'apps/web/features/ai/ai-command-registry.ts'), 'utf8');
  for (const command of ['create crm workflow', 'hire employee', 'generate quarterly report', 'forecast revenue', 'create automation']) {
    assert.ok(registry.includes(command), command + ' command exists');
  }
  assert.match(registry, /canAccessWorkspaceResource/);
});

test('Command palette is smart and connected to AI copilot actions', () => {
  const palette = fs.readFileSync(path.join(root, 'apps/web/components/command/command-palette.tsx'), 'utf8');
  assert.match(palette, /getSmartCommandItems/);
  assert.match(palette, /askCopilot/);
  assert.match(palette, /setCopilotOpen/);
});

test('Phase 5 documentation contains architecture, diagrams and browser checklist', () => {
  const doc = fs.readFileSync(path.join(root, 'docs/frontend-phase-5-ai-copilot.md'), 'utf8');
  for (const token of ['AI Architecture Summary', 'Context Flow Diagram', 'Copilot Component Structure', 'Manual Browser Verification Checklist', 'Product Evolution Report']) {
    assert.ok(doc.includes(token), token + ' is documented');
  }
});
