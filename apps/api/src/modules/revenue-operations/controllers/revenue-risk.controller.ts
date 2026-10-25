
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateRevenueEventDto } from '../dto/revenue-operations.dto';
import { RevenueIntelligenceService } from '../revenue-intelligence.service';

@ApiTags('Revenue Risk')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'revenue-risk', version: '1' })
export class RevenueRiskController {
  constructor(private readonly intelligence: RevenueIntelligenceService) {}
  @Get('dashboard') dashboard() { return this.intelligence.riskDashboard(); }
  @Get() risks(@Query('severity') severity?: string, @Query('status') status?: string, @Query('customerIdentityId') customerIdentityId?: string) { return this.intelligence.revenueRisks(severity, status, customerIdentityId); }
  @Get('events') events(@Query('eventType') eventType?: string, @Query('severity') severity?: string, @Query('revenueAccountId') revenueAccountId?: string) { return this.intelligence.revenueEvents(eventType, severity, revenueAccountId); }
  @Post('events') createEvent(@Body() dto: CreateRevenueEventDto) { return this.intelligence.createRevenueEvent(dto); }
}
