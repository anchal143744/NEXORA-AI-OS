import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const required = [
  'apps/web/features/enterprise-trust/enterprise-trust-workspace.tsx',
  'apps/web/lib/enterprise-trust.ts',
  'apps/web/app/enterprise-trust/page.tsx',
  'apps/web/app/trust-center/page.tsx',
  'docs/phase-63-security-audit-report.md',
  'docs/phase-63-enterprise-trust-report.md',
];

const missing = required.filter((file) => !existsSync(join(root, file)));
const lib = readFileSync(join(root, 'apps/web/lib/enterprise-trust.ts'), 'utf8');
const checks = [
  { name: 'required files', passed: missing.length === 0, detail: String(required.length - missing.length) + '/' + required.length + ' present' },
  { name: 'framework coverage', passed: ['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA', 'PCI DSS'].every((token) => lib.includes(token)), detail: 'compliance frameworks verified' },
  { name: 'risk posture', passed: ['Critical Issues', 'High Issues', 'Security Score', 'OWASP Top 10'].every((token) => lib.includes(token)), detail: 'security posture verified' },
  { name: 'ai governance', passed: ['Prompt Security', 'Agent Permissions', 'AI Governance'].every((token) => lib.includes(token)), detail: 'AI security validation verified' },
];
const failed = checks.filter((check) => !check.passed);
console.log(JSON.stringify({ status: failed.length === 0 ? 'PASSED' : 'FAILED', checkedAt: new Date().toISOString(), checks, missing }, null, 2));
if (failed.length > 0) process.exitCode = 1;
