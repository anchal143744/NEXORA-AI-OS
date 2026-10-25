import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { GlobalOperationsController } from './controllers/global-operations.controller';
import { HealthReliabilityController } from './controllers/health-reliability.controller';
import { IncidentsController } from './controllers/incidents.controller';
import { RecoveryController } from './controllers/recovery.controller';
import { ReliabilityController } from './controllers/reliability.controller';
import { ScalingController } from './controllers/scaling.controller';
import { SreController } from './controllers/sre.controller';
import { UptimeController } from './controllers/uptime.controller';
import { GlobalOperationsService } from './global-operations.service';
import { IncidentManagementService } from './incident-management.service';
import { ReliabilityHealthService } from './reliability-health.service';
import { ReliabilityOperationsService } from './reliability-operations.service';
import { ScalingOperationsService } from './scaling-operations.service';
import { SreAutomationService } from './sre-automation.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [ReliabilityController, SreController, IncidentsController, RecoveryController, UptimeController, ScalingController, GlobalOperationsController, HealthReliabilityController],
  providers: [ReliabilityOperationsService, ReliabilityHealthService, IncidentManagementService, ScalingOperationsService, GlobalOperationsService, SreAutomationService],
  exports: [ReliabilityOperationsService, ReliabilityHealthService, IncidentManagementService, ScalingOperationsService, GlobalOperationsService, SreAutomationService],
})
export class ReliabilityOperationsModule {}