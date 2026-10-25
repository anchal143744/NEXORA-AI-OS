export type ProductionReadinessEntity = 'securityHardeningControl' | 'securityAuditFinding' | 'dependencyRemediationRecord' | 'loadTestScenario' | 'loadTestRun' | 'stressTestRun' | 'performanceBenchmark' | 'performanceOptimizationAction' | 'performanceRegression' | 'observabilityDashboard' | 'monitoringAlertRule' | 'telemetrySignal' | 'backupPolicy' | 'backupValidationRun' | 'recoveryPointObjective' | 'disasterRecoveryPlan' | 'disasterRecoveryExercise' | 'failoverValidation' | 'deploymentReadinessCheck' | 'environmentReadinessProfile' | 'startupValidationRecord' | 'apiGovernanceReview' | 'apiPolicyAssessment' | 'apiVersionCompliance' | 'testCoverageSnapshot' | 'unitTestCoverageReview' | 'integrationTestCoverageReview' | 'releaseCandidateChecklist' | 'releaseValidationRun' | 'releaseApproval' | 'enterpriseDocumentationReview' | 'documentationGap' | 'documentationEvidence' | 'productionReadinessScore' | 'productionRiskRegister' | 'hardeningAuditEvent';

export interface ProductionReadinessEntityDefinition {
  entity: ProductionReadinessEntity;
  model: string;
  delegate: string;
  route: string;
  group: string;
  event: string;
}

