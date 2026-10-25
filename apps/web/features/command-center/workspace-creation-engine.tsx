'use client';

import { CheckCircle2, Circle, Loader2, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateWorkspaceFromCommandCenter } from '@/hooks/use-command-center-actions';
import { useCommandCenterStore } from '@/stores/command-center-store';

export function WorkspaceCreationEngine() {
  const launchPlan = useCommandCenterStore((state) => state.launchPlan);
  const markTaskComplete = useCommandCenterStore((state) => state.markTaskComplete);
  const createWorkspace = useCreateWorkspaceFromCommandCenter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Rocket className="size-4 text-gold-300" />Workspace Creation Engine</CardTitle>
        <CardDescription>Turns the Phase 53 blueprint into a launchable workspace with activation tasks, context setup and agent readiness.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{launchPlan.workspaceName}</Badge>
          <Badge variant="neutral">{launchPlan.industry}</Badge>
          <Badge variant="success">{launchPlan.readinessScore}% ready</Badge>
        </div>
        <div className="space-y-2">
          {launchPlan.tasks.map((task) => (
            <button key={task.id} type="button" onClick={() => markTaskComplete(task.id)} className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-3 text-left text-sm text-graphite-300 transition hover:bg-white/[0.07] focus-visible:premium-focus">
              {task.status === 'complete' ? <CheckCircle2 className="size-4 text-gold-300" /> : <Circle className="size-4 text-graphite-500" />}
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-white">{task.label}</span>
                <span className="text-xs text-graphite-500">{task.stage} - {task.owner}</span>
              </span>
              <Badge variant={task.status === 'complete' ? 'success' : 'neutral'}>{task.status}</Badge>
            </button>
          ))}
        </div>
        <Button onClick={() => createWorkspace.mutate(launchPlan)} disabled={createWorkspace.isPending}>
          {createWorkspace.isPending ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />}
          Launch workspace
        </Button>
        {createWorkspace.data ? <p className="text-sm text-gold-100">Workspace status: {createWorkspace.data.status}</p> : null}
      </CardContent>
    </Card>
  );
}
