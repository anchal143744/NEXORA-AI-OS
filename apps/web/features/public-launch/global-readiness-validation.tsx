'use client';

import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { globalReadinessChecks } from '@/lib/public-launch';
import { LaunchPanel, LaunchScoreBar, LaunchStatusBadge } from './public-launch-panel';

export function GlobalReadinessValidation() {
  return (
    <LaunchPanel title="Global Readiness Validation" description="Validate Performance, Security, Compliance, Scalability and Documentation before official public launch." badge="Scalability">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {globalReadinessChecks.map((check) => (
          <article key={check.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <ShieldCheck className="size-5 text-gold-200" />
              <LaunchStatusBadge status={check.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{check.domain}</h3>
            <Badge className="mt-3">{check.score}%</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{check.validation}</p>
            <div className="mt-4"><LaunchScoreBar value={check.score} /></div>
          </article>
        ))}
      </div>
    </LaunchPanel>
  );
}
