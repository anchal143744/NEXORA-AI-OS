'use client';

import { UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePublicBetaActions } from '@/hooks/use-public-beta-actions';
import { betaCohorts } from '@/lib/public-beta';
import { usePublicBetaStore } from '@/stores/public-beta-store';
import { BetaPanel, BetaProgress } from './public-beta-panel';

export function PublicBetaManagement() {
  const selectedCohort = usePublicBetaStore((state) => state.selectedCohort);
  const { inspectCohort } = usePublicBetaActions();

  return (
    <BetaPanel title="Public Beta Management" description="Beta applications, invitations, user management, cohorts and analytics are organized into one launch operating surface." badge="Active Testers">
      <div className="grid gap-3 lg:grid-cols-4">
        {betaCohorts.map((cohort) => (
          <article key={cohort.id} className={selectedCohort === cohort.id ? 'rounded-lg border border-gold-500/40 bg-gold-500/10 p-4' : 'rounded-lg border border-white/10 bg-white/[0.045] p-4'}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><UsersRound className="size-4 text-gold-200" />{cohort.name}</div>
              <Badge variant={cohort.status === 'ready' ? 'success' : 'warning'}>{cohort.status}</Badge>
            </div>
            <p className="mt-3 text-sm text-graphite-300">{cohort.testers} testers</p>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs text-graphite-400"><span>Engagement</span><span>{cohort.engagement}%</span></div>
              <BetaProgress value={cohort.engagement} />
            </div>
            <p className="mt-3 text-xs text-gold-100">{cohort.featureUsage}</p>
            <p className="mt-2 text-xs text-graphite-400">{cohort.feedbackVolume} feedback signals</p>
            <Button className="mt-4 w-full" variant="subtle" size="sm" onClick={() => inspectCohort(cohort.id)}>Inspect cohort</Button>
          </article>
        ))}
      </div>
    </BetaPanel>
  );
}
