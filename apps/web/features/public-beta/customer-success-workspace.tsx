'use client';

import { HeartPulse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { customerSuccessAccounts } from '@/lib/public-beta';
import { BetaPanel, BetaProgress } from './public-beta-panel';

export function CustomerSuccessWorkspace() {
  return (
    <BetaPanel title="Customer Success Workspace" description="Customer Health Scores, success plans, onboarding progress and risk detection help teams guide each beta account." badge="Customer Health Scores">
      <div className="grid gap-3 lg:grid-cols-4">
        {customerSuccessAccounts.map((account) => (
          <article key={account.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><HeartPulse className="size-4 text-gold-200" />{account.name}</div>
              <Badge variant={account.healthScore >= 80 ? 'success' : 'warning'}>{account.risk}</Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-graphite-400"><span>Health</span><span>{account.healthScore}%</span></div>
              <BetaProgress value={account.healthScore} />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-graphite-400"><span>Onboarding</span><span>{account.onboardingProgress}%</span></div>
              <BetaProgress value={account.onboardingProgress} />
            </div>
            <p className="mt-3 text-xs text-gold-100">{account.nextAction}</p>
          </article>
        ))}
      </div>
    </BetaPanel>
  );
}
