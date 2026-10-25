import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateServiceHealthDto, CreateUptimeMetricDto } from '../dto/reliability-operations.dto';
import { ReliabilityHealthService } from '../reliability-health.service';

@ApiTags('Uptime')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'uptime', version: '1' })
export class UptimeController {
  constructor(private readonly health: ReliabilityHealthService) {}

  @Get('monitor') monitor() { return this.health.uptimeMonitor(); }
  @Get('service-health') serviceHealth(@Query('serviceType') serviceType?: string, @Query('status') status?: string, @Query('region') region?: string) { return this.health.serviceHealth(serviceType, status, region); }
  @Post('service-health') createServiceHealth(@Body() dto: CreateServiceHealthDto) { return this.health.createServiceHealth(dto); }
  @Get('metrics') metrics(@Query('serviceName') serviceName?: string, @Query('status') status?: string, @Query('region') region?: string) { return this.health.uptimeMetrics(serviceName, status, region); }
  @Post('metrics') createMetric(@Body() dto: CreateUptimeMetricDto) { return this.health.createUptimeMetric(dto); }
}