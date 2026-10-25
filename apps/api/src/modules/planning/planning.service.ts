import { Injectable } from '@nestjs/common';
import { PlanningAnalyticsService } from './planning-analytics.service';
import { PlanningReadinessService } from './planning-readiness.service';

@Injectable()
export class PlanningService {
  constructor(private readonly analytics: PlanningAnalyticsService, private readonly readinessService: PlanningReadinessService) {}
  overview() { return this.analytics.executiveDashboard(); }
  readiness() { return this.readinessService.readiness(); }
}
