import { Injectable } from '@nestjs/common';
import { WorkforceAnalyticsService } from './workforce-analytics.service';
import { WorkforceReadinessService } from './workforce-readiness.service';

@Injectable()
export class WorkforceService {
  constructor(private readonly analytics: WorkforceAnalyticsService, private readonly readinessService: WorkforceReadinessService) {}

  async dashboard() {
    const analytics = await this.analytics.executiveDashboard();
    return {
      analytics,
      readiness: this.readinessService.readiness(),
    };
  }
}

