'use client';

import { Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { releaseCandidateChecks } from '@/lib/production-ui';

export function ProductionUiReleaseCandidate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production UI Release Candidate</CardTitle>
        <p className="text-sm text-graphite-400">Design System, CRM, HR, Finance, AI Agents, Analytics and Command Center are validated for RC1.</p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {releaseCandidateChecks.map((check) => (
          <article key={check.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
            <Rocket className="mb-3 size-4 text-gold-200" />
            <div className="text-sm font-semibold text-white">{check.area}</div>
            <p className="mt-2 text-xs leading-5 text-graphite-400">{check.result}</p>
            <Badge className="mt-3" variant="success">{check.status}</Badge>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
