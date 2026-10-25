
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateRenewalForecastDto, CreateRenewalScheduleDto } from '../dto/revenue-operations.dto';
import { RenewalIntelligenceService } from '../renewal-intelligence.service';

@ApiTags('Renewals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'renewals', version: '1' })
export class RenewalsController {
  constructor(private readonly renewals: RenewalIntelligenceService) {}
  @Get('dashboard') dashboard() { return this.renewals.dashboard(); }
  @Get('schedules') schedules(@Query('status') status?: string, @Query('renewalType') renewalType?: string, @Query('revenueAccountId') revenueAccountId?: string) { return this.renewals.schedules(status, renewalType, revenueAccountId); }
  @Post('schedules') createSchedule(@Body() dto: CreateRenewalScheduleDto) { return this.renewals.createSchedule(dto); }
  @Get('forecasts') forecasts(@Query('forecastStatus') forecastStatus?: string, @Query('riskBand') riskBand?: string, @Query('revenueAccountId') revenueAccountId?: string) { return this.renewals.forecasts(forecastStatus, riskBand, revenueAccountId); }
  @Post('forecasts') createForecast(@Body() dto: CreateRenewalForecastDto) { return this.renewals.createForecast(dto); }
}
