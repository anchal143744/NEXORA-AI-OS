'use client';

import { BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ecosystemInsights } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel, EcosystemScoreBar } from './ecosystem-marketplace-panel';

export function EcosystemIntelligenceCenter() {
  return (
    <EcosystemPanel title="Ecosystem Intelligence Center" description="AI insights for Top Apps, Fastest Growing Apps, Ecosystem Health, Revenue Trends and Partner Performance." badge="Ecosystem Health">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {ecosystemInsights.map((insight, index) => (
          <article key={insight.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <BrainCircuit className="size-5 text-gold-200" />
            <h3 className="mt-4 font-semibold text-white">{insight.title}</h3>
            <Badge className="mt-3" variant="info">{insight.impact}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{insight.signal}</p>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{insight.recommendation}</p>
            <div className="mt-4"><EcosystemScoreBar value={88 - index * 4} /></div>
          </article>
        ))}
      </div>
    </EcosystemPanel>
  );
}
