import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateGrowthRecommendationDto } from '../dto/product-intelligence.dto';
import { GrowthInsightsService } from '../growth-insights.service';

@ApiTags('Growth Insights')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'growth-insights', version: '1' })
export class GrowthInsightsController {
  constructor(private readonly growth: GrowthInsightsService) {}

  @Get('recommendations') recommendations(@Query('recommendationType') recommendationType?: string, @Query('status') status?: string) { return this.growth.recommendations(recommendationType, status); }
  @Post('recommendations') createRecommendation(@Body() dto: CreateGrowthRecommendationDto) { return this.growth.createRecommendation(dto); }
  @Get('product') productInsights(@Query('moduleKey') moduleKey?: string) { return this.growth.productInsights(moduleKey); }
  @Get('adoption') adoption(@Query('moduleKey') moduleKey?: string) { return this.growth.adoptionRecommendations(moduleKey); }
  @Get('growth') growthRecommendations() { return this.growth.growthRecommendations(); }
  @Get('funnel-optimization') funnelOptimization(@Query('funnelId') funnelId?: string) { return this.growth.funnelOptimizationSuggestions(funnelId); }
  @Get('retention') retentionSuggestions() { return this.growth.retentionImprovementSuggestions(); }
  @Get('experiments') experimentRecommendations() { return this.growth.experimentRecommendations(); }
}
