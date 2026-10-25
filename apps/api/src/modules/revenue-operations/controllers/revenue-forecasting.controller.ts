
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateRevenueForecastDto } from '../dto/revenue-operations.dto';
import { RevenueIntelligenceService } from '../revenue-intelligence.service';

@ApiTags('Revenue Forecasting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'revenue-forecasting', version: '1' })
export class RevenueForecastingController {
  constructor(private readonly intelligence: RevenueIntelligenceService) {}
  @Get('dashboard') dashboard() { return this.intelligence.forecastingDashboard(); }
  @Get() forecasts(@Query('forecastType') forecastType?: string, @Query('modelVersion') modelVersion?: string, @Query('revenueAccountId') revenueAccountId?: string) { return this.intelligence.revenueForecasts(forecastType, modelVersion, revenueAccountId); }
  @Post() create(@Body() dto: CreateRevenueForecastDto) { return this.intelligence.createRevenueForecast(dto); }
}
