'use client';

import { Bot, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboardingStore } from '@/stores/onboarding-store';

export function AiWelcomeCopilot() {
  const businessProfile = useOnboardingStore((state) => state.businessProfile);
  const aiProfile = useOnboardingStore((state) => state.aiProfile);

  return (
    <Card className="border-gold-500/20 bg-gold-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot className="size-4 text-gold-300" />AI Welcome Copilot</CardTitle>
        <CardDescription>Copilot context is assembled from role, industry, country, goals and selected agents.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-graphite-300">
        <div className="flex flex-wrap gap-2">
          <Badge>{businessProfile.industry ?? 'Industry pending'}</Badge>
          <Badge variant="neutral">{businessProfile.country ?? 'Country pending'}</Badge>
          <Badge variant="success">{aiProfile.copilotTone}</Badge>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.05] p-3">
          <Sparkles className="mb-2 size-4 text-gold-300" />
          When the first workspace opens, NEXORA will recommend modules, workflows, KPIs and agent actions based on this setup.
        </div>
      </CardContent>
    </Card>
  );
}
