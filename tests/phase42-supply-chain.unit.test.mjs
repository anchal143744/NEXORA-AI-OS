import { fileURLToPath } from 'node:url';

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const calculations = fs.readFileSync(path.join(root, 'apps/api/src/modules/supply-chain/supply-chain-calculations.ts'), 'utf8');
const dto = fs.readFileSync(path.join(root, 'apps/api/src/modules/supply-chain/dto/supply-chain.dto.ts'), 'utf8');

test('Phase 42 calculation helpers expose replenishment and delay risk logic', () => {
  assert.match(calculations, /calculateReplenishmentQuantity/);
  assert.match(calculations, /classifyDelayRisk/);
  assert.match(calculations, /delayRiskScore >= 90/);
});

test('Phase 42 DTOs cover core inventory and fulfillment inputs', () => {
  for (const dtoName of ['CreateSupplyChainItemDto', 'CreateWarehouseDto', 'CreateStockBalanceDto', 'CreateShipmentDto', 'CreateSupplyChainCopilotQueryDto']) {
    assert.match(dto, new RegExp('class ' + dtoName));
  }
});
