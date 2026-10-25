'use client';

import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { executiveWarRoomSignals } from '@/lib/public-launch';
import { LaunchPanel } from './public-launch-panel';

export function ExecutiveLaunchWarRoom() {
  return (
    <LaunchPanel title="Executive Launch War Room" description="Launch Health, Risks, Opportunities, Customer Sentiment and Revenue Metrics for leadership decisions." badge="Customer Sentiment">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {executiveWarRoomSignals.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Crown className="size-5 text-gold-200" />
            <h3 className="mt-4 font-semibold text-white">{signal.signal}</h3>
            <Badge className="mt-3">{signal.value}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{signal.interpretation}</p>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{signal.action}</p>
          </article>
        ))}
      </div>
    </LaunchPanel>
  );
}
