import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

const requiredFiles = [
  'apps/web/styles/tokens.ts',
  'apps/web/styles/globals.css',
  'apps/web/lib/design-system.ts',
  'apps/web/lib/accessibility.ts',
  'apps/web/components/ui/button.tsx',
  'apps/web/components/ui/input.tsx',
  'apps/web/components/ui/select.tsx',
  'apps/web/components/ui/card.tsx',
  'apps/web/components/ui/modal.tsx',
  'apps/web/components/ui/drawer.tsx',
  'apps/web/components/ui/tabs.tsx',
  'apps/web/components/ui/table.tsx',
  'apps/web/components/ui/toast.tsx',
  'apps/web/components/ui/badge.tsx',
  'apps/web/components/ui/avatar.tsx',
  'apps/web/components/ui/tooltip.tsx',
  'apps/web/components/ui/skeleton.tsx',
  'apps/web/components/ui/loading-states.tsx',
  'apps/web/layouts/enterprise-shell.tsx',
  'apps/web/components/shell/workspace-header.tsx',
  'apps/web/features/design-system/design-system-workspace.tsx',
  'docs/phase-51-design-system-report.md',
  'docs/phase-51-component-library-report.md',
  'docs/phase-51-frontend-architecture-report.md',
  'docs/phase-51-accessibility-report.md',
  'docs/phase-51-theme-report.md',
  'docs/phase-51-animation-report.md',
];

test('Phase 51 required files exist physically', () => {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('Phase 51 version remains at or beyond the 1.1.0 foundation baseline', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const [major, minor] = pkg.version.split('.').map(Number);
  assert.equal(major, 1);
  assert.ok(minor >= 1);
});

test('Design tokens include graphite and gold systems', () => {
  const tokens = fs.readFileSync(path.join(root, 'apps/web/styles/tokens.ts'), 'utf8');
  assert.match(tokens, /graphite/);
  assert.match(tokens, /gold/);
  assert.match(tokens, /Deep Graphite|deep-graphite/);
});

test('Enterprise shell and root providers expose required surfaces', () => {
  const shell = fs.readFileSync(path.join(root, 'apps/web/layouts/enterprise-shell.tsx'), 'utf8');
  const providers = fs.readFileSync(path.join(root, 'apps/web/providers/app-providers.tsx'), 'utf8');
  assert.match(shell, /AdaptiveSidebar/);
  assert.match(shell, /TopNavigation/);
  assert.match(shell, /WorkspaceHeader/);
  assert.match(providers, /PersistentAiCopilot|AiCopilotDock/);
});
