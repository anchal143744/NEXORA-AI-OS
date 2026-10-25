import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateRetentionCohortDto } from '../dto/product-intelligence.dto';
import { GrowthInsightsService } from '../growth-insights.service';
import { RetentionIntelligenceService } from '../retention-intelligence.service';

@ApiTags('Retention Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'retention', version: '1' })
export class RetentionController {
  constructor(private readonly retention: RetentionIntelligenceService, private readonly growth: GrowthInsightsService) {}

  @Get('cohorts') cohorts(@Query('cohortType') cohortType?: string) { return this.retention.cohorts(cohortType); }
  @Post('cohorts') createCohort(@Body() dto: CreateRetentionCohortDto) { return this.retention.createCohort(dto); }
  @Get('churn-signals') churnSignals() { return this.retention.churnSignals(); }
  @Get('stickiness') stickiness() { return this.retention.stickiness(); }
  @Get('suggestions') suggestions() { return this.growth.retentionImprovementSuggestions(); }
}
