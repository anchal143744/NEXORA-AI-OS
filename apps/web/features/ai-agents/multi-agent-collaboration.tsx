'use client';

import { ArrowRight, Network } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { collaborationFlows } from '@/lib/agent-workspace';

export function MultiAgentCollaboration() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Agent Collaboration</CardTitle>
        <p className="text-sm text-graphite-400">Support agent-to-agent workflows with approval-aware handoffs.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {collaborationFlows.map((flow) => (
          <article key={flow.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white"><Network className="size-4 text-gold-200" />{flow.name}</div>
              <Badge>{flow.status}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {flow.agents.map((agent, index) => (
                <span key={agent} className="flex items-center gap-2">
                  <span className="rounded-sm border border-white/10 bg-graphite-950/70 px-2 py-1 text-xs text-graphite-300">{agent}</span>
                  {index < flow.agents.length - 1 ? <ArrowRight className="size-3 text-gold-200" /> : null}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-graphite-400">{flow.businessOutcome}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
