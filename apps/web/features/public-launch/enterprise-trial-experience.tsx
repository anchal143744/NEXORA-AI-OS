'use client';

import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { trialExperience } from '@/lib/public-launch';
import { LaunchPanel, LaunchStatusBadge } from './public-launch-panel';

export function EnterpriseTrialExperience() {
  return (
    <LaunchPanel title="Enterprise Trial Experience" description="Instant Workspace Creation, Guided Setup, Demo Data and Trial Conversion Tracking for launch-ready customer adoption." badge="Instant Workspace Creation">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {trialExperience.map((step) => (
          <article key={step.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <Sparkles className="size-5 text-gold-200" />
              <LaunchStatusBadge status={step.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{step.step}</h3>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{step.outcome}</p>
            <Badge className="mt-4" variant="neutral">{step.metric}</Badge>
          </article>
        ))}
      </div>
    </LaunchPanel>
  );
}
