'use client';

import { Cable } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { integrationConnectors } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel, StatusBadge } from './ecosystem-marketplace-panel';

export function IntegrationMarketplace() {
  return (
    <EcosystemPanel title="Integration Marketplace" description="Enterprise connectors for Salesforce, HubSpot, SAP, Oracle, Slack, Teams, Zoom, Stripe, AWS, Azure and Google Workspace." badge="Connectors">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {integrationConnectors.map((connector) => (
          <article key={connector.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><Cable className="size-4 text-gold-200" />{connector.name}</div>
              <StatusBadge status={connector.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{connector.category}</Badge>
              <Badge variant="neutral">{connector.auth}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{connector.sync}</p>
          </article>
        ))}
      </div>
    </EcosystemPanel>
  );
}
