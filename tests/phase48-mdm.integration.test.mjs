import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');
const appModule = fs.readFileSync(path.join(root, 'apps/api/src/app.module.ts'), 'utf8');
const apiMap = fs.readFileSync(path.join(root, 'apps/web/services/mdm-api.ts'), 'utf8');
const registry = fs.readFileSync(path.join(root, 'apps/api/src/modules/events/registry/event-registry.ts'), 'utf8');

test('Phase 48 Prisma schema includes required MDM model surface', () => {
  const required = ["CustomerMasterRecord","CustomerMasterProfile","CustomerMasterIdentifier","CustomerMasterRelationship","VendorMasterRecord","VendorMasterProfile","VendorMasterIdentifier","VendorMasterRelationship","ProductMasterRecord","ProductMasterCatalog","ProductMasterAttribute","ProductMasterHierarchy","EmployeeMasterRecord","EmployeeMasterProfile","EmployeeMasterIdentifier","EmployeeMasterAssignment","AssetMasterRecord","AssetMasterProfile","AssetMasterIdentifier","AssetMasterHierarchy","MdmDataQualityRule","MdmDataQualityScore","MdmDataQualityIssue","MdmDataQualityRun","MdmDuplicateRule","MdmDuplicateCandidate","MdmDuplicateCluster","MdmDuplicateReview","MdmEntityResolutionRule","MdmEntityMatch","MdmEntityResolutionRun","MdmEntityResolutionDecision","MdmGoldenRecord","MdmGoldenRecordVersion","MdmSurvivorshipRule","MdmMergeRequest","MdmGovernancePolicy","MdmStewardshipAssignment","MdmDataDomain","MdmComplianceControl","MdmLineageRecord","MdmLineageEvent","MdmSourceSystem","MdmDataContractLink","MdmCopilotQuery","MdmRecommendation","MdmRiskSignal","MdmAuditEvent"];
  for (const model of required) assert.ok(schema.includes('model ' + model + ' {'), model + ' exists in Prisma schema');
});

test('Phase 48 module, API map and MDM events are registered', () => {
  assert.match(appModule, /MdmModule/);
  for (const apiPath of ["/v1/customer-master","/v1/vendor-master","/v1/product-master","/v1/employee-master","/v1/asset-master","/v1/data-quality","/v1/duplicate-detection","/v1/entity-resolution","/v1/golden-records","/v1/mdm-governance","/v1/mdm-lineage","/v1/ai-data-copilot"]) assert.ok(apiMap.includes(apiPath), apiPath + ' exists in API map');
  for (const eventName of ['MDM_CUSTOMER_MASTER_CREATED', 'MDM_DATA_QUALITY_ISSUE_DETECTED', 'MDM_DUPLICATE_CANDIDATE_DETECTED', 'MDM_GOLDEN_RECORD_CREATED', 'MDM_COPILOT_QUERIED']) assert.ok(registry.includes(eventName), eventName + ' registered');
});
