import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSemanticDimensionDto, CreateSemanticMetricDto } from '../dto/data-platform.dto';
import { SemanticLayerService } from '../semantic-layer.service';

@ApiTags('Semantic Layer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'semantic-layer', version: '1' })
export class SemanticLayerController {
  constructor(private readonly semantic: SemanticLayerService) {}

  @Get('metrics') metrics(@Query('category') category?: string, @Query('certified') certified?: string) { return this.semantic.metrics(category, certified === undefined ? undefined : certified === 'true'); }
  @Post('metrics') createMetric(@Body() dto: CreateSemanticMetricDto) { return this.semantic.createMetric(dto); }
  @Get('dimensions') dimensions(@Query('dimensionType') dimensionType?: string) { return this.semantic.dimensions(dimensionType); }
  @Post('dimensions') createDimension(@Body() dto: CreateSemanticDimensionDto) { return this.semantic.createDimension(dto); }
  @Get('manager') manager() { return this.semantic.manager(); }
  @Get('certified-metrics') certifiedMetrics() { return this.semantic.certifiedMetrics(); }
}