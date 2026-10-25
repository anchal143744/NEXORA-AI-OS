'use client';

import { Globe2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { scaleReadinessChecks } from '@/lib/growth-program';
import { GrowthPanel, GrowthScoreBar, GrowthStatusBadge } from './growth-program-panel';

export function GlobalScaleReadiness() {
  return (
    <GrowthPanel title="Global Scale Readiness" description="Multi-Region Support, Localization Readiness, Currency Support, Time Zone Support and International Expansion validation." badge="Multi-Region Support">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {scaleReadinessChecks.map((check) => (
          <article key={check.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <Globe2 className="size-5 text-gold-200" />
              <GrowthStatusBadge status={check.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{check.domain}</h3>
            <Badge className="mt-3">{check.readiness}%</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{check.validation}</p>
            <div className="mt-4"><GrowthScoreBar value={check.readiness} /></div>
          </article>
        ))}
      </div>
    </GrowthPanel>
  );
}
