import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { CustomerMasterController } from './controllers/customer-master.controller';
import { VendorMasterController } from './controllers/vendor-master.controller';
import { ProductMasterController } from './controllers/product-master.controller';
import { EmployeeMasterController } from './controllers/employee-master.controller';
import { AssetMasterController } from './controllers/asset-master.controller';
import { DataQualityEngineController } from './controllers/data-quality-engine.controller';
import { DuplicateDetectionEngineController } from './controllers/duplicate-detection-engine.controller';
import { EntityResolutionEngineController } from './controllers/entity-resolution-engine.controller';
import { GoldenRecordEngineController } from './controllers/golden-record-engine.controller';
import { MdmGovernanceController } from './controllers/mdm-governance.controller';
import { MdmLineageController } from './controllers/mdm-lineage.controller';
import { AiDataCopilotController } from './controllers/ai-data-copilot.controller';
import { MdmAnalyticsService } from './mdm-analytics.service';
import { MdmCommandService } from './mdm-command.service';
import { MdmCqrsService } from './mdm-cqrs.service';
import { MdmQueryService } from './mdm-query.service';
import { MdmReadinessService } from './mdm-readiness.service';
import { MdmService } from './mdm.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [CustomerMasterController, VendorMasterController, ProductMasterController, EmployeeMasterController, AssetMasterController, DataQualityEngineController, DuplicateDetectionEngineController, EntityResolutionEngineController, GoldenRecordEngineController, MdmGovernanceController, MdmLineageController, AiDataCopilotController],
  providers: [MdmService, MdmCommandService, MdmQueryService, MdmCqrsService, MdmAnalyticsService, MdmReadinessService],
  exports: [MdmService, MdmCommandService, MdmQueryService, MdmCqrsService, MdmAnalyticsService, MdmReadinessService],
})
export class MdmModule {}
