-- Phase 50 - Production Hardening and Enterprise Release Candidate Layer
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TABLE IF NOT EXISTS "security_hardening_controls" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "security_hardening_controls_tenant_record_key_uidx" ON "security_hardening_controls" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_tenant_workspace_idx" ON "security_hardening_controls" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_tenant_environment_idx" ON "security_hardening_controls" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_tenant_release_idx" ON "security_hardening_controls" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_tenant_status_idx" ON "security_hardening_controls" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_scenario_idx" ON "security_hardening_controls" ("scenarioId");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_run_idx" ON "security_hardening_controls" ("runId");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_policy_idx" ON "security_hardening_controls" ("policyId");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_finding_idx" ON "security_hardening_controls" ("findingId");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_risk_idx" ON "security_hardening_controls" ("riskId");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_validation_status_idx" ON "security_hardening_controls" ("validationStatus");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_approval_status_idx" ON "security_hardening_controls" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_risk_level_idx" ON "security_hardening_controls" ("riskLevel");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_severity_idx" ON "security_hardening_controls" ("severity");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_blocking_idx" ON "security_hardening_controls" ("isBlocking");
CREATE INDEX IF NOT EXISTS "security_hardening_controls_deleted_idx" ON "security_hardening_controls" ("deletedAt");


CREATE TABLE IF NOT EXISTS "security_audit_findings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "security_audit_findings_tenant_record_key_uidx" ON "security_audit_findings" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "security_audit_findings_tenant_workspace_idx" ON "security_audit_findings" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "security_audit_findings_tenant_environment_idx" ON "security_audit_findings" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "security_audit_findings_tenant_release_idx" ON "security_audit_findings" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "security_audit_findings_tenant_status_idx" ON "security_audit_findings" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "security_audit_findings_scenario_idx" ON "security_audit_findings" ("scenarioId");
CREATE INDEX IF NOT EXISTS "security_audit_findings_run_idx" ON "security_audit_findings" ("runId");
CREATE INDEX IF NOT EXISTS "security_audit_findings_policy_idx" ON "security_audit_findings" ("policyId");
CREATE INDEX IF NOT EXISTS "security_audit_findings_finding_idx" ON "security_audit_findings" ("findingId");
CREATE INDEX IF NOT EXISTS "security_audit_findings_risk_idx" ON "security_audit_findings" ("riskId");
CREATE INDEX IF NOT EXISTS "security_audit_findings_validation_status_idx" ON "security_audit_findings" ("validationStatus");
CREATE INDEX IF NOT EXISTS "security_audit_findings_approval_status_idx" ON "security_audit_findings" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "security_audit_findings_risk_level_idx" ON "security_audit_findings" ("riskLevel");
CREATE INDEX IF NOT EXISTS "security_audit_findings_severity_idx" ON "security_audit_findings" ("severity");
CREATE INDEX IF NOT EXISTS "security_audit_findings_blocking_idx" ON "security_audit_findings" ("isBlocking");
CREATE INDEX IF NOT EXISTS "security_audit_findings_deleted_idx" ON "security_audit_findings" ("deletedAt");


CREATE TABLE IF NOT EXISTS "dependency_remediation_records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "dependency_remediation_records_tenant_record_key_uidx" ON "dependency_remediation_records" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_tenant_workspace_idx" ON "dependency_remediation_records" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_tenant_environment_idx" ON "dependency_remediation_records" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_tenant_release_idx" ON "dependency_remediation_records" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_tenant_status_idx" ON "dependency_remediation_records" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_scenario_idx" ON "dependency_remediation_records" ("scenarioId");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_run_idx" ON "dependency_remediation_records" ("runId");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_policy_idx" ON "dependency_remediation_records" ("policyId");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_finding_idx" ON "dependency_remediation_records" ("findingId");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_risk_idx" ON "dependency_remediation_records" ("riskId");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_validation_status_idx" ON "dependency_remediation_records" ("validationStatus");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_approval_status_idx" ON "dependency_remediation_records" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_risk_level_idx" ON "dependency_remediation_records" ("riskLevel");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_severity_idx" ON "dependency_remediation_records" ("severity");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_blocking_idx" ON "dependency_remediation_records" ("isBlocking");
CREATE INDEX IF NOT EXISTS "dependency_remediation_records_deleted_idx" ON "dependency_remediation_records" ("deletedAt");


CREATE TABLE IF NOT EXISTS "load_test_scenarios" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "load_test_scenarios_tenant_record_key_uidx" ON "load_test_scenarios" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_tenant_workspace_idx" ON "load_test_scenarios" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_tenant_environment_idx" ON "load_test_scenarios" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_tenant_release_idx" ON "load_test_scenarios" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_tenant_status_idx" ON "load_test_scenarios" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_scenario_idx" ON "load_test_scenarios" ("scenarioId");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_run_idx" ON "load_test_scenarios" ("runId");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_policy_idx" ON "load_test_scenarios" ("policyId");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_finding_idx" ON "load_test_scenarios" ("findingId");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_risk_idx" ON "load_test_scenarios" ("riskId");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_validation_status_idx" ON "load_test_scenarios" ("validationStatus");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_approval_status_idx" ON "load_test_scenarios" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_risk_level_idx" ON "load_test_scenarios" ("riskLevel");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_severity_idx" ON "load_test_scenarios" ("severity");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_blocking_idx" ON "load_test_scenarios" ("isBlocking");
CREATE INDEX IF NOT EXISTS "load_test_scenarios_deleted_idx" ON "load_test_scenarios" ("deletedAt");


