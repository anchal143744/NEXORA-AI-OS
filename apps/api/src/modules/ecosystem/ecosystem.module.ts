import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { ApiDocsController } from './controllers/api-docs.controller';
import { DeveloperPortalController } from './controllers/developer-portal.controller';
import { EcosystemController } from './controllers/ecosystem.controller';
import { IntegrationsController } from './controllers/integrations.controller';
import { PartnerMarketplaceController } from './controllers/partner-marketplace.controller';
import { SdkController } from './controllers/sdk.controller';
import { StatusCenterController } from './controllers/status-center.controller';
import { TrustCenterController } from './controllers/trust-center.controller';
import { DeveloperPortalService } from './developer-portal.service';
import { EcosystemCatalogService } from './ecosystem-catalog.service';
import { EcosystemService } from './ecosystem.service';
import { TrustCenterService } from './trust-center.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [TrustCenterController, DeveloperPortalController, ApiDocsController, SdkController, IntegrationsController, PartnerMarketplaceController, StatusCenterController, EcosystemController],
  providers: [TrustCenterService, DeveloperPortalService, EcosystemCatalogService, EcosystemService],
  exports: [TrustCenterService, DeveloperPortalService, EcosystemCatalogService, EcosystemService],
})
export class EcosystemModule {}
