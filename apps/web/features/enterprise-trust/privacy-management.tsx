'use client';

import { ScrollText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { privacyControls } from '@/lib/enterprise-trust';
import { TrustPanel } from './enterprise-trust-panel';

export function PrivacyManagement() {
  return (
    <TrustPanel title="Privacy Management" description="Consent Management, Data Retention Policies, Privacy Requests and Data Processing Records are organized for privacy operations." badge="Consent Management">
      <div className="grid gap-3 lg:grid-cols-4">
        {privacyControls.map((control) => (
          <article key={control.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><ScrollText className="size-4 text-gold-200" />{control.area}</div>
              <Badge variant="success">{control.status}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{control.policy}</p>
            <p className="mt-3 text-xs text-gold-100">{control.owner}</p>
          </article>
        ))}
      </div>
    </TrustPanel>
  );
}
