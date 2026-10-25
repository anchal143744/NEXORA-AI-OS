import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateRiskForecastDto } from '../dto/strategic-forecasting.dto';
import { GrowthRiskForecastService } from '../growth-risk-forecast.service';
import { StrategyCopilotService } from '../strategy-copilot.service';

@ApiTags('Risk Forecast')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'risk-forecast', version: '1' })
export class RiskForecastController {
  constructor(private readonly growthRisk: GrowthRiskForecastService, private readonly copilot: StrategyCopilotService) {}

  @Get() list(@Query('riskType') riskType?: string, @Query('severity') severity?: string, @Query('status') status?: string) { return this.growthRisk.riskForecasts(riskType, severity, status); }
  @Post() create(@Body() dto: CreateRiskForecastDto) { return this.growthRisk.createRisk(dto); }
  @Get('alerts') alerts() { return this.copilot.riskAlerts(); }
  @Get('mitigation') mitigation() { return this.growthRisk.mitigation(); }
}