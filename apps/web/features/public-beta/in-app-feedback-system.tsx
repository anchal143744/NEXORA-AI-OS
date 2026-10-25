'use client';

import { MessageCircleQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { inAppFeedbackChannels } from '@/lib/public-beta';
import { BetaPanel } from './public-beta-panel';

export function InAppFeedbackSystem() {
  return (
    <BetaPanel title="In-App Feedback System" description="Quick feedback, screenshots, issue reporting and feature suggestions are routed to the right launch teams." badge="Screenshot Feedback">
      <div className="grid gap-3 lg:grid-cols-4">
        {inAppFeedbackChannels.map((channel) => (
          <article key={channel.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><MessageCircleQuestion className="size-4 text-gold-200" />{channel.channel}</div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{channel.captureMode}</p>
            <p className="mt-3 text-xs text-gold-100">{channel.routing}</p>
            <Badge className="mt-3" variant="neutral">{channel.responseTarget}</Badge>
          </article>
        ))}
      </div>
    </BetaPanel>
  );
}
