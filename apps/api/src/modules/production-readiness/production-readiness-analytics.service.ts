import { Injectable } from '@nestjs/common';
import { PRODUCTION_READINESS_GROUPS } from './production-readiness.entities';
import { ProductionReadinessQueryService } from './production-readiness-query.service';

@Injectable()
export class ProductionReadinessAnalyticsService {
  constructor(private readonly queries: ProductionReadinessQueryService) {}
  dashboard(group: string) { return this.queries.dashboard(group); }
  async executiveDashboard() {
    const platform = await this.queries.platformDashboard();
    return {
      ...platform,
      coverage: {
        modules: Object.keys(PRODUCTION_READINESS_GROUPS),
        analytics: ['security_score', 'performance_score', 'reliability_score', 'coverage_score', 'documentation_score', 'readiness_score', 'release_risk'],
        rcGates: ['dependency_audit', 'build_validation', 'test_validation', 'backup_validation', 'dr_validation', 'api_governance', 'documentation_review'],
      },
    };
  }
}
