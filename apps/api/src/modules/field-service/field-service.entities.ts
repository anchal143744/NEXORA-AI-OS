export type FieldServiceEntity = 'fieldServiceRegion' | 'fieldServiceTerritory' | 'fieldServiceRequest' | 'fieldServiceCase' | 'fieldServiceAppointment' | 'fieldWorkOrder' | 'fieldWorkOrderTask' | 'fieldWorkOrderPart' | 'fieldWorkOrderChecklist' | 'fieldWorkOrderCompletion' | 'dispatchBoard' | 'dispatchAssignment' | 'dispatchRule' | 'dispatchException' | 'technicianProfile' | 'technicianSkill' | 'technicianCertification' | 'technicianAvailability' | 'technicianPerformance' | 'fieldRoutePlan' | 'fieldRouteStop' | 'fieldRouteOptimization' | 'travelTimeEstimate' | 'mobileWorkSession' | 'mobileDeviceRegistration' | 'offlineJobQueue' | 'mobileSyncEvent' | 'fieldServiceSlaPolicy' | 'fieldServiceSlaCommitment' | 'fieldServiceSlaBreach' | 'fieldServiceEscalation' | 'customerServiceVisit' | 'customerServiceFeedback' | 'customerServiceResolution' | 'customerServiceInsight' | 'fieldWorkforceMetric' | 'fieldWorkforceAnalyticsSnapshot' | 'technicianUtilizationRecord' | 'fieldServiceForecast' | 'fieldServiceCopilotQuery' | 'fieldServiceRecommendation' | 'fieldServiceRiskSignal';

export interface FieldServiceEntityDefinition {
  entity: FieldServiceEntity;
  model: string;
  delegate: string;
  route: string;
  group: string;
  event: string;
}

