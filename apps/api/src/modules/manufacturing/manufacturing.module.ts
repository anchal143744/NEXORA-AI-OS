import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { BillOfMaterialsController } from './controllers/bill-of-materials.controller';
import { DigitalTwinController } from './controllers/digital-twin.controller';
import { FactoryResourcesController } from './controllers/factory-resources.controller';
import { ManufacturingAnalyticsController } from './controllers/manufacturing-analytics.controller';
import { ManufacturingCopilotController } from './controllers/manufacturing-copilot.controller';
import { ManufacturingExecutionController } from './controllers/manufacturing-execution.controller';
import { ManufacturingRiskController } from './controllers/manufacturing-risk.controller';
import { ManufacturingController } from './controllers/manufacturing.controller';
import { PredictiveMaintenanceController } from './controllers/predictive-maintenance.controller';
import { ProductionCostController } from './controllers/production-cost.controller';
import { ProductionPlanningController } from './controllers/production-planning.controller';
import { QualityManagementController } from './controllers/quality-management.controller';
import { ManufacturingCommandService } from './manufacturing-command.service';
import { ManufacturingCqrsService } from './manufacturing-cqrs.service';
import { ManufacturingQueryService } from './manufacturing-query.service';
import { ManufacturingService } from './manufacturing.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [ManufacturingController, BillOfMaterialsController, ProductionPlanningController, ManufacturingExecutionController, FactoryResourcesController, QualityManagementController, PredictiveMaintenanceController, ProductionCostController, ManufacturingAnalyticsController, ManufacturingRiskController, DigitalTwinController, ManufacturingCopilotController],
  providers: [ManufacturingService, ManufacturingCommandService, ManufacturingQueryService, ManufacturingCqrsService],
  exports: [ManufacturingService, ManufacturingCommandService, ManufacturingQueryService, ManufacturingCqrsService],
})
export class ManufacturingModule {}

