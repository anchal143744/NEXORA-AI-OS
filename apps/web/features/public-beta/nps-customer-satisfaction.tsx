'use client';

import { SmilePlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { npsSegments } from '@/lib/public-beta';
import { BetaPanel } from './public-beta-panel';

export function NpsCustomerSatisfaction() {
  return (
    <BetaPanel title="NPS & Customer Satisfaction" description="NPS Score, Customer Satisfaction, user sentiment and product experience are tracked by beta cohort." badge="NPS Score">
      <div className="grid gap-3 lg:grid-cols-4">
        {npsSegments.map((segment) => (
          <article key={segment.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><SmilePlus className="size-4 text-gold-200" />{segment.segment}</div>
              <Badge variant={segment.score >= 50 ? 'success' : 'info'}>{segment.score}</Badge>
            </div>
            <p className="mt-3 text-sm text-graphite-300">{segment.satisfaction} satisfaction</p>
            <p className="mt-3 text-xs leading-5 text-gold-100">{segment.driver}</p>
          </article>
        ))}
      </div>
    </BetaPanel>
  );
}
