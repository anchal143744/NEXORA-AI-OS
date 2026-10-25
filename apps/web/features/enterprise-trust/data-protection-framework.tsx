'use client';

import { LockKeyhole } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { dataProtectionControls } from '@/lib/enterprise-trust';
import { TrustPanel } from './enterprise-trust-panel';

export function DataProtectionFramework() {
  return (
    <TrustPanel title="Data Protection Framework" description="Encryption Validation, Access Reviews, Data Classification and Data Handling Policies are validated as enterprise trust controls." badge="Encryption Validation">
      <div className="grid gap-3 lg:grid-cols-4">
        {dataProtectionControls.map((control) => (
          <article key={control.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><LockKeyhole className="size-4 text-gold-200" />{control.control}</div>
              <Badge variant={control.status === 'ready' ? 'success' : 'warning'}>{control.status}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{control.validation}</p>
            <p className="mt-3 text-xs text-gold-100">{control.evidence}</p>
          </article>
        ))}
      </div>
    </TrustPanel>
  );
}