CREATE TABLE IF NOT EXISTS "load_test_runs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "load_test_runs_tenant_record_key_uidx" ON "load_test_runs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "load_test_runs_tenant_workspace_idx" ON "load_test_runs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "load_test_runs_tenant_environment_idx" ON "load_test_runs" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "load_test_runs_tenant_release_idx" ON "load_test_runs" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "load_test_runs_tenant_status_idx" ON "load_test_runs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "load_test_runs_scenario_idx" ON "load_test_runs" ("scenarioId");
CREATE INDEX IF NOT EXISTS "load_test_runs_run_idx" ON "load_test_runs" ("runId");
CREATE INDEX IF NOT EXISTS "load_test_runs_policy_idx" ON "load_test_runs" ("policyId");
CREATE INDEX IF NOT EXISTS "load_test_runs_finding_idx" ON "load_test_runs" ("findingId");
CREATE INDEX IF NOT EXISTS "load_test_runs_risk_idx" ON "load_test_runs" ("riskId");
CREATE INDEX IF NOT EXISTS "load_test_runs_validation_status_idx" ON "load_test_runs" ("validationStatus");
CREATE INDEX IF NOT EXISTS "load_test_runs_approval_status_idx" ON "load_test_runs" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "load_test_runs_risk_level_idx" ON "load_test_runs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "load_test_runs_severity_idx" ON "load_test_runs" ("severity");
CREATE INDEX IF NOT EXISTS "load_test_runs_blocking_idx" ON "load_test_runs" ("isBlocking");
CREATE INDEX IF NOT EXISTS "load_test_runs_deleted_idx" ON "load_test_runs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "stress_test_runs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "stress_test_runs_tenant_record_key_uidx" ON "stress_test_runs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "stress_test_runs_tenant_workspace_idx" ON "stress_test_runs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "stress_test_runs_tenant_environment_idx" ON "stress_test_runs" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "stress_test_runs_tenant_release_idx" ON "stress_test_runs" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "stress_test_runs_tenant_status_idx" ON "stress_test_runs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "stress_test_runs_scenario_idx" ON "stress_test_runs" ("scenarioId");
CREATE INDEX IF NOT EXISTS "stress_test_runs_run_idx" ON "stress_test_runs" ("runId");
CREATE INDEX IF NOT EXISTS "stress_test_runs_policy_idx" ON "stress_test_runs" ("policyId");
CREATE INDEX IF NOT EXISTS "stress_test_runs_finding_idx" ON "stress_test_runs" ("findingId");
CREATE INDEX IF NOT EXISTS "stress_test_runs_risk_idx" ON "stress_test_runs" ("riskId");
CREATE INDEX IF NOT EXISTS "stress_test_runs_validation_status_idx" ON "stress_test_runs" ("validationStatus");
CREATE INDEX IF NOT EXISTS "stress_test_runs_approval_status_idx" ON "stress_test_runs" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "stress_test_runs_risk_level_idx" ON "stress_test_runs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "stress_test_runs_severity_idx" ON "stress_test_runs" ("severity");
CREATE INDEX IF NOT EXISTS "stress_test_runs_blocking_idx" ON "stress_test_runs" ("isBlocking");
CREATE INDEX IF NOT EXISTS "stress_test_runs_deleted_idx" ON "stress_test_runs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "performance_benchmarks" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "performance_benchmarks_tenant_record_key_uidx" ON "performance_benchmarks" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_tenant_workspace_idx" ON "performance_benchmarks" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_tenant_environment_idx" ON "performance_benchmarks" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_tenant_release_idx" ON "performance_benchmarks" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_tenant_status_idx" ON "performance_benchmarks" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_scenario_idx" ON "performance_benchmarks" ("scenarioId");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_run_idx" ON "performance_benchmarks" ("runId");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_policy_idx" ON "performance_benchmarks" ("policyId");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_finding_idx" ON "performance_benchmarks" ("findingId");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_risk_idx" ON "performance_benchmarks" ("riskId");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_validation_status_idx" ON "performance_benchmarks" ("validationStatus");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_approval_status_idx" ON "performance_benchmarks" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_risk_level_idx" ON "performance_benchmarks" ("riskLevel");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_severity_idx" ON "performance_benchmarks" ("severity");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_blocking_idx" ON "performance_benchmarks" ("isBlocking");
CREATE INDEX IF NOT EXISTS "performance_benchmarks_deleted_idx" ON "performance_benchmarks" ("deletedAt");


CREATE TABLE IF NOT EXISTS "performance_optimization_actions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "performance_optimization_actions_tenant_record_key_uidx" ON "performance_optimization_actions" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_tenant_workspace_idx" ON "performance_optimization_actions" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_tenant_environment_idx" ON "performance_optimization_actions" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_tenant_release_idx" ON "performance_optimization_actions" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_tenant_status_idx" ON "performance_optimization_actions" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_scenario_idx" ON "performance_optimization_actions" ("scenarioId");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_run_idx" ON "performance_optimization_actions" ("runId");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_policy_idx" ON "performance_optimization_actions" ("policyId");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_finding_idx" ON "performance_optimization_actions" ("findingId");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_risk_idx" ON "performance_optimization_actions" ("riskId");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_validation_status_idx" ON "performance_optimization_actions" ("validationStatus");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_approval_status_idx" ON "performance_optimization_actions" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_risk_level_idx" ON "performance_optimization_actions" ("riskLevel");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_severity_idx" ON "performance_optimization_actions" ("severity");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_blocking_idx" ON "performance_optimization_actions" ("isBlocking");
CREATE INDEX IF NOT EXISTS "performance_optimization_actions_deleted_idx" ON "performance_optimization_actions" ("deletedAt");


CREATE TABLE IF NOT EXISTS "performance_regressions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "performance_regressions_tenant_record_key_uidx" ON "performance_regressions" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "performance_regressions_tenant_workspace_idx" ON "performance_regressions" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "performance_regressions_tenant_environment_idx" ON "performance_regressions" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "performance_regressions_tenant_release_idx" ON "performance_regressions" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "performance_regressions_tenant_status_idx" ON "performance_regressions" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "performance_regressions_scenario_idx" ON "performance_regressions" ("scenarioId");
CREATE INDEX IF NOT EXISTS "performance_regressions_run_idx" ON "performance_regressions" ("runId");
CREATE INDEX IF NOT EXISTS "performance_regressions_policy_idx" ON "performance_regressions" ("policyId");
CREATE INDEX IF NOT EXISTS "performance_regressions_finding_idx" ON "performance_regressions" ("findingId");
CREATE INDEX IF NOT EXISTS "performance_regressions_risk_idx" ON "performance_regressions" ("riskId");
CREATE INDEX IF NOT EXISTS "performance_regressions_validation_status_idx" ON "performance_regressions" ("validationStatus");
CREATE INDEX IF NOT EXISTS "performance_regressions_approval_status_idx" ON "performance_regressions" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "performance_regressions_risk_level_idx" ON "performance_regressions" ("riskLevel");
CREATE INDEX IF NOT EXISTS "performance_regressions_severity_idx" ON "performance_regressions" ("severity");
CREATE INDEX IF NOT EXISTS "performance_regressions_blocking_idx" ON "performance_regressions" ("isBlocking");
CREATE INDEX IF NOT EXISTS "performance_regressions_deleted_idx" ON "performance_regressions" ("deletedAt");


