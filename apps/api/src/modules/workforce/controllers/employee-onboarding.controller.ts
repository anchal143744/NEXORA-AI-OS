import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateOnboardingWorkflowDto, CreateOnboardingTaskDto, CreateOnboardingChecklistDto, CreateEmployeeEquipmentDto, CreatePolicyAcknowledgementDto } from '../dto/workforce.dto';
import { WorkforceAnalyticsService } from '../workforce-analytics.service';
import { WorkforceCommandService } from '../workforce-command.service';
import { WorkforceQueryService } from '../workforce-query.service';

@ApiTags('Employee Onboarding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'employee-onboarding', version: '1' })
export class EmployeeOnboardingController {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService, private readonly analytics: WorkforceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Employee Onboarding');
  }

  @Get('onboarding-workflows') listOnboardingWorkflow(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('onboardingWorkflow', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('onboarding-workflows') createOnboardingWorkflow(@Body() dto: CreateOnboardingWorkflowDto) {
    return this.commands.create('onboardingWorkflow', dto);
  }

  @Get('onboarding-tasks') listOnboardingTask(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('onboardingTask', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('onboarding-tasks') createOnboardingTask(@Body() dto: CreateOnboardingTaskDto) {
    return this.commands.create('onboardingTask', dto);
  }

  @Get('onboarding-checklists') listOnboardingChecklist(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('onboardingChecklist', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('onboarding-checklists') createOnboardingChecklist(@Body() dto: CreateOnboardingChecklistDto) {
    return this.commands.create('onboardingChecklist', dto);
  }

  @Get('employee-equipment') listEmployeeEquipment(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('employeeEquipment', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('employee-equipment') createEmployeeEquipment(@Body() dto: CreateEmployeeEquipmentDto) {
    return this.commands.create('employeeEquipment', dto);
  }

  @Get('policy-acknowledgements') listPolicyAcknowledgement(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('policyAcknowledgement', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('policy-acknowledgements') createPolicyAcknowledgement(@Body() dto: CreatePolicyAcknowledgementDto) {
    return this.commands.create('policyAcknowledgement', dto);
  }
}

