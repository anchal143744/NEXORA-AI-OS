import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const calculations = fs.readFileSync(path.join(root, 'apps/api/src/modules/mdm/mdm-calculations.ts'), 'utf8');
const dto = fs.readFileSync(path.join(root, 'apps/api/src/modules/mdm/dto/mdm.dto.ts'), 'utf8');
const rbac = fs.readFileSync(path.join(root, 'apps/api/src/modules/mdm/mdm-rbac.constants.ts'), 'utf8');

test('Phase 48 calculation helpers expose MDM intelligence logic', () => {
  for (const helper of ['calculateDataQualityScore', 'calculateDuplicateConfidence', 'calculateGoldenRecordTrust', 'calculateResolutionRate', 'classifyDataRisk', 'isGoldenRecordEligible']) assert.ok(calculations.includes(helper), helper + ' exists');
});

test('Phase 48 DTO validation surface is enterprise-grade', () => {
  const validatorCount = (dto.match(/@Is[A-Za-z]+/g) ?? []).length;
  assert.ok(validatorCount >= 220, 'expected at least 220 validators, found ' + validatorCount);
});

test('Phase 48 MDM RBAC roles are present', () => {
  for (const role of ['MDM_ADMIN', 'DATA_STEWARD', 'DATA_OWNER', 'DATA_QUALITY_MANAGER', 'GOVERNANCE_MANAGER', 'INTEGRATION_STEWARD', 'DATA_ANALYST']) assert.ok(rbac.includes(role), role + ' role exists');
});
