export type MdmEntity = 'customerMasterRecord' | 'customerMasterProfile' | 'customerMasterIdentifier' | 'customerMasterRelationship' | 'vendorMasterRecord' | 'vendorMasterProfile' | 'vendorMasterIdentifier' | 'vendorMasterRelationship' | 'productMasterRecord' | 'productMasterCatalog' | 'productMasterAttribute' | 'productMasterHierarchy' | 'employeeMasterRecord' | 'employeeMasterProfile' | 'employeeMasterIdentifier' | 'employeeMasterAssignment' | 'assetMasterRecord' | 'assetMasterProfile' | 'assetMasterIdentifier' | 'assetMasterHierarchy' | 'mdmDataQualityRule' | 'mdmDataQualityScore' | 'mdmDataQualityIssue' | 'mdmDataQualityRun' | 'mdmDuplicateRule' | 'mdmDuplicateCandidate' | 'mdmDuplicateCluster' | 'mdmDuplicateReview' | 'mdmEntityResolutionRule' | 'mdmEntityMatch' | 'mdmEntityResolutionRun' | 'mdmEntityResolutionDecision' | 'mdmGoldenRecord' | 'mdmGoldenRecordVersion' | 'mdmSurvivorshipRule' | 'mdmMergeRequest' | 'mdmGovernancePolicy' | 'mdmStewardshipAssignment' | 'mdmDataDomain' | 'mdmComplianceControl' | 'mdmLineageRecord' | 'mdmLineageEvent' | 'mdmSourceSystem' | 'mdmDataContractLink' | 'mdmCopilotQuery' | 'mdmRecommendation' | 'mdmRiskSignal' | 'mdmAuditEvent';

export interface MdmEntityDefinition {
  entity: MdmEntity;
  model: string;
  delegate: string;
  route: string;
  group: string;
  event: string;
}

