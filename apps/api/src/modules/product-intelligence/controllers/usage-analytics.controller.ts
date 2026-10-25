import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateFeatureUsageDto, CreateProductUsageMetricDto, CreateSessionAnalyticsDto } from '../dto/product-intelligence.dto';
import { UsageAnalyticsService } from '../usage-analytics.service';

@ApiTags('Usage Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'usage-analytics', version: '1' })
export class UsageAnalyticsController {
  constructor(private readonly usage: UsageAnalyticsService) {}

  @Get('metrics') metrics(@Query('metricType') metricType?: string, @Query('moduleKey') moduleKey?: string) { return this.usage.metrics(metricType, moduleKey); }
  @Post('metrics') createMetric(@Body() dto: CreateProductUsageMetricDto) { return this.usage.createMetric(dto); }
  @Get('sessions') sessions(@Query('userId') userId?: string) { return this.usage.sessions(userId); }
  @Post('sessions') createSession(@Body() dto: CreateSessionAnalyticsDto) { return this.usage.createSession(dto); }
  @Get('feature-usage') featureUsage(@Query('moduleKey') moduleKey?: string, @Query('featureKey') featureKey?: string) { return this.usage.featureUsage(moduleKey, featureKey); }
  @Post('feature-usage') createFeatureUsage(@Body() dto: CreateFeatureUsageDto) { return this.usage.createFeatureUsage(dto); }
  @Get('user-activity') userActivity(@Query('userId') userId?: string) { return this.usage.userActivity(userId); }
  @Get('workspace') workspaceAnalytics() { return this.usage.workspaceAnalytics(); }
  @Get('team') teamAnalytics(@Query('teamId') teamId?: string) { return this.usage.teamAnalytics(teamId); }
  @Get('module') moduleAnalytics(@Query('moduleKey') moduleKey?: string) { return this.usage.moduleAnalytics(moduleKey); }
}
