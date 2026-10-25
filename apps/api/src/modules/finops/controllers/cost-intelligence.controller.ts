import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CostIntelligenceService } from '../cost-intelligence.service';
import { CreateCostCenterDto, CreateCostMetricDto } from '../dto/finops.dto';

@ApiTags('Cost Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'cost-intelligence', version: '1' })
export class CostIntelligenceController {
  constructor(private readonly costs: CostIntelligenceService) {}

  @Get('dashboard') dashboard() { return this.costs.dashboard(); }
  @Get('cost-centers') costCenters(@Query('status') status?: string, @Query('department') department?: string) { return this.costs.costCenters(status, department); }
  @Post('cost-centers') createCostCenter(@Body() dto: CreateCostCenterDto) { return this.costs.createCostCenter(dto); }
  @Get('metrics') metrics(@Query('metricType') metricType?: string, @Query('provider') provider?: string, @Query('serviceName') serviceName?: string) { return this.costs.costMetrics(metricType, provider, serviceName); }
  @Post('metrics') createMetric(@Body() dto: CreateCostMetricDto) { return this.costs.createCostMetric(dto); }
}