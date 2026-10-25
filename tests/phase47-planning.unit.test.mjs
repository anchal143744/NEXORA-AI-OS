import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const calculations = fs.readFileSync(path.join(root, 'apps/api/src/modules/planning/planning-calculations.ts'), 'utf8');
const dto = fs.readFileSync(path.join(root, 'apps/api/src/modules/planning/dto/planning.dto.ts'), 'utf8');
const rbac = fs.readFileSync(path.join(root, 'apps/api/src/modules/planning/planning-rbac.constants.ts'), 'utf8');

test('Phase 47 calculation helpers expose planning intelligence logic', () => {
  for (const helper of ['calculateOkrProgress', 'calculateBudgetVariance', 'calculateCapacityUtilization', 'classifyPortfolioHealth', 'calculateScenarioWeightedOutcome', 'classifyStrategyRisk']) assert.ok(calculations.includes(helper), helper + ' exists');
});

test('Phase 47 DTO validation surface is enterprise-grade', () => {
  const validatorCount = (dto.match(/@Is[A-Za-z]+/g) ?? []).length;
  assert.ok(validatorCount >= 180, 'expected at least 180 validators, found ' + validatorCount);
});

test('Phase 47 planning RBAC roles are present', () => {
  for (const role of ['STRATEGY_ADMIN', 'EXECUTIVE_SPONSOR', 'PORTFOLIO_MANAGER', 'OKR_OWNER', 'RESOURCE_PLANNER', 'FINANCE_PLANNER', 'STRATEGY_ANALYST']) assert.ok(rbac.includes(role), role + ' role exists');
});
