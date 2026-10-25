'use client';

import { ExternalLink, Layers3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommandCenterStore } from '@/stores/command-center-store';

export function WorkspaceLauncher() {
  const launchPlan = useCommandCenterStore((state) => state.launchPlan);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Layers3 className="size-4 text-gold-300" />Workspace Launcher</CardTitle>
        <CardDescription>Launch modules, agents and automations from one place.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 text-xs uppercase text-graphite-500">Modules</div>
          <div className="flex flex-wrap gap-2">{launchPlan.modules.map((module) => <Badge key={module} variant="neutral">{module}</Badge>)}</div>
        </div>
        <div>
          <div className="mb-2 text-xs uppercase text-graphite-500">AI agents</div>
          <div className="flex flex-wrap gap-2">{launchPlan.agents.map((agent) => <Badge key={agent}>{agent}</Badge>)}</div>
        </div>
        <Button variant="outline"><ExternalLink className="size-4" />Open workspace</Button>
      </CardContent>
    </Card>
  );
}
