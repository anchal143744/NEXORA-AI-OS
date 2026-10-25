import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const calculations = fs.readFileSync(path.join(root, 'apps/api/src/modules/eam/eam-calculations.ts'), 'utf8');
const dto = fs.readFileSync(path.join(root, 'apps/api/src/modules/eam/dto/eam.dto.ts'), 'utf8');
const rbac = fs.readFileSync(path.join(root, 'apps/api/src/modules/eam/eam-rbac.constants.ts'), 'utf8');

test('Phase 45 calculation helpers expose asset intelligence logic', () => {
  assert.match(calculations, /calculateAssetHealthScore/);
  assert.match(calculations, /classifyAssetRisk/);
  assert.match(calculations, /calculateTotalCostOfOwnership/);
  assert.match(calculations, /calculateMaintenanceBacklog/);
});

test('Phase 45 DTO validation surface is enterprise-grade', () => {
  const validatorCount = (dto.match(/@Is[A-Za-z]+/g) ?? []).length;
  assert.ok(validatorCount >= 150, 'expected at least 150 validators, found ' + validatorCount);
});

test('Phase 45 EAM RBAC roles are present', () => {
  for (const role of ['ASSET_ADMIN', 'ASSET_MANAGER', 'MAINTENANCE_MANAGER', 'TECHNICIAN', 'FIELD_ENGINEER', 'FINANCE_MANAGER', 'ASSET_VIEWER']) assert.ok(rbac.includes(role), role + ' role exists');
});