export const FIELD_SERVICE_ENTITIES: FieldServiceEntityDefinition[] = [
  { entity: 'fieldServiceRegion', model: 'FieldServiceRegion', delegate: 'fieldServiceRegion', route: 'regions', group: 'Field Service Management', event: 'FIELD_SERVICE_REQUEST_CREATED' },
  { entity: 'fieldServiceTerritory', model: 'FieldServiceTerritory', delegate: 'fieldServiceTerritory', route: 'territories', group: 'Field Service Management', event: 'FIELD_SERVICE_REQUEST_CREATED' },
  { entity: 'fieldServiceRequest', model: 'FieldServiceRequest', delegate: 'fieldServiceRequest', route: 'requests', group: 'Field Service Management', event: 'FIELD_SERVICE_REQUEST_CREATED' },
  { entity: 'fieldServiceCase', model: 'FieldServiceCase', delegate: 'fieldServiceCase', route: 'cases', group: 'Field Service Management', event: 'FIELD_SERVICE_CASE_UPDATED' },
  { entity: 'fieldServiceAppointment', model: 'FieldServiceAppointment', delegate: 'fieldServiceAppointment', route: 'appointments', group: 'Field Service Management', event: 'SERVICE_APPOINTMENT_SCHEDULED' },
  { entity: 'fieldWorkOrder', model: 'FieldWorkOrder', delegate: 'fieldWorkOrder', route: 'work-orders', group: 'Work Order Management', event: 'FIELD_WORK_ORDER_CREATED' },
  { entity: 'fieldWorkOrderTask', model: 'FieldWorkOrderTask', delegate: 'fieldWorkOrderTask', route: 'work-order-tasks', group: 'Work Order Management', event: 'FIELD_WORK_ORDER_UPDATED' },
  { entity: 'fieldWorkOrderPart', model: 'FieldWorkOrderPart', delegate: 'fieldWorkOrderPart', route: 'work-order-parts', group: 'Work Order Management', event: 'FIELD_WORK_ORDER_UPDATED' },
  { entity: 'fieldWorkOrderChecklist', model: 'FieldWorkOrderChecklist', delegate: 'fieldWorkOrderChecklist', route: 'work-order-checklists', group: 'Work Order Management', event: 'FIELD_WORK_ORDER_UPDATED' },
  { entity: 'fieldWorkOrderCompletion', model: 'FieldWorkOrderCompletion', delegate: 'fieldWorkOrderCompletion', route: 'work-order-completions', group: 'Work Order Management', event: 'FIELD_WORK_ORDER_COMPLETED' },
  { entity: 'dispatchBoard', model: 'DispatchBoard', delegate: 'dispatchBoard', route: 'dispatch-boards', group: 'Dispatch Engine', event: 'DISPATCH_ASSIGNMENT_CREATED' },
  { entity: 'dispatchAssignment', model: 'DispatchAssignment', delegate: 'dispatchAssignment', route: 'dispatch-assignments', group: 'Dispatch Engine', event: 'DISPATCH_ASSIGNMENT_CREATED' },
  { entity: 'dispatchRule', model: 'DispatchRule', delegate: 'dispatchRule', route: 'dispatch-rules', group: 'Dispatch Engine', event: 'DISPATCH_ASSIGNMENT_CREATED' },
  { entity: 'dispatchException', model: 'DispatchException', delegate: 'dispatchException', route: 'dispatch-exceptions', group: 'Dispatch Engine', event: 'DISPATCH_EXCEPTION_CREATED' },
  { entity: 'technicianProfile', model: 'TechnicianProfile', delegate: 'technicianProfile', route: 'technician-profiles', group: 'Technician Management', event: 'TECHNICIAN_UPDATED' },
  { entity: 'technicianSkill', model: 'TechnicianSkill', delegate: 'technicianSkill', route: 'technician-skills', group: 'Technician Management', event: 'TECHNICIAN_UPDATED' },
  { entity: 'technicianCertification', model: 'TechnicianCertification', delegate: 'technicianCertification', route: 'technician-certifications', group: 'Technician Management', event: 'TECHNICIAN_UPDATED' },
  { entity: 'technicianAvailability', model: 'TechnicianAvailability', delegate: 'technicianAvailability', route: 'technician-availability', group: 'Technician Management', event: 'TECHNICIAN_UPDATED' },
  { entity: 'technicianPerformance', model: 'TechnicianPerformance', delegate: 'technicianPerformance', route: 'technician-performance', group: 'Technician Management', event: 'TECHNICIAN_UPDATED' },
  { entity: 'fieldRoutePlan', model: 'FieldRoutePlan', delegate: 'fieldRoutePlan', route: 'route-plans', group: 'Route Optimization', event: 'ROUTE_OPTIMIZED' },
  { entity: 'fieldRouteStop', model: 'FieldRouteStop', delegate: 'fieldRouteStop', route: 'route-stops', group: 'Route Optimization', event: 'ROUTE_OPTIMIZED' },
  { entity: 'fieldRouteOptimization', model: 'FieldRouteOptimization', delegate: 'fieldRouteOptimization', route: 'route-optimizations', group: 'Route Optimization', event: 'ROUTE_OPTIMIZED' },
  { entity: 'travelTimeEstimate', model: 'TravelTimeEstimate', delegate: 'travelTimeEstimate', route: 'travel-time-estimates', group: 'Route Optimization', event: 'ROUTE_OPTIMIZED' },
  { entity: 'mobileWorkSession', model: 'MobileWorkSession', delegate: 'mobileWorkSession', route: 'work-sessions', group: 'Mobile Workforce Foundation', event: 'MOBILE_WORK_STARTED' },
  { entity: 'mobileDeviceRegistration', model: 'MobileDeviceRegistration', delegate: 'mobileDeviceRegistration', route: 'device-registrations', group: 'Mobile Workforce Foundation', event: 'MOBILE_WORK_STARTED' },
  { entity: 'offlineJobQueue', model: 'OfflineJobQueue', delegate: 'offlineJobQueue', route: 'offline-job-queue', group: 'Mobile Workforce Foundation', event: 'MOBILE_SYNC_COMPLETED' },
  { entity: 'mobileSyncEvent', model: 'MobileSyncEvent', delegate: 'mobileSyncEvent', route: 'sync-events', group: 'Mobile Workforce Foundation', event: 'MOBILE_SYNC_COMPLETED' },
  { entity: 'fieldServiceSlaPolicy', model: 'FieldServiceSlaPolicy', delegate: 'fieldServiceSlaPolicy', route: 'sla-policies', group: 'SLA Management', event: 'SLA_POLICY_CREATED' },
  { entity: 'fieldServiceSlaCommitment', model: 'FieldServiceSlaCommitment', delegate: 'fieldServiceSlaCommitment', route: 'sla-commitments', group: 'SLA Management', event: 'SLA_POLICY_CREATED' },
  { entity: 'fieldServiceSlaBreach', model: 'FieldServiceSlaBreach', delegate: 'fieldServiceSlaBreach', route: 'sla-breaches', group: 'SLA Management', event: 'SLA_BREACH_DETECTED' },
  { entity: 'fieldServiceEscalation', model: 'FieldServiceEscalation', delegate: 'fieldServiceEscalation', route: 'escalations', group: 'SLA Management', event: 'FIELD_SERVICE_ESCALATED' },
  { entity: 'customerServiceVisit', model: 'CustomerServiceVisit', delegate: 'customerServiceVisit', route: 'service-visits', group: 'Customer Service Intelligence', event: 'CUSTOMER_VISIT_COMPLETED' },
  { entity: 'customerServiceFeedback', model: 'CustomerServiceFeedback', delegate: 'customerServiceFeedback', route: 'service-feedback', group: 'Customer Service Intelligence', event: 'CUSTOMER_FEEDBACK_RECEIVED' },
  { entity: 'customerServiceResolution', model: 'CustomerServiceResolution', delegate: 'customerServiceResolution', route: 'service-resolutions', group: 'Customer Service Intelligence', event: 'CUSTOMER_VISIT_COMPLETED' },
  { entity: 'customerServiceInsight', model: 'CustomerServiceInsight', delegate: 'customerServiceInsight', route: 'service-insights', group: 'Customer Service Intelligence', event: 'FIELD_ANALYTICS_GENERATED' },
  { entity: 'fieldWorkforceMetric', model: 'FieldWorkforceMetric', delegate: 'fieldWorkforceMetric', route: 'metrics', group: 'Workforce Analytics', event: 'FIELD_ANALYTICS_GENERATED' },
  { entity: 'fieldWorkforceAnalyticsSnapshot', model: 'FieldWorkforceAnalyticsSnapshot', delegate: 'fieldWorkforceAnalyticsSnapshot', route: 'analytics-snapshots', group: 'Workforce Analytics', event: 'FIELD_ANALYTICS_GENERATED' },
  { entity: 'technicianUtilizationRecord', model: 'TechnicianUtilizationRecord', delegate: 'technicianUtilizationRecord', route: 'technician-utilization', group: 'Workforce Analytics', event: 'FIELD_ANALYTICS_GENERATED' },
  { entity: 'fieldServiceForecast', model: 'FieldServiceForecast', delegate: 'fieldServiceForecast', route: 'forecasts', group: 'Workforce Analytics', event: 'FIELD_ANALYTICS_GENERATED' },
  { entity: 'fieldServiceCopilotQuery', model: 'FieldServiceCopilotQuery', delegate: 'fieldServiceCopilotQuery', route: 'queries', group: 'AI Field Service Copilot', event: 'FIELD_SERVICE_COPILOT_QUERIED' },
  { entity: 'fieldServiceRecommendation', model: 'FieldServiceRecommendation', delegate: 'fieldServiceRecommendation', route: 'recommendations', group: 'AI Field Service Copilot', event: 'FIELD_RECOMMENDATION_CREATED' },
  { entity: 'fieldServiceRiskSignal', model: 'FieldServiceRiskSignal', delegate: 'fieldServiceRiskSignal', route: 'risk-signals', group: 'AI Field Service Copilot', event: 'FIELD_RISK_DETECTED' },
];

