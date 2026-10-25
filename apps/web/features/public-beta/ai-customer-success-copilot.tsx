'use client';

import { Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { aiCustomerSuccessCommands } from '@/lib/public-beta';
import { BetaPanel } from './public-beta-panel';

export function AiCustomerSuccessCopilot() {
  return (
    <BetaPanel title="AI Customer Success Copilot" description="Customer success teams can ask plain business questions about onboarding progress, risk, feature requests, sentiment and product priorities." badge="Show onboarding progress">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {aiCustomerSuccessCommands.map((command) => (
          <article key={command.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><Bot className="size-4 text-gold-200" />{command.command}</div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{command.responseFocus}</p>
            <Badge className="mt-3" variant="default">{command.action}</Badge>
          </article>
        ))}
      </div>
    </BetaPanel>
  );
}
