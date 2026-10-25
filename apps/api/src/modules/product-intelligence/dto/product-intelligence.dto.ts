import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductHealthScoreDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() moduleKey?: string;
  @ApiProperty() @IsNumber() score!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreBand?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() previousScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() trend?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() drivers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() risks?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() successMetrics?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateProductUsageMetricDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() moduleKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() featureKey?: string;
  @ApiProperty() @IsString() metricType!: string;
  @ApiProperty() @IsString() metricName!: string;
  @ApiProperty() @IsNumber() value!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dimensions?: Record<string, unknown>;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class StartUserJourneyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() journeyKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sessionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() journeyType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() entryPoint?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class RecordJourneyStepDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() journeyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stepKey?: string;
  @ApiProperty() @IsString() stepName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stepType?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) orderIndex?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() featureKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() moduleKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() exitedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) durationSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() properties?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class TrackProductEventDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sessionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() journeyId?: string;
  @ApiProperty() @IsString() eventName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() moduleKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() featureKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() occurredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() properties?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() context?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSessionAnalyticsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sessionKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) durationSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) pageViews?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) eventCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) featureCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() entryUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() exitUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() referrer?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateFeatureUsageDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() usageKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productKey?: string;
  @ApiProperty() @IsString() moduleKey!: string;
  @ApiProperty() @IsString() featureKey!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teamId?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) usageCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) activeUsers?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() adoptionRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() lastUsedAt?: string;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateFunnelDefinitionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() funnelKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() funnelType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() targetAudience?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() conversionGoal?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() stages?: Array<{ name: string; eventName: string; orderIndex?: number; criteria?: Record<string, unknown>; targetConversionRate?: number }>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateFunnelResultDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resultKey?: string;
  @ApiProperty() @IsString() funnelId!: string;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() stageResults?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() conversionRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() dropOffRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() bottlenecks?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateExperimentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() experimentKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hypothesis?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() experimentType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() targetAudience?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() primaryMetric?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() secondaryMetrics?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() startedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() variants?: Array<{ name: string; allocationPercent?: number; isControl?: boolean; config?: Record<string, unknown> }>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class AddExperimentVariantDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() variantKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() allocationPercent?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isControl?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() config?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class EvaluateExperimentResultDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() variantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resultKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) sampleSize?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) conversions?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() conversionRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() uplift?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() pValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() significant?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() metricResults?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRetentionCohortDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cohortKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cohortType?: string;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) userCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) retainedUsers?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() retentionRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() churnRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() segments?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() churnSignals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateEngagementScoreDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teamId?: string;
  @ApiProperty() @IsNumber() score!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreBand?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() stickiness?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) activityCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) activeDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() signals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateGrowthRecommendationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recommendationKey?: string;
  @ApiProperty() @IsString() recommendationType!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() impactScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() evidence?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() actions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
