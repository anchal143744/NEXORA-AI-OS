import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAdminOperationDto {
  @ApiProperty() @IsString() operationType!: string;
  @ApiProperty() @IsString() targetType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateEnvironmentDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() slug!: string;
  @ApiProperty({ enum: ['development', 'staging', 'production', 'disaster-recovery'] }) @IsIn(['development', 'staging', 'production', 'disaster-recovery']) environmentType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currentVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() approvalsRequired?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() variables?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateReleaseDto {
  @ApiPropertyOptional() @IsOptional() @IsString() environmentId?: string;
  @ApiProperty() @IsString() version!: string;
  @ApiProperty({ enum: ['major', 'minor', 'patch', 'hotfix', 'rollback'] }) @IsIn(['major', 'minor', 'patch', 'hotfix', 'rollback']) releaseType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() changeSummary?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rollbackTargetVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() approvalPolicy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateFeatureFlagDto {
  @ApiProperty() @IsString() flagKey!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() rolloutStrategy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() rules?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpdateFeatureFlagDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() rolloutStrategy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() rules?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateChangeRequestDto {
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() changeType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() environmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() releaseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() impactAssessment?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() rollbackPlan?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateIncidentDto {
  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'] }) @IsIn(['low', 'medium', 'high', 'critical']) severity!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class SuspendTenantDto {
  @ApiProperty() @IsString() reason!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateEmergencyControlDto {
  @ApiProperty() @IsString() controlKey!: string;
  @ApiProperty() @IsString() scope!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class RecordHealthSnapshotDto {
  @ApiProperty() @IsString() component!: string;
  @ApiProperty() @IsString() status!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() latencyMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() details?: Record<string, unknown>;
}
