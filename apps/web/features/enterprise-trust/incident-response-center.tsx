'use client';

import { Siren } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { incidentPlans } from '@/lib/enterprise-trust';
import { TrustPanel } from './enterprise-trust-panel';

export function IncidentResponseCenter() {
  return (
    <TrustPanel title="Incident Response Center" description="Incident Tracking, Severity Levels, Response Plans and Post-Mortem Analysis are organized by severity." badge="Incident Tracking">
      <div className="grid gap-3 lg:grid-cols-4">
        {incidentPlans.map((plan) => (
          <article key={plan.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><Siren className="size-4 text-gold-200" />{plan.severity}</div>
              <Badge variant={plan.severity === 'critical' || plan.severity === 'high' ? 'warning' : 'success'}>{plan.status}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{plan.responsePlan}</p>
            <p className="mt-3 text-xs text-gold-100">{plan.postMortem}</p>
          </article>
        ))}
      </div>
    </TrustPanel>
  );
}
