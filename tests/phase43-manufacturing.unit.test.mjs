import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const calculations = fs.readFileSync(path.join(root, 'apps/api/src/modules/manufacturing/manufacturing-calculations.ts'), 'utf8');
const dto = fs.readFileSync(path.join(root, 'apps/api/src/modules/manufacturing/dto/manufacturing.dto.ts'), 'utf8');

test('Phase 43 calculation helpers expose manufacturing intelligence logic', () => {
  assert.match(calculations, /calculateYieldRate/);
  assert.match(calculations, /calculateOee/);
  assert.match(calculations, /classifyManufacturingRisk/);
  assert.match(calculations, /riskScore >= 80/);
});

test('Phase 43 DTOs cover manufacturing planning, MES, QMS and digital twin inputs', () => {
  for (const dtoName of ['CreateManufacturingPlantDto', 'CreateBillOfMaterialDto', 'CreateProductionOrderDto', 'CreateManufacturingExecutionRunDto', 'CreateQualityInspectionDto', 'CreateMaintenancePredictionDto', 'CreateDigitalTwinSnapshotDto', 'CreateManufacturingCopilotQueryDto']) {
    assert.match(dto, new RegExp('class ' + dtoName));
  }
});

