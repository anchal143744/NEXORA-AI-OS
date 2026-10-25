import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePlanningCapacityPlanDto, CreateCapacityScenarioDto, CreateCapacityConstraintDto, CreateCapacityForecastSignalDto } from '../dto/planning.dto';
import { PlanningAnalyticsService } from '../planning-analytics.service';
import { PlanningCommandService } from '../planning-command.service';
import { PlanningQueryService } from '../planning-query.service';

@ApiTags('Capacity Planning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'capacity-planning', version: '1' })
export class CapacityPlanningController {
  constructor(private readonly commands: PlanningCommandService, private readonly queries: PlanningQueryService, private readonly analytics: PlanningAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Capacity Planning');
  }

  @Get('capacity-plans') listPlanningCapacityPlan(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('planningCapacityPlan', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('capacity-plans') createPlanningCapacityPlan(@Body() dto: CreatePlanningCapacityPlanDto) {
    return this.commands.create('planningCapacityPlan', dto);
  }

  @Get('capacity-scenarios') listCapacityScenario(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('capacityScenario', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('capacity-scenarios') createCapacityScenario(@Body() dto: CreateCapacityScenarioDto) {
    return this.commands.create('capacityScenario', dto);
  }

  @Get('capacity-constraints') listCapacityConstraint(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('capacityConstraint', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('capacity-constraints') createCapacityConstraint(@Body() dto: CreateCapacityConstraintDto) {
    return this.commands.create('capacityConstraint', dto);
  }

  @Get('capacity-forecast-signals') listCapacityForecastSignal(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('capacityForecastSignal', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('capacity-forecast-signals') createCapacityForecastSignal(@Body() dto: CreateCapacityForecastSignalDto) {
    return this.commands.create('capacityForecastSignal', dto);
  }
}
