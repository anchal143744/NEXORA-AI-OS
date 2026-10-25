import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { DataLakeController } from './controllers/data-lake.controller';
import { DataMartsController } from './controllers/data-marts.controller';
import { DataPipelinesController } from './controllers/data-pipelines.controller';
import { DataWarehouseController } from './controllers/data-warehouse.controller';
import { ExecutiveDashboardsController } from './controllers/executive-dashboards.controller';
import { KpisController } from './controllers/kpis.controller';
import { SemanticLayerController } from './controllers/semantic-layer.controller';
import { DataLakeService } from './data-lake.service';
import { DataPipelineService } from './data-pipeline.service';
import { DataWarehouseService } from './data-warehouse.service';
import { KpiExecutiveService } from './kpi-executive.service';
import { SemanticLayerService } from './semantic-layer.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [DataLakeController, DataWarehouseController, SemanticLayerController, KpisController, ExecutiveDashboardsController, DataPipelinesController, DataMartsController],
  providers: [DataLakeService, DataWarehouseService, SemanticLayerService, KpiExecutiveService, DataPipelineService],
  exports: [DataLakeService, DataWarehouseService, SemanticLayerService, KpiExecutiveService, DataPipelineService],
})
export class DataPlatformModule {}