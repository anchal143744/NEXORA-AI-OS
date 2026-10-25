'use client';

import { LineChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { launchAnalyticsSignals } from '@/lib/public-launch';
import { LaunchPanel } from './public-launch-panel';

export function LaunchAnalyticsDashboard() {
  return (
    <LaunchPanel title="Launch Analytics Dashboard" description="New Customers, Active Trials, Revenue Growth and Adoption Trends for real-time launch visibility." badge="Revenue Growth">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {launchAnalyticsSignals.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between">
              <LineChart className="size-5 text-gold-200" />
              <Badge variant="success">{signal.trend}</Badge>
            </div>
            <h3 className="mt-4 font-semibold text-white">{signal.metric}</h3>
            <div className="mt-2 text-2xl font-semibold text-white">{signal.value}</div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{signal.insight}</p>
          </article>
        ))}
      </div>
    </LaunchPanel>
  );
}
