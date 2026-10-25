'use client';

import { HeartHandshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { retentionSignals } from '@/lib/growth-program';
import { GrowthPanel, GrowthStatusBadge } from './growth-program-panel';

export function CustomerRetentionCenter() {
  return (
    <GrowthPanel title="Customer Retention Center" description="Churn Prediction, Customer Health Scores, Risk Detection and Retention Playbooks for post-launch retention." badge="Churn Prediction">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {retentionSignals.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <HeartHandshake className="size-5 text-gold-200" />
              <GrowthStatusBadge status={signal.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{signal.customer}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>Health {signal.healthScore}</Badge>
              <Badge variant="warning">Risk {signal.churnRisk}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{signal.playbook}</p>
          </article>
        ))}
      </div>
    </GrowthPanel>
  );
}
