'use client';

import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { securityEvents } from '@/lib/enterprise-trust';
import { TrustPanel, TrustScoreBar } from './enterprise-trust-panel';

export function SecurityOperationsDashboard() {
  return (
    <TrustPanel title="Security Operations Dashboard" description="Security Events, Threat Alerts, Risk Scores, Security Trends and Incident Status are summarized for operational visibility." badge="Security Events">
      <div className="grid gap-3 lg:grid-cols-4">
        {securityEvents.map((event) => (
          <article key={event.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><Activity className="size-4 text-gold-200" />{event.event}</div>
              <Badge variant={event.status === 'ready' ? 'success' : 'warning'}>{event.status}</Badge>
            </div>
            <div className="mt-4 text-2xl font-semibold text-white">{event.riskScore}</div>
            <div className="mt-3"><TrustScoreBar value={event.riskScore} /></div>
            <p className="mt-3 text-xs text-gold-100">Trend: {event.trend}</p>
          </article>
        ))}
      </div>
    </TrustPanel>
  );
}
