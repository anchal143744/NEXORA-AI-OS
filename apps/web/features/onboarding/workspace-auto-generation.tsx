'use client';

import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-states';
import { useGenerateWorkspace } from '@/hooks/use-onboarding-actions';
import { useOnboardingStore } from '@/stores/onboarding-store';
import type { BusinessProfile } from '@/types/onboarding';

export function WorkspaceAutoGeneration() {
  const businessProfile = useOnboardingStore((state) => state.businessProfile);
  const aiProfile = useOnboardingStore((state) => state.aiProfile);
  const workspaceResult = useOnboardingStore((state) => state.workspaceResult);
  const completeStep = useOnboardingStore((state) => state.completeStep);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const generateWorkspace = useGenerateWorkspace();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Wand2 className="size-4 text-gold-300" />Workspace Auto-Generation</CardTitle>
        <CardDescription>Generate workspace structure, modules, KPIs, workflows, navigation, permissions and agents from the business profile.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {generateWorkspace.isPending ? <LoadingState variant="ai" label="Generating adaptive workspace" /> : null}
        <Button
          onClick={() => {
            const profile = businessProfile as BusinessProfile;
            generateWorkspace.mutate(
              { businessProfile: profile, aiProfile },
              {
                onSuccess: () => {
                  completeStep('workspace');
                  setCurrentStep('invite');
                },
              },
            );
          }}
          disabled={generateWorkspace.isPending}
        >
          {generateWorkspace.isPending ? 'Generating workspace' : workspaceResult ? 'Workspace generated' : 'Generate workspace'}
        </Button>
        {workspaceResult ? (
          <div className="grid gap-3 md:grid-cols-2">
            {workspaceResult.modules.map((module) => <Badge key={module} variant="neutral">{module}</Badge>)}
          </div>
        ) : null}
        {!workspaceResult && !generateWorkspace.isPending ? <p className="text-xs text-graphite-400">Generated modules appear here after the API persists the workspace blueprint.</p> : null}
        {generateWorkspace.error ? <p className="text-xs text-red-200">{generateWorkspace.error.message}</p> : null}
      </CardContent>
    </Card>
  );
}