CREATE TABLE IF NOT EXISTS "observability_dashboards" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "observability_dashboards_tenant_record_key_uidx" ON "observability_dashboards" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "observability_dashboards_tenant_workspace_idx" ON "observability_dashboards" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "observability_dashboards_tenant_environment_idx" ON "observability_dashboards" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "observability_dashboards_tenant_release_idx" ON "observability_dashboards" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "observability_dashboards_tenant_status_idx" ON "observability_dashboards" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "observability_dashboards_scenario_idx" ON "observability_dashboards" ("scenarioId");
CREATE INDEX IF NOT EXISTS "observability_dashboards_run_idx" ON "observability_dashboards" ("runId");
CREATE INDEX IF NOT EXISTS "observability_dashboards_policy_idx" ON "observability_dashboards" ("policyId");
CREATE INDEX IF NOT EXISTS "observability_dashboards_finding_idx" ON "observability_dashboards" ("findingId");
CREATE INDEX IF NOT EXISTS "observability_dashboards_risk_idx" ON "observability_dashboards" ("riskId");
CREATE INDEX IF NOT EXISTS "observability_dashboards_validation_status_idx" ON "observability_dashboards" ("validationStatus");
CREATE INDEX IF NOT EXISTS "observability_dashboards_approval_status_idx" ON "observability_dashboards" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "observability_dashboards_risk_level_idx" ON "observability_dashboards" ("riskLevel");
CREATE INDEX IF NOT EXISTS "observability_dashboards_severity_idx" ON "observability_dashboards" ("severity");
CREATE INDEX IF NOT EXISTS "observability_dashboards_blocking_idx" ON "observability_dashboards" ("isBlocking");
CREATE INDEX IF NOT EXISTS "observability_dashboards_deleted_idx" ON "observability_dashboards" ("deletedAt");


CREATE TABLE IF NOT EXISTS "monitoring_alert_rules" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "monitoring_alert_rules_tenant_record_key_uidx" ON "monitoring_alert_rules" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_tenant_workspace_idx" ON "monitoring_alert_rules" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_tenant_environment_idx" ON "monitoring_alert_rules" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_tenant_release_idx" ON "monitoring_alert_rules" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_tenant_status_idx" ON "monitoring_alert_rules" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_scenario_idx" ON "monitoring_alert_rules" ("scenarioId");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_run_idx" ON "monitoring_alert_rules" ("runId");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_policy_idx" ON "monitoring_alert_rules" ("policyId");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_finding_idx" ON "monitoring_alert_rules" ("findingId");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_risk_idx" ON "monitoring_alert_rules" ("riskId");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_validation_status_idx" ON "monitoring_alert_rules" ("validationStatus");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_approval_status_idx" ON "monitoring_alert_rules" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_risk_level_idx" ON "monitoring_alert_rules" ("riskLevel");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_severity_idx" ON "monitoring_alert_rules" ("severity");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_blocking_idx" ON "monitoring_alert_rules" ("isBlocking");
CREATE INDEX IF NOT EXISTS "monitoring_alert_rules_deleted_idx" ON "monitoring_alert_rules" ("deletedAt");


CREATE TABLE IF NOT EXISTS "telemetry_signals" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "telemetry_signals_tenant_record_key_uidx" ON "telemetry_signals" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "telemetry_signals_tenant_workspace_idx" ON "telemetry_signals" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "telemetry_signals_tenant_environment_idx" ON "telemetry_signals" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "telemetry_signals_tenant_release_idx" ON "telemetry_signals" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "telemetry_signals_tenant_status_idx" ON "telemetry_signals" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "telemetry_signals_scenario_idx" ON "telemetry_signals" ("scenarioId");
CREATE INDEX IF NOT EXISTS "telemetry_signals_run_idx" ON "telemetry_signals" ("runId");
CREATE INDEX IF NOT EXISTS "telemetry_signals_policy_idx" ON "telemetry_signals" ("policyId");
CREATE INDEX IF NOT EXISTS "telemetry_signals_finding_idx" ON "telemetry_signals" ("findingId");
CREATE INDEX IF NOT EXISTS "telemetry_signals_risk_idx" ON "telemetry_signals" ("riskId");
CREATE INDEX IF NOT EXISTS "telemetry_signals_validation_status_idx" ON "telemetry_signals" ("validationStatus");
CREATE INDEX IF NOT EXISTS "telemetry_signals_approval_status_idx" ON "telemetry_signals" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "telemetry_signals_risk_level_idx" ON "telemetry_signals" ("riskLevel");
CREATE INDEX IF NOT EXISTS "telemetry_signals_severity_idx" ON "telemetry_signals" ("severity");
CREATE INDEX IF NOT EXISTS "telemetry_signals_blocking_idx" ON "telemetry_signals" ("isBlocking");
CREATE INDEX IF NOT EXISTS "telemetry_signals_deleted_idx" ON "telemetry_signals" ("deletedAt");


CREATE TABLE IF NOT EXISTS "backup_policys" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "backup_policys_tenant_record_key_uidx" ON "backup_policys" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "backup_policys_tenant_workspace_idx" ON "backup_policys" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "backup_policys_tenant_environment_idx" ON "backup_policys" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "backup_policys_tenant_release_idx" ON "backup_policys" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "backup_policys_tenant_status_idx" ON "backup_policys" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "backup_policys_scenario_idx" ON "backup_policys" ("scenarioId");
CREATE INDEX IF NOT EXISTS "backup_policys_run_idx" ON "backup_policys" ("runId");
CREATE INDEX IF NOT EXISTS "backup_policys_policy_idx" ON "backup_policys" ("policyId");
CREATE INDEX IF NOT EXISTS "backup_policys_finding_idx" ON "backup_policys" ("findingId");
CREATE INDEX IF NOT EXISTS "backup_policys_risk_idx" ON "backup_policys" ("riskId");
CREATE INDEX IF NOT EXISTS "backup_policys_validation_status_idx" ON "backup_policys" ("validationStatus");
CREATE INDEX IF NOT EXISTS "backup_policys_approval_status_idx" ON "backup_policys" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "backup_policys_risk_level_idx" ON "backup_policys" ("riskLevel");
CREATE INDEX IF NOT EXISTS "backup_policys_severity_idx" ON "backup_policys" ("severity");
CREATE INDEX IF NOT EXISTS "backup_policys_blocking_idx" ON "backup_policys" ("isBlocking");
CREATE INDEX IF NOT EXISTS "backup_policys_deleted_idx" ON "backup_policys" ("deletedAt");


