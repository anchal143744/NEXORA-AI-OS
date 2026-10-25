export type EamEntity = 'enterpriseAsset' | 'assetCategory' | 'assetLocation' | 'assetTag' | 'assetLifecycleRecord' | 'assetAssignment' | 'assetDepreciationPolicy' | 'assetMaintenancePlan' | 'assetMaintenanceSchedule' | 'assetMaintenanceTask' | 'assetInspection' | 'assetWorkOrder' | 'workOrderTask' | 'workOrderPart' | 'workOrderTimeEntry' | 'workOrderApproval' | 'assetHealthScore' | 'assetConditionSignal' | 'assetRiskAssessment' | 'assetFailurePrediction' | 'assetWarranty' | 'assetServiceContract' | 'assetVendorAgreement' | 'assetRenewalReminder' | 'assetCostRecord' | 'assetBudget' | 'assetTcoSnapshot' | 'assetCostOptimization' | 'assetIotDevice' | 'assetIotTelemetry' | 'assetIotAlert' | 'assetSensorCalibration' | 'assetMetric' | 'assetAnalyticsSnapshot' | 'assetReliabilityScore' | 'assetUtilizationRecord' | 'assetCopilotQuery' | 'assetRecommendation' | 'assetInsight';

export interface EamEntityDefinition {
  entity: EamEntity;
  model: string;
  delegate: string;
  route: string;
  group: string;
  event: string;
}

