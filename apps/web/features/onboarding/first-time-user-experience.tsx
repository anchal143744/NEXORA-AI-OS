'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboardingStore } from '@/stores/onboarding-store';

export function FirstTimeUserExperience() {
  const completeStep = useOnboardingStore((state) => state.completeStep);
  const workspaceResult = useOnboardingStore((state) => state.workspaceResult);

  return (
    <Card className="border-gold-500/20 bg-gradient-to-br from-gold-500/12 to-white/[0.045]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CheckCircle2 className="size-4 text-gold-300" />First-Time User Experience</CardTitle>
        <CardDescription>Your first adaptive workspace is ready to open.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-graphite-300">
          {workspaceResult?.workspaceName ?? 'Your operating workspace'} includes generated navigation, recommended modules, KPIs, workflow starts and AI agent context.
        </p>
        <Button asChild onClick={() => completeStep('finish')}>
          <Link href="/"><ArrowRight className="size-4" />Open NEXORA workspace</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
