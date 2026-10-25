import { Injectable } from '@nestjs/common';
import { FieldServiceAnalyticsService } from './field-service-analytics.service';
import { FieldServiceReadinessService } from './field-service-readiness.service';

@Injectable()
export class FieldServiceService {
  constructor(private readonly analytics: FieldServiceAnalyticsService, private readonly readinessService: FieldServiceReadinessService) {}
  async dashboard() {
    return { analytics: await this.analytics.executiveDashboard(), readiness: this.readinessService.readiness() };
  }
}

