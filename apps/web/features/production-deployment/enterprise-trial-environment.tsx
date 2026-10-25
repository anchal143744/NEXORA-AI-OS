'use client';

import { Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { trialEnvironmentModules } from '@/lib/production-deployment';
import { ProductionPanel } from './production-deployment-panel';

export function EnterpriseTrialEnvironment() {
  return (
    <ProductionPanel title="Enterprise Trial Environment" description="Trial organizations, demo workspaces, sample data and guided setup prepare NEXORA for public beta onboarding." badge="Trial Organizations">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {trialEnvironmentModules.map((module) => (
          <article key={module} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><Building2 className="size-4 text-gold-200" />{module}</div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">Configured for tenant-scoped public beta onboarding with workspace blueprint replay and conversion handoff.</p>
            <Badge className="mt-3" variant="success">launch-ready</Badge>
          </article>
        ))}
      </div>
    </ProductionPanel>
  );
}
