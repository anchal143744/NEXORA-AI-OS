import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'apps/web/types/growth-program.ts',
  'apps/web/lib/growth-program.ts',
  'apps/web/features/growth-program/growth-program-workspace.tsx',
  'apps/web/app/growth-program/page.tsx',
  'apps/web/app/workspace/growth-program/page.tsx',
  'docs/phase-66-growth-intelligence-report.md',
  'docs/phase-66-verification-report.md',
];

const missing = requiredFiles.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error('Missing Phase 66 files:', missing);
  process.exit(1);
}

const lib = readFileSync(join(root, 'apps/web/lib/growth-program.ts'), 'utf8');
const requiredTokens = [
  'Active Organizations',
  'Feature Adoption Tracking',
  'Upsell Opportunities',
  'Strategic Accounts',
  'AI Skills Library',
  'Agent-to-Agent Communication',
  'DAU',
  'ARR',
  'Churn Prediction',
  'Multi-Region Support',
  'AI Usage',
  'Show growth trends',
];

const missingTokens = requiredTokens.filter((token) => !lib.includes(token));
if (missingTokens.length) {
  console.error('Phase 66 readiness tokens missing:', missingTokens);
  process.exit(1);
}

console.log('Phase 66 growth program readiness check passed.');
