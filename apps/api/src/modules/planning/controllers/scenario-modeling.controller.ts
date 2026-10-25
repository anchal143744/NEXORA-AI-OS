import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePlanningScenarioDto, CreateScenarioAssumptionDto, CreateScenarioSimulationDto, CreateScenarioDecisionDto } from '../dto/planning.dto';
import { PlanningAnalyticsService } from '../planning-analytics.service';
import { PlanningCommandService } from '../planning-command.service';
import { PlanningQueryService } from '../planning-query.service';

@ApiTags('Scenario Modeling')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'scenario-modeling', version: '1' })
export class ScenarioModelingController {
  constructor(private readonly commands: PlanningCommandService, private readonly queries: PlanningQueryService, private readonly analytics: PlanningAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Scenario Modeling');
  }

  @Get('scenarios') listPlanningScenario(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('planningScenario', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('scenarios') createPlanningScenario(@Body() dto: CreatePlanningScenarioDto) {
    return this.commands.create('planningScenario', dto);
  }

  @Get('scenario-assumptions') listScenarioAssumption(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('scenarioAssumption', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('scenario-assumptions') createScenarioAssumption(@Body() dto: CreateScenarioAssumptionDto) {
    return this.commands.create('scenarioAssumption', dto);
  }

  @Get('scenario-simulations') listScenarioSimulation(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('scenarioSimulation', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('scenario-simulations') createScenarioSimulation(@Body() dto: CreateScenarioSimulationDto) {
    return this.commands.create('scenarioSimulation', dto);
  }

  @Get('scenario-decisions') listScenarioDecision(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('scenarioDecision', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('scenario-decisions') createScenarioDecision(@Body() dto: CreateScenarioDecisionDto) {
    return this.commands.create('scenarioDecision', dto);
  }
}