export const FIELD_SERVICE_GROUPS = {
  'Field Service Management': { apiGroup: '/v1/field-service-management', entities: FIELD_SERVICE_ENTITIES.filter((entity) => entity.group === 'Field Service Management') },
  'Work Order Management': { apiGroup: '/v1/field-work-orders', entities: FIELD_SERVICE_ENTITIES.filter((entity) => entity.group === 'Work Order Management') },
  'Dispatch Engine': { apiGroup: '/v1/dispatch-engine', entities: FIELD_SERVICE_ENTITIES.filter((entity) => entity.group === 'Dispatch Engine') },
  'Technician Management': { apiGroup: '/v1/technician-management', entities: FIELD_SERVICE_ENTITIES.filter((entity) => entity.group === 'Technician Management') },
  'Route Optimization': { apiGroup: '/v1/field-route-optimization', entities: FIELD_SERVICE_ENTITIES.filter((entity) => entity.group === 'Route Optimization') },
  'Mobile Workforce Foundation': { apiGroup: '/v1/mobile-workforce', entities: FIELD_SERVICE_ENTITIES.filter((entity) => entity.group === 'Mobile Workforce Foundation') },
  'SLA Management': { apiGroup: '/v1/field-sla-management', entities: FIELD_SERVICE_ENTITIES.filter((entity) => entity.group === 'SLA Management') },
  'Customer Service Intelligence': { apiGroup: '/v1/customer-service-intelligence', entities: FIELD_SERVICE_ENTITIES.filter((entity) => entity.group === 'Customer Service Intelligence') },
  'Workforce Analytics': { apiGroup: '/v1/field-workforce-analytics', entities: FIELD_SERVICE_ENTITIES.filter((entity) => entity.group === 'Workforce Analytics') },
  'AI Field Service Copilot': { apiGroup: '/v1/field-service-copilot', entities: FIELD_SERVICE_ENTITIES.filter((entity) => entity.group === 'AI Field Service Copilot') },
} as const;

export function getFieldServiceEntity(entity: FieldServiceEntity) {
  const definition = FIELD_SERVICE_ENTITIES.find((item) => item.entity === entity);
  if (!definition) throw new Error('Unknown field service entity: ' + entity);
  return definition;
}

