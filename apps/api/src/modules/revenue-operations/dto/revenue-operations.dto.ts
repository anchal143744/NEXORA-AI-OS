
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateRevenueAccountDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() accountKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() segment?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lifecycleStage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() annualRecurringRevenue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() totalContractValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() healthScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() churnRiskScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() expansionScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() renewalDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRevenueContractDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revenueAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contractKey?: string;
  @ApiProperty() @IsString() contractNumber!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contractType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() contractValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() annualRecurringRevenue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() startDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() renewalDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoRenew?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() terms?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() obligations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateContractAmendmentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revenueContractId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() amendmentKey?: string;
  @ApiProperty() @IsString() amendmentNumber!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() amendmentType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() signedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() valueDelta?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() arrDelta?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() termsDelta?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() approvals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRenewalScheduleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revenueAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revenueContractId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scheduleKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() renewalType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsString() renewalDate!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() noticeDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() renewalAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() playbook?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() tasks?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRenewalForecastDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revenueAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() renewalScheduleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() forecastKey?: string;
  @ApiProperty() @IsString() forecastPeriod!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() forecastDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() expectedRenewalAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() forecastStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskBand?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() drivers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() assumptions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateChurnSignalDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revenueAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() signalKey?: string;
  @ApiProperty() @IsString() signalType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() detectedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() signalPayload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendedActions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateExpansionOpportunityDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revenueAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() opportunityKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() opportunityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() estimatedValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() expectedCloseAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() signals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAccountHealthScoreDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revenueAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreKey?: string;
  @ApiProperty() @IsNumber() score!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreBand?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() previousScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() trend?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() calculatedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() drivers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() risks?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRevenueForecastDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revenueAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() forecastKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() forecastType?: string;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() forecastAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() committedAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() upsideAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() downsideAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() modelVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assumptions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() drivers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRevenueEventDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revenueAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revenueContractId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventKey?: string;
  @ApiProperty() @IsString() eventType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subjectType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subjectId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() occurredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() processedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
