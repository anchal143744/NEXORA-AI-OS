import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { BillingPortalService } from './billing-portal.service';
import { BillingController } from './controllers/billing.controller';
import { CustomerPortalController } from './controllers/customer-portal.controller';
import { CustomerWorkspacesController } from './controllers/customer-workspaces.controller';
import { InvoicesController } from './controllers/invoices.controller';
import { PartnerPortalController } from './controllers/partner-portal.controller';
import { PartnerReferralsController } from './controllers/partner-referrals.controller';
import { PaymentsController } from './controllers/payments.controller';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { CustomerPortalService } from './customer-portal.service';
import { ExternalPortalService } from './external-portal.service';
import { PartnerPortalService } from './partner-portal.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [CustomerPortalController, CustomerWorkspacesController, SubscriptionsController, BillingController, InvoicesController, PaymentsController, PartnerPortalController, PartnerReferralsController],
  providers: [CustomerPortalService, BillingPortalService, PartnerPortalService, ExternalPortalService],
  exports: [CustomerPortalService, BillingPortalService, PartnerPortalService, ExternalPortalService],
})
export class CustomerPortalModule {}
