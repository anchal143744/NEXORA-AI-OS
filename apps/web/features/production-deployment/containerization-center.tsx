'use client';

import { Container } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { containerImages } from '@/lib/production-deployment';
import { ProductionPanel } from './production-deployment-panel';

export function ContainerizationCenter() {
  return (
    <ProductionPanel title="Containerization" description="Backend, frontend, background worker and AI execution containers use immutable images and explicit runtime commands." badge="Container Images">
      <div className="grid gap-3 lg:grid-cols-4">
        {containerImages.map((image) => (
          <article key={image.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><Container className="size-4 text-gold-200" />{image.image}</div>
            <Badge className="mt-3" variant="info">{image.dockerfile}</Badge>
            <p className="mt-4 break-words font-mono text-xs leading-5 text-graphite-300">{image.command}</p>
            <p className="mt-3 text-xs text-gold-100">Healthcheck: {image.healthcheck}</p>
          </article>
        ))}
      </div>
    </ProductionPanel>
  );
}
