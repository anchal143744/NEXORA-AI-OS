'use client';

import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { marketplaceAnalyticsSignals } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel } from './ecosystem-marketplace-panel';

export function MarketplaceAnalytics() {
  return (
    <EcosystemPanel title="Marketplace Analytics" description="Installs, Revenue, Active Apps, Partner Growth and User Adoption metrics for ecosystem operators." badge="Installs">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {marketplaceAnalyticsSignals.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="size-5 text-gold-200" />
              <Badge variant="success">{signal.trend}</Badge>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">{signal.metric}</h3>
            <div className="mt-2 text-2xl font-semibold text-white">{signal.value}</div>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{signal.insight}</p>
          </article>
        ))}
      </div>
    </EcosystemPanel>
  );
}
