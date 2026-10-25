'use client';

import { BotMessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { executiveGrowthCommands } from '@/lib/growth-program';
import { GrowthPanel } from './growth-program-panel';

export function ExecutiveGrowthIntelligence() {
  return (
    <GrowthPanel title="Executive Growth Intelligence" description="AI commands that explain growth trends, expansion opportunities, churn, ARR forecasts, growth actions and enterprise health." badge="Show growth trends">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {executiveGrowthCommands.map((command) => (
          <article key={command.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <BotMessageSquare className="size-5 text-gold-200" />
            <Badge className="mt-4">{command.command}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{command.response}</p>
          </article>
        ))}
      </div>
    </GrowthPanel>
  );
}
