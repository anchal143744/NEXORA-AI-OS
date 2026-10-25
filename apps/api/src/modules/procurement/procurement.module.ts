
import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { BudgetsController } from './controllers/budgets.controller';
import { CostOptimizationController } from './controllers/cost-optimization.controller';
import { ProcurementApprovalsController } from './controllers/procurement-approvals.controller';
import { ProcurementController } from './controllers/procurement.controller';
import { PurchaseOrdersController } from './controllers/purchase-orders.controller';
import { SpendIntelligenceController } from './controllers/spend-intelligence.controller';
import { VendorContractsController } from './controllers/vendor-contracts.controller';
import { VendorsController } from './controllers/vendors.controller';
import { ProcurementWorkflowService } from './procurement-workflow.service';
import { ProcurementService } from './procurement.service';
import { SpendIntelligenceService } from './spend-intelligence.service';
import { VendorManagementService } from './vendor-management.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [VendorsController, VendorContractsController, ProcurementController, PurchaseOrdersController, ProcurementApprovalsController, SpendIntelligenceController, BudgetsController, CostOptimizationController],
  providers: [ProcurementService, VendorManagementService, ProcurementWorkflowService, SpendIntelligenceService],
  exports: [ProcurementService, VendorManagementService, ProcurementWorkflowService, SpendIntelligenceService],
})
export class ProcurementModule {}
