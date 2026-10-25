'use client';

import { DatabaseBackup } from 'lucide-react';
import { backupPolicies } from '@/lib/production-deployment';
import { ProductionPanel } from './production-deployment-panel';

export function BackupDisasterRecovery() {
  return (
    <ProductionPanel title="Backup & Disaster Recovery" description="Database, object storage, configuration and audit backups define cadence, retention and restore targets." badge="Recovery Target">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {backupPolicies.map((policy) => (
          <article key={policy.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><DatabaseBackup className="size-4 text-gold-200" />{policy.scope}</div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{policy.cadence}</p>
            <p className="mt-3 text-xs text-gold-100">Retention: {policy.retention}</p>
            <p className="mt-2 text-xs text-graphite-400">{policy.recoveryTarget}</p>
          </article>
        ))}
      </div>
    </ProductionPanel>
  );
}
