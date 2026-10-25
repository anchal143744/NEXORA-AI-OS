import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSecurityHardeningControlDto, CreateSecurityAuditFindingDto, CreateDependencyRemediationRecordDto } from '../dto/production-readiness.dto';
import { ProductionReadinessAnalyticsService } from '../production-readiness-analytics.service';
import { ProductionReadinessCommandService } from '../production-readiness-command.service';
import { ProductionReadinessQueryService } from '../production-readiness-query.service';

@ApiTags('Security Hardening')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'security-hardening', version: '1' })
export class SecurityHardeningController {
  constructor(private readonly commands: ProductionReadinessCommandService, private readonly queries: ProductionReadinessQueryService, private readonly analytics: ProductionReadinessAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Security Hardening');
  }

  @Get('controls') listSecurityHardeningControl(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('securityHardeningControl', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('controls') createSecurityHardeningControl(@Body() dto: CreateSecurityHardeningControlDto) {
    return this.commands.create('securityHardeningControl', dto);
  }

  @Get('audit-findings') listSecurityAuditFinding(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('securityAuditFinding', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('audit-findings') createSecurityAuditFinding(@Body() dto: CreateSecurityAuditFindingDto) {
    return this.commands.create('securityAuditFinding', dto);
  }

  @Get('dependency-remediations') listDependencyRemediationRecord(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('dependencyRemediationRecord', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('dependency-remediations') createDependencyRemediationRecord(@Body() dto: CreateDependencyRemediationRecordDto) {
    return this.commands.create('dependencyRemediationRecord', dto);
  }
}
