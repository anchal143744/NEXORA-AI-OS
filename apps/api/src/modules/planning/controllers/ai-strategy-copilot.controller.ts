import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateStrategyCopilotQueryDto, CreateStrategyRecommendationDto, CreateStrategicRiskSignalDto, CreatePlanningAuditEventDto } from '../dto/planning.dto';
import { PlanningAnalyticsService } from '../planning-analytics.service';
import { PlanningCommandService } from '../planning-command.service';
import { PlanningQueryService } from '../planning-query.service';

@ApiTags('AI Strategy Copilot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'ai-strategy-copilot', version: '1' })
export class AiStrategyCopilotController {
  constructor(private readonly commands: PlanningCommandService, private readonly queries: PlanningQueryService, private readonly analytics: PlanningAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('AI Strategy Copilot');
  }

  @Get('queries') listStrategyCopilotQuery(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('strategyCopilotQuery', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('queries') createStrategyCopilotQuery(@Body() dto: CreateStrategyCopilotQueryDto) {
    return this.commands.create('strategyCopilotQuery', dto);
  }

  @Get('recommendations') listStrategyRecommendation(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('strategyRecommendation', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('recommendations') createStrategyRecommendation(@Body() dto: CreateStrategyRecommendationDto) {
    return this.commands.create('strategyRecommendation', dto);
  }

  @Get('risk-signals') listStrategicRiskSignal(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('strategicRiskSignal', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('risk-signals') createStrategicRiskSignal(@Body() dto: CreateStrategicRiskSignalDto) {
    return this.commands.create('strategicRiskSignal', dto);
  }

  @Get('audit-events') listPlanningAuditEvent(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('riskLevel') riskLevel?: string, @Query('healthStatus') healthStatus?: string, @Query('planId') planId?: string, @Query('objectiveId') objectiveId?: string, @Query('portfolioId') portfolioId?: string, @Query('programId') programId?: string, @Query('ownerUserId') ownerUserId?: string, @Query('departmentId') departmentId?: string, @Query('fiscalYear') fiscalYear?: string) {
    return this.queries.list('planningAuditEvent', { status, stage, priority, riskLevel, healthStatus, planId, objectiveId, portfolioId, programId, ownerUserId, departmentId, fiscalYear });
  }

  @Post('audit-events') createPlanningAuditEvent(@Body() dto: CreatePlanningAuditEventDto) {
    return this.commands.create('planningAuditEvent', dto);
  }
}