export const MDM_ENTITIES: MdmEntityDefinition[] = [
  { entity: 'customerMasterRecord', model: 'CustomerMasterRecord', delegate: 'customerMasterRecord', route: 'records', group: 'Customer Master', event: 'MDM_CUSTOMER_MASTER_CREATED' },
  { entity: 'customerMasterProfile', model: 'CustomerMasterProfile', delegate: 'customerMasterProfile', route: 'profiles', group: 'Customer Master', event: 'MDM_CUSTOMER_MASTER_CREATED' },
  { entity: 'customerMasterIdentifier', model: 'CustomerMasterIdentifier', delegate: 'customerMasterIdentifier', route: 'identifiers', group: 'Customer Master', event: 'MDM_CUSTOMER_MASTER_CREATED' },
  { entity: 'customerMasterRelationship', model: 'CustomerMasterRelationship', delegate: 'customerMasterRelationship', route: 'relationships', group: 'Customer Master', event: 'MDM_CUSTOMER_MASTER_CREATED' },
  { entity: 'vendorMasterRecord', model: 'VendorMasterRecord', delegate: 'vendorMasterRecord', route: 'records', group: 'Vendor Master', event: 'MDM_VENDOR_MASTER_CREATED' },
  { entity: 'vendorMasterProfile', model: 'VendorMasterProfile', delegate: 'vendorMasterProfile', route: 'profiles', group: 'Vendor Master', event: 'MDM_VENDOR_MASTER_CREATED' },
  { entity: 'vendorMasterIdentifier', model: 'VendorMasterIdentifier', delegate: 'vendorMasterIdentifier', route: 'identifiers', group: 'Vendor Master', event: 'MDM_VENDOR_MASTER_CREATED' },
  { entity: 'vendorMasterRelationship', model: 'VendorMasterRelationship', delegate: 'vendorMasterRelationship', route: 'relationships', group: 'Vendor Master', event: 'MDM_VENDOR_MASTER_CREATED' },
  { entity: 'productMasterRecord', model: 'ProductMasterRecord', delegate: 'productMasterRecord', route: 'records', group: 'Product Master', event: 'MDM_PRODUCT_MASTER_CREATED' },
  { entity: 'productMasterCatalog', model: 'ProductMasterCatalog', delegate: 'productMasterCatalog', route: 'catalogs', group: 'Product Master', event: 'MDM_PRODUCT_MASTER_CREATED' },
  { entity: 'productMasterAttribute', model: 'ProductMasterAttribute', delegate: 'productMasterAttribute', route: 'attributes', group: 'Product Master', event: 'MDM_PRODUCT_MASTER_CREATED' },
  { entity: 'productMasterHierarchy', model: 'ProductMasterHierarchy', delegate: 'productMasterHierarchy', route: 'hierarchies', group: 'Product Master', event: 'MDM_PRODUCT_MASTER_CREATED' },
  { entity: 'employeeMasterRecord', model: 'EmployeeMasterRecord', delegate: 'employeeMasterRecord', route: 'records', group: 'Employee Master', event: 'MDM_EMPLOYEE_MASTER_CREATED' },
  { entity: 'employeeMasterProfile', model: 'EmployeeMasterProfile', delegate: 'employeeMasterProfile', route: 'profiles', group: 'Employee Master', event: 'MDM_EMPLOYEE_MASTER_CREATED' },
  { entity: 'employeeMasterIdentifier', model: 'EmployeeMasterIdentifier', delegate: 'employeeMasterIdentifier', route: 'identifiers', group: 'Employee Master', event: 'MDM_EMPLOYEE_MASTER_CREATED' },
  { entity: 'employeeMasterAssignment', model: 'EmployeeMasterAssignment', delegate: 'employeeMasterAssignment', route: 'assignments', group: 'Employee Master', event: 'MDM_EMPLOYEE_MASTER_CREATED' },
  { entity: 'assetMasterRecord', model: 'AssetMasterRecord', delegate: 'assetMasterRecord', route: 'records', group: 'Asset Master', event: 'MDM_ASSET_MASTER_CREATED' },
  { entity: 'assetMasterProfile', model: 'AssetMasterProfile', delegate: 'assetMasterProfile', route: 'profiles', group: 'Asset Master', event: 'MDM_ASSET_MASTER_CREATED' },
  { entity: 'assetMasterIdentifier', model: 'AssetMasterIdentifier', delegate: 'assetMasterIdentifier', route: 'identifiers', group: 'Asset Master', event: 'MDM_ASSET_MASTER_CREATED' },
  { entity: 'assetMasterHierarchy', model: 'AssetMasterHierarchy', delegate: 'assetMasterHierarchy', route: 'hierarchies', group: 'Asset Master', event: 'MDM_ASSET_MASTER_CREATED' },
  { entity: 'mdmDataQualityRule', model: 'MdmDataQualityRule', delegate: 'mdmDataQualityRule', route: 'rules', group: 'Data Quality Engine', event: 'MDM_DATA_QUALITY_RULE_CREATED' },
  { entity: 'mdmDataQualityScore', model: 'MdmDataQualityScore', delegate: 'mdmDataQualityScore', route: 'scores', group: 'Data Quality Engine', event: 'MDM_DATA_QUALITY_RUN_COMPLETED' },
  { entity: 'mdmDataQualityIssue', model: 'MdmDataQualityIssue', delegate: 'mdmDataQualityIssue', route: 'issues', group: 'Data Quality Engine', event: 'MDM_DATA_QUALITY_ISSUE_DETECTED' },
  { entity: 'mdmDataQualityRun', model: 'MdmDataQualityRun', delegate: 'mdmDataQualityRun', route: 'runs', group: 'Data Quality Engine', event: 'MDM_DATA_QUALITY_RUN_COMPLETED' },
  { entity: 'mdmDuplicateRule', model: 'MdmDuplicateRule', delegate: 'mdmDuplicateRule', route: 'rules', group: 'Duplicate Detection Engine', event: 'MDM_DUPLICATE_CANDIDATE_DETECTED' },
  { entity: 'mdmDuplicateCandidate', model: 'MdmDuplicateCandidate', delegate: 'mdmDuplicateCandidate', route: 'candidates', group: 'Duplicate Detection Engine', event: 'MDM_DUPLICATE_CANDIDATE_DETECTED' },
  { entity: 'mdmDuplicateCluster', model: 'MdmDuplicateCluster', delegate: 'mdmDuplicateCluster', route: 'clusters', group: 'Duplicate Detection Engine', event: 'MDM_DUPLICATE_CLUSTER_CREATED' },
  { entity: 'mdmDuplicateReview', model: 'MdmDuplicateReview', delegate: 'mdmDuplicateReview', route: 'reviews', group: 'Duplicate Detection Engine', event: 'MDM_DUPLICATE_REVIEW_COMPLETED' },
  { entity: 'mdmEntityResolutionRule', model: 'MdmEntityResolutionRule', delegate: 'mdmEntityResolutionRule', route: 'rules', group: 'Entity Resolution Engine', event: 'MDM_ENTITY_RESOLUTION_STARTED' },
  { entity: 'mdmEntityMatch', model: 'MdmEntityMatch', delegate: 'mdmEntityMatch', route: 'matches', group: 'Entity Resolution Engine', event: 'MDM_ENTITY_MATCH_CREATED' },
  { entity: 'mdmEntityResolutionRun', model: 'MdmEntityResolutionRun', delegate: 'mdmEntityResolutionRun', route: 'runs', group: 'Entity Resolution Engine', event: 'MDM_ENTITY_RESOLUTION_COMPLETED' },
  { entity: 'mdmEntityResolutionDecision', model: 'MdmEntityResolutionDecision', delegate: 'mdmEntityResolutionDecision', route: 'decisions', group: 'Entity Resolution Engine', event: 'MDM_ENTITY_RESOLUTION_COMPLETED' },
  { entity: 'mdmGoldenRecord', model: 'MdmGoldenRecord', delegate: 'mdmGoldenRecord', route: 'records', group: 'Golden Record Engine', event: 'MDM_GOLDEN_RECORD_CREATED' },
  { entity: 'mdmGoldenRecordVersion', model: 'MdmGoldenRecordVersion', delegate: 'mdmGoldenRecordVersion', route: 'versions', group: 'Golden Record Engine', event: 'MDM_GOLDEN_RECORD_UPDATED' },
  { entity: 'mdmSurvivorshipRule', model: 'MdmSurvivorshipRule', delegate: 'mdmSurvivorshipRule', route: 'survivorship-rules', group: 'Golden Record Engine', event: 'MDM_GOLDEN_RECORD_UPDATED' },
  { entity: 'mdmMergeRequest', model: 'MdmMergeRequest', delegate: 'mdmMergeRequest', route: 'merge-requests', group: 'Golden Record Engine', event: 'MDM_MERGE_REQUEST_CREATED' },
  { entity: 'mdmGovernancePolicy', model: 'MdmGovernancePolicy', delegate: 'mdmGovernancePolicy', route: 'policies', group: 'Data Governance', event: 'MDM_GOVERNANCE_POLICY_CREATED' },
  { entity: 'mdmStewardshipAssignment', model: 'MdmStewardshipAssignment', delegate: 'mdmStewardshipAssignment', route: 'stewardship-assignments', group: 'Data Governance', event: 'MDM_STEWARDSHIP_ASSIGNED' },
  { entity: 'mdmDataDomain', model: 'MdmDataDomain', delegate: 'mdmDataDomain', route: 'data-domains', group: 'Data Governance', event: 'MDM_GOVERNANCE_POLICY_CREATED' },
  { entity: 'mdmComplianceControl', model: 'MdmComplianceControl', delegate: 'mdmComplianceControl', route: 'compliance-controls', group: 'Data Governance', event: 'MDM_GOVERNANCE_POLICY_CREATED' },
  { entity: 'mdmLineageRecord', model: 'MdmLineageRecord', delegate: 'mdmLineageRecord', route: 'records', group: 'Data Lineage', event: 'MDM_LINEAGE_RECORDED' },
  { entity: 'mdmLineageEvent', model: 'MdmLineageEvent', delegate: 'mdmLineageEvent', route: 'events', group: 'Data Lineage', event: 'MDM_LINEAGE_RECORDED' },
  { entity: 'mdmSourceSystem', model: 'MdmSourceSystem', delegate: 'mdmSourceSystem', route: 'source-systems', group: 'Data Lineage', event: 'MDM_SOURCE_SYSTEM_CONNECTED' },
  { entity: 'mdmDataContractLink', model: 'MdmDataContractLink', delegate: 'mdmDataContractLink', route: 'data-contract-links', group: 'Data Lineage', event: 'MDM_DATA_CONTRACT_LINKED' },
  { entity: 'mdmCopilotQuery', model: 'MdmCopilotQuery', delegate: 'mdmCopilotQuery', route: 'queries', group: 'AI Data Copilot', event: 'MDM_COPILOT_QUERIED' },
  { entity: 'mdmRecommendation', model: 'MdmRecommendation', delegate: 'mdmRecommendation', route: 'recommendations', group: 'AI Data Copilot', event: 'MDM_RECOMMENDATION_CREATED' },
  { entity: 'mdmRiskSignal', model: 'MdmRiskSignal', delegate: 'mdmRiskSignal', route: 'risk-signals', group: 'AI Data Copilot', event: 'MDM_RISK_DETECTED' },
  { entity: 'mdmAuditEvent', model: 'MdmAuditEvent', delegate: 'mdmAuditEvent', route: 'audit-events', group: 'AI Data Copilot', event: 'MDM_AUDIT_RECORDED' },
];

