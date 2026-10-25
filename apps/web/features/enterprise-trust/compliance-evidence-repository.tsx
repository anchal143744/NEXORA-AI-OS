'use client';

import { Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { evidenceItems } from '@/lib/enterprise-trust';
import { TrustPanel } from './enterprise-trust-panel';

export function ComplianceEvidenceRepository() {
  return (
    <TrustPanel title="Compliance Evidence Repository" description="Audit Evidence, Security Reviews, Compliance Documents and Validation Reports are organized for customer and auditor review." badge="Audit Evidence">
      <div className="grid gap-3 lg:grid-cols-4">
        {evidenceItems.map((item) => (
          <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><Archive className="size-4 text-gold-200" />{item.title}</div>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="info">{item.type}</Badge>
              <Badge variant="neutral">{item.retention}</Badge>
            </div>
            <p className="mt-3 text-xs text-gold-100">{item.owner}</p>
          </article>
        ))}
      </div>
    </TrustPanel>
  );
}
