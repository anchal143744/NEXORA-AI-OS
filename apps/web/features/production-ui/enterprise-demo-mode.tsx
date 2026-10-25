'use client';

import { PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { demoModeSteps } from '@/lib/production-ui';
import { useProductionUiActions } from '@/hooks/use-production-ui-actions';

export function EnterpriseDemoMode() {
  const { startDemoTour } = useProductionUiActions();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enterprise Demo Mode</CardTitle>
        <p className="text-sm text-graphite-400">Demo data, guided tours and product walkthroughs for executive presentations.</p>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-5">
        {demoModeSteps.map((step) => (
          <article key={step.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Badge>{step.workspace}</Badge>
            <h3 className="mt-3 text-sm font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-xs leading-5 text-graphite-400">{step.objective}</p>
            <Button className="mt-4 w-full" size="sm" onClick={() => startDemoTour(step.id)}><PlayCircle className="size-4" />Start tour</Button>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
