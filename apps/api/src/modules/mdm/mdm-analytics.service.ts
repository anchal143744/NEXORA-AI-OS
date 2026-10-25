import { Injectable } from '@nestjs/common';
import { MDM_GROUPS } from './mdm.entities';
import { MdmQueryService } from './mdm-query.service';

@Injectable()
export class MdmAnalyticsService {
  constructor(private readonly queries: MdmQueryService) {}
  dashboard(group: string) { return this.queries.dashboard(group); }
  async executiveDashboard() {
    const platform = await this.queries.platformDashboard();
    return {
      ...platform,
      coverage: {
        modules: Object.keys(MDM_GROUPS),
        analytics: ['golden_record_coverage', 'data_quality_score', 'duplicate_rate', 'resolution_rate', 'lineage_coverage', 'governance_compliance', 'source_trust'],
        aiQuestions: ['duplicate_customers', 'quality_hotspots', 'best_golden_record', 'lineage_for_record', 'governance_gaps'],
      },
    };
  }
}
