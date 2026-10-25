import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateBackupPolicyDto, CreateBackupValidationRunDto, CreateRecoveryPointObjectiveDto } from '../dto/production-readiness.dto';
import { ProductionReadinessAnalyticsService } from '../production-readiness-analytics.service';
import { ProductionReadinessCommandService } from '../production-readiness-command.service';
import { ProductionReadinessQueryService } from '../production-readiness-query.service';

@ApiTags('Backup & Recovery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'backup-recovery', version: '1' })
export class BackupRecoveryController {
  constructor(private readonly commands: ProductionReadinessCommandService, private readonly queries: ProductionReadinessQueryService, private readonly analytics: ProductionReadinessAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Backup & Recovery');
  }

  @Get('policies') listBackupPolicy(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('backupPolicy', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('policies') createBackupPolicy(@Body() dto: CreateBackupPolicyDto) {
    return this.commands.create('backupPolicy', dto);
  }

  @Get('validation-runs') listBackupValidationRun(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('backupValidationRun', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('validation-runs') createBackupValidationRun(@Body() dto: CreateBackupValidationRunDto) {
    return this.commands.create('backupValidationRun', dto);
  }

  @Get('recovery-point-objectives') listRecoveryPointObjective(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('recoveryPointObjective', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('recovery-point-objectives') createRecoveryPointObjective(@Body() dto: CreateRecoveryPointObjectiveDto) {
    return this.commands.create('recoveryPointObjective', dto);
  }
}
