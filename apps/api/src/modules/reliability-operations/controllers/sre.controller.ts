import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCapacityForecastDto, CreateSreAlertDto } from '../dto/reliability-operations.dto';
import { ScalingOperationsService } from '../scaling-operations.service';
import { SreAutomationService } from '../sre-automation.service';

@ApiTags('SRE')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'sre', version: '1' })
export class SreController {
  constructor(private readonly sre: SreAutomationService, private readonly scaling: ScalingOperationsService) {}

  @Get('dashboard') dashboard() { return this.sre.dashboard(); }
  @Get('reliability-intelligence') reliabilityIntelligence() { return this.sre.reliabilityIntelligence(); }
  @Get('alerts') alerts(@Query('severity') severity?: string, @Query('status') status?: string, @Query('alertType') alertType?: string) { return this.sre.alerts(severity, status, alertType); }
  @Post('alerts') createAlert(@Body() dto: CreateSreAlertDto) { return this.sre.createAlert(dto); }
  @Get('capacity-forecasts') forecasts(@Query('serviceName') serviceName?: string, @Query('forecastType') forecastType?: string, @Query('region') region?: string) { return this.scaling.capacityForecasts(serviceName, forecastType, region); }
  @Post('capacity-forecasts') createForecast(@Body() dto: CreateCapacityForecastDto) { return this.scaling.createCapacityForecast(dto); }
}