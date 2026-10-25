import { Injectable } from '@nestjs/common';
import { FIELD_SERVICE_GROUPS } from './field-service.entities';
import { FieldServiceQueryService } from './field-service-query.service';

@Injectable()
export class FieldServiceAnalyticsService {
  constructor(private readonly queries: FieldServiceQueryService) {}
  dashboard(group: string) { return this.queries.dashboard(group); }
  async executiveDashboard() {
    const platform = await this.queries.platformDashboard();
    return {
      ...platform,
      coverage: {
        modules: Object.keys(FIELD_SERVICE_GROUPS),
        analytics: ['sla_attainment', 'dispatch_efficiency', 'technician_utilization', 'route_efficiency', 'first_time_fix_rate', 'mobile_sync_health', 'customer_satisfaction', 'service_risk'],
        aiQuestions: ['late_jobs', 'best_technician', 'route_recommendations', 'sla_risk', 'field_capacity'],
      },
    };
  }
}

