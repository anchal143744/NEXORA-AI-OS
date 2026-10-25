'use client';

import { BookOpenText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { developerResources } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel } from './ecosystem-marketplace-panel';

export function DeveloperPlatform() {
  return (
    <EcosystemPanel title="Developer Platform" description="SDK Documentation, API Documentation, Sandbox Environments and Developer Resources for world-class builder experience." badge="SDK Documentation">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {developerResources.map((resource) => (
          <article key={resource.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <BookOpenText className="size-5 text-gold-200" />
            <h3 className="mt-4 font-semibold text-white">{resource.title}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{resource.audience}</Badge>
              <Badge variant="neutral">{resource.format}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{resource.summary}</p>
          </article>
        ))}
      </div>
    </EcosystemPanel>
  );
}
