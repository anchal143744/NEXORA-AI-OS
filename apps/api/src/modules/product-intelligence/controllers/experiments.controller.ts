import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AddExperimentVariantDto, CreateExperimentDto, EvaluateExperimentResultDto } from '../dto/product-intelligence.dto';
import { ExperimentationService } from '../experimentation.service';
import { GrowthInsightsService } from '../growth-insights.service';

@ApiTags('Growth Experiments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'experiments', version: '1' })
export class ExperimentsController {
  constructor(private readonly experiments: ExperimentationService, private readonly growth: GrowthInsightsService) {}

  @Get() list(@Query('status') status?: string, @Query('experimentType') experimentType?: string) { return this.experiments.experiments(status, experimentType); }
  @Post() create(@Body() dto: CreateExperimentDto) { return this.experiments.createExperiment(dto); }
  @Get('dashboard') dashboard() { return this.experiments.dashboard(); }
  @Get('recommendations') recommendations() { return this.growth.experimentRecommendations(); }
  @Get(':id') get(@Param('id') id: string) { return this.experiments.getExperiment(id); }
  @Post(':id/variants') addVariant(@Param('id') id: string, @Body() dto: AddExperimentVariantDto) { return this.experiments.addVariant(id, dto); }
  @Get(':id/results') results(@Param('id') id: string) { return this.experiments.results(id); }
  @Post(':id/results') evaluate(@Param('id') id: string, @Body() dto: EvaluateExperimentResultDto) { return this.experiments.evaluateResult(id, dto); }
}
