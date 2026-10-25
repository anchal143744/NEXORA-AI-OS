
import { Injectable } from '@nestjs/common';
import { FulfillmentDistributionService } from './fulfillment-distribution.service';
import { InventoryCoreService } from './inventory-core.service';
import { SupplyChainIntelligenceService } from './supply-chain-intelligence.service';
import { SupplyChainPlanningService } from './supply-chain-planning.service';
import { WarehouseManagementService } from './warehouse-management.service';

@Injectable()
export class SupplyChainService {
  constructor(
    private readonly inventory: InventoryCoreService,
    private readonly warehouses: WarehouseManagementService,
    private readonly planning: SupplyChainPlanningService,
    private readonly fulfillment: FulfillmentDistributionService,
    private readonly intelligence: SupplyChainIntelligenceService,
  ) {}

  dashboard() {
    return this.intelligence.analyticsDashboard();
  }
}
