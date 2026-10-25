import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { ApiKeyGovernanceService } from './api-key-governance.service';
import { ApiMonetizationService } from './api-monetization.service';
import { ApiProductService } from './api-product.service';
import { ApiBillingController } from './controllers/api-billing.controller';
import { ApiGovernanceController } from './controllers/api-governance.controller';
import { ApiKeysController } from './controllers/api-keys.controller';
import { ApiMonetizationController } from './controllers/api-monetization.controller';
import { ApiProductsController } from './controllers/api-products.controller';
import { ApiUsageController } from './controllers/api-usage.controller';
import { DataContractsController } from './controllers/data-contracts.controller';
import { PartnerAccessController } from './controllers/partner-access.controller';
import { DataContractService } from './data-contract.service';
import { PlatformGovernanceService } from './platform-governance.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [DataContractsController, ApiProductsController, ApiMonetizationController, ApiUsageController, ApiBillingController, ApiGovernanceController, ApiKeysController, PartnerAccessController],
  providers: [DataContractService, ApiProductService, ApiMonetizationService, ApiKeyGovernanceService, PlatformGovernanceService],
  exports: [DataContractService, ApiProductService, ApiMonetizationService, ApiKeyGovernanceService, PlatformGovernanceService],
})
export class PlatformGovernanceModule {}
