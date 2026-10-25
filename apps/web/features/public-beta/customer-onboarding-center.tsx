'use client';

import { CheckCircle2 } from 'lucide-react';
import { onboardingMilestones } from '@/lib/public-beta';
import { BetaPanel, BetaProgress } from './public-beta-panel';

export function CustomerOnboardingCenter() {
  return (
    <BetaPanel title="Customer Onboarding Center" description="Organization setup, team invitations, guided configuration, workspace activation and success milestones are tuned for under ten minutes." badge="under ten minutes">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {onboardingMilestones.map((milestone) => (
          <article key={milestone.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><CheckCircle2 className="size-4 text-gold-200" />{milestone.title}</div>
            <p className="mt-3 text-sm text-graphite-300">Target minute {milestone.targetMinute}</p>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs text-graphite-400"><span>Completion</span><span>{milestone.completionRate}%</span></div>
              <BetaProgress value={milestone.completionRate} />
            </div>
            <p className="mt-3 text-xs text-gold-100">{milestone.owner}</p>
          </article>
        ))}
      </div>
    </BetaPanel>
  );
}
