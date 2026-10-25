import { Injectable } from '@nestjs/common';
import { MdmAnalyticsService } from './mdm-analytics.service';
import { MdmReadinessService } from './mdm-readiness.service';

@Injectable()
export class MdmService {
  constructor(private readonly analytics: MdmAnalyticsService, private readonly readinessService: MdmReadinessService) {}
  overview() { return this.analytics.executiveDashboard(); }
  readiness() { return this.readinessService.readiness(); }
}
