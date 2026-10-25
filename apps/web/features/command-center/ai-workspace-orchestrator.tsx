'use client';

import { Network } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommandCenterStore } from '@/stores/command-center-store';

export function AiWorkspaceOrchestrator() {
  const launchPlan = useCommandCenterStore((state) => state.launchPlan);
  const completeCount = launchPlan.tasks.filter((task) => task.status === 'complete').length;

  return (
    <Card className="border-gold-500/20 bg-gold-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Network className="size-4 text-gold-300" />AI Workspace Orchestrator</CardTitle>
        <CardDescription>Coordinates workspace creation, module activation, AI agent setup and command-center launch state.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge>{completeCount}/{launchPlan.tasks.length} launch tasks complete</Badge>
          <Badge variant="neutral">{launchPlan.agents.length} agents</Badge>
          <Badge variant="success">{launchPlan.automations.length} automations</Badge>
        </div>
        <p className="text-sm leading-6 text-graphite-300">The orchestrator is prepared for Phase 55 CRM and revenue operations launch actions.</p>
      </CardContent>
    </Card>
  );
}
