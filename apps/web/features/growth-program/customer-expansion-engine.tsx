'use client';

import { Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { expansionOpportunities } from '@/lib/growth-program';
import { GrowthPanel, GrowthStatusBadge } from './growth-program-panel';

export function CustomerExpansionEngine() {
  return (
    <GrowthPanel title="Customer Expansion Engine" description="Upsell Opportunities, Cross-Sell Opportunities, Expansion Recommendations and Enterprise Upgrade Tracking." badge="Upsell Opportunities">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {expansionOpportunities.map((opportunity) => (
          <article key={opportunity.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <Target className="size-5 text-gold-200" />
              <GrowthStatusBadge status={opportunity.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{opportunity.account}</h3>
            <Badge className="mt-3">{opportunity.value}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{opportunity.opportunity}</p>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{opportunity.recommendation}</p>
          </article>
        ))}
      </div>
    </GrowthPanel>
  );
}
