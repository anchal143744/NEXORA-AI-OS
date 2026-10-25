'use client';

import { TerminalSquare } from 'lucide-react';
import { developerConsoleItems } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel, StatusBadge } from './ecosystem-marketplace-panel';

export function DeveloperConsole() {
  return (
    <EcosystemPanel title="Developer Console" description="API Keys, OAuth Apps, Webhooks, Usage Analytics and Logs with tenant-safe governance and auditability." badge="API Keys">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {developerConsoleItems.map((item) => (
          <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <TerminalSquare className="size-5 text-gold-200" />
              <StatusBadge status={item.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{item.name}</h3>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{item.control}</p>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{item.audit}</p>
          </article>
        ))}
      </div>
    </EcosystemPanel>
  );
}