export const PRODUCTION_READINESS_ENTITIES: ProductionReadinessEntityDefinition[] = [
  { entity: 'securityHardeningControl', model: 'SecurityHardeningControl', delegate: 'securityHardeningControl', route: 'controls', group: 'Security Hardening', event: 'SECURITY_HARDENING_CONTROL_CREATED' },
  { entity: 'securityAuditFinding', model: 'SecurityAuditFinding', delegate: 'securityAuditFinding', route: 'audit-findings', group: 'Security Hardening', event: 'SECURITY_AUDIT_COMPLETED' },
  { entity: 'dependencyRemediationRecord', model: 'DependencyRemediationRecord', delegate: 'dependencyRemediationRecord', route: 'dependency-remediations', group: 'Security Hardening', event: 'DEPENDENCY_REMEDIATION_RECORDED' },
  { entity: 'loadTestScenario', model: 'LoadTestScenario', delegate: 'loadTestScenario', route: 'scenarios', group: 'Load Testing', event: 'LOAD_TEST_STARTED' },
  { entity: 'loadTestRun', model: 'LoadTestRun', delegate: 'loadTestRun', route: 'runs', group: 'Load Testing', event: 'LOAD_TEST_COMPLETED' },
  { entity: 'stressTestRun', model: 'StressTestRun', delegate: 'stressTestRun', route: 'stress-runs', group: 'Load Testing', event: 'STRESS_TEST_COMPLETED' },
  { entity: 'performanceBenchmark', model: 'PerformanceBenchmark', delegate: 'performanceBenchmark', route: 'benchmarks', group: 'Performance Optimization', event: 'PERFORMANCE_BENCHMARK_RECORDED' },
  { entity: 'performanceOptimizationAction', model: 'PerformanceOptimizationAction', delegate: 'performanceOptimizationAction', route: 'optimization-actions', group: 'Performance Optimization', event: 'PERFORMANCE_OPTIMIZATION_APPLIED' },
  { entity: 'performanceRegression', model: 'PerformanceRegression', delegate: 'performanceRegression', route: 'regressions', group: 'Performance Optimization', event: 'PERFORMANCE_REGRESSION_DETECTED' },
  { entity: 'observabilityDashboard', model: 'ObservabilityDashboard', delegate: 'observabilityDashboard', route: 'dashboards', group: 'Monitoring & Observability', event: 'OBSERVABILITY_SIGNAL_RECORDED' },
  { entity: 'monitoringAlertRule', model: 'MonitoringAlertRule', delegate: 'monitoringAlertRule', route: 'alert-rules', group: 'Monitoring & Observability', event: 'MONITORING_ALERT_RULE_CREATED' },
  { entity: 'telemetrySignal', model: 'TelemetrySignal', delegate: 'telemetrySignal', route: 'telemetry-signals', group: 'Monitoring & Observability', event: 'OBSERVABILITY_SIGNAL_RECORDED' },
  { entity: 'backupPolicy', model: 'BackupPolicy', delegate: 'backupPolicy', route: 'policies', group: 'Backup & Recovery', event: 'BACKUP_POLICY_CREATED' },
  { entity: 'backupValidationRun', model: 'BackupValidationRun', delegate: 'backupValidationRun', route: 'validation-runs', group: 'Backup & Recovery', event: 'BACKUP_VALIDATION_COMPLETED' },
  { entity: 'recoveryPointObjective', model: 'RecoveryPointObjective', delegate: 'recoveryPointObjective', route: 'recovery-point-objectives', group: 'Backup & Recovery', event: 'RECOVERY_POINT_VALIDATED' },
  { entity: 'disasterRecoveryPlan', model: 'DisasterRecoveryPlan', delegate: 'disasterRecoveryPlan', route: 'plans', group: 'Disaster Recovery', event: 'DISASTER_RECOVERY_PLAN_CREATED' },
  { entity: 'disasterRecoveryExercise', model: 'DisasterRecoveryExercise', delegate: 'disasterRecoveryExercise', route: 'exercises', group: 'Disaster Recovery', event: 'DISASTER_RECOVERY_EXERCISED' },
  { entity: 'failoverValidation', model: 'FailoverValidation', delegate: 'failoverValidation', route: 'failover-validations', group: 'Disaster Recovery', event: 'FAILOVER_VALIDATED' },
  { entity: 'deploymentReadinessCheck', model: 'DeploymentReadinessCheck', delegate: 'deploymentReadinessCheck', route: 'checks', group: 'Production Deployment Readiness', event: 'DEPLOYMENT_READINESS_CHECKED' },
  { entity: 'environmentReadinessProfile', model: 'EnvironmentReadinessProfile', delegate: 'environmentReadinessProfile', route: 'environment-profiles', group: 'Production Deployment Readiness', event: 'ENVIRONMENT_READINESS_VALIDATED' },
  { entity: 'startupValidationRecord', model: 'StartupValidationRecord', delegate: 'startupValidationRecord', route: 'startup-validations', group: 'Production Deployment Readiness', event: 'STARTUP_VALIDATION_COMPLETED' },
  { entity: 'apiGovernanceReview', model: 'ApiGovernanceReview', delegate: 'apiGovernanceReview', route: 'reviews', group: 'API Governance', event: 'API_GOVERNANCE_REVIEW_COMPLETED' },
  { entity: 'apiPolicyAssessment', model: 'ApiPolicyAssessment', delegate: 'apiPolicyAssessment', route: 'policy-assessments', group: 'API Governance', event: 'API_POLICY_ASSESSED' },
  { entity: 'apiVersionCompliance', model: 'ApiVersionCompliance', delegate: 'apiVersionCompliance', route: 'version-compliance', group: 'API Governance', event: 'API_VERSION_COMPLIANCE_RECORDED' },
  { entity: 'testCoverageSnapshot', model: 'TestCoverageSnapshot', delegate: 'testCoverageSnapshot', route: 'coverage-snapshots', group: 'Test Coverage Expansion', event: 'TEST_COVERAGE_SNAPSHOT_CREATED' },
  { entity: 'unitTestCoverageReview', model: 'UnitTestCoverageReview', delegate: 'unitTestCoverageReview', route: 'unit-coverage-reviews', group: 'Test Coverage Expansion', event: 'UNIT_COVERAGE_REVIEW_COMPLETED' },
  { entity: 'integrationTestCoverageReview', model: 'IntegrationTestCoverageReview', delegate: 'integrationTestCoverageReview', route: 'integration-coverage-reviews', group: 'Test Coverage Expansion', event: 'INTEGRATION_COVERAGE_REVIEW_COMPLETED' },
  { entity: 'releaseCandidateChecklist', model: 'ReleaseCandidateChecklist', delegate: 'releaseCandidateChecklist', route: 'checklists', group: 'Release Candidate Validation', event: 'RELEASE_CANDIDATE_CHECKLIST_CREATED' },
  { entity: 'releaseValidationRun', model: 'ReleaseValidationRun', delegate: 'releaseValidationRun', route: 'validation-runs', group: 'Release Candidate Validation', event: 'RELEASE_VALIDATION_COMPLETED' },
  { entity: 'releaseApproval', model: 'ReleaseApproval', delegate: 'releaseApproval', route: 'approvals', group: 'Release Candidate Validation', event: 'RELEASE_APPROVAL_RECORDED' },
  { entity: 'enterpriseDocumentationReview', model: 'EnterpriseDocumentationReview', delegate: 'enterpriseDocumentationReview', route: 'reviews', group: 'Enterprise Documentation', event: 'DOCUMENTATION_REVIEW_COMPLETED' },
  { entity: 'documentationGap', model: 'DocumentationGap', delegate: 'documentationGap', route: 'gaps', group: 'Enterprise Documentation', event: 'DOCUMENTATION_GAP_RECORDED' },
  { entity: 'documentationEvidence', model: 'DocumentationEvidence', delegate: 'documentationEvidence', route: 'evidence', group: 'Enterprise Documentation', event: 'DOCUMENTATION_REVIEW_COMPLETED' },
  { entity: 'productionReadinessScore', model: 'ProductionReadinessScore', delegate: 'productionReadinessScore', route: 'scores', group: 'Production Readiness Scoring', event: 'PRODUCTION_READINESS_SCORED' },
  { entity: 'productionRiskRegister', model: 'ProductionRiskRegister', delegate: 'productionRiskRegister', route: 'risk-register', group: 'Production Readiness Scoring', event: 'PRODUCTION_RISK_REGISTERED' },
  { entity: 'hardeningAuditEvent', model: 'HardeningAuditEvent', delegate: 'hardeningAuditEvent', route: 'audit-events', group: 'Production Readiness Scoring', event: 'HARDENING_AUDIT_RECORDED' },
];

