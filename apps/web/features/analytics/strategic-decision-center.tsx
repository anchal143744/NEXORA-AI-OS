'use client';

import { GitBranch, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { decisionScenarios } from '@/lib/analytics-workspace';

export function StrategicDecisionCenter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategic Decision Center</CardTitle>
        <p className="text-sm text-graphite-400">Decision support, scenario analysis, executive recommendations and risk assessment.</p>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-3">
        {decisionScenarios.map((scenario) => (
          <article key={scenario.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><GitBranch className="size-4 text-gold-200" />{scenario.title}</div>
            <Badge className="mt-3"><ShieldCheck className="size-3" />Decision support</Badge>
            <p className="mt-3 text-sm text-graphite-300">{scenario.expectedImpact}</p>
            <p className="mt-2 text-xs leading-5 text-graphite-400">{scenario.riskAssessment}</p>
            <p className="mt-3 text-xs text-gold-100">{scenario.recommendation}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
