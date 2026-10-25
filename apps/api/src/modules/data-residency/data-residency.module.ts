import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { ComplianceAlertsController } from './controllers/compliance-alerts.controller';
import { ComplianceRegulatoryController } from './controllers/compliance-regulatory.controller';
import { DataRegionsController } from './controllers/data-regions.controller';
import { DataResidencyController } from './controllers/data-residency.controller';
import { DataSovereigntyController } from './controllers/data-sovereignty.controller';
import { JurisdictionsController } from './controllers/jurisdictions.controller';
import { RegulatoryController } from './controllers/regulatory.controller';
import { RegulatoryIntelligenceController } from './controllers/regulatory-intelligence.controller';
import { DataRegionService } from './data-region.service';
import { DataResidencyService } from './data-residency.service';
import { RegulatoryService } from './regulatory.service';
import { ResidencyPolicyService } from './residency-policy.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [DataResidencyController, DataSovereigntyController, RegulatoryController, ComplianceRegulatoryController, JurisdictionsController, DataRegionsController, RegulatoryIntelligenceController, ComplianceAlertsController],
  providers: [DataResidencyService, DataRegionService, ResidencyPolicyService, RegulatoryService],
  exports: [DataResidencyService, DataRegionService, ResidencyPolicyService, RegulatoryService],
})
export class DataResidencyModule {}