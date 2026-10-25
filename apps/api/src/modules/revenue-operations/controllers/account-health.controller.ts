
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAccountHealthScoreDto } from '../dto/revenue-operations.dto';
import { RevenueIntelligenceService } from '../revenue-intelligence.service';

@ApiTags('Account Health')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'account-health', version: '1' })
export class AccountHealthController {
  constructor(private readonly intelligence: RevenueIntelligenceService) {}
  @Get('dashboard') dashboard() { return this.intelligence.healthDashboard(); }
  @Get('scores') scores(@Query('scoreBand') scoreBand?: string, @Query('trend') trend?: string, @Query('revenueAccountId') revenueAccountId?: string) { return this.intelligence.accountHealthScores(scoreBand, trend, revenueAccountId); }
  @Post('scores') createScore(@Body() dto: CreateAccountHealthScoreDto) { return this.intelligence.createAccountHealthScore(dto); }
}
