
import { Injectable } from '@nestjs/common';
import { ContractLifecycleService } from './contract-lifecycle.service';
import { RenewalIntelligenceService } from './renewal-intelligence.service';
import { RevenueAccountService } from './revenue-account.service';
import { RevenueIntelligenceService } from './revenue-intelligence.service';

@Injectable()
export class RevenueOperationsService {
  constructor(
    private readonly accounts: RevenueAccountService,
    private readonly contracts: ContractLifecycleService,
    private readonly renewals: RenewalIntelligenceService,
    private readonly intelligence: RevenueIntelligenceService,
  ) {}

  async dashboard() {
    const [accountCenter, contractCenter, renewalCenter, churnCenter, expansionCenter, healthCenter, forecastCenter, riskCenter] = await Promise.all([
      this.accounts.dashboard(),
      this.contracts.dashboard(),
      this.renewals.dashboard(),
      this.intelligence.churnDashboard(),
      this.intelligence.expansionDashboard(),
      this.intelligence.healthDashboard(),
      this.intelligence.forecastingDashboard(),
      this.intelligence.riskDashboard(),
    ]);
    return {
      accountCenter,
      contractCenter,
      renewalCenter,
      churnCenter,
      expansionCenter,
      healthCenter,
      forecastCenter,
      riskCenter,
      summary: {
        revenueAccountCount: accountCenter.summary.accountCount,
        activeContractCount: contractCenter.summary.activeContractCount,
        openRenewalCount: renewalCenter.summary.openRenewalCount,
        highRiskPredictionCount: churnCenter.summary.highRiskPredictionCount,
        expansionOpportunityCount: expansionCenter.summary.opportunityCount,
        unresolvedRiskCount: riskCenter.summary.unresolvedRiskCount,
      },
    };
  }
}
