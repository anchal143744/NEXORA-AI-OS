import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateReliabilityScoreDto } from '../dto/reliability-operations.dto';
import { ReliabilityHealthService } from '../reliability-health.service';
import { ReliabilityOperationsService } from '../reliability-operations.service';

@ApiTags('Reliability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'reliability', version: '1' })
export class ReliabilityController {
  constructor(private readonly reliability: ReliabilityOperationsService, private readonly health: ReliabilityHealthService) {}

  @Get('dashboard') dashboard() { return this.reliability.dashboard(); }
  @Get('command-center') commandCenter() { return this.reliability.commandCenter(); }
  @Get('intelligence') intelligence() { return this.reliability.intelligence(); }
  @Get('scores') scores(@Query('scopeType') scopeType?: string, @Query('scoreBand') scoreBand?: string) { return this.health.scores(scopeType, scoreBand); }
  @Post('scores') createScore(@Body() dto: CreateReliabilityScoreDto) { return this.health.createScore(dto); }
}