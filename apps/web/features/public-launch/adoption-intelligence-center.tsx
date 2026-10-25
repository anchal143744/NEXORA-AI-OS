'use client';

import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { adoptionIntelligenceSignals } from '@/lib/public-launch';
import { LaunchPanel } from './public-launch-panel';

export function AdoptionIntelligenceCenter() {
  return (
    <LaunchPanel title="Adoption Intelligence Center" description="User Adoption, Feature Adoption, Retention and Expansion Opportunities intelligence for launch growth." badge="Expansion Opportunities">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {adoptionIntelligenceSignals.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between">
              <Activity className="size-5 text-gold-200" />
              <Badge variant="success">{signal.trend}</Badge>
            </div>
            <h3 className="mt-4 font-semibold text-white">{signal.metric}</h3>
            <div className="mt-2 text-2xl font-semibold text-white">{signal.value}</div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{signal.recommendation}</p>
          </article>
        ))}
      </div>
    </LaunchPanel>
  );
}
