import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateWorkforcePlanDto, CreateHeadcountForecastDto, CreateWorkforceCapacityForecastDto, CreateHiringForecastDto, CreateResourceForecastDto } from '../dto/workforce.dto';
import { WorkforceAnalyticsService } from '../workforce-analytics.service';
import { WorkforceCommandService } from '../workforce-command.service';
import { WorkforceQueryService } from '../workforce-query.service';

@ApiTags('Workforce Planning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'workforce-planning', version: '1' })
export class WorkforcePlanningController {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService, private readonly analytics: WorkforceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Workforce Planning');
  }

  @Get('workforce-plans') listWorkforcePlan(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('workforcePlan', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('workforce-plans') createWorkforcePlan(@Body() dto: CreateWorkforcePlanDto) {
    return this.commands.create('workforcePlan', dto);
  }

  @Get('headcount-forecasts') listHeadcountForecast(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('headcountForecast', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('headcount-forecasts') createHeadcountForecast(@Body() dto: CreateHeadcountForecastDto) {
    return this.commands.create('headcountForecast', dto);
  }

  @Get('workforce-capacity-forecasts') listWorkforceCapacityForecast(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('workforceCapacityForecast', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('workforce-capacity-forecasts') createWorkforceCapacityForecast(@Body() dto: CreateWorkforceCapacityForecastDto) {
    return this.commands.create('workforceCapacityForecast', dto);
  }

  @Get('hiring-forecasts') listHiringForecast(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('hiringForecast', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('hiring-forecasts') createHiringForecast(@Body() dto: CreateHiringForecastDto) {
    return this.commands.create('hiringForecast', dto);
  }

  @Get('resource-forecasts') listResourceForecast(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('resourceForecast', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('resource-forecasts') createResourceForecast(@Body() dto: CreateResourceForecastDto) {
    return this.commands.create('resourceForecast', dto);
  }
}

