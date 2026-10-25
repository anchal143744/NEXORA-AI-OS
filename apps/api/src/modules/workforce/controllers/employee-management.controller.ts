import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateEmployeeDto, CreateEmployeeProfileExtensionDto, CreateEmployeeSkillDto, CreateEmployeeDocumentDto, CreateEmployeeHistoryDto, CreateEmployeeRelationshipDto } from '../dto/workforce.dto';
import { WorkforceAnalyticsService } from '../workforce-analytics.service';
import { WorkforceCommandService } from '../workforce-command.service';
import { WorkforceQueryService } from '../workforce-query.service';

@ApiTags('Employee Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'employee-management', version: '1' })
export class EmployeeManagementController {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService, private readonly analytics: WorkforceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Employee Management');
  }

  @Get('employees') listEmployee(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('employee', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('employees') createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.commands.create('employee', dto);
  }

  @Get('employee-profile-extensions') listEmployeeProfileExtension(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('employeeProfileExtension', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('employee-profile-extensions') createEmployeeProfileExtension(@Body() dto: CreateEmployeeProfileExtensionDto) {
    return this.commands.create('employeeProfileExtension', dto);
  }

  @Get('employee-skills') listEmployeeSkill(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('employeeSkill', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('employee-skills') createEmployeeSkill(@Body() dto: CreateEmployeeSkillDto) {
    return this.commands.create('employeeSkill', dto);
  }

  @Get('employee-documents') listEmployeeDocument(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('employeeDocument', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('employee-documents') createEmployeeDocument(@Body() dto: CreateEmployeeDocumentDto) {
    return this.commands.create('employeeDocument', dto);
  }

  @Get('employee-history') listEmployeeHistory(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('employeeHistory', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('employee-history') createEmployeeHistory(@Body() dto: CreateEmployeeHistoryDto) {
    return this.commands.create('employeeHistory', dto);
  }

  @Get('employee-relationships') listEmployeeRelationship(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('employeeRelationship', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('employee-relationships') createEmployeeRelationship(@Body() dto: CreateEmployeeRelationshipDto) {
    return this.commands.create('employeeRelationship', dto);
  }
}

