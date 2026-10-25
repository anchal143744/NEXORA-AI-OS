'use client';

import { errorExperiences } from '@/lib/production-ui';
import { PremiumErrorState } from '@/components/ui/production-states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ErrorHandlingExperience() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Handling Experience</CardTitle>
        <p className="text-sm text-graphite-400">Friendly errors, recovery actions and retry flows that keep users oriented.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <PremiumErrorState title="Connection paused" description="Your work is safe. Retry the request or continue with cached data." action="Retry" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {errorExperiences.map((error) => (
            <article key={error.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="text-sm font-semibold text-white">{error.errorType}</div>
              <p className="mt-2 text-xs leading-5 text-graphite-400">{error.userMessage}</p>
              <p className="mt-3 text-xs text-gold-100">{error.recoveryAction}</p>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
