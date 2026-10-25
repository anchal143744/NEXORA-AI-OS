'use client';

import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-states';
import { useGenerateBlueprint } from '@/hooks/use-workspace-intelligence';
import { useDiscoveryStore } from '@/stores/discovery-store';

export function WorkspaceBlueprintGenerator() {
  const answers = useDiscoveryStore((state) => state.answers);
  const blueprint = useDiscoveryStore((state) => state.blueprint);
  const generateBlueprint = useGenerateBlueprint();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Wand2 className="size-4 text-gold-300" />Workspace Blueprint Generator</CardTitle>
        <CardDescription>Turns discovery answers into navigation, modules, KPIs, workflows, agents and automations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={() => generateBlueprint.mutate(answers)} disabled={generateBlueprint.isPending}>
          {generateBlueprint.isPending ? <LoadingState variant="ai" label="Generating blueprint" /> : 'Generate workspace blueprint'}
        </Button>
        {blueprint ? <p className="text-sm text-graphite-300">Generated blueprint: <span className="font-semibold text-white">{blueprint.workspaceName}</span></p> : null}
      </CardContent>
    </Card>
  );
}
