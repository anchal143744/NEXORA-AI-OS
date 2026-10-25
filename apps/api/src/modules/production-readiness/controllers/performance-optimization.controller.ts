import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePerformanceBenchmarkDto, CreatePerformanceOptimizationActionDto, CreatePerformanceRegressionDto } from '../dto/production-readiness.dto';
import { ProductionReadinessAnalyticsService } from '../production-readiness-analytics.service';
import { ProductionReadinessCommandService } from '../production-readiness-command.service';
import { ProductionReadinessQueryService } from '../production-readiness-query.service';

@ApiTags('Performance Optimization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'performance-optimization', version: '1' })
export class PerformanceOptimizationController {
  constructor(private readonly commands: ProductionReadinessCommandService, private readonly queries: ProductionReadinessQueryService, private readonly analytics: ProductionReadinessAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Performance Optimization');
  }

  @Get('benchmarks') listPerformanceBenchmark(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('performanceBenchmark', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('benchmarks') createPerformanceBenchmark(@Body() dto: CreatePerformanceBenchmarkDto) {
    return this.commands.create('performanceBenchmark', dto);
  }

  @Get('optimization-actions') listPerformanceOptimizationAction(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('performanceOptimizationAction', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('optimization-actions') createPerformanceOptimizationAction(@Body() dto: CreatePerformanceOptimizationActionDto) {
    return this.commands.create('performanceOptimizationAction', dto);
  }

  @Get('regressions') listPerformanceRegression(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('performanceRegression', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('regressions') createPerformanceRegression(@Body() dto: CreatePerformanceRegressionDto) {
    return this.commands.create('performanceRegression', dto);
  }
}
