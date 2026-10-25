import { Injectable } from '@nestjs/common';
import { EAM_GROUPS } from './eam.entities';
import { EamQueryService } from './eam-query.service';

@Injectable()
export class EamAnalyticsService {
  constructor(private readonly queries: EamQueryService) {}
  dashboard(group: string) { return this.queries.dashboard(group); }
  async executiveDashboard() {
    const platform = await this.queries.platformDashboard();
    return {
      ...platform,
      coverage: {
        modules: Object.keys(EAM_GROUPS),
        analytics: ['asset_health', 'work_orders', 'maintenance_backlog', 'warranty_expiry', 'total_cost_of_ownership', 'utilization', 'reliability', 'iot_alerts'],
        aiQuestions: ['assets_at_risk', 'maintenance_due', 'warranty_expiring', 'highest_cost_assets', 'replacement_recommendations'],
      },
    };
  }
}

