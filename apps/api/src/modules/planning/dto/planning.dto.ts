import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recordKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cycleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() objectiveId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() keyResultId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() initiativeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() programId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() projectId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resourcePoolId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() capacityPlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() budgetPlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scenarioId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dashboardId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sponsorUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teamId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessUnitId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() horizon?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cadence?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() confidenceLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() healthStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() alignmentStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() fiscalYear?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() quarter?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() sequence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() startDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reviewedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() targetValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() actualValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() baselineValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() progressPercent?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() weight?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() score?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() impactScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() effortScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() capacityHours?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() demandHours?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() allocatedHours?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() utilizationRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() scenarioProbability?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() plannedBudget?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() approvedBudget?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() actualSpend?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() forecastSpend?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() varianceAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isStrategic?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requiresApproval?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() assumptions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metrics?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() dependencies?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() constraints?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() insights?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() createdByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedByUserId?: string;
}

export class CreatePlanningCycleDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() planningCycleCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planningCycleOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() planningCycleAttributes?: Record<string, unknown>;
}

export class CreateOkrObjectiveDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() okrObjectiveCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() okrObjectiveOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() okrObjectiveAttributes?: Record<string, unknown>;
}

export class CreateOkrKeyResultDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() okrKeyResultCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() okrKeyResultOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() okrKeyResultAttributes?: Record<string, unknown>;
}

export class CreateOkrInitiativeDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() okrInitiativeCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() okrInitiativeOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() okrInitiativeAttributes?: Record<string, unknown>;
}

export class CreateOkrCheckInDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() okrCheckInCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() okrCheckInOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() okrCheckInAttributes?: Record<string, unknown>;
}

export class CreateOkrAlignmentDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() okrAlignmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() okrAlignmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() okrAlignmentAttributes?: Record<string, unknown>;
}

export class CreateEnterpriseStrategicPlanDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() enterpriseStrategicPlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enterpriseStrategicPlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() enterpriseStrategicPlanAttributes?: Record<string, unknown>;
}

export class CreateStrategyPillarDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() strategyPillarCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() strategyPillarOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() strategyPillarAttributes?: Record<string, unknown>;
}

export class CreateStrategicThemeDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() strategicThemeCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() strategicThemeOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() strategicThemeAttributes?: Record<string, unknown>;
}

export class CreateStrategyMilestoneDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() strategyMilestoneCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() strategyMilestoneOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() strategyMilestoneAttributes?: Record<string, unknown>;
}

export class CreateEnterprisePortfolioDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() enterprisePortfolioCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enterprisePortfolioOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() enterprisePortfolioAttributes?: Record<string, unknown>;
}

export class CreatePortfolioProgramDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioProgramCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioProgramOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() portfolioProgramAttributes?: Record<string, unknown>;
}

export class CreatePortfolioProjectDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioProjectCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioProjectOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() portfolioProjectAttributes?: Record<string, unknown>;
}

export class CreatePortfolioInvestmentDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioInvestmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioInvestmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() portfolioInvestmentAttributes?: Record<string, unknown>;
}

export class CreatePortfolioRiskDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioRiskCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioRiskOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() portfolioRiskAttributes?: Record<string, unknown>;
}

export class CreatePortfolioDependencyDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioDependencyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioDependencyOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() portfolioDependencyAttributes?: Record<string, unknown>;
}

export class CreatePlanningResourcePoolDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() planningResourcePoolCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planningResourcePoolOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() planningResourcePoolAttributes?: Record<string, unknown>;
}

export class CreateResourceDemandDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() resourceDemandCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resourceDemandOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() resourceDemandAttributes?: Record<string, unknown>;
}

export class CreatePortfolioResourceAllocationDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioResourceAllocationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioResourceAllocationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() portfolioResourceAllocationAttributes?: Record<string, unknown>;
}

export class CreateResourceSkillRequirementDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() resourceSkillRequirementCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resourceSkillRequirementOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() resourceSkillRequirementAttributes?: Record<string, unknown>;
}

export class CreatePlanningCapacityPlanDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() planningCapacityPlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planningCapacityPlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() planningCapacityPlanAttributes?: Record<string, unknown>;
}

export class CreateCapacityScenarioDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() capacityScenarioCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() capacityScenarioOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() capacityScenarioAttributes?: Record<string, unknown>;
}

export class CreateCapacityConstraintDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() capacityConstraintCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() capacityConstraintOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() capacityConstraintAttributes?: Record<string, unknown>;
}

export class CreateCapacityForecastSignalDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() capacityForecastSignalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() capacityForecastSignalOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() capacityForecastSignalAttributes?: Record<string, unknown>;
}

export class CreatePlanningBudgetPlanDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() planningBudgetPlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planningBudgetPlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() planningBudgetPlanAttributes?: Record<string, unknown>;
}

export class CreateBudgetLineItemDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() budgetLineItemCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() budgetLineItemOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() budgetLineItemAttributes?: Record<string, unknown>;
}

export class CreateBudgetScenarioDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() budgetScenarioCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() budgetScenarioOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() budgetScenarioAttributes?: Record<string, unknown>;
}

export class CreateBudgetVarianceDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() budgetVarianceCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() budgetVarianceOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() budgetVarianceAttributes?: Record<string, unknown>;
}

export class CreatePlanningScenarioDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() planningScenarioCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planningScenarioOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() planningScenarioAttributes?: Record<string, unknown>;
}

export class CreateScenarioAssumptionDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() scenarioAssumptionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scenarioAssumptionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() scenarioAssumptionAttributes?: Record<string, unknown>;
}

export class CreateScenarioSimulationDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() scenarioSimulationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scenarioSimulationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() scenarioSimulationAttributes?: Record<string, unknown>;
}

export class CreateScenarioDecisionDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() scenarioDecisionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scenarioDecisionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() scenarioDecisionAttributes?: Record<string, unknown>;
}

export class CreatePlanningExecutiveDashboardDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() planningExecutiveDashboardCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planningExecutiveDashboardOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() planningExecutiveDashboardAttributes?: Record<string, unknown>;
}

export class CreateExecutiveScorecardDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() executiveScorecardCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() executiveScorecardOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() executiveScorecardAttributes?: Record<string, unknown>;
}

export class CreatePortfolioMetricDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioMetricCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioMetricOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() portfolioMetricAttributes?: Record<string, unknown>;
}

export class CreatePortfolioAnalyticsSnapshotDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioAnalyticsSnapshotCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioAnalyticsSnapshotOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() portfolioAnalyticsSnapshotAttributes?: Record<string, unknown>;
}

export class CreatePortfolioHealthScoreDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioHealthScoreCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioHealthScoreOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() portfolioHealthScoreAttributes?: Record<string, unknown>;
}

export class CreateStrategyCopilotQueryDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() strategyCopilotQueryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() strategyCopilotQueryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() strategyCopilotQueryAttributes?: Record<string, unknown>;
}

export class CreateStrategyRecommendationDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() strategyRecommendationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() strategyRecommendationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() strategyRecommendationAttributes?: Record<string, unknown>;
}

export class CreateStrategicRiskSignalDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() strategicRiskSignalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() strategicRiskSignalOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() strategicRiskSignalAttributes?: Record<string, unknown>;
}

export class CreatePlanningAuditEventDto extends CreatePlanningRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() planningAuditEventCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planningAuditEventOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() planningAuditEventAttributes?: Record<string, unknown>;
}