CREATE TABLE IF NOT EXISTS "backup_validation_runs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "backup_validation_runs_tenant_record_key_uidx" ON "backup_validation_runs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_tenant_workspace_idx" ON "backup_validation_runs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_tenant_environment_idx" ON "backup_validation_runs" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_tenant_release_idx" ON "backup_validation_runs" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_tenant_status_idx" ON "backup_validation_runs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_scenario_idx" ON "backup_validation_runs" ("scenarioId");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_run_idx" ON "backup_validation_runs" ("runId");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_policy_idx" ON "backup_validation_runs" ("policyId");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_finding_idx" ON "backup_validation_runs" ("findingId");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_risk_idx" ON "backup_validation_runs" ("riskId");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_validation_status_idx" ON "backup_validation_runs" ("validationStatus");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_approval_status_idx" ON "backup_validation_runs" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_risk_level_idx" ON "backup_validation_runs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_severity_idx" ON "backup_validation_runs" ("severity");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_blocking_idx" ON "backup_validation_runs" ("isBlocking");
CREATE INDEX IF NOT EXISTS "backup_validation_runs_deleted_idx" ON "backup_validation_runs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "recovery_point_objectives" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "recovery_point_objectives_tenant_record_key_uidx" ON "recovery_point_objectives" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_tenant_workspace_idx" ON "recovery_point_objectives" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_tenant_environment_idx" ON "recovery_point_objectives" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_tenant_release_idx" ON "recovery_point_objectives" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_tenant_status_idx" ON "recovery_point_objectives" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_scenario_idx" ON "recovery_point_objectives" ("scenarioId");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_run_idx" ON "recovery_point_objectives" ("runId");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_policy_idx" ON "recovery_point_objectives" ("policyId");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_finding_idx" ON "recovery_point_objectives" ("findingId");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_risk_idx" ON "recovery_point_objectives" ("riskId");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_validation_status_idx" ON "recovery_point_objectives" ("validationStatus");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_approval_status_idx" ON "recovery_point_objectives" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_risk_level_idx" ON "recovery_point_objectives" ("riskLevel");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_severity_idx" ON "recovery_point_objectives" ("severity");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_blocking_idx" ON "recovery_point_objectives" ("isBlocking");
CREATE INDEX IF NOT EXISTS "recovery_point_objectives_deleted_idx" ON "recovery_point_objectives" ("deletedAt");


CREATE TABLE IF NOT EXISTS "disaster_recovery_plans" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "disaster_recovery_plans_tenant_record_key_uidx" ON "disaster_recovery_plans" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_tenant_workspace_idx" ON "disaster_recovery_plans" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_tenant_environment_idx" ON "disaster_recovery_plans" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_tenant_release_idx" ON "disaster_recovery_plans" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_tenant_status_idx" ON "disaster_recovery_plans" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_scenario_idx" ON "disaster_recovery_plans" ("scenarioId");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_run_idx" ON "disaster_recovery_plans" ("runId");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_policy_idx" ON "disaster_recovery_plans" ("policyId");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_finding_idx" ON "disaster_recovery_plans" ("findingId");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_risk_idx" ON "disaster_recovery_plans" ("riskId");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_validation_status_idx" ON "disaster_recovery_plans" ("validationStatus");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_approval_status_idx" ON "disaster_recovery_plans" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_risk_level_idx" ON "disaster_recovery_plans" ("riskLevel");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_severity_idx" ON "disaster_recovery_plans" ("severity");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_blocking_idx" ON "disaster_recovery_plans" ("isBlocking");
CREATE INDEX IF NOT EXISTS "disaster_recovery_plans_deleted_idx" ON "disaster_recovery_plans" ("deletedAt");


CREATE TABLE IF NOT EXISTS "disaster_recovery_exercises" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "disaster_recovery_exercises_tenant_record_key_uidx" ON "disaster_recovery_exercises" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_tenant_workspace_idx" ON "disaster_recovery_exercises" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_tenant_environment_idx" ON "disaster_recovery_exercises" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_tenant_release_idx" ON "disaster_recovery_exercises" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_tenant_status_idx" ON "disaster_recovery_exercises" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_scenario_idx" ON "disaster_recovery_exercises" ("scenarioId");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_run_idx" ON "disaster_recovery_exercises" ("runId");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_policy_idx" ON "disaster_recovery_exercises" ("policyId");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_finding_idx" ON "disaster_recovery_exercises" ("findingId");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_risk_idx" ON "disaster_recovery_exercises" ("riskId");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_validation_status_idx" ON "disaster_recovery_exercises" ("validationStatus");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_approval_status_idx" ON "disaster_recovery_exercises" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_risk_level_idx" ON "disaster_recovery_exercises" ("riskLevel");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_severity_idx" ON "disaster_recovery_exercises" ("severity");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_blocking_idx" ON "disaster_recovery_exercises" ("isBlocking");
CREATE INDEX IF NOT EXISTS "disaster_recovery_exercises_deleted_idx" ON "disaster_recovery_exercises" ("deletedAt");


CREATE TABLE IF NOT EXISTS "failover_validations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "failover_validations_tenant_record_key_uidx" ON "failover_validations" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "failover_validations_tenant_workspace_idx" ON "failover_validations" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "failover_validations_tenant_environment_idx" ON "failover_validations" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "failover_validations_tenant_release_idx" ON "failover_validations" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "failover_validations_tenant_status_idx" ON "failover_validations" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "failover_validations_scenario_idx" ON "failover_validations" ("scenarioId");
CREATE INDEX IF NOT EXISTS "failover_validations_run_idx" ON "failover_validations" ("runId");
CREATE INDEX IF NOT EXISTS "failover_validations_policy_idx" ON "failover_validations" ("policyId");
CREATE INDEX IF NOT EXISTS "failover_validations_finding_idx" ON "failover_validations" ("findingId");
CREATE INDEX IF NOT EXISTS "failover_validations_risk_idx" ON "failover_validations" ("riskId");
CREATE INDEX IF NOT EXISTS "failover_validations_validation_status_idx" ON "failover_validations" ("validationStatus");
CREATE INDEX IF NOT EXISTS "failover_validations_approval_status_idx" ON "failover_validations" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "failover_validations_risk_level_idx" ON "failover_validations" ("riskLevel");
CREATE INDEX IF NOT EXISTS "failover_validations_severity_idx" ON "failover_validations" ("severity");
CREATE INDEX IF NOT EXISTS "failover_validations_blocking_idx" ON "failover_validations" ("isBlocking");
CREATE INDEX IF NOT EXISTS "failover_validations_deleted_idx" ON "failover_validations" ("deletedAt");


CREATE TABLE IF NOT EXISTS "deployment_readiness_checks" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "deployment_readiness_checks_tenant_record_key_uidx" ON "deployment_readiness_checks" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_tenant_workspace_idx" ON "deployment_readiness_checks" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_tenant_environment_idx" ON "deployment_readiness_checks" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_tenant_release_idx" ON "deployment_readiness_checks" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_tenant_status_idx" ON "deployment_readiness_checks" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_scenario_idx" ON "deployment_readiness_checks" ("scenarioId");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_run_idx" ON "deployment_readiness_checks" ("runId");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_policy_idx" ON "deployment_readiness_checks" ("policyId");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_finding_idx" ON "deployment_readiness_checks" ("findingId");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_risk_idx" ON "deployment_readiness_checks" ("riskId");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_validation_status_idx" ON "deployment_readiness_checks" ("validationStatus");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_approval_status_idx" ON "deployment_readiness_checks" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_risk_level_idx" ON "deployment_readiness_checks" ("riskLevel");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_severity_idx" ON "deployment_readiness_checks" ("severity");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_blocking_idx" ON "deployment_readiness_checks" ("isBlocking");
CREATE INDEX IF NOT EXISTS "deployment_readiness_checks_deleted_idx" ON "deployment_readiness_checks" ("deletedAt");


