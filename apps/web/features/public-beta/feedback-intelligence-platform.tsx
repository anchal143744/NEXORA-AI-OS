'use client';

import { Radar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePublicBetaActions } from '@/hooks/use-public-beta-actions';
import { feedbackSignals } from '@/lib/public-beta';
import { usePublicBetaStore } from '@/stores/public-beta-store';
import { BetaPanel } from './public-beta-panel';

export function FeedbackIntelligencePlatform() {
  const selectedFeedback = usePublicBetaStore((state) => state.selectedFeedback);
  const { inspectFeedback } = usePublicBetaActions();

  return (
    <BetaPanel title="Feedback Intelligence Platform" description="Product feedback, UX feedback, feature requests, bug reports and improvement suggestions are analyzed by sentiment, priority and impact." badge="Sentiment">
      <div className="grid gap-3 lg:grid-cols-4">
        {feedbackSignals.map((signal) => (
          <article key={signal.id} className={selectedFeedback === signal.id ? 'rounded-lg border border-gold-500/40 bg-gold-500/10 p-4' : 'rounded-lg border border-white/10 bg-white/[0.045] p-4'}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><Radar className="size-4 text-gold-200" />{signal.category}</div>
              <Badge variant={signal.priority === 'critical' || signal.priority === 'high' ? 'warning' : 'neutral'}>{signal.priority}</Badge>
            </div>
            <p className="mt-3 text-xs text-primary-100">{signal.source} - {signal.sentiment}</p>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{signal.impact}</p>
            <p className="mt-3 text-xs text-gold-100">{signal.action}</p>
            <Button className="mt-4 w-full" variant="subtle" size="sm" onClick={() => inspectFeedback(signal.id)}>Inspect signal</Button>
          </article>
        ))}
      </div>
    </BetaPanel>
  );
}
