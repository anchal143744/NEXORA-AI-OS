import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateDataRegionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() regionKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() countryCode!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() regionCode?: string;
  @ApiProperty() @IsString() jurisdiction!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cloudProvider?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataResidencyTier?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() allowedDataClasses?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() restrictedDataClasses?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() encryptionRequirements?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateResidencyPolicyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataRegionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enforcementMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() dataClasses?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() allowedRegions?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() restrictedRegions?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() retentionRules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSovereigntyRuleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ruleKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() countryCode!: string;
  @ApiProperty() @IsString() jurisdiction!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ruleType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enforcementMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() conditions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() restrictions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() exceptions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRegulatoryFrameworkDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frameworkKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frameworkType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() jurisdiction?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() authority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() version?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateComplianceRequirementDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frameworkId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requirementKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requirementType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() controlMapping?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() evidenceRequirements?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateJurisdictionRuleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataRegionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ruleKey?: string;
  @ApiProperty() @IsString() jurisdiction!: string;
  @ApiProperty() @IsString() countryCode!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ruleType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() requirements?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() restrictions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() penalties?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateDataTransferRuleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceRegionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() destinationRegionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ruleKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() transferType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() allowed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsArray() dataClasses?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() safeguards?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() approvalRequired?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() legalBasis?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateComplianceAuditDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frameworkId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requirementId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataRegionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() auditKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() auditType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() scope?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() findings?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() evidence?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() remediation?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() auditedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() auditorUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRegulatoryAlertDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frameworkId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataRegionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() alertKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() alertType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() message?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() triggeredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() acknowledgedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateResidencyAssignmentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataRegionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignmentKey?: string;
  @ApiProperty() @IsString() subjectType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subjectId?: string;
  @ApiProperty() @IsString() dataClass!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() residencyStatus?: string;
  @ApiProperty() @IsString() assignedRegion!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enforcementMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateDataLocationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataRegionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() locationKey?: string;
  @ApiProperty() @IsString() dataObjectType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataObjectId?: string;
  @ApiProperty() @IsString() storageProvider!: string;
  @ApiProperty() @IsString() storageRegion!: string;
  @ApiProperty() @IsString() countryCode!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() residencyState?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() encryptionState?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastVerifiedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRegulatoryRiskDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frameworkId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requirementId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataRegionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskKey?: string;
  @ApiProperty() @IsString() riskType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() impactScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() riskScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() mitigationPlan?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}