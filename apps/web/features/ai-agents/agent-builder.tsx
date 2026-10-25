'use client';

import { BrainCircuit, CheckCircle2, ShieldCheck, Target, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { agentTypes, builderSteps } from '@/lib/agent-workspace';

export function AgentBuilder() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Agent Builder</CardTitle>
            <p className="mt-2 text-sm text-graphite-400">Create agents in plain business language, then define goals, tools, permissions and triggers.</p>
          </div>
          <Badge><BrainCircuit className="size-3" />No technical setup required</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {agentTypes.map((type) => (
            <div key={type} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Target className="size-4 text-gold-200" />
                {type}
              </div>
              <p className="mt-2 text-xs leading-5 text-graphite-400">Ready for goals, approved tools, safe permissions and event triggers.</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {builderSteps.map((step) => (
            <article key={step.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                {step.id.includes('tools') ? <Wrench className="size-4 text-gold-200" /> : step.id.includes('permissions') ? <ShieldCheck className="size-4 text-gold-200" /> : <CheckCircle2 className="size-4 text-gold-200" />}
                {step.label}
              </div>
              <p className="mt-2 text-xs leading-5 text-graphite-400">{step.description}</p>
              <p className="mt-3 text-xs text-gold-100">{step.businessQuestion}</p>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
