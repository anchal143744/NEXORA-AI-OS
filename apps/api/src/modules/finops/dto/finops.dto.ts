import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCostCenterDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() department?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() monthlyBudget?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() annualBudget?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateResourceUsageDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() usageKey?: string;
  @ApiProperty() @IsString() resourceType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() provider?: string;
  @ApiProperty() @IsString() serviceName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiProperty() @IsNumber() usageQuantity!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() usageUnit?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() unitCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() totalCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() measuredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dimensions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCostMetricDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricKey?: string;
  @ApiProperty() @IsString() metricName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricType?: string;
  @ApiProperty() @IsNumber() amount!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() provider?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceName?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dimensions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCostForecastDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() forecastKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() forecastType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() horizon?: string;
  @ApiProperty() @IsNumber() predictedCost!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() baselineCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() variancePercent?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() forecastAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() signals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() assumptions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateOptimizationRecommendationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recommendationKey?: string;
  @ApiProperty() @IsString() recommendationType!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() estimatedSavings?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() effort?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() impact?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() actions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateEfficiencyScoreDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scopeType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scopeId?: string;
  @ApiProperty() @IsNumber() score!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreBand?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() previousScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() trend?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() costEfficiency?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() performanceEfficiency?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() utilizationEfficiency?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() factors?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() calculatedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePerformanceMetricDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resourceUsageId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricKey?: string;
  @ApiProperty() @IsString() metricName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricType?: string;
  @ApiProperty() @IsNumber() value!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() threshold?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() provider?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() measuredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dimensions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateResourceAllocationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() allocationKey?: string;
  @ApiProperty() @IsString() resourceType!: string;
  @ApiProperty() @IsString() resourceName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() allocationType?: string;
  @ApiProperty() @IsString() allocatedTo!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() allocationPercent?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() allocatedCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateFinOpsPolicyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enforcementMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() rules?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() thresholds?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() actions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateBudgetTrackingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() budgetKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() period?: string;
  @ApiProperty() @IsNumber() budgetAmount!: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() actualAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() forecastAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCostAlertDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() budgetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() alertKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() alertType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() message?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() thresholdAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() actualAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() triggeredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() acknowledgedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSavingsOpportunityDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recommendationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() opportunityKey?: string;
  @ApiProperty() @IsString() opportunityType!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsNumber() estimatedSavings!: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() realizedSavings?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() identifiedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}