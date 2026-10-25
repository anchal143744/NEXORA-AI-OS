'use client';

import { Logs } from 'lucide-react';
import { logStreams } from '@/lib/production-deployment';
import { ProductionPanel } from './production-deployment-panel';

export function CentralizedLogging() {
  return (
    <ProductionPanel title="Centralized Logging" description="Application, audit, security and AI execution logs are routed into protected retention streams with tenant-aware metadata." badge="Log Streams">
      <div className="grid gap-3 md:grid-cols-2">
        {logStreams.map((stream) => (
          <article key={stream.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><Logs className="size-4 text-gold-200" />{stream.source}</div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{stream.routing}</p>
            <p className="mt-3 text-xs text-gold-100">Retention: {stream.retention}</p>
            <p className="mt-2 text-xs text-graphite-400">{stream.protection}</p>
          </article>
        ))}
      </div>
    </ProductionPanel>
  );
}