export const EAM_ENTITIES: EamEntityDefinition[] = [
  { entity: 'enterpriseAsset', model: 'EnterpriseAsset', delegate: 'enterpriseAsset', route: 'assets', group: 'Asset Registry', event: 'ASSET_CREATED' },
  { entity: 'assetCategory', model: 'AssetCategory', delegate: 'assetCategory', route: 'categories', group: 'Asset Registry', event: 'ASSET_UPDATED' },
  { entity: 'assetLocation', model: 'AssetLocation', delegate: 'assetLocation', route: 'locations', group: 'Asset Registry', event: 'ASSET_UPDATED' },
  { entity: 'assetTag', model: 'AssetTag', delegate: 'assetTag', route: 'tags', group: 'Asset Registry', event: 'ASSET_UPDATED' },
  { entity: 'assetLifecycleRecord', model: 'AssetLifecycleRecord', delegate: 'assetLifecycleRecord', route: 'lifecycle-records', group: 'Asset Lifecycle Management', event: 'ASSET_LIFECYCLE_UPDATED' },
  { entity: 'assetAssignment', model: 'AssetAssignment', delegate: 'assetAssignment', route: 'assignments', group: 'Asset Lifecycle Management', event: 'ASSET_ASSIGNED' },
  { entity: 'assetDepreciationPolicy', model: 'AssetDepreciationPolicy', delegate: 'assetDepreciationPolicy', route: 'depreciation-policies', group: 'Asset Lifecycle Management', event: 'ASSET_COST_RECORDED' },
  { entity: 'assetMaintenancePlan', model: 'AssetMaintenancePlan', delegate: 'assetMaintenancePlan', route: 'maintenance-plans', group: 'Maintenance Management', event: 'ASSET_MAINTENANCE_SCHEDULED' },
  { entity: 'assetMaintenanceSchedule', model: 'AssetMaintenanceSchedule', delegate: 'assetMaintenanceSchedule', route: 'maintenance-schedules', group: 'Maintenance Management', event: 'ASSET_MAINTENANCE_SCHEDULED' },
  { entity: 'assetMaintenanceTask', model: 'AssetMaintenanceTask', delegate: 'assetMaintenanceTask', route: 'maintenance-tasks', group: 'Maintenance Management', event: 'ASSET_MAINTENANCE_COMPLETED' },
  { entity: 'assetInspection', model: 'AssetInspection', delegate: 'assetInspection', route: 'inspections', group: 'Maintenance Management', event: 'ASSET_HEALTH_UPDATED' },
  { entity: 'assetWorkOrder', model: 'AssetWorkOrder', delegate: 'assetWorkOrder', route: 'work-orders', group: 'Work Order Management', event: 'ASSET_WORK_ORDER_CREATED' },
  { entity: 'workOrderTask', model: 'WorkOrderTask', delegate: 'workOrderTask', route: 'work-order-tasks', group: 'Work Order Management', event: 'ASSET_WORK_ORDER_UPDATED' },
  { entity: 'workOrderPart', model: 'WorkOrderPart', delegate: 'workOrderPart', route: 'work-order-parts', group: 'Work Order Management', event: 'ASSET_WORK_ORDER_UPDATED' },
  { entity: 'workOrderTimeEntry', model: 'WorkOrderTimeEntry', delegate: 'workOrderTimeEntry', route: 'work-order-time-entries', group: 'Work Order Management', event: 'ASSET_WORK_ORDER_UPDATED' },
  { entity: 'workOrderApproval', model: 'WorkOrderApproval', delegate: 'workOrderApproval', route: 'work-order-approvals', group: 'Work Order Management', event: 'ASSET_WORK_ORDER_COMPLETED' },
  { entity: 'assetHealthScore', model: 'AssetHealthScore', delegate: 'assetHealthScore', route: 'health-scores', group: 'Asset Health Intelligence', event: 'ASSET_HEALTH_UPDATED' },
  { entity: 'assetConditionSignal', model: 'AssetConditionSignal', delegate: 'assetConditionSignal', route: 'condition-signals', group: 'Asset Health Intelligence', event: 'ASSET_HEALTH_UPDATED' },
  { entity: 'assetRiskAssessment', model: 'AssetRiskAssessment', delegate: 'assetRiskAssessment', route: 'risk-assessments', group: 'Asset Health Intelligence', event: 'ASSET_RISK_DETECTED' },
  { entity: 'assetFailurePrediction', model: 'AssetFailurePrediction', delegate: 'assetFailurePrediction', route: 'failure-predictions', group: 'Asset Health Intelligence', event: 'ASSET_RISK_DETECTED' },
  { entity: 'assetWarranty', model: 'AssetWarranty', delegate: 'assetWarranty', route: 'warranties', group: 'Warranty and Contract Tracking', event: 'ASSET_WARRANTY_EXPIRING' },
  { entity: 'assetServiceContract', model: 'AssetServiceContract', delegate: 'assetServiceContract', route: 'service-contracts', group: 'Warranty and Contract Tracking', event: 'ASSET_CONTRACT_RENEWAL_DUE' },
  { entity: 'assetVendorAgreement', model: 'AssetVendorAgreement', delegate: 'assetVendorAgreement', route: 'vendor-agreements', group: 'Warranty and Contract Tracking', event: 'ASSET_CONTRACT_RENEWAL_DUE' },
  { entity: 'assetRenewalReminder', model: 'AssetRenewalReminder', delegate: 'assetRenewalReminder', route: 'renewal-reminders', group: 'Warranty and Contract Tracking', event: 'ASSET_CONTRACT_RENEWAL_DUE' },
  { entity: 'assetCostRecord', model: 'AssetCostRecord', delegate: 'assetCostRecord', route: 'cost-records', group: 'Asset Cost Intelligence', event: 'ASSET_COST_RECORDED' },
  { entity: 'assetBudget', model: 'AssetBudget', delegate: 'assetBudget', route: 'budgets', group: 'Asset Cost Intelligence', event: 'ASSET_COST_RECORDED' },
  { entity: 'assetTcoSnapshot', model: 'AssetTcoSnapshot', delegate: 'assetTcoSnapshot', route: 'tco-snapshots', group: 'Asset Cost Intelligence', event: 'ASSET_COST_RECORDED' },
  { entity: 'assetCostOptimization', model: 'AssetCostOptimization', delegate: 'assetCostOptimization', route: 'cost-optimizations', group: 'Asset Cost Intelligence', event: 'ASSET_RECOMMENDATION_CREATED' },
  { entity: 'assetIotDevice', model: 'AssetIotDevice', delegate: 'assetIotDevice', route: 'iot-devices', group: 'IoT Asset Monitoring Foundation', event: 'ASSET_IOT_SIGNAL_RECEIVED' },
  { entity: 'assetIotTelemetry', model: 'AssetIotTelemetry', delegate: 'assetIotTelemetry', route: 'iot-telemetry', group: 'IoT Asset Monitoring Foundation', event: 'ASSET_IOT_SIGNAL_RECEIVED' },
  { entity: 'assetIotAlert', model: 'AssetIotAlert', delegate: 'assetIotAlert', route: 'iot-alerts', group: 'IoT Asset Monitoring Foundation', event: 'ASSET_RISK_DETECTED' },
  { entity: 'assetSensorCalibration', model: 'AssetSensorCalibration', delegate: 'assetSensorCalibration', route: 'sensor-calibrations', group: 'IoT Asset Monitoring Foundation', event: 'ASSET_IOT_SIGNAL_RECEIVED' },
  { entity: 'assetMetric', model: 'AssetMetric', delegate: 'assetMetric', route: 'metrics', group: 'Asset Analytics', event: 'ASSET_ANALYTICS_GENERATED' },
  { entity: 'assetAnalyticsSnapshot', model: 'AssetAnalyticsSnapshot', delegate: 'assetAnalyticsSnapshot', route: 'snapshots', group: 'Asset Analytics', event: 'ASSET_ANALYTICS_GENERATED' },
  { entity: 'assetReliabilityScore', model: 'AssetReliabilityScore', delegate: 'assetReliabilityScore', route: 'reliability-scores', group: 'Asset Analytics', event: 'ASSET_ANALYTICS_GENERATED' },
  { entity: 'assetUtilizationRecord', model: 'AssetUtilizationRecord', delegate: 'assetUtilizationRecord', route: 'utilization-records', group: 'Asset Analytics', event: 'ASSET_ANALYTICS_GENERATED' },
  { entity: 'assetCopilotQuery', model: 'AssetCopilotQuery', delegate: 'assetCopilotQuery', route: 'queries', group: 'AI Asset Copilot', event: 'ASSET_COPILOT_QUERIED' },
  { entity: 'assetRecommendation', model: 'AssetRecommendation', delegate: 'assetRecommendation', route: 'recommendations', group: 'AI Asset Copilot', event: 'ASSET_RECOMMENDATION_CREATED' },
  { entity: 'assetInsight', model: 'AssetInsight', delegate: 'assetInsight', route: 'insights', group: 'AI Asset Copilot', event: 'ASSET_ANALYTICS_GENERATED' },
];

