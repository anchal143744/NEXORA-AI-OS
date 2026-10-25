'use client';

import { Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { acquisitionSignals } from '@/lib/public-launch';
import { LaunchPanel } from './public-launch-panel';

export function CustomerAcquisitionEngine() {
  return (
    <LaunchPanel title="Customer Acquisition Engine" description="Track Leads, Signups, Conversions, Trial Activations and Revenue across launch channels." badge="Trial Activations">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {acquisitionSignals.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Target className="size-5 text-gold-200" />
            <h3 className="mt-4 font-semibold text-white">{signal.channel}</h3>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-graphite-300">
              <Badge>Leads {signal.leads}</Badge>
              <Badge variant="neutral">Signups {signal.signups}</Badge>
              <Badge variant="info">Conversions {signal.conversions}</Badge>
              <Badge variant="success">Revenue {signal.revenue}</Badge>
            </div>
          </article>
        ))}
      </div>
    </LaunchPanel>
  );
}
