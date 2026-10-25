import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePerformanceMetricDto } from '../dto/finops.dto';
import { ResourceAnalyticsService } from '../resource-analytics.service';

@ApiTags('Performance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'performance', version: '1' })
export class PerformanceController {
  constructor(private readonly resources: ResourceAnalyticsService) {}

  @Get('dashboard') dashboard() { return this.resources.analytics(); }
  @Get('metrics') metrics(@Query('metricType') metricType?: string, @Query('status') status?: string, @Query('serviceName') serviceName?: string) { return this.resources.performanceMetrics(metricType, status, serviceName); }
  @Post('metrics') createMetric(@Body() dto: CreatePerformanceMetricDto) { return this.resources.createPerformanceMetric(dto); }
  @Get('resource-analytics') resourceAnalytics() { return this.resources.analytics(); }
}