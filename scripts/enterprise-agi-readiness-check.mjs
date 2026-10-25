import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'apps/web/types/enterprise-agi.ts',
  'apps/web/lib/enterprise-agi.ts',
  'apps/web/services/enterprise-agi-api.ts',
  'apps/web/stores/enterprise-agi-store.ts',
  'apps/web/hooks/use-enterprise-agi-actions.ts',
  'apps/web/features/enterprise-agi/enterprise-agi-workspace.tsx',
  'apps/web/features/enterprise-agi/enterprise-agi-core.tsx',
  'apps/web/features/enterprise-agi/unified-intelligence-fabric.tsx',
  'apps/web/features/enterprise-agi/cross-module-coordination-engine.tsx',
  'apps/web/features/enterprise-agi/enterprise-knowledge-graph.tsx',
  'apps/web/features/enterprise-agi/autonomous-business-ecosystem.tsx',
  'apps/web/features/enterprise-agi/multi-agent-command-network.tsx',
  'apps/web/features/enterprise-agi/enterprise-context-engine.tsx',
  'apps/web/features/enterprise-agi/organizational-intelligence-layer.tsx',
  'apps/web/features/enterprise-agi/executive-agi-workspace.tsx',
  'apps/web/features/enterprise-agi/strategic-coordination-hub.tsx',
  'apps/web/app/enterprise-agi/page.tsx',
  'apps/web/app/enterprise-agi/core/page.tsx',
  'apps/web/app/enterprise-agi/intelligence-fabric/page.tsx',
  'apps/web/app/enterprise-agi/cross-module-coordination/page.tsx',
  'apps/web/app/enterprise-agi/knowledge-graph/page.tsx',
  'apps/web/app/enterprise-agi/business-ecosystem/page.tsx',
  'apps/web/app/enterprise-agi/multi-agent-network/page.tsx',
  'apps/web/app/enterprise-agi/context-engine/page.tsx',
  'apps/web/app/enterprise-agi/organizational-intelligence/page.tsx',
  'apps/web/app/enterprise-agi/executive-workspace/page.tsx',
  'apps/web/app/enterprise-agi/strategic-coordination/page.tsx',
  'apps/web/app/workspace/enterprise-agi/page.tsx',
  'docs/phase-70-enterprise-agi-report.md',
  'docs/phase-70-verification-report.md',
];

const requiredMarkers = [
  'Enterprise-wide reasoning',
  'Multi-domain intelligence',
  'Strategic planning',
  'Business understanding',
  'Goal orchestration',
  'CRM',
  'Finance',
  'HR',
  'Projects',
  'Inventory',
  'Marketing',
  'Customer Success',
  'Analytics',
  'AI Agents',
  'Workflow synchronization',
  'Shared context',
  'Cross-domain execution',
  'Organizational alignment',
  'Customers',
  'Employees',
  'Vendors',
  'Assets',
  'Revenue',
  'Operations',
  'AI-driven collaboration',
  'Business process orchestration',
  'Organizational intelligence',
  'Enterprise automation',
  'Agent hierarchy',
  'Agent coordination',
  'Agent communication',
  'Shared memory',
  'Collective execution',
  'Organizational memory',
  'Business history',
  'Strategic context',
  'Operational context',
  'Performance',
  'Productivity',
  'Growth',
  'Risk',
  'Opportunities',
  'Show enterprise health',
  'Recommend growth strategy',
  'Optimize organization',
  'Predict future risks',
  'Generate board report',
  'Coordinate business execution',
  'Enterprise objectives',
  'Strategic initiatives',
  'Execution tracking',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
const lib = fs.readFileSync(path.join(root, 'apps/web/lib/enterprise-agi.ts'), 'utf8');
const missingMarkers = requiredMarkers.filter((marker) => !lib.includes(marker));
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const result = {
  phase: 70,
  version: packageJson.version,
  requiredFiles: requiredFiles.length,
  missingFiles: missing,
  requiredMarkers: requiredMarkers.length,
  missingMarkers,
  passed: packageJson.version === '3.0.0' && missing.length === 0 && missingMarkers.length === 0,
};

console.log(JSON.stringify(result, null, 2));

if (!result.passed) {
  process.exitCode = 1;
}
