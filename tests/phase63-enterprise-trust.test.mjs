import { assertRegisteredWorkspaceModule } from './helpers/web-contracts.mjs';
import { assertReleaseVersions } from './helpers/web-contracts.mjs';
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('Phase 63 enterprise trust files exist', () => {
  [
    'apps/web/types/enterprise-trust.ts',
    'apps/web/lib/enterprise-trust.ts',
    'apps/web/services/enterprise-trust-api.ts',
    'apps/web/stores/enterprise-trust-store.ts',
    'apps/web/hooks/use-enterprise-trust-actions.ts',
    'apps/web/features/enterprise-trust/enterprise-trust-workspace.tsx',
    'apps/web/app/enterprise-trust/page.tsx',
    'apps/web/app/trust-center/page.tsx',
    'apps/web/app/workspace/enterprise-trust/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Enterprise Trust workspace covers all requested modules', () => {
  const source = read('apps/web/features/enterprise-trust/enterprise-trust-workspace.tsx');
  [
    'SecurityAuditCenter',
    'VulnerabilityManagement',
    'SecurityOperationsDashboard',
    'ComplianceManagement',
    'TrustCenter',
    'PrivacyManagement',
    'DataProtectionFramework',
    'RiskManagement',
    'IncidentResponseCenter',
    'ComplianceEvidenceRepository',
    'VendorSecurityManagement',
    'AiSecurityGovernanceValidation',
  ].forEach((name) => assert.match(source, new RegExp(name)));
});

test('Enterprise Trust data covers security, compliance, privacy and AI governance', () => {
  const source = read('apps/web/lib/enterprise-trust.ts');
  [
    'Security Score',
    'Critical Issues',
    'High Issues',
    'OWASP Top 10',
    'SOC 2',
    'ISO 27001',
    'GDPR',
    'HIPAA',
    'PCI DSS',
    'Privacy Commitments',
    'Encryption Validation',
    'Incident Tracking',
    'Vendor Risk Reviews',
    'Prompt Security',
    'Agent Permissions',
  ].forEach((token) => assert.match(source, new RegExp(token.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'))));
});

test('Enterprise Trust route files are physically created', () => {
  [
    'apps/web/app/enterprise-trust/security-audit/page.tsx',
    'apps/web/app/enterprise-trust/vulnerabilities/page.tsx',
    'apps/web/app/enterprise-trust/security-operations/page.tsx',
    'apps/web/app/enterprise-trust/compliance/page.tsx',
    'apps/web/app/enterprise-trust/trust-center/page.tsx',
    'apps/web/app/enterprise-trust/privacy/page.tsx',
    'apps/web/app/enterprise-trust/data-protection/page.tsx',
    'apps/web/app/enterprise-trust/risk-management/page.tsx',
    'apps/web/app/enterprise-trust/incidents/page.tsx',
    'apps/web/app/enterprise-trust/evidence/page.tsx',
    'apps/web/app/enterprise-trust/vendor-security/page.tsx',
    'apps/web/app/enterprise-trust/ai-security/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Workspace config registers Enterprise Trust through adaptive navigation metadata', () => {
  assertRegisteredWorkspaceModule('enterprise-trust', '/enterprise-trust', 'Trust Program');
});

test('Phase 63 package versions are present', () => {
  const rootPkg = JSON.parse(read('package.json'));
  const webPkg = JSON.parse(read('apps/web/package.json'));
  const apiPkg = JSON.parse(read('apps/api/package.json'));
  assertReleaseVersions();


});