CREATE TABLE IF NOT EXISTS "environment_readiness_profiles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "environment_readiness_profiles_tenant_record_key_uidx" ON "environment_readiness_profiles" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_tenant_workspace_idx" ON "environment_readiness_profiles" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_tenant_environment_idx" ON "environment_readiness_profiles" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_tenant_release_idx" ON "environment_readiness_profiles" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_tenant_status_idx" ON "environment_readiness_profiles" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_scenario_idx" ON "environment_readiness_profiles" ("scenarioId");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_run_idx" ON "environment_readiness_profiles" ("runId");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_policy_idx" ON "environment_readiness_profiles" ("policyId");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_finding_idx" ON "environment_readiness_profiles" ("findingId");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_risk_idx" ON "environment_readiness_profiles" ("riskId");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_validation_status_idx" ON "environment_readiness_profiles" ("validationStatus");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_approval_status_idx" ON "environment_readiness_profiles" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_risk_level_idx" ON "environment_readiness_profiles" ("riskLevel");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_severity_idx" ON "environment_readiness_profiles" ("severity");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_blocking_idx" ON "environment_readiness_profiles" ("isBlocking");
CREATE INDEX IF NOT EXISTS "environment_readiness_profiles_deleted_idx" ON "environment_readiness_profiles" ("deletedAt");


CREATE TABLE IF NOT EXISTS "startup_validation_records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "startup_validation_records_tenant_record_key_uidx" ON "startup_validation_records" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "startup_validation_records_tenant_workspace_idx" ON "startup_validation_records" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "startup_validation_records_tenant_environment_idx" ON "startup_validation_records" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "startup_validation_records_tenant_release_idx" ON "startup_validation_records" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "startup_validation_records_tenant_status_idx" ON "startup_validation_records" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "startup_validation_records_scenario_idx" ON "startup_validation_records" ("scenarioId");
CREATE INDEX IF NOT EXISTS "startup_validation_records_run_idx" ON "startup_validation_records" ("runId");
CREATE INDEX IF NOT EXISTS "startup_validation_records_policy_idx" ON "startup_validation_records" ("policyId");
CREATE INDEX IF NOT EXISTS "startup_validation_records_finding_idx" ON "startup_validation_records" ("findingId");
CREATE INDEX IF NOT EXISTS "startup_validation_records_risk_idx" ON "startup_validation_records" ("riskId");
CREATE INDEX IF NOT EXISTS "startup_validation_records_validation_status_idx" ON "startup_validation_records" ("validationStatus");
CREATE INDEX IF NOT EXISTS "startup_validation_records_approval_status_idx" ON "startup_validation_records" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "startup_validation_records_risk_level_idx" ON "startup_validation_records" ("riskLevel");
CREATE INDEX IF NOT EXISTS "startup_validation_records_severity_idx" ON "startup_validation_records" ("severity");
CREATE INDEX IF NOT EXISTS "startup_validation_records_blocking_idx" ON "startup_validation_records" ("isBlocking");
CREATE INDEX IF NOT EXISTS "startup_validation_records_deleted_idx" ON "startup_validation_records" ("deletedAt");


CREATE TABLE IF NOT EXISTS "api_governance_reviews" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "api_governance_reviews_tenant_record_key_uidx" ON "api_governance_reviews" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_tenant_workspace_idx" ON "api_governance_reviews" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_tenant_environment_idx" ON "api_governance_reviews" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_tenant_release_idx" ON "api_governance_reviews" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_tenant_status_idx" ON "api_governance_reviews" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_scenario_idx" ON "api_governance_reviews" ("scenarioId");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_run_idx" ON "api_governance_reviews" ("runId");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_policy_idx" ON "api_governance_reviews" ("policyId");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_finding_idx" ON "api_governance_reviews" ("findingId");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_risk_idx" ON "api_governance_reviews" ("riskId");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_validation_status_idx" ON "api_governance_reviews" ("validationStatus");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_approval_status_idx" ON "api_governance_reviews" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_risk_level_idx" ON "api_governance_reviews" ("riskLevel");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_severity_idx" ON "api_governance_reviews" ("severity");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_blocking_idx" ON "api_governance_reviews" ("isBlocking");
CREATE INDEX IF NOT EXISTS "api_governance_reviews_deleted_idx" ON "api_governance_reviews" ("deletedAt");


CREATE TABLE IF NOT EXISTS "api_policy_assessments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "api_policy_assessments_tenant_record_key_uidx" ON "api_policy_assessments" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_tenant_workspace_idx" ON "api_policy_assessments" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_tenant_environment_idx" ON "api_policy_assessments" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_tenant_release_idx" ON "api_policy_assessments" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_tenant_status_idx" ON "api_policy_assessments" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_scenario_idx" ON "api_policy_assessments" ("scenarioId");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_run_idx" ON "api_policy_assessments" ("runId");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_policy_idx" ON "api_policy_assessments" ("policyId");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_finding_idx" ON "api_policy_assessments" ("findingId");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_risk_idx" ON "api_policy_assessments" ("riskId");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_validation_status_idx" ON "api_policy_assessments" ("validationStatus");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_approval_status_idx" ON "api_policy_assessments" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_risk_level_idx" ON "api_policy_assessments" ("riskLevel");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_severity_idx" ON "api_policy_assessments" ("severity");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_blocking_idx" ON "api_policy_assessments" ("isBlocking");
CREATE INDEX IF NOT EXISTS "api_policy_assessments_deleted_idx" ON "api_policy_assessments" ("deletedAt");


CREATE TABLE IF NOT EXISTS "api_version_compliances" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "api_version_compliances_tenant_record_key_uidx" ON "api_version_compliances" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "api_version_compliances_tenant_workspace_idx" ON "api_version_compliances" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "api_version_compliances_tenant_environment_idx" ON "api_version_compliances" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "api_version_compliances_tenant_release_idx" ON "api_version_compliances" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "api_version_compliances_tenant_status_idx" ON "api_version_compliances" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "api_version_compliances_scenario_idx" ON "api_version_compliances" ("scenarioId");
CREATE INDEX IF NOT EXISTS "api_version_compliances_run_idx" ON "api_version_compliances" ("runId");
CREATE INDEX IF NOT EXISTS "api_version_compliances_policy_idx" ON "api_version_compliances" ("policyId");
CREATE INDEX IF NOT EXISTS "api_version_compliances_finding_idx" ON "api_version_compliances" ("findingId");
CREATE INDEX IF NOT EXISTS "api_version_compliances_risk_idx" ON "api_version_compliances" ("riskId");
CREATE INDEX IF NOT EXISTS "api_version_compliances_validation_status_idx" ON "api_version_compliances" ("validationStatus");
CREATE INDEX IF NOT EXISTS "api_version_compliances_approval_status_idx" ON "api_version_compliances" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "api_version_compliances_risk_level_idx" ON "api_version_compliances" ("riskLevel");
CREATE INDEX IF NOT EXISTS "api_version_compliances_severity_idx" ON "api_version_compliances" ("severity");
CREATE INDEX IF NOT EXISTS "api_version_compliances_blocking_idx" ON "api_version_compliances" ("isBlocking");
CREATE INDEX IF NOT EXISTS "api_version_compliances_deleted_idx" ON "api_version_compliances" ("deletedAt");


