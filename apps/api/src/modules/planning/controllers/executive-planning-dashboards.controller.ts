import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePlanningExecutiveDashboardDto, CreateExecutiveScorecardDto } from '../dto/planning.dto';
import { PlanningAnalyticsService } from '../planning-analytics.service';
import { PlanningCommandService } from '../planning-command.service';
import { PlanningQueryService } from '../planning-query.service';

@ApiTags('Executive Dashboards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'executive-planning-dashboards', version: '1' })
export class ExecutivePlanningDashboardsController {
  constructor(private readonly commands: PlanningCommandService, private readonly queries: PlanningQueryService, private readonly analytics: PlanningAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Executive Dashboards');
  }

  @Get('dashboards') listPlanningExecutiveDashboard(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('planningExecutiveDashboard', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('dashboards') createPlanningExecutiveDashboard(@Body() dto: CreatePlanningExecutiveDashboardDto) {
    return this.commands.create('planningExecutiveDashboard', dto);
  }

  @Get('scorecards') listExecutiveScorecard(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('executiveScorecard', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('scorecards') createExecutiveScorecard(@Body() dto: CreateExecutiveScorecardDto) {
    return this.commands.create('executiveScorecard', dto);
  }
}
