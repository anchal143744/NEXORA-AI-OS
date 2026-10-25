import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { BudgetGovernanceService } from './budget-governance.service';
import { BudgetsController } from './controllers/budgets.controller';
import { CostForecastController } from './controllers/cost-forecast.controller';
import { CostIntelligenceController } from './controllers/cost-intelligence.controller';
import { EfficiencyController } from './controllers/efficiency.controller';
import { FinOpsController } from './controllers/finops.controller';
import { OptimizationController } from './controllers/optimization.controller';
import { PerformanceController } from './controllers/performance.controller';
import { ResourceUsageController } from './controllers/resource-usage.controller';
import { CostIntelligenceService } from './cost-intelligence.service';
import { FinOpsService } from './finops.service';
import { OptimizationService } from './optimization.service';
import { ResourceAnalyticsService } from './resource-analytics.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [FinOpsController, CostIntelligenceController, PerformanceController, ResourceUsageController, CostForecastController, OptimizationController, BudgetsController, EfficiencyController],
  providers: [FinOpsService, CostIntelligenceService, ResourceAnalyticsService, OptimizationService, BudgetGovernanceService],
  exports: [FinOpsService, CostIntelligenceService, ResourceAnalyticsService, OptimizationService, BudgetGovernanceService],
})
export class FinOpsModule {}