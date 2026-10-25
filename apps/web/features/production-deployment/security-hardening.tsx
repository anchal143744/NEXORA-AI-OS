'use client';

import { LockKeyhole } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { securityControls } from '@/lib/production-deployment';
import { ProductionPanel } from './production-deployment-panel';

export function SecurityHardening() {
  return (
    <ProductionPanel title="Security Hardening" description="RBAC, API security, rate limiting, secrets protection, encryption and headers are represented as deploy-time controls." badge="Security Controls">
      <div className="grid gap-3 lg:grid-cols-3">
        {securityControls.map((control) => (
          <article key={control.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><LockKeyhole className="size-4 text-gold-200" />{control.area}</div>
              <Badge variant={control.state === 'ready' ? 'success' : 'warning'}>{control.state}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{control.control}</p>
            <p className="mt-3 text-xs text-gold-100">{control.evidence}</p>
          </article>
        ))}
      </div>
    </ProductionPanel>
  );
}
