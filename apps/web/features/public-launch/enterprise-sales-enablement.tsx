'use client';

import { BriefcaseBusiness } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { salesEnablementAssets } from '@/lib/public-launch';
import { LaunchPanel, LaunchStatusBadge } from './public-launch-panel';

export function EnterpriseSalesEnablement() {
  return (
    <LaunchPanel title="Enterprise Sales Enablement" description="Sales Playbooks, Demo Scripts, Proposal Templates and ROI Calculators for enterprise launch execution." badge="ROI Calculators">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {salesEnablementAssets.map((asset) => (
          <article key={asset.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <BriefcaseBusiness className="size-5 text-gold-200" />
              <LaunchStatusBadge status={asset.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{asset.asset}</h3>
            <Badge className="mt-3" variant="neutral">{asset.audience}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{asset.outcome}</p>
          </article>
        ))}
      </div>
    </LaunchPanel>
  );
}