export const PRODUCTION_READINESS_GROUPS = {
  'Security Hardening': { apiGroup: '/v1/security-hardening', entities: PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === 'Security Hardening') },
  'Load Testing': { apiGroup: '/v1/load-testing', entities: PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === 'Load Testing') },
  'Performance Optimization': { apiGroup: '/v1/performance-optimization', entities: PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === 'Performance Optimization') },
  'Monitoring & Observability': { apiGroup: '/v1/monitoring-observability', entities: PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === 'Monitoring & Observability') },
  'Backup & Recovery': { apiGroup: '/v1/backup-recovery', entities: PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === 'Backup & Recovery') },
  'Disaster Recovery': { apiGroup: '/v1/disaster-recovery', entities: PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === 'Disaster Recovery') },
  'Production Deployment Readiness': { apiGroup: '/v1/deployment-readiness', entities: PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === 'Production Deployment Readiness') },
  'API Governance': { apiGroup: '/v1/api-governance-review', entities: PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === 'API Governance') },
  'Test Coverage Expansion': { apiGroup: '/v1/test-coverage', entities: PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === 'Test Coverage Expansion') },
  'Release Candidate Validation': { apiGroup: '/v1/release-candidate', entities: PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === 'Release Candidate Validation') },
  'Enterprise Documentation': { apiGroup: '/v1/enterprise-documentation', entities: PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === 'Enterprise Documentation') },
  'Production Readiness Scoring': { apiGroup: '/v1/production-readiness-scoring', entities: PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === 'Production Readiness Scoring') },
} as const;

export function getProductionReadinessEntity(entity: ProductionReadinessEntity) {
  const definition = PRODUCTION_READINESS_ENTITIES.find((item) => item.entity === entity);
  if (!definition) throw new Error('Unknown production readiness entity: ' + entity);
  return definition;
}
