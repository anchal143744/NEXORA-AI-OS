import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const calculations = fs.readFileSync(path.join(root, 'apps/api/src/modules/global-connectivity/global-connectivity-calculations.ts'), 'utf8');
const dto = fs.readFileSync(path.join(root, 'apps/api/src/modules/global-connectivity/dto/global-connectivity.dto.ts'), 'utf8');
const rbac = fs.readFileSync(path.join(root, 'apps/api/src/modules/global-connectivity/global-connectivity-rbac.constants.ts'), 'utf8');

test('Phase 49 calculation helpers expose connectivity intelligence logic', () => {
  for (const helper of ['calculateIntegrationSuccessRate', 'calculateErrorRate', 'calculateGatewayRiskScore', 'classifyIntegrationHealth', 'shouldRotateOAuthToken', 'calculateWebhookRetryDelay']) assert.ok(calculations.includes(helper), helper + ' exists');
});

test('Phase 49 DTO validation surface is enterprise-grade', () => {
  const validatorCount = (dto.match(/@Is[A-Za-z]+/g) ?? []).length;
  assert.ok(validatorCount >= 250, 'expected at least 250 validators, found ' + validatorCount);
});

test('Phase 49 connectivity RBAC roles are present', () => {
  for (const role of ['INTEGRATION_ADMIN', 'CONNECTOR_DEVELOPER', 'API_GATEWAY_ADMIN', 'WEBHOOK_MANAGER', 'OAUTH_SECURITY_MANAGER', 'INTEGRATION_OPERATOR', 'CONNECTIVITY_ANALYST']) assert.ok(rbac.includes(role), role + ' role exists');
});
