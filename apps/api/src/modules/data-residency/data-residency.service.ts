import { Injectable } from '@nestjs/common';
import { DataRegionService } from './data-region.service';
import { RegulatoryService } from './regulatory.service';
import { ResidencyPolicyService } from './residency-policy.service';

@Injectable()
export class DataResidencyService {
  constructor(
    private readonly regions: DataRegionService,
    private readonly residency: ResidencyPolicyService,
    private readonly regulatory: RegulatoryService,
  ) {}

  async dashboard() {
    const [regions, sovereignty, regulatory] = await Promise.all([this.regions.dashboard(), this.residency.sovereigntyDashboard(), this.regulatory.dashboard()]);
    return { regions, sovereignty, regulatory, summary: { activeRegions: regions.summary.activeRegionCount, nonCompliantLocations: regions.summary.nonCompliantLocationCount, blockedTransfers: sovereignty.summary.blockedTransferCount, openRegulatoryAlerts: regulatory.summary.openAlertCount, openRegulatoryRisks: regulatory.summary.openRiskCount } };
  }

  residencyCenter() { return this.dashboard(); }
  sovereigntyCenter() { return this.residency.sovereigntyDashboard(); }
  regulatoryOperations() { return this.regulatory.dashboard(); }
  intelligence() { return this.dashboard().then((dashboard) => ({ dashboard: dashboard.summary, recommendations: [{ type: 'data_residency', priority: dashboard.summary.nonCompliantLocations > 0 ? 'high' : 'medium', action: 'Review non-compliant data locations and update residency assignments.' }, { type: 'data_transfer', priority: dashboard.summary.blockedTransfers > 0 ? 'high' : 'medium', action: 'Review blocked transfer rules and required safeguards.' }, { type: 'regulatory_risk', priority: dashboard.summary.openRegulatoryRisks > 0 ? 'high' : 'low', action: 'Prioritize mitigation plans for open regulatory risks.' }] })); }
}