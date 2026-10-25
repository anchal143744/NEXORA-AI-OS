'use client';

import { CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { marketplaceBillingPlans } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel } from './ecosystem-marketplace-panel';

export function MarketplaceBilling() {
  return (
    <EcosystemPanel title="Marketplace Billing" description="Subscription Billing, Revenue Sharing, Partner Payouts and Usage Billing for monetized ecosystem products." badge="Revenue Sharing">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {marketplaceBillingPlans.map((plan) => (
          <article key={plan.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <CreditCard className="size-5 text-gold-200" />
            <h3 className="mt-4 font-semibold text-white">{plan.name}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{plan.model}</Badge>
              <Badge variant="neutral">{plan.payoutCadence}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{plan.controls}</p>
            <p className="mt-3 text-xs text-graphite-400">Revenue Sharing: {plan.revenueShare}</p>
          </article>
        ))}
      </div>
    </EcosystemPanel>
  );
}