CREATE TABLE IF NOT EXISTS "test_coverage_snapshots" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "test_coverage_snapshots_tenant_record_key_uidx" ON "test_coverage_snapshots" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_tenant_workspace_idx" ON "test_coverage_snapshots" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_tenant_environment_idx" ON "test_coverage_snapshots" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_tenant_release_idx" ON "test_coverage_snapshots" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_tenant_status_idx" ON "test_coverage_snapshots" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_scenario_idx" ON "test_coverage_snapshots" ("scenarioId");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_run_idx" ON "test_coverage_snapshots" ("runId");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_policy_idx" ON "test_coverage_snapshots" ("policyId");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_finding_idx" ON "test_coverage_snapshots" ("findingId");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_risk_idx" ON "test_coverage_snapshots" ("riskId");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_validation_status_idx" ON "test_coverage_snapshots" ("validationStatus");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_approval_status_idx" ON "test_coverage_snapshots" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_risk_level_idx" ON "test_coverage_snapshots" ("riskLevel");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_severity_idx" ON "test_coverage_snapshots" ("severity");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_blocking_idx" ON "test_coverage_snapshots" ("isBlocking");
CREATE INDEX IF NOT EXISTS "test_coverage_snapshots_deleted_idx" ON "test_coverage_snapshots" ("deletedAt");


CREATE TABLE IF NOT EXISTS "unit_test_coverage_reviews" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "unit_test_coverage_reviews_tenant_record_key_uidx" ON "unit_test_coverage_reviews" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_tenant_workspace_idx" ON "unit_test_coverage_reviews" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_tenant_environment_idx" ON "unit_test_coverage_reviews" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_tenant_release_idx" ON "unit_test_coverage_reviews" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_tenant_status_idx" ON "unit_test_coverage_reviews" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_scenario_idx" ON "unit_test_coverage_reviews" ("scenarioId");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_run_idx" ON "unit_test_coverage_reviews" ("runId");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_policy_idx" ON "unit_test_coverage_reviews" ("policyId");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_finding_idx" ON "unit_test_coverage_reviews" ("findingId");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_risk_idx" ON "unit_test_coverage_reviews" ("riskId");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_validation_status_idx" ON "unit_test_coverage_reviews" ("validationStatus");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_approval_status_idx" ON "unit_test_coverage_reviews" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_risk_level_idx" ON "unit_test_coverage_reviews" ("riskLevel");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_severity_idx" ON "unit_test_coverage_reviews" ("severity");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_blocking_idx" ON "unit_test_coverage_reviews" ("isBlocking");
CREATE INDEX IF NOT EXISTS "unit_test_coverage_reviews_deleted_idx" ON "unit_test_coverage_reviews" ("deletedAt");


CREATE TABLE IF NOT EXISTS "integration_test_coverage_reviews" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "integration_test_coverage_reviews_tenant_record_key_uidx" ON "integration_test_coverage_reviews" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_tenant_workspace_idx" ON "integration_test_coverage_reviews" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_tenant_environment_idx" ON "integration_test_coverage_reviews" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_tenant_release_idx" ON "integration_test_coverage_reviews" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_tenant_status_idx" ON "integration_test_coverage_reviews" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_scenario_idx" ON "integration_test_coverage_reviews" ("scenarioId");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_run_idx" ON "integration_test_coverage_reviews" ("runId");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_policy_idx" ON "integration_test_coverage_reviews" ("policyId");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_finding_idx" ON "integration_test_coverage_reviews" ("findingId");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_risk_idx" ON "integration_test_coverage_reviews" ("riskId");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_validation_status_idx" ON "integration_test_coverage_reviews" ("validationStatus");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_approval_status_idx" ON "integration_test_coverage_reviews" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_risk_level_idx" ON "integration_test_coverage_reviews" ("riskLevel");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_severity_idx" ON "integration_test_coverage_reviews" ("severity");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_blocking_idx" ON "integration_test_coverage_reviews" ("isBlocking");
CREATE INDEX IF NOT EXISTS "integration_test_coverage_reviews_deleted_idx" ON "integration_test_coverage_reviews" ("deletedAt");


CREATE TABLE IF NOT EXISTS "release_candidate_checklists" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "release_candidate_checklists_tenant_record_key_uidx" ON "release_candidate_checklists" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_tenant_workspace_idx" ON "release_candidate_checklists" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_tenant_environment_idx" ON "release_candidate_checklists" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_tenant_release_idx" ON "release_candidate_checklists" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_tenant_status_idx" ON "release_candidate_checklists" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_scenario_idx" ON "release_candidate_checklists" ("scenarioId");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_run_idx" ON "release_candidate_checklists" ("runId");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_policy_idx" ON "release_candidate_checklists" ("policyId");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_finding_idx" ON "release_candidate_checklists" ("findingId");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_risk_idx" ON "release_candidate_checklists" ("riskId");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_validation_status_idx" ON "release_candidate_checklists" ("validationStatus");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_approval_status_idx" ON "release_candidate_checklists" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_risk_level_idx" ON "release_candidate_checklists" ("riskLevel");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_severity_idx" ON "release_candidate_checklists" ("severity");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_blocking_idx" ON "release_candidate_checklists" ("isBlocking");
CREATE INDEX IF NOT EXISTS "release_candidate_checklists_deleted_idx" ON "release_candidate_checklists" ("deletedAt");


