'use client';

import { BotMessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ecosystemCopilotCommands } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel } from './ecosystem-marketplace-panel';

export function AiEcosystemCopilot() {
  return (
    <EcosystemPanel title="AI Ecosystem Copilot" description="Plain-language ecosystem intelligence for marketplace leaders, partners and developers." badge="Show top marketplace apps">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {ecosystemCopilotCommands.map((command) => (
          <article key={command.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <BotMessageSquare className="size-5 text-gold-200" />
            <Badge className="mt-4">{command.command}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{command.response}</p>
          </article>
        ))}
      </div>
    </EcosystemPanel>
  );
}
