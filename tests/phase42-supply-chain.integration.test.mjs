import { fileURLToPath } from 'node:url';

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');
const appModule = fs.readFileSync(path.join(root, 'apps/api/src/app.module.ts'), 'utf8');
const apiMap = fs.readFileSync(path.join(root, 'apps/web/services/supply-chain-api.ts'), 'utf8');

test('Phase 42 Prisma schema includes the required supply chain model surface', () => {
  for (const model of ['SupplyChainItem', 'Warehouse', 'StockBalance', 'InventoryBatch', 'InventorySerial', 'InventoryAudit', 'FulfillmentOrder', 'Shipment', 'DemandForecastModel', 'DemandForecastScenario', 'ReplenishmentPlan', 'SupplyChainRisk', 'SupplyChainInsight']) {
    assert.ok(schema.includes('model ' + model + ' {'), model + ' exists in Prisma schema');
  }
});

test('Phase 42 API module and frontend API map are registered', () => {
  assert.match(appModule, /SupplyChainModule/);
  for (const apiPath of ['/v1/inventory-core', '/v1/warehouses', '/v1/demand-forecasting', '/v1/replenishment', '/v1/fulfillment', '/v1/shipments', '/v1/distribution-network', '/v1/supply-chain-intelligence', '/v1/supply-chain-analytics', '/v1/supply-chain-copilot']) {
    assert.ok(apiMap.includes(apiPath), apiPath + ' is present in frontend API map');
  }
});
