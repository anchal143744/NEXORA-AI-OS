'use client';

import { BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { aiExpansionCapabilities } from '@/lib/growth-program';
import { GrowthPanel, GrowthStatusBadge } from './growth-program-panel';

export function AiExpansionPlatform() {
  return (
    <GrowthPanel title="AI Expansion Platform" description="Advanced AI Agents, Agent Collaboration, AI Skills Library and AI Decision Intelligence for post-launch AI expansion." badge="AI Skills Library">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {aiExpansionCapabilities.map((capability) => (
          <article key={capability.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <BrainCircuit className="size-5 text-gold-200" />
              <GrowthStatusBadge status={capability.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{capability.capability}</h3>
            <Badge className="mt-3" variant="info">{capability.scope}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{capability.businessImpact}</p>
          </article>
        ))}
      </div>
    </GrowthPanel>
  );
}
