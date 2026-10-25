import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateExecutiveDashboardDto } from '../dto/data-platform.dto';
import { KpiExecutiveService } from '../kpi-executive.service';

@ApiTags('Executive Dashboards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'executive-dashboards', version: '1' })
export class ExecutiveDashboardsController {
  constructor(private readonly executive: KpiExecutiveService) {}

  @Get() list(@Query('status') status?: string, @Query('audience') audience?: string) { return this.executive.dashboards(status, audience); }
  @Post() create(@Body() dto: CreateExecutiveDashboardDto) { return this.executive.createDashboard(dto); }
  @Get('analytics') analytics() { return this.executive.executiveAnalytics(); }
  @Get('builder') builder() { return this.executive.dashboards(); }
}