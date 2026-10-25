import { Injectable } from '@nestjs/common';
import { WORKFORCE_GROUPS } from './workforce.entities';
import { WorkforceQueryService } from './workforce-query.service';

@Injectable()
export class WorkforceAnalyticsService {
  constructor(private readonly queries: WorkforceQueryService) {}

  dashboard(group: string) {
    return this.queries.dashboard(group);
  }

  async executiveDashboard() {
    const platform = await this.queries.platformDashboard();
    return {
      ...platform,
      coverage: {
        modules: Object.keys(WORKFORCE_GROUPS),
        analytics: ['headcount', 'hiring', 'performance', 'learning', 'compensation', 'retention', 'engagement', 'organization'],
        aiQuestions: ['promotion_ready', 'resignation_risk', 'top_performers', 'hiring_needs', 'leadership_candidates'],
      },
    };
  }
}

