import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { QueueModule } from '../../infrastructure/queues/queue.module';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { BackupService } from './backup/backup.service';
import { ComplianceService } from './compliance/compliance.service';
import { DataClassificationService } from './governance/data-classification.service';
import { DataLifecycleManager } from './governance/data-lifecycle-manager.service';
import { DataRetentionService } from './governance/data-retention.service';
import { DatabaseHealthService } from './health/database-health.service';
import { ExternalHealthService } from './health/external-health.service';
import { HealthController } from './health/health.controller';
import { QueueHealthService } from './health/queue-health.service';
import { RedisHealthService } from './health/redis-health.service';
import { RequestLoggingInterceptor } from './interceptors/request-logging.interceptor';
import { OperationsController } from './operations.controller';
import { AuditTrackingService } from './observability/audit-tracking.service';
import { HealthMonitoringService } from './observability/health-monitoring.service';
import { ObservabilityModule } from './observability/observability.module';
import { PrometheusMetricsController } from './observability/prometheus-metrics.controller';
import { AdvancedRateLimitService } from './rate-limiting/advanced-rate-limit.service';
import { DependencyValidationService } from './readiness/dependency-validation.service';
import { EnvironmentValidationService } from './readiness/environment-validation.service';
import { ReadinessCheckService } from './readiness/readiness-check.service';
import { StartupValidationService } from './readiness/startup-validation.service';
import { FailoverStrategy } from './recovery/failover-strategy.service';
import { RecoveryManager } from './recovery/recovery-manager.service';
import { RestoreService } from './recovery/restore.service';
import { SecurityHardeningService } from './security/security-hardening.service';

@Module({ imports: [ObservabilityModule, QueueModule, RedisModule], controllers: [HealthController, OperationsController, PrometheusMetricsController], providers: [AuditTrackingService, HealthMonitoringService, DatabaseHealthService, RedisHealthService, QueueHealthService, ExternalHealthService, ComplianceService, DataRetentionService, DataClassificationService, DataLifecycleManager, BackupService, RecoveryManager, RestoreService, FailoverStrategy, EnvironmentValidationService, DependencyValidationService, StartupValidationService, ReadinessCheckService, AdvancedRateLimitService, SecurityHardeningService, { provide: APP_INTERCEPTOR, useClass: RequestLoggingInterceptor }], exports: [ObservabilityModule, ReadinessCheckService, SecurityHardeningService] })
export class OperationsModule {}