'use client';

import { Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePublicBetaActions } from '@/hooks/use-public-beta-actions';
import { gtmReadinessGates } from '@/lib/public-beta';
import { usePublicBetaStore } from '@/stores/public-beta-store';
import { BetaPanel } from './public-beta-panel';

export function GoToMarketReadinessCenter() {
  const selectedGate = usePublicBetaStore((state) => state.selectedGate);
  const { inspectGate } = usePublicBetaActions();

  return (
    <BetaPanel title="Go-To-Market Readiness Center" description="Product positioning, messaging, customer journey, pricing readiness and trial experience are validated before public beta expansion." badge="Product positioning">
      <div className="grid gap-3 lg:grid-cols-5">
        {gtmReadinessGates.map((gate) => (
          <article key={gate.id} className={selectedGate === gate.id ? 'rounded-lg border border-gold-500/40 bg-gold-500/10 p-4' : 'rounded-lg border border-white/10 bg-white/[0.045] p-4'}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><Rocket className="size-4 text-gold-200" />{gate.gate}</div>
              <Badge variant={gate.status === 'ready' ? 'success' : 'warning'}>{gate.status}</Badge>
            </div>
            <p className="mt-3 text-xs text-primary-100">{gate.owner}</p>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{gate.evidence}</p>
            <Button className="mt-4 w-full" variant="subtle" size="sm" onClick={() => inspectGate(gate.id)}>Inspect gate</Button>
          </article>
        ))}
      </div>
    </BetaPanel>
  );
}
