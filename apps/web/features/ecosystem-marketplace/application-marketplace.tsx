'use client';

import { Boxes } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { applicationLifecycle } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel, StatusBadge } from './ecosystem-marketplace-panel';

export function ApplicationMarketplace() {
  return (
    <EcosystemPanel title="Application Marketplace" description="Third-Party Apps, Internal Apps, App Publishing, App Updates and Version Management with tenant-safe release governance." badge="Third-Party Apps">
      <div className="grid gap-3 md:grid-cols-2">
        {applicationLifecycle.map((app) => (
          <article key={app.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><Boxes className="size-4 text-gold-200" />{app.name}</div>
              <StatusBadge status={app.status} />
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{app.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-graphite-300">
              <Badge>{app.category}</Badge>
              <span>{app.publisher}</span>
              <span>{app.installs} installs</span>
              <span>{app.installTime}</span>
            </div>
          </article>
        ))}
      </div>
    </EcosystemPanel>
  );
}
