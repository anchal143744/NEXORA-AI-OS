import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'apps/web/types/enterprise-digital-twin.ts',
  'apps/web/lib/enterprise-digital-twin.ts',
  'apps/web/features/enterprise-digital-twin/enterprise-digital-twin-workspace.tsx',
  'apps/web/app/enterprise-digital-twin/page.tsx',
  'apps/web/app/workspace/enterprise-digital-twin/page.tsx',
  'docs/phase-68-digital-twin-report.md',
  'docs/phase-68-simulation-intelligence-report.md',
  'docs/phase-68-strategic-planning-report.md',
  'docs/phase-68-forecast-report.md',
  'docs/phase-68-risk-simulation-report.md',
  'docs/phase-68-revenue-simulation-report.md',
  'docs/phase-68-executive-strategy-report.md',
  'docs/phase-68-verification-report.md',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error('Missing Phase 68 files:', missing);
  process.exit(1);
}

const lib = fs.readFileSync(path.join(root, 'apps/web/lib/enterprise-digital-twin.ts'), 'utf8');
const markers = [
  'Organization',
  'Workforce',
  'Revenue',
  'Customers',
  'Operations',
  'Projects',
  'Assets',
  'Financial Systems',
  'Growth Scenarios',
  'Revenue Changes',
  'Hiring Plans',
  'Budget Adjustments',
  'Product Launches',
  'Market Expansion',
  'Annual Planning',
  'Quarterly Planning',
  'OKR Planning',
  'Portfolio Planning',
  'Resource Planning',
  'Best Case',
  'Expected Case',
  'Worst Case',
  'Profitability',
  'Customer Growth',
  'Team Expansion',
  'Market Share',
  'Financial Risk',
  'Operational Risk',
  'Compliance Risk',
  'Workforce Risk',
  'Vendor Risk',
  'Teams',
  'Budget',
  'Infrastructure',
  'MRR',
  'ARR',
  'Expansion Revenue',
  'Enterprise Contracts',
  'New Countries',
  'New Regions',
  'New Industries',
  'New Customer Segments',
  'Create strategic plan',
  'Run business simulation',
  'Predict revenue',
  'Evaluate risk',
  'Recommend expansion strategy',
  'Generate board-level insights',
];

const missingMarkers = markers.filter((marker) => !lib.includes(marker));
if (missingMarkers.length > 0) {
  console.error('Missing Phase 68 markers:', missingMarkers);
  process.exit(1);
}

const workspaceConfig = fs.readFileSync(path.join(root, 'apps/web/features/workspace/workspace-config.ts'), 'utf8');
if (!workspaceConfig.includes("key: 'enterprise-digital-twin'")) {
  console.error('Adaptive workspace config does not register enterprise-digital-twin.');
  process.exit(1);
}

console.log('Phase 68 enterprise digital twin readiness check passed.');
