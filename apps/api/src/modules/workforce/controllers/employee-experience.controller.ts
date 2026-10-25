import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateEmployeeDashboardDto, CreateCareerPathDto, CreateInternalOpportunityDto, CreateEmployeeFeedbackDto, CreateEmployeeEngagementDto } from '../dto/workforce.dto';
import { WorkforceAnalyticsService } from '../workforce-analytics.service';
import { WorkforceCommandService } from '../workforce-command.service';
import { WorkforceQueryService } from '../workforce-query.service';

@ApiTags('Employee Experience Platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'employee-experience', version: '1' })
export class EmployeeExperienceController {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService, private readonly analytics: WorkforceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Employee Experience Platform');
  }

  @Get('employee-dashboards') listEmployeeDashboard(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('employeeDashboard', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('employee-dashboards') createEmployeeDashboard(@Body() dto: CreateEmployeeDashboardDto) {
    return this.commands.create('employeeDashboard', dto);
  }

  @Get('career-paths') listCareerPath(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('careerPath', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('career-paths') createCareerPath(@Body() dto: CreateCareerPathDto) {
    return this.commands.create('careerPath', dto);
  }

  @Get('internal-opportunities') listInternalOpportunity(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('internalOpportunity', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('internal-opportunities') createInternalOpportunity(@Body() dto: CreateInternalOpportunityDto) {
    return this.commands.create('internalOpportunity', dto);
  }

  @Get('employee-feedback') listEmployeeFeedback(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('employeeFeedback', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('employee-feedback') createEmployeeFeedback(@Body() dto: CreateEmployeeFeedbackDto) {
    return this.commands.create('employeeFeedback', dto);
  }

  @Get('employee-engagement') listEmployeeEngagement(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('employeeEngagement', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('employee-engagement') createEmployeeEngagement(@Body() dto: CreateEmployeeEngagementDto) {
    return this.commands.create('employeeEngagement', dto);
  }
}

