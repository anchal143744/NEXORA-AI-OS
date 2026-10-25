'use client';

import { Network } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { agentNetworkSignals } from '@/lib/growth-program';
import { GrowthPanel, GrowthStatusBadge } from './growth-program-panel';

export function MultiAgentIntelligenceNetwork() {
  return (
    <GrowthPanel title="Multi-Agent Intelligence Network" description="Agent-to-Agent Communication, Shared Memory, Agent Collaboration and Enterprise Workflows for advanced AI operations." badge="Agent-to-Agent Communication">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {agentNetworkSignals.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <Network className="size-5 text-gold-200" />
              <GrowthStatusBadge status={signal.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{signal.network}</h3>
            <Badge className="mt-3" variant="neutral">{signal.workflow}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{signal.collaboration}</p>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{signal.sharedMemory}</p>
          </article>
        ))}
      </div>
    </GrowthPanel>
  );
}
