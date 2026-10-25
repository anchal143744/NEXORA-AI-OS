
import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { AccountHealthController } from './controllers/account-health.controller';
import { ChurnIntelligenceController } from './controllers/churn-intelligence.controller';
import { ContractsController } from './controllers/contracts.controller';
import { ExpansionOpportunitiesController } from './controllers/expansion-opportunities.controller';
import { RenewalsController } from './controllers/renewals.controller';
import { RevenueForecastingController } from './controllers/revenue-forecasting.controller';
import { RevenueOpsController } from './controllers/revenue-ops.controller';
import { RevenueRiskController } from './controllers/revenue-risk.controller';
import { ContractLifecycleService } from './contract-lifecycle.service';
import { RenewalIntelligenceService } from './renewal-intelligence.service';
import { RevenueAccountService } from './revenue-account.service';
import { RevenueIntelligenceService } from './revenue-intelligence.service';
import { RevenueOperationsService } from './revenue-operations.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [RevenueOpsController, ContractsController, RenewalsController, ChurnIntelligenceController, ExpansionOpportunitiesController, AccountHealthController, RevenueForecastingController, RevenueRiskController],
  providers: [RevenueOperationsService, RevenueAccountService, ContractLifecycleService, RenewalIntelligenceService, RevenueIntelligenceService],
  exports: [RevenueOperationsService, RevenueAccountService, ContractLifecycleService, RenewalIntelligenceService, RevenueIntelligenceService],
})
export class RevenueOperationsModule {}
