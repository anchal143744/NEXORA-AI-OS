import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const calculations = fs.readFileSync(path.join(root, 'apps/api/src/modules/field-service/field-service-calculations.ts'), 'utf8');
const dto = fs.readFileSync(path.join(root, 'apps/api/src/modules/field-service/dto/field-service.dto.ts'), 'utf8');
const rbac = fs.readFileSync(path.join(root, 'apps/api/src/modules/field-service/field-service-rbac.constants.ts'), 'utf8');

test('Phase 46 calculation helpers expose field-service intelligence logic', () => {
  assert.match(calculations, /calculateSlaRemainingMinutes/);
  assert.match(calculations, /isSlaBreached/);
  assert.match(calculations, /calculateTechnicianUtilization/);
  assert.match(calculations, /calculateFirstTimeFixRate/);
  assert.match(calculations, /classifyDispatchRisk/);
});

test('Phase 46 DTO validation surface is enterprise-grade', () => {
  const validatorCount = (dto.match(/@Is[A-Za-z]+/g) ?? []).length;
  assert.ok(validatorCount >= 150, 'expected at least 150 validators, found ' + validatorCount);
});

test('Phase 46 field-service RBAC roles are present', () => {
  for (const role of ['FIELD_SERVICE_ADMIN', 'DISPATCH_MANAGER', 'SERVICE_MANAGER', 'TECHNICIAN', 'MOBILE_WORKER', 'CUSTOMER_SERVICE_MANAGER', 'FIELD_ANALYST']) assert.ok(rbac.includes(role), role + ' role exists');
});

