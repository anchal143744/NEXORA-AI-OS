'use client';

import { Handshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { partnerPrograms } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel } from './ecosystem-marketplace-panel';

export function PartnerPortal() {
  return (
    <EcosystemPanel title="Partner Portal" description="Partner Registration, Partner Profiles, Partner Programs, Revenue Sharing and Certification Status for the external ecosystem." badge="Partner Registration">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {partnerPrograms.map((program) => (
          <article key={program.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><Handshake className="size-4 text-gold-200" />{program.name}</div>
            <Badge className="mt-3" variant="info">{program.type}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{program.growthSignal}</p>
            <div className="mt-4 space-y-2 text-xs text-graphite-400">
              <div>Revenue Sharing: {program.revenueShare}</div>
              <div>Certification: {program.certification}</div>
            </div>
          </article>
        ))}
      </div>
    </EcosystemPanel>
  );
}
