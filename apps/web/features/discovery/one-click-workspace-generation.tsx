'use client';

import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-states';
import { useOneClickWorkspaceGeneration } from '@/hooks/use-workspace-intelligence';
import { useDiscoveryStore } from '@/stores/discovery-store';

export function OneClickWorkspaceGeneration() {
  const blueprint = useDiscoveryStore((state) => state.blueprint);
  const result = useDiscoveryStore((state) => state.generationResult);
  const generate = useOneClickWorkspaceGeneration();

  return (
    <Card className="border-gold-500/20 bg-gold-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Rocket className="size-4 text-gold-300" />One-Click Workspace Generation</CardTitle>
        <CardDescription>Create the workspace from the AI-generated blueprint when ready.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button disabled={!blueprint || generate.isPending} onClick={() => blueprint && generate.mutate(blueprint)}>
          {generate.isPending ? <LoadingState label="Creating workspace" /> : 'Generate workspace'}
        </Button>
        {result ? <p className="text-sm text-graphite-300">Workspace generated: <span className="font-semibold text-white">{result.workspaceName}</span></p> : null}
      </CardContent>
    </Card>
  );
}