CREATE TABLE IF NOT EXISTS "release_validation_runs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "release_validation_runs_tenant_record_key_uidx" ON "release_validation_runs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "release_validation_runs_tenant_workspace_idx" ON "release_validation_runs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "release_validation_runs_tenant_environment_idx" ON "release_validation_runs" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "release_validation_runs_tenant_release_idx" ON "release_validation_runs" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "release_validation_runs_tenant_status_idx" ON "release_validation_runs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "release_validation_runs_scenario_idx" ON "release_validation_runs" ("scenarioId");
CREATE INDEX IF NOT EXISTS "release_validation_runs_run_idx" ON "release_validation_runs" ("runId");
CREATE INDEX IF NOT EXISTS "release_validation_runs_policy_idx" ON "release_validation_runs" ("policyId");
CREATE INDEX IF NOT EXISTS "release_validation_runs_finding_idx" ON "release_validation_runs" ("findingId");
CREATE INDEX IF NOT EXISTS "release_validation_runs_risk_idx" ON "release_validation_runs" ("riskId");
CREATE INDEX IF NOT EXISTS "release_validation_runs_validation_status_idx" ON "release_validation_runs" ("validationStatus");
CREATE INDEX IF NOT EXISTS "release_validation_runs_approval_status_idx" ON "release_validation_runs" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "release_validation_runs_risk_level_idx" ON "release_validation_runs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "release_validation_runs_severity_idx" ON "release_validation_runs" ("severity");
CREATE INDEX IF NOT EXISTS "release_validation_runs_blocking_idx" ON "release_validation_runs" ("isBlocking");
CREATE INDEX IF NOT EXISTS "release_validation_runs_deleted_idx" ON "release_validation_runs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "release_approvals" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "release_approvals_tenant_record_key_uidx" ON "release_approvals" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "release_approvals_tenant_workspace_idx" ON "release_approvals" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "release_approvals_tenant_environment_idx" ON "release_approvals" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "release_approvals_tenant_release_idx" ON "release_approvals" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "release_approvals_tenant_status_idx" ON "release_approvals" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "release_approvals_scenario_idx" ON "release_approvals" ("scenarioId");
CREATE INDEX IF NOT EXISTS "release_approvals_run_idx" ON "release_approvals" ("runId");
CREATE INDEX IF NOT EXISTS "release_approvals_policy_idx" ON "release_approvals" ("policyId");
CREATE INDEX IF NOT EXISTS "release_approvals_finding_idx" ON "release_approvals" ("findingId");
CREATE INDEX IF NOT EXISTS "release_approvals_risk_idx" ON "release_approvals" ("riskId");
CREATE INDEX IF NOT EXISTS "release_approvals_validation_status_idx" ON "release_approvals" ("validationStatus");
CREATE INDEX IF NOT EXISTS "release_approvals_approval_status_idx" ON "release_approvals" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "release_approvals_risk_level_idx" ON "release_approvals" ("riskLevel");
CREATE INDEX IF NOT EXISTS "release_approvals_severity_idx" ON "release_approvals" ("severity");
CREATE INDEX IF NOT EXISTS "release_approvals_blocking_idx" ON "release_approvals" ("isBlocking");
CREATE INDEX IF NOT EXISTS "release_approvals_deleted_idx" ON "release_approvals" ("deletedAt");


CREATE TABLE IF NOT EXISTS "enterprise_documentation_reviews" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "enterprise_documentation_reviews_tenant_record_key_uidx" ON "enterprise_documentation_reviews" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_tenant_workspace_idx" ON "enterprise_documentation_reviews" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_tenant_environment_idx" ON "enterprise_documentation_reviews" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_tenant_release_idx" ON "enterprise_documentation_reviews" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_tenant_status_idx" ON "enterprise_documentation_reviews" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_scenario_idx" ON "enterprise_documentation_reviews" ("scenarioId");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_run_idx" ON "enterprise_documentation_reviews" ("runId");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_policy_idx" ON "enterprise_documentation_reviews" ("policyId");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_finding_idx" ON "enterprise_documentation_reviews" ("findingId");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_risk_idx" ON "enterprise_documentation_reviews" ("riskId");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_validation_status_idx" ON "enterprise_documentation_reviews" ("validationStatus");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_approval_status_idx" ON "enterprise_documentation_reviews" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_risk_level_idx" ON "enterprise_documentation_reviews" ("riskLevel");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_severity_idx" ON "enterprise_documentation_reviews" ("severity");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_blocking_idx" ON "enterprise_documentation_reviews" ("isBlocking");
CREATE INDEX IF NOT EXISTS "enterprise_documentation_reviews_deleted_idx" ON "enterprise_documentation_reviews" ("deletedAt");


CREATE TABLE IF NOT EXISTS "documentation_gaps" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "documentation_gaps_tenant_record_key_uidx" ON "documentation_gaps" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "documentation_gaps_tenant_workspace_idx" ON "documentation_gaps" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "documentation_gaps_tenant_environment_idx" ON "documentation_gaps" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "documentation_gaps_tenant_release_idx" ON "documentation_gaps" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "documentation_gaps_tenant_status_idx" ON "documentation_gaps" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "documentation_gaps_scenario_idx" ON "documentation_gaps" ("scenarioId");
CREATE INDEX IF NOT EXISTS "documentation_gaps_run_idx" ON "documentation_gaps" ("runId");
CREATE INDEX IF NOT EXISTS "documentation_gaps_policy_idx" ON "documentation_gaps" ("policyId");
CREATE INDEX IF NOT EXISTS "documentation_gaps_finding_idx" ON "documentation_gaps" ("findingId");
CREATE INDEX IF NOT EXISTS "documentation_gaps_risk_idx" ON "documentation_gaps" ("riskId");
CREATE INDEX IF NOT EXISTS "documentation_gaps_validation_status_idx" ON "documentation_gaps" ("validationStatus");
CREATE INDEX IF NOT EXISTS "documentation_gaps_approval_status_idx" ON "documentation_gaps" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "documentation_gaps_risk_level_idx" ON "documentation_gaps" ("riskLevel");
CREATE INDEX IF NOT EXISTS "documentation_gaps_severity_idx" ON "documentation_gaps" ("severity");
CREATE INDEX IF NOT EXISTS "documentation_gaps_blocking_idx" ON "documentation_gaps" ("isBlocking");
CREATE INDEX IF NOT EXISTS "documentation_gaps_deleted_idx" ON "documentation_gaps" ("deletedAt");


CREATE TABLE IF NOT EXISTS "documentation_evidences" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "documentation_evidences_tenant_record_key_uidx" ON "documentation_evidences" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "documentation_evidences_tenant_workspace_idx" ON "documentation_evidences" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "documentation_evidences_tenant_environment_idx" ON "documentation_evidences" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "documentation_evidences_tenant_release_idx" ON "documentation_evidences" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "documentation_evidences_tenant_status_idx" ON "documentation_evidences" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "documentation_evidences_scenario_idx" ON "documentation_evidences" ("scenarioId");
CREATE INDEX IF NOT EXISTS "documentation_evidences_run_idx" ON "documentation_evidences" ("runId");
CREATE INDEX IF NOT EXISTS "documentation_evidences_policy_idx" ON "documentation_evidences" ("policyId");
CREATE INDEX IF NOT EXISTS "documentation_evidences_finding_idx" ON "documentation_evidences" ("findingId");
CREATE INDEX IF NOT EXISTS "documentation_evidences_risk_idx" ON "documentation_evidences" ("riskId");
CREATE INDEX IF NOT EXISTS "documentation_evidences_validation_status_idx" ON "documentation_evidences" ("validationStatus");
CREATE INDEX IF NOT EXISTS "documentation_evidences_approval_status_idx" ON "documentation_evidences" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "documentation_evidences_risk_level_idx" ON "documentation_evidences" ("riskLevel");
CREATE INDEX IF NOT EXISTS "documentation_evidences_severity_idx" ON "documentation_evidences" ("severity");
CREATE INDEX IF NOT EXISTS "documentation_evidences_blocking_idx" ON "documentation_evidences" ("isBlocking");
CREATE INDEX IF NOT EXISTS "documentation_evidences_deleted_idx" ON "documentation_evidences" ("deletedAt");


