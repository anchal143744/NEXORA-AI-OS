import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateForecastModelDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() forecastType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() horizon?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cadence?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() algorithm?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() sourceData?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() assumptions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() features?: string[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastTrainedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class GenerateForecastResultDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() forecastModelId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resultKey?: string;
  @ApiProperty() @IsString() forecastType!: string;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiProperty() @IsString() horizonStart!: string;
  @ApiProperty() @IsString() horizonEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() baseValue?: number;
  @ApiProperty() @IsNumber() forecastValue!: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() lowerBound?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() upperBound?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currencyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() drivers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() explanation?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePredictionModelDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() predictionType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() algorithm?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetEntity?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() features?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() thresholds?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() trainingWindow?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastTrainedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class GeneratePredictionResultDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() predictionModelId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resultKey?: string;
  @ApiProperty() @IsString() predictionType!: string;
  @ApiProperty() @IsString() targetType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetId?: string;
  @ApiProperty() @IsNumber() score!: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() band?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() horizonStart?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() horizonEnd?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() drivers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() explanation?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendedActions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateStrategicPlanDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planningHorizon?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() departments?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() kpis?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() assumptions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() objectives?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateStrategicGoalDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() strategicPlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() goalKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() goalType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetMetric?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() targetValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() currentValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() kpis?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() milestones?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateScenarioModelDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() strategicPlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scenarioKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scenarioType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() baseCase?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() assumptions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() variables?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() createdByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class GenerateScenarioResultDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() scenarioModelId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resultKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() outcomeSummary?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() kpiImpacts?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() financialImpact?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() riskImpact?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendedActions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateBudgetPlanDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() strategicPlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() budgetKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() fiscalYear!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currencyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() plannedRevenue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() plannedExpenses?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() plannedBudget?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() allocatedBudget?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() variance?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() assumptions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() lineItems?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() approvals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCapacityPlanDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() strategicPlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() capacityKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() capacityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() periodStart?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() periodEnd?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() demandForecast?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() currentCapacity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() requiredCapacity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() capacityGap?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() utilizationRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() constraints?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() hiringPlan?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRiskForecastDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskKey?: string;
  @ApiProperty() @IsString() riskType!: string;
  @ApiProperty() @IsString() riskName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() impactScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() horizonStart?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() horizonEnd?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() drivers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() mitigationActions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateGrowthForecastDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() growthKey?: string;
  @ApiProperty() @IsString() growthType!: string;
  @ApiProperty() @IsString() metricName!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() baselineValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() forecastValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() growthRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() horizonStart?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() horizonEnd?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() drivers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() opportunities?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendedActions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}