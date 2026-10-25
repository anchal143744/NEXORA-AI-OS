import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { SecurityHardeningController } from './controllers/security-hardening.controller';
import { LoadTestingController } from './controllers/load-testing.controller';
import { PerformanceOptimizationController } from './controllers/performance-optimization.controller';
import { MonitoringObservabilityController } from './controllers/monitoring-observability.controller';
import { BackupRecoveryController } from './controllers/backup-recovery.controller';
import { DisasterRecoveryController } from './controllers/disaster-recovery.controller';
import { DeploymentReadinessController } from './controllers/deployment-readiness.controller';
import { ApiGovernanceReviewController } from './controllers/api-governance-review.controller';
import { TestCoverageController } from './controllers/test-coverage.controller';
import { ReleaseCandidateController } from './controllers/release-candidate.controller';
import { EnterpriseDocumentationController } from './controllers/enterprise-documentation.controller';
import { ProductionReadinessScoringController } from './controllers/production-readiness-scoring.controller';
import { ProductionReadinessAnalyticsService } from './production-readiness-analytics.service';
import { ProductionReadinessCommandService } from './production-readiness-command.service';
import { ProductionReadinessCqrsService } from './production-readiness-cqrs.service';
import { ProductionReadinessQueryService } from './production-readiness-query.service';
import { ProductionReadinessReadinessService } from './production-readiness-readiness.service';
import { ProductionReadinessService } from './production-readiness.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [SecurityHardeningController, LoadTestingController, PerformanceOptimizationController, MonitoringObservabilityController, BackupRecoveryController, DisasterRecoveryController, DeploymentReadinessController, ApiGovernanceReviewController, TestCoverageController, ReleaseCandidateController, EnterpriseDocumentationController, ProductionReadinessScoringController],
  providers: [ProductionReadinessService, ProductionReadinessCommandService, ProductionReadinessQueryService, ProductionReadinessCqrsService, ProductionReadinessAnalyticsService, ProductionReadinessReadinessService],
  exports: [ProductionReadinessService, ProductionReadinessCommandService, ProductionReadinessQueryService, ProductionReadinessCqrsService, ProductionReadinessAnalyticsService, ProductionReadinessReadinessService],
})
export class ProductionReadinessModule {}
