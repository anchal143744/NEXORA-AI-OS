'use client';

import { Activity } from 'lucide-react';
import { monitoringSignals } from '@/lib/production-deployment';
import { ProductionPanel } from './production-deployment-panel';

export function MonitoringObservability() {
  return (
    <ProductionPanel title="Monitoring & Observability" description="Application, API, infrastructure and database monitoring signals are mapped to SLO targets and alerts." badge="Monitoring Signals">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {monitoringSignals.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><Activity className="size-4 text-gold-200" />{signal.label}</div>
            <p className="mt-3 font-mono text-xs text-primary-100">{signal.metric}</p>
            <p className="mt-3 text-sm text-graphite-300">Target: {signal.target}</p>
            <p className="mt-2 text-xs text-gold-100">Alert: {signal.alert}</p>
          </article>
        ))}
      </div>
    </ProductionPanel>
  );
}
