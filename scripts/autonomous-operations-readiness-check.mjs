import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'apps/web/types/autonomous-operations.ts',
  'apps/web/lib/autonomous-operations.ts',
  'apps/web/features/autonomous-operations/autonomous-operations-workspace.tsx',
  'apps/web/app/autonomous-operations/page.tsx',
  'apps/web/app/workspace/autonomous-operations/page.tsx',
  'docs/phase-69-autonomous-execution-report.md',
  'docs/phase-69-self-healing-report.md',
  'docs/phase-69-monitoring-report.md',
  'docs/phase-69-incident-prediction-report.md',
  'docs/phase-69-governance-evolution-report.md',
  'docs/phase-69-compliance-automation-report.md',
  'docs/phase-69-executive-operations-report.md',
  'docs/phase-69-verification-report.md',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error('Missing Phase 69 files:', missing);
  process.exit(1);
}

const lib = fs.readFileSync(path.join(root, 'apps/web/lib/autonomous-operations.ts'), 'utf8');
const markers = [
  'AI Task Coordination',
  'Cross-System Actions',
  'Execution Planning',
  'Approval Workflows',
  'Autonomous Recommendations',
  'Failure Detection',
  'Workflow Recovery',
  'Service Recovery Suggestions',
  'Process Correction Plans',
  'Operational Health Monitoring',
  'Application Health',
  'Business Process Health',
  'AI Agent Health',
  'Workflow Health',
  'Integration Health',
  'Bottlenecks',
  'Failure Patterns',
  'Operational Risks',
  'Productivity Issues',
  'Resource Constraints',
  'Service Failures',
  'Process Failures',
  'SLA Breaches',
  'Customer Impact Risks',
  'AI Policies',
  'AI Audits',
  'AI Compliance',
  'Model Monitoring',
  'Agent Governance',
  'Automated Checks',
  'Audit Preparation',
  'Policy Validation',
  'Governance Reporting',
  'Retry Strategies',
  'Recovery Suggestions',
  'Failure Escalation',
  'Recovery Analytics',
  'Reliability Scores',
  'Recovery Metrics',
  'Incident Trends',
  'Operational Stability',
  'Show operational health',
  'Predict failures',
  'Analyze risks',
  'Recommend recovery actions',
  'Evaluate governance status',
  'Generate executive operations report',
];

const missingMarkers = markers.filter((marker) => !lib.includes(marker));
if (missingMarkers.length > 0) {
  console.error('Missing Phase 69 markers:', missingMarkers);
  process.exit(1);
}

const workspaceConfig = fs.readFileSync(path.join(root, 'apps/web/features/workspace/workspace-config.ts'), 'utf8');
if (!workspaceConfig.includes("key: 'autonomous-operations'")) {
  console.error('Adaptive workspace config does not register autonomous-operations.');
  process.exit(1);
}

console.log('Phase 69 autonomous operations readiness check passed.');
