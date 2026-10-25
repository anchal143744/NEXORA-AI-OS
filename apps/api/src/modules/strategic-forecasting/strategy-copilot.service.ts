import { Injectable } from '@nestjs/common';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { BudgetPlanningService } from './budget-planning.service';
import { CapacityPlanningService } from './capacity-planning.service';
import { ForecastingService } from './forecasting.service';
import { GrowthRiskForecastService } from './growth-risk-forecast.service';
import { PredictionService } from './prediction.service';
import { StrategicPlanningService } from './strategic-planning.service';

@Injectable()
export class StrategyCopilotService {
  constructor(
    private readonly forecasting: ForecastingService,
    private readonly predictions: PredictionService,
    private readonly planning: StrategicPlanningService,
    private readonly budget: BudgetPlanningService,
    private readonly capacity: CapacityPlanningService,
    private readonly growthRisk: GrowthRiskForecastService,
    private readonly context: TenantContextService,
    private readonly events: EventBusService,
  ) {}

  async recommendations() {
    const [forecastDashboard, predictionRisks, kpiPlanning, budgetRecommendations, capacityRecommendations, growthRecommendations, riskAlerts] = await Promise.all([
      this.forecasting.dashboard(),
      this.predictions.byType('risk'),
      this.planning.kpiPlanning(),
      this.budget.recommendations(),
      this.capacity.recommendations(),
      this.growthRisk.recommendations(),
      this.growthRisk.alerts(),
    ]);
    const recommendations = [
      { type: 'forecast', title: 'Review forecast variance', evidenceCount: forecastDashboard.summary.resultCount, priority: forecastDashboard.summary.openRiskCount > 0 ? 'high' : 'normal' },
      { type: 'budget', title: 'Align budget allocation with strategic goals', evidenceCount: budgetRecommendations.plans.length, priority: Math.abs(budgetRecommendations.variance) > 0 ? 'high' : 'normal' },
      { type: 'capacity', title: 'Resolve capacity gaps before execution risk increases', evidenceCount: capacityRecommendations.gaps.length, priority: capacityRecommendations.gaps.length ? 'high' : 'normal' },
      { type: 'growth', title: 'Prioritize growth forecasts with actionable opportunities', evidenceCount: growthRecommendations.recommendations.length, priority: 'normal' },
      { type: 'risk', title: 'Mitigate high-confidence strategic risks', evidenceCount: riskAlerts.alerts.length, priority: riskAlerts.alerts.length ? 'critical' : 'normal' },
    ];
    if (recommendations.some((item) => ['high', 'critical'].includes(item.priority))) {
      await this.events.publish({ tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, type: 'strategy.recommendation.generated', source: 'ai-strategy-copilot', payload: { recommendations }, actorUserId: this.context.context()?.userId });
    }
    return { recommendations, forecastDashboard, predictionRisks, kpiPlanning, budgetRecommendations, capacityRecommendations, growthRecommendations, riskAlerts };
  }

  explanations() {
    return this.forecasting.dashboard().then((dashboard) => ({ explanations: dashboard.results.map((result: { id: string; forecastType: string; forecastValue: number; confidence?: number | null; drivers: unknown }) => ({ forecastResultId: result.id, forecastType: result.forecastType, value: result.forecastValue, confidence: result.confidence, drivers: result.drivers })) }));
  }

  riskAlerts() { return this.growthRisk.alerts(); }
}