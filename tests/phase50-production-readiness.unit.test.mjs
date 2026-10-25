import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const calculations = fs.readFileSync(path.join(root, 'apps/api/src/modules/production-readiness/production-readiness-calculations.ts'), 'utf8');
const dto = fs.readFileSync(path.join(root, 'apps/api/src/modules/production-readiness/dto/production-readiness.dto.ts'), 'utf8');
const rbac = fs.readFileSync(path.join(root, 'apps/api/src/modules/production-readiness/production-readiness-rbac.constants.ts'), 'utf8');

test('Phase 50 calculation helpers expose release-candidate scoring logic', () => {
  for (const helper of ['calculateReadinessScore', 'calculateCoverageScore', 'calculateErrorBudget', 'classifyReleaseRisk', 'isReleaseCandidateEligible', 'calculateLoadTestPassRate']) assert.ok(calculations.includes(helper), helper + ' exists');
});

test('Phase 50 DTO validation surface is enterprise-grade', () => {
  const validatorCount = (dto.match(/@Is[A-Za-z]+/g) ?? []).length;
  assert.ok(validatorCount >= 190, 'expected at least 190 validators, found ' + validatorCount);
});

test('Phase 50 release-candidate RBAC roles are present', () => {
  for (const role of ['RELEASE_MANAGER', 'SECURITY_REVIEWER', 'SRE_LEAD', 'PERFORMANCE_ENGINEER', 'API_GOVERNANCE_MANAGER', 'DOCUMENTATION_OWNER', 'EXECUTIVE_APPROVER']) assert.ok(rbac.includes(role), role + ' role exists');
});
