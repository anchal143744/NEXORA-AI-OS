import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');
const appModule = fs.readFileSync(path.join(root, 'apps/api/src/app.module.ts'), 'utf8');
const apiMap = fs.readFileSync(path.join(root, 'apps/web/services/eam-api.ts'), 'utf8');
const registry = fs.readFileSync(path.join(root, 'apps/api/src/modules/events/registry/event-registry.ts'), 'utf8');

test('Phase 45 Prisma schema includes required EAM model surface', () => {
  const required = ["EnterpriseAsset","AssetCategory","AssetLocation","AssetTag","AssetLifecycleRecord","AssetAssignment","AssetDepreciationPolicy","AssetMaintenancePlan","AssetMaintenanceSchedule","AssetMaintenanceTask","AssetInspection","AssetWorkOrder","WorkOrderTask","WorkOrderPart","WorkOrderTimeEntry","WorkOrderApproval","AssetHealthScore","AssetConditionSignal","AssetRiskAssessment","AssetFailurePrediction","AssetWarranty","AssetServiceContract","AssetVendorAgreement","AssetRenewalReminder","AssetCostRecord","AssetBudget","AssetTcoSnapshot","AssetCostOptimization","AssetIotDevice","AssetIotTelemetry","AssetIotAlert","AssetSensorCalibration","AssetMetric","AssetAnalyticsSnapshot","AssetReliabilityScore","AssetUtilizationRecord","AssetCopilotQuery","AssetRecommendation","AssetInsight"];
  for (const model of required) assert.ok(schema.includes('model ' + model + ' {'), model + ' exists in Prisma schema');
});

test('Phase 45 module, API map and asset events are registered', () => {
  assert.match(appModule, /EamModule/);
  for (const apiPath of ["/v1/asset-registry","/v1/asset-lifecycle","/v1/maintenance-management","/v1/work-orders","/v1/asset-health","/v1/warranty-contracts","/v1/asset-costs","/v1/iot-assets","/v1/asset-analytics","/v1/asset-copilot"]) assert.ok(apiMap.includes(apiPath), apiPath + ' exists in API map');
  for (const eventName of ['ASSET_CREATED', 'ASSET_WORK_ORDER_CREATED', 'ASSET_HEALTH_UPDATED', 'ASSET_RISK_DETECTED', 'ASSET_COPILOT_QUERIED']) assert.ok(registry.includes(eventName), eventName + ' registered');
});

