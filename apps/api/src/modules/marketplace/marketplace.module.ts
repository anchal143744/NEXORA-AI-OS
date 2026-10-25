import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { ExtensionFrameworkController } from './extensions/extension-framework.controller';
import { ExtensionFrameworkService } from './extensions/extension-framework.service';
import { IndustryTemplatePackController } from './industry-templates/industry-template-pack.controller';
import { IndustryTemplatePackService } from './industry-templates/industry-template-pack.service';
import { MarketplaceController } from './marketplace/marketplace.controller';
import { MarketplaceService } from './marketplace/marketplace.service';
import { PartnerEcosystemController } from './partners/partner-ecosystem.controller';
import { PartnerEcosystemService } from './partners/partner-ecosystem.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [MarketplaceController, ExtensionFrameworkController, PartnerEcosystemController, IndustryTemplatePackController],
  providers: [MarketplaceService, ExtensionFrameworkService, PartnerEcosystemService, IndustryTemplatePackService],
  exports: [MarketplaceService, ExtensionFrameworkService, PartnerEcosystemService, IndustryTemplatePackService],
})
export class MarketplaceModule {}