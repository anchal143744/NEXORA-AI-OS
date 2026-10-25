import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateEnterpriseDocumentationReviewDto, CreateDocumentationGapDto, CreateDocumentationEvidenceDto } from '../dto/production-readiness.dto';
import { ProductionReadinessAnalyticsService } from '../production-readiness-analytics.service';
import { ProductionReadinessCommandService } from '../production-readiness-command.service';
import { ProductionReadinessQueryService } from '../production-readiness-query.service';

@ApiTags('Enterprise Documentation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'enterprise-documentation', version: '1' })
export class EnterpriseDocumentationController {
  constructor(private readonly commands: ProductionReadinessCommandService, private readonly queries: ProductionReadinessQueryService, private readonly analytics: ProductionReadinessAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Enterprise Documentation');
  }

  @Get('reviews') listEnterpriseDocumentationReview(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('enterpriseDocumentationReview', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('reviews') createEnterpriseDocumentationReview(@Body() dto: CreateEnterpriseDocumentationReviewDto) {
    return this.commands.create('enterpriseDocumentationReview', dto);
  }

  @Get('gaps') listDocumentationGap(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('documentationGap', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('gaps') createDocumentationGap(@Body() dto: CreateDocumentationGapDto) {
    return this.commands.create('documentationGap', dto);
  }

  @Get('evidence') listDocumentationEvidence(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('documentationEvidence', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('evidence') createDocumentationEvidence(@Body() dto: CreateDocumentationEvidenceDto) {
    return this.commands.create('documentationEvidence', dto);
  }
}
