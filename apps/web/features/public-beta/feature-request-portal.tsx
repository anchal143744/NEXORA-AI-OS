'use client';

import { Vote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { featureRequests } from '@/lib/public-beta';
import { BetaPanel } from './public-beta-panel';

export function FeatureRequestPortal() {
  return (
    <BetaPanel title="Feature Request Portal" description="Request submission, voting, prioritization and roadmap visibility convert customer demand into launch planning." badge="Voting">
      <div className="grid gap-3 lg:grid-cols-4">
        {featureRequests.map((request) => (
          <article key={request.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><Vote className="size-4 text-gold-200" />{request.title}</div>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant={request.priority === 'critical' ? 'warning' : 'info'}>{request.priority}</Badge>
              <Badge variant="neutral">{request.votes} votes</Badge>
            </div>
            <p className="mt-3 text-xs text-primary-100">{request.roadmapStage}</p>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{request.businessImpact}</p>
          </article>
        ))}
      </div>
    </BetaPanel>
  );
}
