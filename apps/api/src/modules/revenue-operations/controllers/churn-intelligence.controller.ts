
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateChurnSignalDto } from '../dto/revenue-operations.dto';
import { RevenueIntelligenceService } from '../revenue-intelligence.service';

@ApiTags('Churn Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'churn-intelligence', version: '1' })
export class ChurnIntelligenceController {
  constructor(private readonly intelligence: RevenueIntelligenceService) {}
  @Get('dashboard') dashboard() { return this.intelligence.churnDashboard(); }
  @Get('signals') signals(@Query('severity') severity?: string, @Query('status') status?: string, @Query('revenueAccountId') revenueAccountId?: string) { return this.intelligence.churnSignals(severity, status, revenueAccountId); }
  @Post('signals') createSignal(@Body() dto: CreateChurnSignalDto) { return this.intelligence.createChurnSignal(dto); }
  @Get('predictions') predictions(@Query('riskBand') riskBand?: string, @Query('status') status?: string, @Query('customerIdentityId') customerIdentityId?: string) { return this.intelligence.churnPredictions(riskBand, status, customerIdentityId); }
}
