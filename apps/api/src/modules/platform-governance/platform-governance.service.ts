import { Injectable } from '@nestjs/common';
import { ApiMonetizationService } from './api-monetization.service';
import { ApiProductService } from './api-product.service';
import { DataContractService } from './data-contract.service';

@Injectable()
export class PlatformGovernanceService {
  constructor(private readonly contracts: DataContractService, private readonly products: ApiProductService, private readonly monetization: ApiMonetizationService) {}

  async center() {
    const [contracts, marketplace, monetization] = await Promise.all([this.contracts.dashboard(), this.products.marketplace(), this.monetization.dashboard()]);
    return {
      contracts,
      marketplace,
      monetization,
      summary: {
        contractCount: contracts.summary.contractCount,
        apiProductCount: marketplace.summary.productCount,
        activeSubscriptionCount: marketplace.summary.activeSubscriptionCount,
        totalRequests: monetization.summary.totalRequests,
        openBillingCount: monetization.summary.openBillingCount,
        quotaUtilization: monetization.summary.quotaUtilization,
      },
      recommendations: [
        { type: 'contract_governance', priority: contracts.summary.breakingVersionCount > 0 ? 'high' : 'medium', action: 'Review breaking contract versions and notify impacted consumers.' },
        { type: 'api_monetization', priority: marketplace.summary.activeSubscriptionCount > 0 ? 'medium' : 'low', action: 'Align API products with plans, quotas and partner access grants.' },
        { type: 'usage_metering', priority: monetization.summary.quotaUtilization > 80 ? 'high' : 'medium', action: 'Review API quota utilization and rate-limit policies.' },
      ],
    };
  }

  monetizationCenter() { return this.monetization.dashboard(); }
  governanceCenter() { return this.center(); }
  usageAnalytics() { return this.monetization.dashboard(); }
  billingCenter() { return this.monetization.dashboard(); }
  partnerManagement() { return this.products.marketplace(); }
}
