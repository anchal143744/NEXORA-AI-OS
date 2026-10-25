'use client';

import { Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEnterpriseTrustActions } from '@/hooks/use-enterprise-trust-actions';
import { enterpriseRisks } from '@/lib/enterprise-trust';
import { useEnterpriseTrustStore } from '@/stores/enterprise-trust-store';
import { TrustPanel, TrustScoreBar } from './enterprise-trust-panel';

export function RiskManagement() {
  const selectedRisk = useEnterpriseTrustStore((state) => state.selectedRisk);
  const { inspectRisk } = useEnterpriseTrustActions();

  return (
    <TrustPanel title="Risk Management" description="Enterprise Risks, Risk Assessments, Risk Mitigation Plans and Risk Monitoring are visible in a single executive view." badge="Enterprise Risks">
      <div className="grid gap-3 lg:grid-cols-4">
        {enterpriseRisks.map((risk) => (
          <article key={risk.id} className={selectedRisk === risk.id ? 'rounded-lg border border-gold-500/40 bg-gold-500/10 p-4' : 'rounded-lg border border-white/10 bg-white/[0.045] p-4'}>
            <div className="flex items-center gap-2 font-semibold text-white"><Gauge className="size-4 text-gold-200" />{risk.risk}</div>
            <div className="mt-4 text-2xl font-semibold text-white">{risk.score}</div>
            <div className="mt-3"><TrustScoreBar value={risk.score} /></div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{risk.mitigation}</p>
            <p className="mt-3 text-xs text-gold-100">{risk.monitoring}</p>
            <Button className="mt-4 w-full" variant="subtle" size="sm" onClick={() => inspectRisk(risk.id)}>Inspect risk</Button>
          </article>
        ))}
      </div>
    </TrustPanel>
  );
}