export const MDM_GROUPS = {
  'Customer Master': { apiGroup: '/v1/customer-master', entities: MDM_ENTITIES.filter((entity) => entity.group === 'Customer Master') },
  'Vendor Master': { apiGroup: '/v1/vendor-master', entities: MDM_ENTITIES.filter((entity) => entity.group === 'Vendor Master') },
  'Product Master': { apiGroup: '/v1/product-master', entities: MDM_ENTITIES.filter((entity) => entity.group === 'Product Master') },
  'Employee Master': { apiGroup: '/v1/employee-master', entities: MDM_ENTITIES.filter((entity) => entity.group === 'Employee Master') },
  'Asset Master': { apiGroup: '/v1/asset-master', entities: MDM_ENTITIES.filter((entity) => entity.group === 'Asset Master') },
  'Data Quality Engine': { apiGroup: '/v1/data-quality', entities: MDM_ENTITIES.filter((entity) => entity.group === 'Data Quality Engine') },
  'Duplicate Detection Engine': { apiGroup: '/v1/duplicate-detection', entities: MDM_ENTITIES.filter((entity) => entity.group === 'Duplicate Detection Engine') },
  'Entity Resolution Engine': { apiGroup: '/v1/entity-resolution', entities: MDM_ENTITIES.filter((entity) => entity.group === 'Entity Resolution Engine') },
  'Golden Record Engine': { apiGroup: '/v1/golden-records', entities: MDM_ENTITIES.filter((entity) => entity.group === 'Golden Record Engine') },
  'Data Governance': { apiGroup: '/v1/mdm-governance', entities: MDM_ENTITIES.filter((entity) => entity.group === 'Data Governance') },
  'Data Lineage': { apiGroup: '/v1/mdm-lineage', entities: MDM_ENTITIES.filter((entity) => entity.group === 'Data Lineage') },
  'AI Data Copilot': { apiGroup: '/v1/ai-data-copilot', entities: MDM_ENTITIES.filter((entity) => entity.group === 'AI Data Copilot') },
} as const;

export function getMdmEntity(entity: MdmEntity) {
  const definition = MDM_ENTITIES.find((item) => item.entity === entity);
  if (!definition) throw new Error('Unknown MDM entity: ' + entity);
  return definition;
}
