'use client';

import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { trustCenterDocuments } from '@/lib/enterprise-trust';
import { TrustPanel } from './enterprise-trust-panel';

export function TrustCenter() {
  return (
    <TrustPanel title="Trust Center" description="Public-facing trust center communicates Security Practices, Compliance Status, Uptime Information, Privacy Commitments and Trust Documentation." badge="Security Practices">
      <div className="grid gap-3 lg:grid-cols-5">
        {trustCenterDocuments.map((doc) => (
          <article key={doc.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><ShieldCheck className="size-4 text-gold-200" />{doc.title}</div>
              <Badge variant={doc.status === 'ready' ? 'success' : 'warning'}>{doc.status}</Badge>
            </div>
            <p className="mt-3 text-xs text-primary-100">{doc.audience}</p>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{doc.summary}</p>
          </article>
        ))}
      </div>
    </TrustPanel>
  );
}
