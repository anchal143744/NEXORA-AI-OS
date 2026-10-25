import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recordKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() environment?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() releaseVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() releaseCandidate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() controlId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() checkId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scenarioId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() runId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() findingId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() evidenceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() complianceStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() validationStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvalStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reviewerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reviewedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() score?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() readinessScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() securityScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() performanceScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() reliabilityScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() documentationScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() coverageScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() riskScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() p50LatencyMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() p95LatencyMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() p99LatencyMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() throughputRps?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() errorRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() successRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() uptimePercent?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() rpoMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() rtoMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() targetUsers?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() concurrentUsers?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() durationMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() totalChecks?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() passedChecks?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() failedChecks?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() openFindings?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() remediatedFindings?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() criticalFindings?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() highFindings?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() moderateFindings?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() lowFindings?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isBlocking?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isAutomated?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requiresApproval?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsArray() evidence?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metrics?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() thresholds?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() remediationPlan?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() createdByUserId?: string;
}

export class CreateSecurityHardeningControlDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() securityHardeningControlCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() securityHardeningControlOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() securityHardeningControlAttributes?: Record<string, unknown>;
}

export class CreateSecurityAuditFindingDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() securityAuditFindingCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() securityAuditFindingOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() securityAuditFindingAttributes?: Record<string, unknown>;
}

export class CreateDependencyRemediationRecordDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() dependencyRemediationRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dependencyRemediationRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dependencyRemediationRecordAttributes?: Record<string, unknown>;
}

export class CreateLoadTestScenarioDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() loadTestScenarioCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() loadTestScenarioOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() loadTestScenarioAttributes?: Record<string, unknown>;
}

export class CreateLoadTestRunDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() loadTestRunCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() loadTestRunOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() loadTestRunAttributes?: Record<string, unknown>;
}

export class CreateStressTestRunDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() stressTestRunCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stressTestRunOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() stressTestRunAttributes?: Record<string, unknown>;
}

export class CreatePerformanceBenchmarkDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() performanceBenchmarkCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() performanceBenchmarkOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() performanceBenchmarkAttributes?: Record<string, unknown>;
}

export class CreatePerformanceOptimizationActionDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() performanceOptimizationActionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() performanceOptimizationActionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() performanceOptimizationActionAttributes?: Record<string, unknown>;
}

export class CreatePerformanceRegressionDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() performanceRegressionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() performanceRegressionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() performanceRegressionAttributes?: Record<string, unknown>;
}

export class CreateObservabilityDashboardDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() observabilityDashboardCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() observabilityDashboardOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() observabilityDashboardAttributes?: Record<string, unknown>;
}

export class CreateMonitoringAlertRuleDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() monitoringAlertRuleCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() monitoringAlertRuleOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() monitoringAlertRuleAttributes?: Record<string, unknown>;
}

export class CreateTelemetrySignalDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() telemetrySignalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() telemetrySignalOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() telemetrySignalAttributes?: Record<string, unknown>;
}

export class CreateBackupPolicyDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() backupPolicyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() backupPolicyOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() backupPolicyAttributes?: Record<string, unknown>;
}

export class CreateBackupValidationRunDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() backupValidationRunCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() backupValidationRunOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() backupValidationRunAttributes?: Record<string, unknown>;
}

export class CreateRecoveryPointObjectiveDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() recoveryPointObjectiveCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recoveryPointObjectiveOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() recoveryPointObjectiveAttributes?: Record<string, unknown>;
}

export class CreateDisasterRecoveryPlanDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() disasterRecoveryPlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() disasterRecoveryPlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() disasterRecoveryPlanAttributes?: Record<string, unknown>;
}

export class CreateDisasterRecoveryExerciseDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() disasterRecoveryExerciseCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() disasterRecoveryExerciseOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() disasterRecoveryExerciseAttributes?: Record<string, unknown>;
}

export class CreateFailoverValidationDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() failoverValidationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() failoverValidationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() failoverValidationAttributes?: Record<string, unknown>;
}

export class CreateDeploymentReadinessCheckDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() deploymentReadinessCheckCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deploymentReadinessCheckOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() deploymentReadinessCheckAttributes?: Record<string, unknown>;
}

export class CreateEnvironmentReadinessProfileDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() environmentReadinessProfileCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() environmentReadinessProfileOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() environmentReadinessProfileAttributes?: Record<string, unknown>;
}

export class CreateStartupValidationRecordDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() startupValidationRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startupValidationRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() startupValidationRecordAttributes?: Record<string, unknown>;
}

export class CreateApiGovernanceReviewDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() apiGovernanceReviewCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiGovernanceReviewOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() apiGovernanceReviewAttributes?: Record<string, unknown>;
}

export class CreateApiPolicyAssessmentDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() apiPolicyAssessmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiPolicyAssessmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() apiPolicyAssessmentAttributes?: Record<string, unknown>;
}

export class CreateApiVersionComplianceDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() apiVersionComplianceCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiVersionComplianceOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() apiVersionComplianceAttributes?: Record<string, unknown>;
}

export class CreateTestCoverageSnapshotDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() testCoverageSnapshotCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() testCoverageSnapshotOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() testCoverageSnapshotAttributes?: Record<string, unknown>;
}

export class CreateUnitTestCoverageReviewDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() unitTestCoverageReviewCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() unitTestCoverageReviewOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() unitTestCoverageReviewAttributes?: Record<string, unknown>;
}

export class CreateIntegrationTestCoverageReviewDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() integrationTestCoverageReviewCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() integrationTestCoverageReviewOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() integrationTestCoverageReviewAttributes?: Record<string, unknown>;
}

export class CreateReleaseCandidateChecklistDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() releaseCandidateChecklistCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() releaseCandidateChecklistOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() releaseCandidateChecklistAttributes?: Record<string, unknown>;
}

export class CreateReleaseValidationRunDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() releaseValidationRunCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() releaseValidationRunOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() releaseValidationRunAttributes?: Record<string, unknown>;
}

export class CreateReleaseApprovalDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() releaseApprovalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() releaseApprovalOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() releaseApprovalAttributes?: Record<string, unknown>;
}

export class CreateEnterpriseDocumentationReviewDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() enterpriseDocumentationReviewCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enterpriseDocumentationReviewOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() enterpriseDocumentationReviewAttributes?: Record<string, unknown>;
}

export class CreateDocumentationGapDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() documentationGapCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() documentationGapOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() documentationGapAttributes?: Record<string, unknown>;
}

export class CreateDocumentationEvidenceDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() documentationEvidenceCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() documentationEvidenceOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() documentationEvidenceAttributes?: Record<string, unknown>;
}

export class CreateProductionReadinessScoreDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productionReadinessScoreCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productionReadinessScoreOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() productionReadinessScoreAttributes?: Record<string, unknown>;
}

export class CreateProductionRiskRegisterDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productionRiskRegisterCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productionRiskRegisterOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() productionRiskRegisterAttributes?: Record<string, unknown>;
}

export class CreateHardeningAuditEventDto extends CreateProductionReadinessRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() hardeningAuditEventCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hardeningAuditEventOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() hardeningAuditEventAttributes?: Record<string, unknown>;
}
