import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { AssetRegistryController } from './controllers/asset-registry.controller';
import { AssetLifecycleController } from './controllers/asset-lifecycle.controller';
import { MaintenanceManagementController } from './controllers/maintenance-management.controller';
import { WorkOrdersController } from './controllers/work-orders.controller';
import { AssetHealthController } from './controllers/asset-health.controller';
import { WarrantyContractsController } from './controllers/warranty-contracts.controller';
import { AssetCostsController } from './controllers/asset-costs.controller';
import { IotAssetsController } from './controllers/iot-assets.controller';
import { AssetAnalyticsController } from './controllers/asset-analytics.controller';
import { AssetCopilotController } from './controllers/asset-copilot.controller';
import { EamAnalyticsService } from './eam-analytics.service';
import { EamCommandService } from './eam-command.service';
import { EamCqrsService } from './eam-cqrs.service';
import { EamQueryService } from './eam-query.service';
import { EamReadinessService } from './eam-readiness.service';
import { EamService } from './eam.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [AssetRegistryController, AssetLifecycleController, MaintenanceManagementController, WorkOrdersController, AssetHealthController, WarrantyContractsController, AssetCostsController, IotAssetsController, AssetAnalyticsController, AssetCopilotController],
  providers: [EamService, EamCommandService, EamQueryService, EamCqrsService, EamAnalyticsService, EamReadinessService],
  exports: [EamService, EamCommandService, EamQueryService, EamCqrsService, EamAnalyticsService, EamReadinessService],
})
export class EamModule {}

