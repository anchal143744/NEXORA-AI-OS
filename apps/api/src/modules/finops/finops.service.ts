import { Injectable } from '@nestjs/common';
import { BudgetGovernanceService } from './budget-governance.service';
import { CostIntelligenceService } from './cost-intelligence.service';
import { OptimizationService } from './optimization.service';
import { ResourceAnalyticsService } from './resource-analytics.service';

@Injectable()
export class FinOpsService {
  constructor(
    private readonly costs: CostIntelligenceService,
    private readonly resources: ResourceAnalyticsService,
    private readonly optimization: OptimizationService,
    private readonly budgets: BudgetGovernanceService,
  ) {}

  async dashboard() {
    const [costs, resources, optimization, budgets] = await Promise.all([this.costs.dashboard(), this.resources.analytics(), this.optimization.dashboard(), this.budgets.dashboard()]);
    return { costs, resources, optimization, budgets, summary: { totalCost: costs.summary.totalCost, totalUsageCost: resources.summary.totalUsageCost, estimatedSavings: optimization.summary.estimatedSavings, openCostAlerts: budgets.summary.openAlertCount, efficiencyScore: optimization.summary.latestEfficiencyScore } };
  }

  commandCenter() { return this.dashboard(); }
  costSummary() { return this.costs.dashboard(); }
  optimizationSummary() { return this.optimization.dashboard(); }
  allocationSummary() { return this.resources.analytics(); }
  policySummary() { return this.budgets.dashboard(); }
}