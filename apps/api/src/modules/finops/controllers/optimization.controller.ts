import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateOptimizationRecommendationDto, CreateSavingsOpportunityDto } from '../dto/finops.dto';
import { OptimizationService } from '../optimization.service';

@ApiTags('Optimization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'optimization', version: '1' })
export class OptimizationController {
  constructor(private readonly optimization: OptimizationService) {}

  @Get('dashboard') dashboard() { return this.optimization.dashboard(); }
  @Get('recommendations') recommendations(@Query('recommendationType') recommendationType?: string, @Query('priority') priority?: string, @Query('status') status?: string) { return this.optimization.recommendations(recommendationType, priority, status); }
  @Post('recommendations') createRecommendation(@Body() dto: CreateOptimizationRecommendationDto) { return this.optimization.createRecommendation(dto); }
  @Get('savings-opportunities') opportunities(@Query('opportunityType') opportunityType?: string, @Query('status') status?: string, @Query('priority') priority?: string) { return this.optimization.savingsOpportunities(opportunityType, status, priority); }
  @Post('savings-opportunities') createOpportunity(@Body() dto: CreateSavingsOpportunityDto) { return this.optimization.createSavingsOpportunity(dto); }
}