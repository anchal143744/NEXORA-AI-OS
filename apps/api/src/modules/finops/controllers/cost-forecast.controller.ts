import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CostIntelligenceService } from '../cost-intelligence.service';
import { CreateCostForecastDto } from '../dto/finops.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Cost Forecast')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'cost-forecast', version: '1' })
export class CostForecastController {
  constructor(private readonly costs: CostIntelligenceService) {}

  @Get('engine') engine() { return this.costs.dashboard(); }
  @Get() forecasts(@Query('forecastType') forecastType?: string, @Query('horizon') horizon?: string) { return this.costs.forecasts(forecastType, horizon); }
  @Post() createForecast(@Body() dto: CreateCostForecastDto) { return this.costs.createForecast(dto); }
  @Get('latest') latest() { return this.costs.forecasts().then((forecasts: unknown[]) => forecasts[0] ?? null); }
}