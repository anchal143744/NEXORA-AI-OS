import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateOrganizationStructureDto, CreateReportingLineDto, CreateTeamAnalyticsDto, CreateOrganizationInsightDto } from '../dto/workforce.dto';
import { WorkforceAnalyticsService } from '../workforce-analytics.service';
import { WorkforceCommandService } from '../workforce-command.service';
import { WorkforceQueryService } from '../workforce-query.service';

@ApiTags('Organizational Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'organizational-intelligence', version: '1' })
export class OrganizationalIntelligenceController {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService, private readonly analytics: WorkforceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Organizational Intelligence');
  }

  @Get('organization-structures') listOrganizationStructure(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('organizationStructure', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('organization-structures') createOrganizationStructure(@Body() dto: CreateOrganizationStructureDto) {
    return this.commands.create('organizationStructure', dto);
  }

  @Get('reporting-lines') listReportingLine(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('reportingLine', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('reporting-lines') createReportingLine(@Body() dto: CreateReportingLineDto) {
    return this.commands.create('reportingLine', dto);
  }

  @Get('team-analytics') listTeamAnalytics(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('teamAnalytics', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('team-analytics') createTeamAnalytics(@Body() dto: CreateTeamAnalyticsDto) {
    return this.commands.create('teamAnalytics', dto);
  }

  @Get('organization-insights') listOrganizationInsight(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('organizationInsight', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('organization-insights') createOrganizationInsight(@Body() dto: CreateOrganizationInsightDto) {
    return this.commands.create('organizationInsight', dto);
  }
}

