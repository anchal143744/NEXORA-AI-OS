
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCostOptimizationRecommendationDto } from '../dto/procurement.dto';
import { SpendIntelligenceService } from '../spend-intelligence.service';

@ApiTags('Cost Optimization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'cost-optimization', version: '1' })
export class CostOptimizationController {
  constructor(private readonly spend: SpendIntelligenceService) {}
  @Get('dashboard') dashboard() { return this.spend.optimizationDashboard(); }
  @Get() list(@Query('status') status?: string, @Query('priority') priority?: string, @Query('recommendationType') recommendationType?: string) { return this.spend.recommendations(status, priority, recommendationType); }
  @Post() create(@Body() dto: CreateCostOptimizationRecommendationDto) { return this.spend.createRecommendation(dto); }
}
