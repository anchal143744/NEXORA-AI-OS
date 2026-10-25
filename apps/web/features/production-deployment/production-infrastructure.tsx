'use client';

import { Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { infrastructureServices } from '@/lib/production-deployment';
import { ProductionPanel } from './production-deployment-panel';

export function ProductionInfrastructure() {
  return (
    <ProductionPanel title="Production Infrastructure" description="API, frontend, worker, database, cache, storage and AI services are mapped for real-world deployment." badge="Service topology">
      <div className="grid gap-3 lg:grid-cols-3">
        {infrastructureServices.map((service) => (
          <article key={service.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><Server className="size-4 text-gold-200" />{service.name}</div>
              <Badge variant="neutral">{service.tier}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{service.runtime}</p>
            <p className="mt-3 text-xs text-gold-100">{service.scaling}</p>
            <p className="mt-2 text-xs text-graphite-400">Readiness: {service.readiness}</p>
          </article>
        ))}
      </div>
    </ProductionPanel>
  );
}
