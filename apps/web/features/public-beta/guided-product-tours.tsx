'use client';

import { Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { productTours } from '@/lib/public-beta';
import { BetaPanel } from './public-beta-panel';

export function GuidedProductTours() {
  return (
    <BetaPanel title="Guided Product Tours" description="Interactive walkthroughs, contextual help and onboarding checklists make CRM, HR, Finance, AI Agents and Analytics understandable without documentation." badge="CRM Tour">
      <div className="grid gap-3 lg:grid-cols-5">
        {productTours.map((tour) => (
          <article key={tour.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><Map className="size-4 text-gold-200" />{tour.workspace}</div>
            <Badge className="mt-3" variant="neutral">{tour.duration}</Badge>
            <div className="mt-3 flex flex-wrap gap-2">
              {tour.checkpoints.map((checkpoint) => <Badge key={checkpoint} variant="info">{checkpoint}</Badge>)}
            </div>
            <p className="mt-3 text-xs leading-5 text-gold-100">{tour.activationGoal}</p>
          </article>
        ))}
      </div>
    </BetaPanel>
  );
}
