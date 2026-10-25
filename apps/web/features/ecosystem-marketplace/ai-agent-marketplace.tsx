'use client';

import { Bot, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { agentTemplates } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel, StatusBadge } from './ecosystem-marketplace-panel';

export function AiAgentMarketplace() {
  return (
    <EcosystemPanel title="AI Agent Marketplace" description="Agent Templates, Agent Installation, Agent Ratings, Agent Verification and Agent Updates for certified AI automation." badge="Agent Templates">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {agentTemplates.map((agent) => (
          <article key={agent.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <Bot className="size-5 text-gold-200" />
              <StatusBadge status={agent.verification} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{agent.name}</h3>
            <p className="mt-2 text-xs text-graphite-400">{agent.owner}</p>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{agent.capability}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-graphite-300">
              <Badge variant="neutral"><Star className="size-3 text-gold-200" />{agent.rating}</Badge>
              <span>{agent.updatePolicy}</span>
            </div>
          </article>
        ))}
      </div>
    </EcosystemPanel>
  );
}
