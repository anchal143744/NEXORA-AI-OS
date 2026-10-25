import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateTestCoverageSnapshotDto, CreateUnitTestCoverageReviewDto, CreateIntegrationTestCoverageReviewDto } from '../dto/production-readiness.dto';
import { ProductionReadinessAnalyticsService } from '../production-readiness-analytics.service';
import { ProductionReadinessCommandService } from '../production-readiness-command.service';
import { ProductionReadinessQueryService } from '../production-readiness-query.service';

@ApiTags('Test Coverage Expansion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'test-coverage', version: '1' })
export class TestCoverageController {
  constructor(private readonly commands: ProductionReadinessCommandService, private readonly queries: ProductionReadinessQueryService, private readonly analytics: ProductionReadinessAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Test Coverage Expansion');
  }

  @Get('coverage-snapshots') listTestCoverageSnapshot(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('testCoverageSnapshot', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('coverage-snapshots') createTestCoverageSnapshot(@Body() dto: CreateTestCoverageSnapshotDto) {
    return this.commands.create('testCoverageSnapshot', dto);
  }

  @Get('unit-coverage-reviews') listUnitTestCoverageReview(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('unitTestCoverageReview', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('unit-coverage-reviews') createUnitTestCoverageReview(@Body() dto: CreateUnitTestCoverageReviewDto) {
    return this.commands.create('unitTestCoverageReview', dto);
  }

  @Get('integration-coverage-reviews') listIntegrationTestCoverageReview(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('integrationTestCoverageReview', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('integration-coverage-reviews') createIntegrationTestCoverageReview(@Body() dto: CreateIntegrationTestCoverageReviewDto) {
    return this.commands.create('integrationTestCoverageReview', dto);
  }
}
