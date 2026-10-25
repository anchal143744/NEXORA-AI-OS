import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateEngagementScoreDto } from '../dto/product-intelligence.dto';
import { RetentionIntelligenceService } from '../retention-intelligence.service';

@ApiTags('Product Engagement')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'engagement', version: '1' })
export class EngagementController {
  constructor(private readonly retention: RetentionIntelligenceService) {}

  @Get('scores') scores(@Query('userId') userId?: string, @Query('scoreBand') scoreBand?: string) { return this.retention.engagementScores(userId, scoreBand); }
  @Post('scores') createScore(@Body() dto: CreateEngagementScoreDto) { return this.retention.createEngagementScore(dto); }
  @Get('stickiness') stickiness() { return this.retention.stickiness(); }
  @Get('churn-signals') churnSignals() { return this.retention.churnSignals(); }
}
