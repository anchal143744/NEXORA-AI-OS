import { Injectable } from '@nestjs/common';
import { EamAnalyticsService } from './eam-analytics.service';
import { EamReadinessService } from './eam-readiness.service';

@Injectable()
export class EamService {
  constructor(private readonly analytics: EamAnalyticsService, private readonly readinessService: EamReadinessService) {}
  async dashboard() {
    return { analytics: await this.analytics.executiveDashboard(), readiness: this.readinessService.readiness() };
  }
}

