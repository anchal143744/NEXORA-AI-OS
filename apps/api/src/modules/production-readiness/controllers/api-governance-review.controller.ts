import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateApiGovernanceReviewDto, CreateApiPolicyAssessmentDto, CreateApiVersionComplianceDto } from '../dto/production-readiness.dto';
import { ProductionReadinessAnalyticsService } from '../production-readiness-analytics.service';
import { ProductionReadinessCommandService } from '../production-readiness-command.service';
import { ProductionReadinessQueryService } from '../production-readiness-query.service';

@ApiTags('API Governance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'api-governance-review', version: '1' })
export class ApiGovernanceReviewController {
  constructor(private readonly commands: ProductionReadinessCommandService, private readonly queries: ProductionReadinessQueryService, private readonly analytics: ProductionReadinessAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('API Governance');
  }

  @Get('reviews') listApiGovernanceReview(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('apiGovernanceReview', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('reviews') createApiGovernanceReview(@Body() dto: CreateApiGovernanceReviewDto) {
    return this.commands.create('apiGovernanceReview', dto);
  }

  @Get('policy-assessments') listApiPolicyAssessment(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('apiPolicyAssessment', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('policy-assessments') createApiPolicyAssessment(@Body() dto: CreateApiPolicyAssessmentDto) {
    return this.commands.create('apiPolicyAssessment', dto);
  }

  @Get('version-compliance') listApiVersionCompliance(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('apiVersionCompliance', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('version-compliance') createApiVersionCompliance(@Body() dto: CreateApiVersionComplianceDto) {
    return this.commands.create('apiVersionCompliance', dto);
  }
}
