import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateForecastModelDto, GenerateForecastResultDto } from '../dto/strategic-forecasting.dto';
import { ForecastingService } from '../forecasting.service';
import { StrategyCopilotService } from '../strategy-copilot.service';

@ApiTags('Forecasting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'forecasting', version: '1' })
export class ForecastingController {
  constructor(private readonly forecasting: ForecastingService, private readonly copilot: StrategyCopilotService) {}

  @Get('dashboard') dashboard() { return this.forecasting.dashboard(); }
  @Get('models') models(@Query('forecastType') forecastType?: string, @Query('status') status?: string) { return this.forecasting.models(forecastType, status); }
  @Post('models') createModel(@Body() dto: CreateForecastModelDto) { return this.forecasting.createModel(dto); }
  @Get('results') results(@Query('forecastModelId') forecastModelId?: string, @Query('forecastType') forecastType?: string) { return this.forecasting.results(forecastModelId, forecastType); }
  @Post('results') generateResult(@Body() dto: GenerateForecastResultDto) { return this.forecasting.generateResult(dto); }
  @Get('revenue') revenue() { return this.forecasting.byType('revenue'); }
  @Get('sales') sales() { return this.forecasting.byType('sales'); }
  @Get('expenses') expenses() { return this.forecasting.byType('expenses'); }
  @Get('demand') demand() { return this.forecasting.byType('demand'); }
  @Get('workforce') workforce() { return this.forecasting.byType('workforce'); }
  @Get('capacity') capacity() { return this.forecasting.byType('capacity'); }
  @Get('explanations') explanations() { return this.copilot.explanations(); }
}