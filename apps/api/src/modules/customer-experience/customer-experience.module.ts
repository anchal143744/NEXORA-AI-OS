import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { AiCustomerSuccessService } from './ai-customer-success.service';
import { ChurnPredictionsController } from './controllers/churn-predictions.controller';
import { CustomerExperienceController } from './controllers/customer-experience.controller';
import { CustomerFeedbackController } from './controllers/customer-feedback.controller';
import { CustomerHealthController } from './controllers/customer-health.controller';
import { CustomerSuccessController } from './controllers/customer-success.controller';
import { RenewalsController } from './controllers/renewals.controller';
import { RevenueOpportunitiesController } from './controllers/revenue-opportunities.controller';
import { ServiceCenterController } from './controllers/service-center.controller';
import { ServiceTicketsController } from './controllers/service-tickets.controller';
import { SlaController } from './controllers/sla.controller';
import { CustomerExperienceService } from './customer-experience.service';
import { CustomerSuccessService } from './customer-success.service';
import { RevenueEngagementService } from './revenue-engagement.service';
import { ServiceAutomationService } from './service-automation.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [CustomerExperienceController, CustomerHealthController, CustomerSuccessController, ChurnPredictionsController, RenewalsController, RevenueOpportunitiesController, ServiceCenterController, ServiceTicketsController, SlaController, CustomerFeedbackController],
  providers: [CustomerExperienceService, CustomerSuccessService, RevenueEngagementService, ServiceAutomationService, AiCustomerSuccessService],
  exports: [CustomerExperienceService, CustomerSuccessService, RevenueEngagementService, ServiceAutomationService, AiCustomerSuccessService],
})
export class CustomerExperienceModule {}
