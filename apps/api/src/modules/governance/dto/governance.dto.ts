import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsIn, IsInt, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateDataAssetDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() assetType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceSystem?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() entityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() classification?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sensitivityLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stewardUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessUnit?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class ClassifyDataDto {
  @ApiProperty() @IsString() entityType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() entityId?: string;
  @ApiProperty() @IsString() classification!: string;
  @ApiProperty() @IsString() sensitivityLevel!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() classifier?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() policyKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() evidence?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class AssignDataOwnerDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stewardUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownershipType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateLineageDto {
  @ApiProperty() @IsString() sourceAssetId!: string;
  @ApiProperty() @IsString() targetAssetId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lineageKey?: string;
  @ApiProperty() @IsString() transformType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() transformationKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() direction?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateQualityCheckDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() checkKey?: string;
  @ApiProperty() @IsString() checkType!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() score?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() threshold?: number;
  @ApiPropertyOptional() @IsOptional() issues?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() result?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpsertConsentDto {
  @ApiProperty() @IsString() subjectType!: string;
  @ApiProperty() @IsString() subjectId!: string;
  @ApiProperty() @IsString() consentKey!: string;
  @ApiProperty() @IsString() purpose!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lawfulBasis?: string;
  @ApiPropertyOptional({ enum: ['granted', 'withdrawn', 'expired'] }) @IsOptional() @IsIn(['granted', 'withdrawn', 'expired']) status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() evidence?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePrivacyRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsString() requestKey?: string;
  @ApiProperty({ enum: ['access', 'deletion', 'rectification', 'export', 'consent_review'] }) @IsIn(['access', 'deletion', 'rectification', 'export', 'consent_review']) requestType!: string;
  @ApiProperty() @IsString() subjectType!: string;
  @ApiProperty() @IsString() subjectId!: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() subjectEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() framework?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CompletePrivacyRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsObject() result?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() verificationStatus?: string;
}

export class CreateRetentionPolicyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() policyKey?: string;
  @ApiProperty() @IsString() recordType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() classification?: string;
  @ApiProperty() @IsInt() @Min(1) retentionDays!: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) archiveAfterDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() deletionMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) recoveryWindowDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() legalHoldExempt?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() rules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateLifecycleActionDto {
  @ApiProperty() @IsString() recordType!: string;
  @ApiProperty() @IsString() recordId!: string;
  @ApiProperty({ enum: ['create', 'archive', 'delete', 'recover', 'legal_hold'] }) @IsIn(['create', 'archive', 'delete', 'recover', 'legal_hold']) actionType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scheduledAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() legalHold?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() evidence?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateArchiveJobDto {
  @ApiPropertyOptional() @IsOptional() @IsString() archiveKey?: string;
  @ApiProperty() @IsString() recordType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() storageLocation?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) totalRecords?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() manifest?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class GenerateEvidenceDto {
  @ApiPropertyOptional() @IsOptional() @IsString() evidenceKey?: string;
  @ApiProperty() @IsString() framework!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() controlKey?: string;
  @ApiProperty() @IsString() evidenceType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() evidence?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() storageLocation?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class StartComplianceMonitorDto {
  @ApiPropertyOptional() @IsOptional() @IsString() runKey?: string;
  @ApiProperty() @IsString() framework!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() scope?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}