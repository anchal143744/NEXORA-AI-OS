import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateFieldWorkforceMetricDto, CreateFieldWorkforceAnalyticsSnapshotDto, CreateTechnicianUtilizationRecordDto, CreateFieldServiceForecastDto } from '../dto/field-service.dto';
import { FieldServiceAnalyticsService } from '../field-service-analytics.service';
import { FieldServiceCommandService } from '../field-service-command.service';
import { FieldServiceQueryService } from '../field-service-query.service';

@ApiTags('Workforce Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'field-workforce-analytics', version: '1' })
export class FieldWorkforceAnalyticsController {
  constructor(private readonly commands: FieldServiceCommandService, private readonly queries: FieldServiceQueryService, private readonly analytics: FieldServiceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Workforce Analytics');
  }

  @Get('metrics') listFieldWorkforceMetric(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldWorkforceMetric', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('metrics') createFieldWorkforceMetric(@Body() dto: CreateFieldWorkforceMetricDto) {
    return this.commands.create('fieldWorkforceMetric', dto);
  }

  @Get('analytics-snapshots') listFieldWorkforceAnalyticsSnapshot(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldWorkforceAnalyticsSnapshot', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('analytics-snapshots') createFieldWorkforceAnalyticsSnapshot(@Body() dto: CreateFieldWorkforceAnalyticsSnapshotDto) {
    return this.commands.create('fieldWorkforceAnalyticsSnapshot', dto);
  }

  @Get('technician-utilization') listTechnicianUtilizationRecord(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('technicianUtilizationRecord', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('technician-utilization') createTechnicianUtilizationRecord(@Body() dto: CreateTechnicianUtilizationRecordDto) {
    return this.commands.create('technicianUtilizationRecord', dto);
  }

  @Get('forecasts') listFieldServiceForecast(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceForecast', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('forecasts') createFieldServiceForecast(@Body() dto: CreateFieldServiceForecastDto) {
    return this.commands.create('fieldServiceForecast', dto);
  }
}

