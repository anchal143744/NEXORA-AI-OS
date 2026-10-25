'use client';

import { BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usageMetrics } from '@/lib/growth-program';
import { GrowthPanel } from './growth-program-panel';

export function UsageAnalyticsCenter() {
  return (
    <GrowthPanel title="Usage Analytics Center" description="DAU, WAU, MAU, Feature Usage, Workspace Activity and AI Utilization metrics for growth operators." badge="DAU">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {usageMetrics.map((metric) => (
          <article key={metric.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between">
              <BarChart3 className="size-5 text-gold-200" />
              <Badge variant="success">{metric.trend}</Badge>
            </div>
            <h3 className="mt-4 font-semibold text-white">{metric.metric}</h3>
            <div className="mt-2 text-2xl font-semibold text-white">{metric.value}</div>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{metric.interpretation}</p>
          </article>
        ))}
      </div>
    </GrowthPanel>
  );
}
