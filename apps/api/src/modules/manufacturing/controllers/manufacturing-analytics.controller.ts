import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {

  CreateManufacturingMetricDto,

} from '../dto/manufacturing.dto';
import { ManufacturingCommandService } from '../manufacturing-command.service';
import { ManufacturingQueryService } from '../manufacturing-query.service';
import { ManufacturingService } from '../manufacturing.service';

@ApiTags('Manufacturing Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'manufacturing-analytics', version: '1' })
export class ManufacturingAnalyticsController {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService, private readonly manufacturing: ManufacturingService) {}

  @Get('dashboard') dashboard() { return this.queries.analyticsDashboard(); }
  @Get('metrics') metrics(@Query('metricType') metricType?: string, @Query('plantId') plantId?: string) { return this.queries.metrics(metricType, plantId); }
  @Post('metrics') createMetric(@Body() dto: CreateManufacturingMetricDto) { return this.commands.createMetric(dto); }

}