export const EAM_GROUPS = {
  'Asset Registry': { apiGroup: '/v1/asset-registry', entities: EAM_ENTITIES.filter((entity) => entity.group === 'Asset Registry') },
  'Asset Lifecycle Management': { apiGroup: '/v1/asset-lifecycle', entities: EAM_ENTITIES.filter((entity) => entity.group === 'Asset Lifecycle Management') },
  'Maintenance Management': { apiGroup: '/v1/maintenance-management', entities: EAM_ENTITIES.filter((entity) => entity.group === 'Maintenance Management') },
  'Work Order Management': { apiGroup: '/v1/work-orders', entities: EAM_ENTITIES.filter((entity) => entity.group === 'Work Order Management') },
  'Asset Health Intelligence': { apiGroup: '/v1/asset-health', entities: EAM_ENTITIES.filter((entity) => entity.group === 'Asset Health Intelligence') },
  'Warranty and Contract Tracking': { apiGroup: '/v1/warranty-contracts', entities: EAM_ENTITIES.filter((entity) => entity.group === 'Warranty and Contract Tracking') },
  'Asset Cost Intelligence': { apiGroup: '/v1/asset-costs', entities: EAM_ENTITIES.filter((entity) => entity.group === 'Asset Cost Intelligence') },
  'IoT Asset Monitoring Foundation': { apiGroup: '/v1/iot-assets', entities: EAM_ENTITIES.filter((entity) => entity.group === 'IoT Asset Monitoring Foundation') },
  'Asset Analytics': { apiGroup: '/v1/asset-analytics', entities: EAM_ENTITIES.filter((entity) => entity.group === 'Asset Analytics') },
  'AI Asset Copilot': { apiGroup: '/v1/asset-copilot', entities: EAM_ENTITIES.filter((entity) => entity.group === 'AI Asset Copilot') },
} as const;

export function getEamEntity(entity: EamEntity) {
  const definition = EAM_ENTITIES.find((item) => item.entity === entity);
  if (!definition) throw new Error('Unknown EAM entity: ' + entity);
  return definition;
}

