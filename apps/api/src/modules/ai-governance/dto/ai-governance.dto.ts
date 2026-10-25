import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAIModelRegistryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() registryKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() registryType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() governancePolicy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() accessPolicy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAIModelDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() registryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() provider?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() domain?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskTier?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() purpose?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() limitations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() policies?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAIModelVersionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() aiModelId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() versionKey?: string;
  @ApiProperty() @IsString() version!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() releaseStage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() artifactUri?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() promptTemplate?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() parameters?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() evaluationSummary?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deprecatedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAIModelDeploymentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() aiModelId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelVersionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deploymentKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() environment?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endpoint?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() trafficPercent?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() rollbackVersionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deployedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() retiredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() healthStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() runtimeConfig?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAIDecisionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() aiModelId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelVersionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deploymentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() decisionKey?: string;
  @ApiProperty() @IsString() decisionType!: string;
  @ApiProperty() @IsString() subjectType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subjectId?: string;
  @ApiProperty() @IsString() outcome!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() inputSummary?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() outputSummary?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() policyChecks?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() humanReviewed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() decidedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAIDecisionReasonDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() decisionId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reasonKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reasonType?: string;
  @ApiProperty() @IsString() description!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() weight?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() evidence?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAIDecisionRiskDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() decisionId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskKey?: string;
  @ApiProperty() @IsString() riskType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() impactScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() mitigation?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAIAuditLogDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() aiModelId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() decisionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() auditKey?: string;
  @ApiProperty() @IsString() action!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() actorUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() occurredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAIComplianceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() aiModelId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deploymentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() complianceKey?: string;
  @ApiProperty() @IsString() framework!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() controlId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() evidence?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() findings?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() remediation?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() assessedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assessorUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAIExplainabilityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() aiModelId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelVersionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() decisionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() explanationKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() explanationType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() summary?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() factors?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() counterfactuals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() generatedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateModelPerformanceMetricDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() aiModelId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelVersionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deploymentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricKey?: string;
  @ApiProperty() @IsString() metricName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricType?: string;
  @ApiProperty() @IsNumber() value!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() threshold?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() periodStart?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() periodEnd?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dimensions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() measuredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateModelApprovalWorkflowDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() aiModelId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelVersionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deploymentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workflowKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workflowType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskTier?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requestedByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() steps?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() decision?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() requestedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class DecideModelApprovalDto {
  @ApiProperty() @IsString() status!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() decision?: Record<string, unknown>;
}