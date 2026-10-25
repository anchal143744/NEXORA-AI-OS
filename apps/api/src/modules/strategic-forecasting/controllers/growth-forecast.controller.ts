import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateGrowthForecastDto } from '../dto/strategic-forecasting.dto';
import { GrowthRiskForecastService } from '../growth-risk-forecast.service';

@ApiTags('Growth Forecast')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'growth-forecast', version: '1' })
export class GrowthForecastController {
  constructor(private readonly growthRisk: GrowthRiskForecastService) {}

  @Get() list(@Query('growthType') growthType?: string) { return this.growthRisk.growthForecasts(growthType); }
  @Post() create(@Body() dto: CreateGrowthForecastDto) { return this.growthRisk.createGrowth(dto); }
  @Get('recommendations') recommendations() { return this.growthRisk.recommendations(); }
}