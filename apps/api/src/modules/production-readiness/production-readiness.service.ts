import { Injectable } from '@nestjs/common';
import { ProductionReadinessAnalyticsService } from './production-readiness-analytics.service';
import { ProductionReadinessReadinessService } from './production-readiness-readiness.service';

@Injectable()
export class ProductionReadinessService {
  constructor(private readonly analytics: ProductionReadinessAnalyticsService, private readonly readinessService: ProductionReadinessReadinessService) {}
  overview() { return this.analytics.executiveDashboard(); }
  readiness() { return this.readinessService.readiness(); }
}
