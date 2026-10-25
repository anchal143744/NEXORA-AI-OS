
import { Injectable } from '@nestjs/common';
import { ProcurementWorkflowService } from './procurement-workflow.service';
import { SpendIntelligenceService } from './spend-intelligence.service';
import { VendorManagementService } from './vendor-management.service';

@Injectable()
export class ProcurementService {
  constructor(private readonly vendors: VendorManagementService, private readonly workflow: ProcurementWorkflowService, private readonly spend: SpendIntelligenceService) {}

  async dashboard() {
    const [vendorCenter, workflowCenter, spendCenter, budgetCenter, optimizationCenter] = await Promise.all([
      this.vendors.dashboard(),
      this.workflow.dashboard(),
      this.spend.spendDashboard(),
      this.spend.budgetDashboard(),
      this.spend.optimizationDashboard(),
    ]);
    return {
      vendorCenter,
      workflowCenter,
      spendCenter,
      budgetCenter,
      optimizationCenter,
      summary: {
        vendorCount: vendorCenter.summary.vendorCount,
        requestCount: workflowCenter.summary.requestCount,
        purchaseOrderCount: workflowCenter.summary.purchaseOrderCount,
        spendTransactionCount: spendCenter.summary.transactionCount,
        activeBudgetCount: budgetCenter.summary.activeBudgetCount,
        optimizationRecommendationCount: optimizationCenter.summary.recommendationCount,
      },
    };
  }
}
