'use client';

import { BotMessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { launchCopilotCommands } from '@/lib/public-launch';
import { LaunchPanel } from './public-launch-panel';

export function AiLaunchCopilot() {
  return (
    <LaunchPanel title="AI Launch Copilot" description="Ask launch readiness, adoption, revenue forecasting, customer growth, risk and next-action questions in plain business language." badge="Show launch readiness">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {launchCopilotCommands.map((command) => (
          <article key={command.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <BotMessageSquare className="size-5 text-gold-200" />
            <Badge className="mt-4">{command.command}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{command.response}</p>
          </article>
        ))}
      </div>
    </LaunchPanel>
  );
}
