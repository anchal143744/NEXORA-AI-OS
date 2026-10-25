'use client';

import { BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { certificationPrograms } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel, StatusBadge } from './ecosystem-marketplace-panel';

export function CertificationProgram() {
  return (
    <EcosystemPanel title="Certification Program" description="Certified App, Certified Integration, Certified Partner and Certified AI Agent programs for trustable ecosystem distribution." badge="Certified App">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {certificationPrograms.map((program) => (
          <article key={program.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <BadgeCheck className="size-5 text-gold-200" />
              <StatusBadge status={program.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{program.name}</h3>
            <Badge className="mt-3" variant="neutral">{program.reviewer}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{program.requirements}</p>
          </article>
        ))}
      </div>
    </EcosystemPanel>
  );
}
