import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateObservabilityDashboardDto, CreateMonitoringAlertRuleDto, CreateTelemetrySignalDto } from '../dto/production-readiness.dto';
import { ProductionReadinessAnalyticsService } from '../production-readiness-analytics.service';
import { ProductionReadinessCommandService } from '../production-readiness-command.service';
import { ProductionReadinessQueryService } from '../production-readiness-query.service';

@ApiTags('Monitoring & Observability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'monitoring-observability', version: '1' })
export class MonitoringObservabilityController {
  constructor(private readonly commands: ProductionReadinessCommandService, private readonly queries: ProductionReadinessQueryService, private readonly analytics: ProductionReadinessAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Monitoring & Observability');
  }

  @Get('dashboards') listObservabilityDashboard(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('observabilityDashboard', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('dashboards') createObservabilityDashboard(@Body() dto: CreateObservabilityDashboardDto) {
    return this.commands.create('observabilityDashboard', dto);
  }

  @Get('alert-rules') listMonitoringAlertRule(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('monitoringAlertRule', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('alert-rules') createMonitoringAlertRule(@Body() dto: CreateMonitoringAlertRuleDto) {
    return this.commands.create('monitoringAlertRule', dto);
  }

  @Get('telemetry-signals') listTelemetrySignal(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('telemetrySignal', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('telemetry-signals') createTelemetrySignal(@Body() dto: CreateTelemetrySignalDto) {
    return this.commands.create('telemetrySignal', dto);
  }
}
