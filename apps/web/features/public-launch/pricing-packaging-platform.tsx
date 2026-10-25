'use client';

import { PackageCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { pricingPlans } from '@/lib/public-launch';
import { LaunchPanel } from './public-launch-panel';

export function PricingPackagingPlatform() {
  return (
    <LaunchPanel title="Pricing & Packaging Platform" description="Starter, Growth, Business, Enterprise and AI Enterprise packaging with feature matrix, usage limits and billing integration." badge="AI Enterprise">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {pricingPlans.map((plan) => (
          <article key={plan.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <PackageCheck className="size-5 text-gold-200" />
            <h3 className="mt-4 font-semibold text-white">{plan.name}</h3>
            <p className="mt-2 text-xs leading-5 text-graphite-400">{plan.audience}</p>
            <div className="mt-4 text-2xl font-semibold text-white">{plan.monthlyPrice}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{plan.usageLimit}</Badge>
              <Badge variant="neutral">{plan.billingIntegration}</Badge>
            </div>
            <div className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <div key={feature} className="text-xs text-graphite-300">{feature}</div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </LaunchPanel>
  );
}
