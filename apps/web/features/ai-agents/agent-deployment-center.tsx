'use client';

import { Copy, Pause, Play, Square } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { deployments } from '@/lib/agent-workspace';
import { useAgentWorkspaceActions } from '@/hooks/use-agent-workspace-actions';

export function AgentDeploymentCenter() {
  const { stopDeployment } = useAgentWorkspaceActions();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Deployment Center</CardTitle>
        <p className="text-sm text-graphite-400">Deploy, start, pause, stop, clone and version-control agents safely.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {deployments.map((deployment) => (
          <article key={deployment.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4 lg:grid-cols-[1.2fr_0.8fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-white">{deployment.agentName}</h3>
                <Badge>{deployment.version}</Badge>
                <Badge variant={deployment.status === 'deployed' ? 'success' : 'default'}>{deployment.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-graphite-400">{deployment.lastAction}</p>
            </div>
            <div className="text-sm text-graphite-300">{deployment.environment} deployment · {deployment.approvalPolicy} approval</div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm"><Play className="size-4" />Start</Button>
              <Button size="sm" variant="secondary"><Pause className="size-4" />Pause</Button>
              <Button size="sm" variant="secondary" onClick={() => stopDeployment(deployment.id)}><Square className="size-4" />Stop</Button>
              <Button size="sm" variant="secondary"><Copy className="size-4" />Clone</Button>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
