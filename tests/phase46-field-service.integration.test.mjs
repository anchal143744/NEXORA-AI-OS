import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');
const appModule = fs.readFileSync(path.join(root, 'apps/api/src/app.module.ts'), 'utf8');
const apiMap = fs.readFileSync(path.join(root, 'apps/web/services/field-service-api.ts'), 'utf8');
const registry = fs.readFileSync(path.join(root, 'apps/api/src/modules/events/registry/event-registry.ts'), 'utf8');

test('Phase 46 Prisma schema includes required field-service model surface', () => {
  const required = ["FieldServiceRegion","FieldServiceTerritory","FieldServiceRequest","FieldServiceCase","FieldServiceAppointment","FieldWorkOrder","FieldWorkOrderTask","FieldWorkOrderPart","FieldWorkOrderChecklist","FieldWorkOrderCompletion","DispatchBoard","DispatchAssignment","DispatchRule","DispatchException","TechnicianProfile","TechnicianSkill","TechnicianCertification","TechnicianAvailability","TechnicianPerformance","FieldRoutePlan","FieldRouteStop","FieldRouteOptimization","TravelTimeEstimate","MobileWorkSession","MobileDeviceRegistration","OfflineJobQueue","MobileSyncEvent","FieldServiceSlaPolicy","FieldServiceSlaCommitment","FieldServiceSlaBreach","FieldServiceEscalation","CustomerServiceVisit","CustomerServiceFeedback","CustomerServiceResolution","CustomerServiceInsight","FieldWorkforceMetric","FieldWorkforceAnalyticsSnapshot","TechnicianUtilizationRecord","FieldServiceForecast","FieldServiceCopilotQuery","FieldServiceRecommendation","FieldServiceRiskSignal"];
  for (const model of required) assert.ok(schema.includes('model ' + model + ' {'), model + ' exists in Prisma schema');
});

test('Phase 46 module, API map and field-service events are registered', () => {
  assert.match(appModule, /FieldServiceModule/);
  for (const apiPath of ["/v1/field-service-management","/v1/field-work-orders","/v1/dispatch-engine","/v1/technician-management","/v1/field-route-optimization","/v1/mobile-workforce","/v1/field-sla-management","/v1/customer-service-intelligence","/v1/field-workforce-analytics","/v1/field-service-copilot"]) assert.ok(apiMap.includes(apiPath), apiPath + ' exists in API map');
  for (const eventName of ['FIELD_SERVICE_REQUEST_CREATED', 'SERVICE_APPOINTMENT_SCHEDULED', 'DISPATCH_ASSIGNMENT_CREATED', 'SLA_BREACH_DETECTED', 'FIELD_SERVICE_COPILOT_QUERIED']) assert.ok(registry.includes(eventName), eventName + ' registered');
});

