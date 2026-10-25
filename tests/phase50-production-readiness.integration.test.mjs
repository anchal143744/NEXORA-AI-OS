import { assertReleaseVersions } from './helpers/web-contracts.mjs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');
const appModule = fs.readFileSync(path.join(root, 'apps/api/src/app.module.ts'), 'utf8');
const apiMap = fs.readFileSync(path.join(root, 'apps/web/services/production-readiness-api.ts'), 'utf8');
const registry = fs.readFileSync(path.join(root, 'apps/api/src/modules/events/registry/event-registry.ts'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

test('Phase 50 Prisma schema includes required release-candidate model surface', () => {
  const required = ["SecurityHardeningControl","SecurityAuditFinding","DependencyRemediationRecord","LoadTestScenario","LoadTestRun","StressTestRun","PerformanceBenchmark","PerformanceOptimizationAction","PerformanceRegression","ObservabilityDashboard","MonitoringAlertRule","TelemetrySignal","BackupPolicy","BackupValidationRun","RecoveryPointObjective","DisasterRecoveryPlan","DisasterRecoveryExercise","FailoverValidation","DeploymentReadinessCheck","EnvironmentReadinessProfile","StartupValidationRecord","ApiGovernanceReview","ApiPolicyAssessment","ApiVersionCompliance","TestCoverageSnapshot","UnitTestCoverageReview","IntegrationTestCoverageReview","ReleaseCandidateChecklist","ReleaseValidationRun","ReleaseApproval","EnterpriseDocumentationReview","DocumentationGap","DocumentationEvidence","ProductionReadinessScore","ProductionRiskRegister","HardeningAuditEvent"];
  for (const model of required) assert.ok(schema.includes('model ' + model + ' {'), model + ' exists in Prisma schema');
});

test('Phase 50 module, API map, events and version are registered', () => {
  assertReleaseVersions();
  assert.match(appModule, /ProductionReadinessModule/);
  for (const apiPath of ["/v1/security-hardening","/v1/load-testing","/v1/performance-optimization","/v1/monitoring-observability","/v1/backup-recovery","/v1/disaster-recovery","/v1/deployment-readiness","/v1/api-governance-review","/v1/test-coverage","/v1/release-candidate","/v1/enterprise-documentation","/v1/production-readiness-scoring"]) assert.ok(apiMap.includes(apiPath), apiPath + ' exists in API map');
  for (const eventName of ['SECURITY_AUDIT_COMPLETED', 'LOAD_TEST_COMPLETED', 'BACKUP_VALIDATION_COMPLETED', 'RELEASE_VALIDATION_COMPLETED', 'PRODUCTION_READINESS_SCORED']) assert.ok(registry.includes(eventName), eventName + ' registered');
});
