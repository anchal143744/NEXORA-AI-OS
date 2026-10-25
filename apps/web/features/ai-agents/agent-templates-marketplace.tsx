'use client';

import { Rocket, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { templates } from '@/lib/agent-workspace';
import { useAgentWorkspaceActions } from '@/hooks/use-agent-workspace-actions';

export function AgentTemplatesMarketplace() {
  const { deployTemplate } = useAgentWorkspaceActions();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Templates Marketplace</CardTitle>
        <p className="text-sm text-graphite-400">One-click deployment templates for common business automations.</p>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-3">
        {templates.map((template) => (
          <article key={template.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Badge><Sparkles className="size-3" />{template.setupTime}</Badge>
            <h3 className="mt-3 text-base font-semibold text-white">{template.name}</h3>
            <p className="mt-2 text-sm leading-6 text-graphite-400">{template.description}</p>
            <p className="mt-3 text-xs text-gold-100">{template.recommendedFor}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {template.outcomes.map((outcome) => (
                <span key={outcome} className="rounded-sm border border-white/10 bg-graphite-950/70 px-2 py-1 text-xs text-graphite-300">{outcome}</span>
              ))}
            </div>
            <Button className="mt-4 w-full" onClick={() => deployTemplate(template.id)}><Rocket className="size-4" />Deploy template</Button>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
