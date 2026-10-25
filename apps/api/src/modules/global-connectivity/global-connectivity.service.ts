import { Injectable } from '@nestjs/common';
import { GlobalConnectivityAnalyticsService } from './global-connectivity-analytics.service';
import { GlobalConnectivityReadinessService } from './global-connectivity-readiness.service';

@Injectable()
export class GlobalConnectivityService {
  constructor(private readonly analytics: GlobalConnectivityAnalyticsService, private readonly readinessService: GlobalConnectivityReadinessService) {}
  overview() { return this.analytics.executiveDashboard(); }
  readiness() { return this.readinessService.readiness(); }
}
