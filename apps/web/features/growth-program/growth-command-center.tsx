'use client';

import { TrendingUp } from 'lucide-react';
import { growthMetrics } from '@/lib/growth-program';
import { GrowthPanel, GrowthStatusBadge } from './growth-program-panel';

export function GrowthCommandCenter() {
  return (
    <GrowthPanel title="Growth Command Center" description="Track Active Organizations, Active Users, Revenue Growth, Expansion Revenue, Churn Risk and Adoption Trends in one executive-grade view." badge="Churn Risk">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {growthMetrics.map((metric) => (
          <article key={metric.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <TrendingUp className="size-5 text-gold-200" />
              <GrowthStatusBadge status={metric.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{metric.label}</h3>
            <div className="mt-2 text-2xl font-semibold text-white">{metric.value}</div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{metric.detail}</p>
          </article>
        ))}
      </div>
    </GrowthPanel>
  );
}
