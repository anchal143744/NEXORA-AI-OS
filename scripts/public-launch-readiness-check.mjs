import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'apps/web/types/public-launch.ts',
  'apps/web/lib/public-launch.ts',
  'apps/web/features/public-launch/public-launch-workspace.tsx',
  'apps/web/app/public-launch/page.tsx',
  'apps/web/app/launch/page.tsx',
  'apps/web/app/pricing/page.tsx',
  'apps/web/app/contact-sales/page.tsx',
  'docs/phase-65-public-launch-report.md',
  'docs/nexora-ai-os-v2-release-report.md',
];

const missing = requiredFiles.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error('Missing Phase 65 files:', missing);
  process.exit(1);
}

const lib = readFileSync(join(root, 'apps/web/lib/public-launch.ts'), 'utf8');
const requiredTokens = [
  'Launch Readiness Score',
  'Starter',
  'Growth',
  'Business',
  'Enterprise',
  'AI Enterprise',
  'Instant Workspace Creation',
  'Competitive Differentiation',
  'Trial Activations',
  'ROI Calculators',
  'Contact Sales',
  'Scalability',
  'Expansion Opportunities',
  'Revenue Growth',
  'Customer Sentiment',
  'Show launch readiness',
];

const missingTokens = requiredTokens.filter((token) => !lib.includes(token));
if (missingTokens.length) {
  console.error('Phase 65 readiness tokens missing:', missingTokens);
  process.exit(1);
}

console.log('Phase 65 public launch readiness check passed.');
