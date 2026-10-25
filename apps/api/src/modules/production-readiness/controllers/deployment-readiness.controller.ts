import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateDeploymentReadinessCheckDto, CreateEnvironmentReadinessProfileDto, CreateStartupValidationRecordDto } from '../dto/production-readiness.dto';
import { ProductionReadinessAnalyticsService } from '../production-readiness-analytics.service';
import { ProductionReadinessCommandService } from '../production-readiness-command.service';
import { ProductionReadinessQueryService } from '../production-readiness-query.service';

@ApiTags('Production Deployment Readiness')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'deployment-readiness', version: '1' })
export class DeploymentReadinessController {
  constructor(private readonly commands: ProductionReadinessCommandService, private readonly queries: ProductionReadinessQueryService, private readonly analytics: ProductionReadinessAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Production Deployment Readiness');
  }

  @Get('checks') listDeploymentReadinessCheck(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('deploymentReadinessCheck', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('checks') createDeploymentReadinessCheck(@Body() dto: CreateDeploymentReadinessCheckDto) {
    return this.commands.create('deploymentReadinessCheck', dto);
  }

  @Get('environment-profiles') listEnvironmentReadinessProfile(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('environmentReadinessProfile', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('environment-profiles') createEnvironmentReadinessProfile(@Body() dto: CreateEnvironmentReadinessProfileDto) {
    return this.commands.create('environmentReadinessProfile', dto);
  }

  @Get('startup-validations') listStartupValidationRecord(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('startupValidationRecord', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('startup-validations') createStartupValidationRecord(@Body() dto: CreateStartupValidationRecordDto) {
    return this.commands.create('startupValidationRecord', dto);
  }
}
