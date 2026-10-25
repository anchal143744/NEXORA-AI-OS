'use client';

import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { enterpriseSuccessMetrics } from '@/lib/growth-program';
import { GrowthPanel } from './growth-program-panel';

export function EnterpriseSuccessDashboard() {
  return (
    <GrowthPanel title="Enterprise Success Dashboard" description="Display Adoption, Revenue, Retention, AI Usage and Expansion Opportunities for executive-grade enterprise success tracking." badge="AI Usage">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {enterpriseSuccessMetrics.map((metric) => (
          <article key={metric.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Crown className="size-5 text-gold-200" />
            <h3 className="mt-4 font-semibold text-white">{metric.metric}</h3>
            <Badge className="mt-3">{metric.value}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{metric.impact}</p>
          </article>
        ))}
      </div>
    </GrowthPanel>
  );
}
