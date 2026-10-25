import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEfficiencyScoreDto } from '../dto/finops.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OptimizationService } from '../optimization.service';

@ApiTags('Efficiency')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'efficiency', version: '1' })
export class EfficiencyController {
  constructor(private readonly optimization: OptimizationService) {}

  @Get('dashboard') dashboard() { return this.optimization.dashboard(); }
  @Get('scores') scores(@Query('scopeType') scopeType?: string, @Query('scoreBand') scoreBand?: string) { return this.optimization.efficiencyScores(scopeType, scoreBand); }
  @Post('scores') createScore(@Body() dto: CreateEfficiencyScoreDto) { return this.optimization.createEfficiencyScore(dto); }
  @Get('latest') latest() { return this.optimization.efficiencyScores().then((scores: unknown[]) => scores[0] ?? null); }
}