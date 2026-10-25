import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');
const appModule = fs.readFileSync(path.join(root, 'apps/api/src/app.module.ts'), 'utf8');
const apiMap = fs.readFileSync(path.join(root, 'apps/web/services/manufacturing-api.ts'), 'utf8');
const moduleFile = fs.readFileSync(path.join(root, 'apps/api/src/modules/manufacturing/manufacturing.module.ts'), 'utf8');

test('Phase 43 Prisma schema includes the required manufacturing model surface', () => {
  for (const model of ['ManufacturingPlant', 'ProductionLine', 'WorkCenter', 'FactoryResource', 'BillOfMaterial', 'BomComponent', 'ProductionPlan', 'ProductionSchedule', 'ProductionOrder', 'ProductionOperation', 'ManufacturingExecutionRun', 'ProductionMaterialRequirement', 'MachineTelemetry', 'QualityInspection', 'QualityIssue', 'MaintenanceAsset', 'MaintenancePrediction', 'ProductionCostRecord', 'ManufacturingMetric', 'ManufacturingRisk', 'DigitalTwinModel', 'DigitalTwinSnapshot', 'ManufacturingCopilotQuery', 'ManufacturingEvent']) {
    assert.ok(schema.includes('model ' + model + ' {'), model + ' exists in Prisma schema');
  }
});

test('Phase 43 API module and frontend API map are registered', () => {
  assert.match(appModule, /ManufacturingModule/);
  assert.match(moduleFile, /ManufacturingCqrsService/);
  for (const apiPath of ['/v1/manufacturing', '/v1/bill-of-materials', '/v1/production-planning', '/v1/manufacturing-execution', '/v1/factory-resources', '/v1/quality-management', '/v1/predictive-maintenance', '/v1/production-cost', '/v1/manufacturing-analytics', '/v1/manufacturing-risk', '/v1/digital-twin', '/v1/manufacturing-copilot']) {
    assert.ok(apiMap.includes(apiPath), apiPath + ' is present in frontend API map');
  }
});

