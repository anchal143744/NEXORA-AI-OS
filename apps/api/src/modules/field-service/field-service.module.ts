import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { FieldServiceManagementController } from './controllers/field-service-management.controller';
import { FieldWorkOrdersController } from './controllers/field-work-orders.controller';
import { DispatchEngineController } from './controllers/dispatch-engine.controller';
import { TechnicianManagementController } from './controllers/technician-management.controller';
import { FieldRouteOptimizationController } from './controllers/field-route-optimization.controller';
import { MobileWorkforceController } from './controllers/mobile-workforce.controller';
import { FieldSlaManagementController } from './controllers/field-sla-management.controller';
import { CustomerServiceIntelligenceController } from './controllers/customer-service-intelligence.controller';
import { FieldWorkforceAnalyticsController } from './controllers/field-workforce-analytics.controller';
import { FieldServiceCopilotController } from './controllers/field-service-copilot.controller';
import { FieldServiceAnalyticsService } from './field-service-analytics.service';
import { FieldServiceCommandService } from './field-service-command.service';
import { FieldServiceCqrsService } from './field-service-cqrs.service';
import { FieldServiceQueryService } from './field-service-query.service';
import { FieldServiceReadinessService } from './field-service-readiness.service';
import { FieldServiceService } from './field-service.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [FieldServiceManagementController, FieldWorkOrdersController, DispatchEngineController, TechnicianManagementController, FieldRouteOptimizationController, MobileWorkforceController, FieldSlaManagementController, CustomerServiceIntelligenceController, FieldWorkforceAnalyticsController, FieldServiceCopilotController],
  providers: [FieldServiceService, FieldServiceCommandService, FieldServiceQueryService, FieldServiceCqrsService, FieldServiceAnalyticsService, FieldServiceReadinessService],
  exports: [FieldServiceService, FieldServiceCommandService, FieldServiceQueryService, FieldServiceCqrsService, FieldServiceAnalyticsService, FieldServiceReadinessService],
})
export class FieldServiceModule {}

