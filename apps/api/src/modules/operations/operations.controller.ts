import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextService } from '../tenants/tenant-context.service';
import { BackupService } from './backup/backup.service';
import { ComplianceService } from './compliance/compliance.service';
import { DataClassificationService } from './governance/data-classification.service';
import { DataLifecycleManager } from './governance/data-lifecycle-manager.service';
import { DataRetentionService } from './governance/data-retention.service';
import { MetricsService } from './observability/metrics.service';
import { AdvancedRateLimitService } from './rate-limiting/advanced-rate-limit.service';
import { FailoverStrategy } from './recovery/failover-strategy.service';
import { RecoveryManager } from './recovery/recovery-manager.service';
import { RestoreService } from './recovery/restore.service';
import { ReadinessCheckService } from './readiness/readiness-check.service';
import { SecurityHardeningService } from './security/security-hardening.service';
@ApiTags('Operations') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller({ path: 'operations', version: '1' })
export class OperationsController { constructor(private readonly context: TenantContextService, private readonly metrics: MetricsService, private readonly compliance: ComplianceService, private readonly retention: DataRetentionService, private readonly classification: DataClassificationService, private readonly lifecycle: DataLifecycleManager, private readonly backup: BackupService, private readonly recovery: RecoveryManager, private readonly restore: RestoreService, private readonly failover: FailoverStrategy, private readonly readiness: ReadinessCheckService, private readonly security: SecurityHardeningService, private readonly rateLimit: AdvancedRateLimitService) {}
  @Get('metrics') metricsSnapshot() { return this.metrics.snapshot(this.context.currentTenantId()); }
  @Get('compliance') complianceReadiness() { return { frameworks: this.compliance.frameworks(), readiness: this.compliance.readiness() }; }
  @Post('retention-policies') createRetention(@Body() dto: { resourceType: string; retentionDays: number; action?: string }) { return this.retention.createPolicy({ tenantId: this.context.currentTenantId(), ...dto }); }
  @Get('retention-policies') retentionPolicies() { return this.retention.list(this.context.currentTenantId()); }
  @Get('data-lifecycle') lifecyclePlan() { return this.lifecycle.evaluate(this.context.currentTenantId()); }
  @Post('classify-data') classify(@Body() dto: { resourceType: string; fields?: string[] }) { return this.classification.classify(dto.resourceType, dto.fields ?? []); }
  @Post('backups/:type') createBackup(@Param('type') type: string) { const tenantId = this.context.currentTenantId(); if (type === 'database') return this.backup.database(tenantId); if (type === 'config') return this.backup.config(tenantId); if (type === 'workflow') return this.backup.workflows(tenantId); if (type === 'audit') return this.backup.audit(tenantId); return this.backup.create({ tenantId, backupType: type }); }
  @Post('recovery/start') startRecovery(@Body() dto: { recoveryType: string; backupRunId?: string }) { return this.recovery.start({ tenantId: this.context.currentTenantId(), ...dto }); }
  @Post('restore/:backupRunId') restoreBackup(@Param('backupRunId') backupRunId: string) { return this.restore.restoreBackup({ tenantId: this.context.currentTenantId(), backupRunId }); }
  @Get('failover-plan') failoverPlan() { return this.failover.plan(); }
  @Get('readiness') readinessCheck() { return this.readiness.check(); }
  @Get('security') securityStatus() { return { headers: this.security.headers(), csp: this.security.csp(), encryption: this.security.validateEncryptionSecret(), rotation: this.security.secretRotationPlan() }; }
  @Post('rate-limit/check') checkRateLimit(@Body() dto: { route: string; userId?: string; apiKeyId?: string; workspaceId?: string; limit?: number; windowSeconds?: number }) { return this.rateLimit.check({ tenantId: this.context.currentTenantId(), ...dto }); }
}
