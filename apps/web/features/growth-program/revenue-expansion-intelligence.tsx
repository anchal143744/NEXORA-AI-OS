'use client';

import { DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { revenueExpansionMetrics } from '@/lib/growth-program';
import { GrowthPanel } from './growth-program-panel';

export function RevenueExpansionIntelligence() {
  return (
    <GrowthPanel title="Revenue Expansion Intelligence" description="MRR, ARR, Expansion Revenue, Customer Lifetime Value and Revenue Forecasting in one growth intelligence surface." badge="ARR">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {revenueExpansionMetrics.map((metric) => (
          <article key={metric.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <DollarSign className="size-5 text-gold-200" />
            <h3 className="mt-4 font-semibold text-white">{metric.metric}</h3>
            <div className="mt-2 text-2xl font-semibold text-white">{metric.value}</div>
            <Badge className="mt-3" variant="success">{metric.forecast}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{metric.action}</p>
          </article>
        ))}
      </div>
    </GrowthPanel>
  );
}
