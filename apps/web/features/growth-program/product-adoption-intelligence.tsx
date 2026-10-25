'use client';

import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { adoptionSignals } from '@/lib/growth-program';
import { GrowthPanel, GrowthStatusBadge } from './growth-program-panel';

export function ProductAdoptionIntelligence() {
  return (
    <GrowthPanel title="Product Adoption Intelligence" description="Feature Adoption Tracking, User Journey Analytics, Time To Value Analysis and Usage Segmentation that explain business impact." badge="Time To Value Analysis">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {adoptionSignals.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <Activity className="size-5 text-gold-200" />
              <GrowthStatusBadge status={signal.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{signal.signal}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{signal.value}</Badge>
              <Badge variant="neutral">{signal.segment}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{signal.businessImpact}</p>
          </article>
        ))}
      </div>
    </GrowthPanel>
  );
}
