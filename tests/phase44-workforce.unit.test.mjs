import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const calculations = fs.readFileSync(path.join(root, 'apps/api/src/modules/workforce/workforce-calculations.ts'), 'utf8');
const dto = fs.readFileSync(path.join(root, 'apps/api/src/modules/workforce/dto/workforce.dto.ts'), 'utf8');
const rbac = fs.readFileSync(path.join(root, 'apps/api/src/modules/workforce/workforce-rbac.constants.ts'), 'utf8');

test('Phase 44 calculation helpers expose workforce intelligence logic', () => {
  assert.match(calculations, /calculateRetentionRiskScore/);
  assert.match(calculations, /classifyTalentScore/);
  assert.match(calculations, /calculateHeadcountGap/);
  assert.match(calculations, /calculateEngagementIndex/);
});

test('Phase 44 DTO validation surface exceeds enterprise validator threshold', () => {
  const validatorCount = (dto.match(/@Is[A-Za-z]+/g) ?? []).length;
  assert.ok(validatorCount >= 150, 'expected at least 150 validators, found ' + validatorCount);
});

test('Phase 44 RBAC roles are present', () => {
  for (const role of ['HR_ADMIN', 'HR_MANAGER', 'RECRUITER', 'TEAM_MANAGER', 'LEARNING_MANAGER', 'EMPLOYEE']) {
    assert.ok(rbac.includes(role), role + ' role exists');
  }
});

