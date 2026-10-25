import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePlanningBudgetPlanDto, CreateBudgetLineItemDto, CreateBudgetScenarioDto, CreateBudgetVarianceDto } from '../dto/planning.dto';
import { PlanningAnalyticsService } from '../planning-analytics.service';
import { PlanningCommandService } from '../planning-command.service';
import { PlanningQueryService } from '../planning-query.service';

@ApiTags('Budget Planning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'budget-planning', version: '1' })
export class BudgetPlanningController {
  constructor(private readonly commands: PlanningCommandService, private readonly queries: PlanningQueryService, private readonly analytics: PlanningAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Budget Planning');
  }

  @Get('budget-plans') listPlanningBudgetPlan(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('planningBudgetPlan', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('budget-plans') createPlanningBudgetPlan(@Body() dto: CreatePlanningBudgetPlanDto) {
    return this.commands.create('planningBudgetPlan', dto);
  }

  @Get('budget-line-items') listBudgetLineItem(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('budgetLineItem', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('budget-line-items') createBudgetLineItem(@Body() dto: CreateBudgetLineItemDto) {
    return this.commands.create('budgetLineItem', dto);
  }

  @Get('budget-scenarios') listBudgetScenario(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('budgetScenario', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('budget-scenarios') createBudgetScenario(@Body() dto: CreateBudgetScenarioDto) {
    return this.commands.create('budgetScenario', dto);
  }

  @Get('budget-variances') listBudgetVariance(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('budgetVariance', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('budget-variances') createBudgetVariance(@Body() dto: CreateBudgetVarianceDto) {
    return this.commands.create('budgetVariance', dto);
  }
}
