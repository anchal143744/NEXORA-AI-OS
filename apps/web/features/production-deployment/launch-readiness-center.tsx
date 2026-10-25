'use client';

import { Gauge, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { launchReadinessGates } from '@/lib/production-deployment';
import { ProductionPanel } from './production-deployment-panel';

export function LaunchReadinessCenter() {
  const ready = launchReadinessGates.filter((gate) => gate.state === 'ready').length;
  const score = Math.round((ready / launchReadinessGates.length) * 100);

  return (
    <ProductionPanel title="Launch Readiness Center" description="Public beta readiness is measured across backend, frontend, security, monitoring, infrastructure and documentation gates." badge="Public Beta Launch">
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-gold-500/20 bg-gold-500/10 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-gold-100"><Gauge className="size-4" />Production Readiness Score</div>
          <div className="mt-4 text-5xl font-semibold text-white">{score}%</div>
          <p className="mt-3 text-sm leading-6 text-graphite-300">Security remains in tracked remediation because known non-critical dependency advisories require semver decisions before final GA.</p>
        </section>
        <section className="grid gap-3 md:grid-cols-2">
          {launchReadinessGates.map((gate) => (
            <article key={gate.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-semibold text-white"><Rocket className="size-4 text-gold-200" />{gate.gate}</div>
                <Badge variant={gate.state === 'ready' ? 'success' : 'warning'}>{gate.state}</Badge>
              </div>
              <p className="mt-2 text-xs text-gold-100">{gate.owner}</p>
            </article>
          ))}
        </section>
      </div>
    </ProductionPanel>
  );
}
