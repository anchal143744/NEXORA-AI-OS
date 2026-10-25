import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../rbac/decorators/require-permissions.decorator';
import { RbacGuard } from '../../rbac/guards/rbac.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @RequirePermissions('read')
  @Get()
  @ApiOperation({ summary: 'Read historical KPI metric values for the authenticated workspace' })
  metric(@Query('metricKey') metricKey = 'finance.revenue', @Query('days') days = '90') {
    return this.analytics.metric(metricKey, Number(days));
  }

  @RequirePermissions('read')
  @Get('summary')
  @ApiOperation({ summary: 'Read V1 business analytics from CRM, Finance, HR and Projects data' })
  summary() {
    return this.analytics.summary();
  }
}
