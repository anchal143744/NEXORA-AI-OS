'use client';

import { HeartHandshake } from 'lucide-react';
import { customerSuccessLaunchItems } from '@/lib/public-launch';
import { LaunchPanel, LaunchStatusBadge } from './public-launch-panel';

export function CustomerSuccessLaunchHub() {
  return (
    <LaunchPanel title="Customer Success Launch Hub" description="Customer Onboarding, Adoption Tracking, Success Plans and Health Scores for launch customer outcomes." badge="Health Scores">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {customerSuccessLaunchItems.map((item) => (
          <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <HeartHandshake className="size-5 text-gold-200" />
              <LaunchStatusBadge status={item.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{item.program}</h3>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{item.metric}</p>
            <p className="mt-3 text-xs text-graphite-400">{item.owner}</p>
          </article>
        ))}
      </div>
    </LaunchPanel>
  );
}
