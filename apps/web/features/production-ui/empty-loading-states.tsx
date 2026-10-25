'use client';

import { experienceStates } from '@/lib/production-ui';
import { PremiumEmptyState, PremiumLoadingPanel } from '@/components/ui/production-states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EmptyLoadingStates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Empty States & Loading States</CardTitle>
        <p className="text-sm text-graphite-400">Premium no-data, no-results, first-use, skeleton and progressive loading standards.</p>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-2">
        <PremiumEmptyState title="No results found" description="Search did not find matching records. Users get a calm explanation and a clear next action." action="Clear filters" />
        <PremiumLoadingPanel label="Loading priority workspace data" />
        {experienceStates.map((state) => (
          <article key={state.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="text-sm font-semibold text-white">{state.state}</div>
            <p className="mt-2 text-xs leading-5 text-graphite-400">{state.message}</p>
            <p className="mt-3 text-xs text-gold-100">{state.recoveryAction}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
