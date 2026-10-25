import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePerformanceReviewDto, CreatePerformanceGoalDto, CreatePerformanceCycleDto, CreateFeedbackRecordDto, CreateDevelopmentPlanDto, CreateCompetencyAssessmentDto } from '../dto/workforce.dto';
import { WorkforceAnalyticsService } from '../workforce-analytics.service';
import { WorkforceCommandService } from '../workforce-command.service';
import { WorkforceQueryService } from '../workforce-query.service';

@ApiTags('Performance Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'performance-management', version: '1' })
export class PerformanceManagementController {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService, private readonly analytics: WorkforceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Performance Management');
  }

  @Get('performance-reviews') listPerformanceReview(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('performanceReview', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('performance-reviews') createPerformanceReview(@Body() dto: CreatePerformanceReviewDto) {
    return this.commands.create('performanceReview', dto);
  }

  @Get('performance-goals') listPerformanceGoal(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('performanceGoal', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('performance-goals') createPerformanceGoal(@Body() dto: CreatePerformanceGoalDto) {
    return this.commands.create('performanceGoal', dto);
  }

  @Get('performance-cycles') listPerformanceCycle(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('performanceCycle', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('performance-cycles') createPerformanceCycle(@Body() dto: CreatePerformanceCycleDto) {
    return this.commands.create('performanceCycle', dto);
  }

  @Get('feedback-records') listFeedbackRecord(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('feedbackRecord', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('feedback-records') createFeedbackRecord(@Body() dto: CreateFeedbackRecordDto) {
    return this.commands.create('feedbackRecord', dto);
  }

  @Get('development-plans') listDevelopmentPlan(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('developmentPlan', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('development-plans') createDevelopmentPlan(@Body() dto: CreateDevelopmentPlanDto) {
    return this.commands.create('developmentPlan', dto);
  }

  @Get('competency-assessments') listCompetencyAssessment(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('competencyAssessment', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('competency-assessments') createCompetencyAssessment(@Body() dto: CreateCompetencyAssessmentDto) {
    return this.commands.create('competencyAssessment', dto);
  }
}

