import { Injectable } from '@nestjs/common';
import { PLANNING_GROUPS } from './planning.entities';
import { PlanningQueryService } from './planning-query.service';

@Injectable()
export class PlanningAnalyticsService {
  constructor(private readonly queries: PlanningQueryService) {}
  dashboard(group: string) { return this.queries.dashboard(group); }
  async executiveDashboard() {
    const platform = await this.queries.platformDashboard();
    return {
      ...platform,
      coverage: {
        modules: Object.keys(PLANNING_GROUPS),
        analytics: ['okr_progress', 'portfolio_health', 'resource_capacity', 'budget_variance', 'scenario_outcomes', 'strategic_alignment', 'executive_scorecards'],
        aiQuestions: ['at_risk_objectives', 'portfolio_tradeoffs', 'capacity_constraints', 'budget_variance_causes', 'best_growth_scenario'],
      },
    };
  }
}
