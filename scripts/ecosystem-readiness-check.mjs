import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'apps/web/types/ecosystem-marketplace.ts',
  'apps/web/lib/ecosystem-marketplace.ts',
  'apps/web/features/ecosystem-marketplace/ecosystem-marketplace-workspace.tsx',
  'apps/web/app/ecosystem-marketplace/page.tsx',
  'apps/web/app/workspace/ecosystem-marketplace/page.tsx',
  'docs/phase-64-marketplace-report.md',
  'docs/phase-64-final-ecosystem-readiness-report.md',
];

const missing = requiredFiles.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error('Missing Phase 64 files:', missing);
  process.exit(1);
}

const lib = readFileSync(join(root, 'apps/web/lib/ecosystem-marketplace.ts'), 'utf8');
const requiredTokens = [
  'Salesforce',
  'HubSpot',
  'SAP',
  'Oracle',
  'Slack',
  'Teams',
  'Zoom',
  'Stripe',
  'AWS',
  'Azure',
  'Google Workspace',
  'Certified App',
  'Certified Integration',
  'Certified Partner',
  'Certified AI Agent',
  'Show top marketplace apps',
];

const missingTokens = requiredTokens.filter((token) => !lib.includes(token));
if (missingTokens.length) {
  console.error('Phase 64 readiness tokens missing:', missingTokens);
  process.exit(1);
}

console.log('Phase 64 ecosystem readiness check passed.');
