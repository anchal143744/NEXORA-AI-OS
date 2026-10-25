import { Injectable } from '@nestjs/common';
import { CONNECTIVITY_GROUPS } from './global-connectivity.entities';
import { GlobalConnectivityQueryService } from './global-connectivity-query.service';

@Injectable()
export class GlobalConnectivityAnalyticsService {
  constructor(private readonly queries: GlobalConnectivityQueryService) {}
  dashboard(group: string) { return this.queries.dashboard(group); }
  async executiveDashboard() {
    const platform = await this.queries.platformDashboard();
    return {
      ...platform,
      coverage: {
        modules: Object.keys(CONNECTIVITY_GROUPS),
        analytics: ['connection_health', 'oauth_rotation_risk', 'api_latency', 'webhook_delivery_rate', 'sync_success_rate', 'gateway_throughput', 'connector_usage'],
        aiQuestions: ['failing_connectors', 'token_rotation_actions', 'webhook_delivery_failures', 'api_gateway_bottlenecks', 'connector_recommendations'],
      },
    };
  }
}
