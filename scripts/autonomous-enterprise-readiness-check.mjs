import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'apps/web/types/autonomous-enterprise.ts',
  'apps/web/lib/autonomous-enterprise.ts',
  'apps/web/features/autonomous-enterprise/autonomous-enterprise-workspace.tsx',
  'apps/web/app/autonomous-enterprise/page.tsx',
  'apps/web/app/workspace/autonomous-enterprise/page.tsx',
  'docs/phase-67-autonomous-ai-report.md',
  'docs/phase-67-executive-advisor-report.md',
  'docs/phase-67-optimization-report.md',
  'docs/phase-67-simulation-report.md',
  'docs/phase-67-strategy-report.md',
  'docs/phase-67-reasoning-report.md',
  'docs/phase-67-verification-report.md',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error('Missing Phase 67 files:', missing);
  process.exit(1);
}

const lib = fs.readFileSync(path.join(root, 'apps/web/lib/autonomous-enterprise.ts'), 'utf8');
const markers = [
  'Enterprise Health',
  'Strategic Recommendations',
  'Opportunity Detection',
  'Risk Detection',
  'Autonomous Insights',
  'Chain Of Thought Planning',
  'Multi Step Decision Trees',
  'Scenario Analysis',
  'Strategic Reasoning',
  'Business Logic Reasoning',
  'Agent Communication',
  'Shared Memory',
  'Agent Teams',
  'Task Delegation',
  'Goal Coordination',
  'CEO Advisor',
  'CFO Advisor',
  'COO Advisor',
  'CRO Advisor',
  'CTO Advisor',
  'Bottleneck Detection',
  'Process Improvement',
  'Automation Suggestions',
  'Cost Reduction Recommendations',
  'Revenue',
  'Churn',
  'Hiring Needs',
  'Capacity Requirements',
  'Operational Risks',
  'What If Analysis',
  'Growth Scenarios',
  'Budget Simulations',
  'Resource Simulations',
  'Risk Simulations',
  'Goal Assignment',
  'Goal Monitoring',
  'Goal Achievement Tracking',
  'Automated Action Plans',
  'Performance Monitoring',
  'Optimization Suggestions',
  'Continuous Improvement',
  'AI Driven Enhancements',
  'Relationship Discovery',
  'Context Awareness',
  'Knowledge Linking',
  'Enterprise Intelligence',
  'Quarterly Planning',
  'Annual Planning',
  'Strategic Roadmaps',
  'Growth Planning',
  'Show business risks',
  'Show growth opportunities',
  'Optimize operations',
  'Generate executive plan',
  'Forecast business performance',
  'Recommend strategic actions',
];

const missingMarkers = markers.filter((marker) => !lib.includes(marker));
if (missingMarkers.length > 0) {
  console.error('Missing Phase 67 markers:', missingMarkers);
  process.exit(1);
}

const workspaceConfig = fs.readFileSync(path.join(root, 'apps/web/features/workspace/workspace-config.ts'), 'utf8');
if (!workspaceConfig.includes("key: 'autonomous-enterprise'")) {
  console.error('Adaptive workspace config does not register autonomous-enterprise.');
  process.exit(1);
}

console.log('Phase 67 autonomous enterprise readiness check passed.');
