import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateSecurityIncidentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() detectedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() impact?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() timeline?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSecurityThreatDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() threatKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() threatType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() indicators?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() tactics?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() mitigation?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() firstSeenAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastSeenAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateThreatDetectionRuleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ruleKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ruleType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() logic?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() conditions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() actions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() falsePositiveRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() lastTriggeredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateThreatEventDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() threatId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ruleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentId?: string;
  @ApiProperty() @IsString() eventType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() occurredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() indicators?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSecurityRiskDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() threatId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskKey?: string;
  @ApiProperty() @IsString() riskType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() impactScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() riskScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() mitigationPlan?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSecurityScoreDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scopeType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scopeId?: string;
  @ApiProperty() @IsNumber() score!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreBand?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() previousScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() trend?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() factors?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() calculatedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSecurityAuditDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() auditKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() auditType?: string;
  @ApiProperty() @IsString() action!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() actorUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() occurredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateComplianceViolationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() violationKey?: string;
  @ApiProperty() @IsString() framework!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() controlId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() evidence?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() remediation?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() detectedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateZeroTrustPolicyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enforcementMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() conditions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() actions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() riskThreshold?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() appliesTo?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAccessVerificationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() verificationKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceId?: string;
  @ApiProperty() @IsString() resourceType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resourceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() decision?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() riskScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() trustLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() reasons?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() context?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() verifiedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSecurityAlertDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() threatId?: string;
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

export class CreateSecurityInvestigationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() investigationKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() investigatorUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() findings?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() evidence?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() actions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() openedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() closedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpdateSecurityInvestigationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() investigatorUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() findings?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() evidence?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() actions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() closedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}