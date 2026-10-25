'use client';

import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { adoptionMetrics } from '@/lib/public-beta';
import { BetaPanel } from './public-beta-panel';

export function ProductAdoptionAnalytics() {
  return (
    <BetaPanel title="Product Adoption Analytics" description="Active users, feature adoption, engagement rate, retention rate and Time To Value show whether beta users are reaching meaningful outcomes." badge="Time To Value">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {adoptionMetrics.map((metric) => (
          <article key={metric.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><TrendingUp className="size-4 text-gold-200" />{metric.label}</div>
              <Badge variant="success">{metric.trend}</Badge>
            </div>
            <div className="mt-4 text-2xl font-semibold text-white">{metric.value}</div>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{metric.insight}</p>
          </article>
        ))}
      </div>
    </BetaPanel>
  );
}
