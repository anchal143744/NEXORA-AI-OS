'use client';

import { Gauge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDiscoveryStore } from '@/stores/discovery-store';

export function AiReadinessScoring() {
  const score = useDiscoveryStore((state) => state.readinessScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Gauge className="size-4 text-gold-300" />AI Readiness Scoring</CardTitle>
        <CardDescription>Scores readiness from team structure, software maturity, goals, automation trust and data maturity.</CardDescription>
      </CardHeader>
      <CardContent>
        {score ? (
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <div className="text-5xl font-semibold text-white">{score.score}</div>
              <Badge>{score.level}</Badge>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-gold-500" style={{ width: String(score.score) + '%' }} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-2 text-xs uppercase text-graphite-500">Strengths</div>
                <ul className="space-y-2 text-sm text-graphite-300">{score.strengths.map((item) => <li key={item}>- {item}</li>)}</ul>
              </div>
              <div>
                <div className="mb-2 text-xs uppercase text-graphite-500">Gaps</div>
                <ul className="space-y-2 text-sm text-graphite-300">{score.gaps.map((item) => <li key={item}>- {item}</li>)}</ul>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-graphite-400">Generate a blueprint to calculate AI readiness.</p>
        )}
      </CardContent>
    </Card>
  );
}
