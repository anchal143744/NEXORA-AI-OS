import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { AdminCenterController } from './admin-center/admin-center.controller';
import { AdminCenterService } from './admin-center/admin-center.service';
import { DeploymentGovernanceController } from './deployment-governance/deployment-governance.controller';
import { DeploymentGovernanceService } from './deployment-governance/deployment-governance.service';
import { ProductionOperationsController } from './production-operations/production-operations.controller';
import { ProductionOperationsService } from './production-operations/production-operations.service';
import { SecurityOperationsController } from './security-operations/security-operations.controller';
import { SecurityOperationsService } from './security-operations/security-operations.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [AdminCenterController, DeploymentGovernanceController, ProductionOperationsController, SecurityOperationsController],
  providers: [AdminCenterService, DeploymentGovernanceService, ProductionOperationsService, SecurityOperationsService],
  exports: [AdminCenterService, DeploymentGovernanceService, ProductionOperationsService, SecurityOperationsService],
})
export class EnterpriseAdminModule {}
