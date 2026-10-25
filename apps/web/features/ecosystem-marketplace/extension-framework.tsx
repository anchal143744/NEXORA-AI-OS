'use client';

import { Puzzle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { extensionCapabilities } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel } from './ecosystem-marketplace-panel';

export function ExtensionFramework() {
  return (
    <EcosystemPanel title="Extension Framework" description="Custom Modules, Custom Workflows, Custom Dashboards and Custom AI Agents connected to RBAC, certification and tenant isolation." badge="Custom Modules">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {extensionCapabilities.map((capability) => (
          <article key={capability.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Puzzle className="size-5 text-gold-200" />
            <h3 className="mt-4 font-semibold text-white">{capability.name}</h3>
            <Badge className="mt-3" variant="info">{capability.surface}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{capability.summary}</p>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{capability.governance}</p>
          </article>
        ))}
      </div>
    </EcosystemPanel>
  );
}