CREATE TABLE IF NOT EXISTS "production_readiness_scores" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "production_readiness_scores_tenant_record_key_uidx" ON "production_readiness_scores" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_tenant_workspace_idx" ON "production_readiness_scores" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_tenant_environment_idx" ON "production_readiness_scores" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_tenant_release_idx" ON "production_readiness_scores" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_tenant_status_idx" ON "production_readiness_scores" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_scenario_idx" ON "production_readiness_scores" ("scenarioId");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_run_idx" ON "production_readiness_scores" ("runId");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_policy_idx" ON "production_readiness_scores" ("policyId");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_finding_idx" ON "production_readiness_scores" ("findingId");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_risk_idx" ON "production_readiness_scores" ("riskId");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_validation_status_idx" ON "production_readiness_scores" ("validationStatus");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_approval_status_idx" ON "production_readiness_scores" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_risk_level_idx" ON "production_readiness_scores" ("riskLevel");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_severity_idx" ON "production_readiness_scores" ("severity");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_blocking_idx" ON "production_readiness_scores" ("isBlocking");
CREATE INDEX IF NOT EXISTS "production_readiness_scores_deleted_idx" ON "production_readiness_scores" ("deletedAt");


CREATE TABLE IF NOT EXISTS "production_risk_registers" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "production_risk_registers_tenant_record_key_uidx" ON "production_risk_registers" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "production_risk_registers_tenant_workspace_idx" ON "production_risk_registers" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "production_risk_registers_tenant_environment_idx" ON "production_risk_registers" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "production_risk_registers_tenant_release_idx" ON "production_risk_registers" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "production_risk_registers_tenant_status_idx" ON "production_risk_registers" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "production_risk_registers_scenario_idx" ON "production_risk_registers" ("scenarioId");
CREATE INDEX IF NOT EXISTS "production_risk_registers_run_idx" ON "production_risk_registers" ("runId");
CREATE INDEX IF NOT EXISTS "production_risk_registers_policy_idx" ON "production_risk_registers" ("policyId");
CREATE INDEX IF NOT EXISTS "production_risk_registers_finding_idx" ON "production_risk_registers" ("findingId");
CREATE INDEX IF NOT EXISTS "production_risk_registers_risk_idx" ON "production_risk_registers" ("riskId");
CREATE INDEX IF NOT EXISTS "production_risk_registers_validation_status_idx" ON "production_risk_registers" ("validationStatus");
CREATE INDEX IF NOT EXISTS "production_risk_registers_approval_status_idx" ON "production_risk_registers" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "production_risk_registers_risk_level_idx" ON "production_risk_registers" ("riskLevel");
CREATE INDEX IF NOT EXISTS "production_risk_registers_severity_idx" ON "production_risk_registers" ("severity");
CREATE INDEX IF NOT EXISTS "production_risk_registers_blocking_idx" ON "production_risk_registers" ("isBlocking");
CREATE INDEX IF NOT EXISTS "production_risk_registers_deleted_idx" ON "production_risk_registers" ("deletedAt");


CREATE TABLE IF NOT EXISTS "hardening_audit_events" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "environment" TEXT NOT NULL DEFAULT 'production',
  "releaseVersion" TEXT,
  "releaseCandidate" TEXT,
  "controlId" TEXT,
  "checkId" TEXT,
  "scenarioId" UUID,
  "runId" UUID,
  "policyId" UUID,
  "findingId" UUID,
  "riskId" UUID,
  "evidenceId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "stage" TEXT,
  "severity" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "riskLevel" TEXT,
  "complianceStatus" TEXT,
  "validationStatus" TEXT,
  "approvalStatus" TEXT,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "securityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p50LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p95LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "p99LatencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputRps" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rpoMinutes" INTEGER NOT NULL DEFAULT 0,
  "rtoMinutes" INTEGER NOT NULL DEFAULT 0,
  "targetUsers" INTEGER NOT NULL DEFAULT 0,
  "concurrentUsers" INTEGER NOT NULL DEFAULT 0,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "totalChecks" INTEGER NOT NULL DEFAULT 0,
  "passedChecks" INTEGER NOT NULL DEFAULT 0,
  "failedChecks" INTEGER NOT NULL DEFAULT 0,
  "openFindings" INTEGER NOT NULL DEFAULT 0,
  "remediatedFindings" INTEGER NOT NULL DEFAULT 0,
  "criticalFindings" INTEGER NOT NULL DEFAULT 0,
  "highFindings" INTEGER NOT NULL DEFAULT 0,
  "moderateFindings" INTEGER NOT NULL DEFAULT 0,
  "lowFindings" INTEGER NOT NULL DEFAULT 0,
  "isBlocking" BOOLEAN NOT NULL DEFAULT false,
  "isAutomated" BOOLEAN NOT NULL DEFAULT true,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "thresholds" JSONB NOT NULL DEFAULT '{}',
  "remediationPlan" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "hardening_audit_events_tenant_record_key_uidx" ON "hardening_audit_events" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_tenant_workspace_idx" ON "hardening_audit_events" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_tenant_environment_idx" ON "hardening_audit_events" ("tenantId", "environment");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_tenant_release_idx" ON "hardening_audit_events" ("tenantId", "releaseVersion");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_tenant_status_idx" ON "hardening_audit_events" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_scenario_idx" ON "hardening_audit_events" ("scenarioId");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_run_idx" ON "hardening_audit_events" ("runId");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_policy_idx" ON "hardening_audit_events" ("policyId");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_finding_idx" ON "hardening_audit_events" ("findingId");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_risk_idx" ON "hardening_audit_events" ("riskId");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_validation_status_idx" ON "hardening_audit_events" ("validationStatus");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_approval_status_idx" ON "hardening_audit_events" ("approvalStatus");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_risk_level_idx" ON "hardening_audit_events" ("riskLevel");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_severity_idx" ON "hardening_audit_events" ("severity");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_blocking_idx" ON "hardening_audit_events" ("isBlocking");
CREATE INDEX IF NOT EXISTS "hardening_audit_events_deleted_idx" ON "hardening_audit_events" ("deletedAt");
