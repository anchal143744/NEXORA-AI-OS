import { Injectable } from '@nestjs/common';
import { BillingPortalService } from './billing-portal.service';
import { CustomerPortalService } from './customer-portal.service';
import { PartnerPortalService } from './partner-portal.service';

@Injectable()
export class ExternalPortalService {
  constructor(private readonly customers: CustomerPortalService, private readonly billing: BillingPortalService, private readonly partners: PartnerPortalService) {}

  async dashboard() {
    const [customers, billing, partners] = await Promise.all([this.customers.dashboard(), this.billing.dashboard(), this.partners.dashboard()]);
    return {
      customers,
      billing,
      partners,
      summary: {
        customerAccounts: customers.summary.accountCount,
        customerWorkspaces: customers.summary.workspaceCount,
        activeSubscriptions: billing.summary.activeSubscriptions,
        openInvoices: billing.summary.openInvoiceCount,
        totalAmountDue: billing.summary.totalAmountDue,
        partnerAccounts: partners.summary.partnerAccountCount,
        openReferrals: partners.summary.openReferralCount,
      },
      recommendations: [
        { type: 'customer_portal', priority: customers.summary.atRiskAccountCount > 0 ? 'high' : 'medium', action: 'Review at-risk customer accounts and launch success playbooks.' },
        { type: 'billing', priority: billing.summary.openInvoiceCount > 0 ? 'high' : 'low', action: 'Review open invoices and payment method coverage.' },
        { type: 'partner_portal', priority: partners.summary.openReferralCount > 0 ? 'medium' : 'low', action: 'Review partner referrals and commission readiness.' },
      ],
    };
  }

  customerPortal() { return this.dashboard(); }
  subscriptionCenter() { return this.billing.dashboard(); }
  billingWorkspace() { return this.billing.dashboard(); }
  usageMonitoring() { return this.billing.dashboard(); }
  partnerPortal() { return this.partners.dashboard(); }
}
