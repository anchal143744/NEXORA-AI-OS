import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateModelPerformanceMetricDto } from '../dto/ai-governance.dto';
import { ModelPerformanceService } from '../model-performance.service';

@ApiTags('Model Performance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'model-performance', version: '1' })
export class ModelPerformanceController {
  constructor(private readonly performance: ModelPerformanceService) {}

  @Get('metrics') metrics(@Query('aiModelId') aiModelId?: string, @Query('metricType') metricType?: string, @Query('status') status?: string) { return this.performance.metrics(aiModelId, metricType, status); }
  @Post('metrics') recordMetric(@Body() dto: CreateModelPerformanceMetricDto) { return this.performance.recordMetric(dto); }
  @Get('dashboard') dashboard() { return this.performance.dashboard(); }
  @Get('drift') drift(@Query('aiModelId') aiModelId?: string) { return this.performance.drift(aiModelId); }
}