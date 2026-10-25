import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateReleaseCandidateChecklistDto, CreateReleaseValidationRunDto, CreateReleaseApprovalDto } from '../dto/production-readiness.dto';
import { ProductionReadinessAnalyticsService } from '../production-readiness-analytics.service';
import { ProductionReadinessCommandService } from '../production-readiness-command.service';
import { ProductionReadinessQueryService } from '../production-readiness-query.service';

@ApiTags('Release Candidate Validation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'release-candidate', version: '1' })
export class ReleaseCandidateController {
  constructor(private readonly commands: ProductionReadinessCommandService, private readonly queries: ProductionReadinessQueryService, private readonly analytics: ProductionReadinessAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Release Candidate Validation');
  }

  @Get('checklists') listReleaseCandidateChecklist(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('releaseCandidateChecklist', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('checklists') createReleaseCandidateChecklist(@Body() dto: CreateReleaseCandidateChecklistDto) {
    return this.commands.create('releaseCandidateChecklist', dto);
  }

  @Get('validation-runs') listReleaseValidationRun(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('releaseValidationRun', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('validation-runs') createReleaseValidationRun(@Body() dto: CreateReleaseValidationRunDto) {
    return this.commands.create('releaseValidationRun', dto);
  }

  @Get('approvals') listReleaseApproval(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('releaseApproval', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('approvals') createReleaseApproval(@Body() dto: CreateReleaseApprovalDto) {
    return this.commands.create('releaseApproval', dto);
  }
}
