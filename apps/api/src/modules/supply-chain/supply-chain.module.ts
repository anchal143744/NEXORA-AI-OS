
import { Module } from '@nestjs/common';
import { RetailModule } from '../retail/retail.module';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { DemandForecastingController } from './controllers/demand-forecasting.controller';
import { DistributionNetworkController } from './controllers/distribution-network.controller';
import { FulfillmentController } from './controllers/fulfillment.controller';
import { InventoryCoreController } from './controllers/inventory-core.controller';
import { ReplenishmentController } from './controllers/replenishment.controller';
import { ShipmentsController } from './controllers/shipments.controller';
import { SupplyChainAnalyticsController } from './controllers/supply-chain-analytics.controller';
import { SupplyChainCopilotController } from './controllers/supply-chain-copilot.controller';
import { SupplyChainIntelligenceController } from './controllers/supply-chain-intelligence.controller';
import { WarehousesController } from './controllers/warehouses.controller';
import { FulfillmentDistributionService } from './fulfillment-distribution.service';
import { InventoryCoreService } from './inventory-core.service';
import { SupplyChainIntelligenceService } from './supply-chain-intelligence.service';
import { SupplyChainPlanningService } from './supply-chain-planning.service';
import { SupplyChainService } from './supply-chain.service';
import { WarehouseManagementService } from './warehouse-management.service';

@Module({
  imports: [TenantsModule, EventsModule, RetailModule],
  controllers: [InventoryCoreController, WarehousesController, DemandForecastingController, ReplenishmentController, FulfillmentController, ShipmentsController, DistributionNetworkController, SupplyChainIntelligenceController, SupplyChainAnalyticsController, SupplyChainCopilotController],
  providers: [SupplyChainService, InventoryCoreService, WarehouseManagementService, SupplyChainPlanningService, FulfillmentDistributionService, SupplyChainIntelligenceService],
  exports: [SupplyChainService, InventoryCoreService, WarehouseManagementService, SupplyChainPlanningService, FulfillmentDistributionService, SupplyChainIntelligenceService],
})
export class SupplyChainModule {}
