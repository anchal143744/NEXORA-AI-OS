'use client';

import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProductionDeploymentActions } from '@/hooks/use-production-deployment-actions';
import { productionEnvironments } from '@/lib/production-deployment';
import { useProductionDeploymentStore } from '@/stores/production-deployment-store';
import { ProductionPanel } from './production-deployment-panel';

export function MultiEnvironmentManagement() {
  const activeEnvironment = useProductionDeploymentStore((state) => state.activeEnvironment);
  const { inspectEnvironment } = useProductionDeploymentActions();

  return (
    <ProductionPanel title="Multi-Environment Management" description="Environment isolation, configuration, secret management and deployment controls for development, staging and production." badge="Environment Isolation">
      <div className="grid gap-3 lg:grid-cols-3">
        {productionEnvironments.map((environment) => (
          <article key={environment.id} className={activeEnvironment === environment.id ? 'rounded-lg border border-gold-500/40 bg-gold-500/10 p-4' : 'rounded-lg border border-white/10 bg-white/[0.045] p-4'}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><ShieldCheck className="size-4 text-gold-200" />{environment.label}</div>
              <Badge variant={environment.state === 'ready' ? 'success' : 'warning'}>{environment.state}</Badge>
            </div>
            <dl className="mt-4 space-y-3 text-xs text-graphite-300">
              <div><dt className="text-graphite-500">Isolation</dt><dd>{environment.isolation}</dd></div>
              <div><dt className="text-graphite-500">Config</dt><dd>{environment.configSource}</dd></div>
              <div><dt className="text-graphite-500">Secrets</dt><dd>{environment.secretSource}</dd></div>
              <div><dt className="text-graphite-500">Policy</dt><dd>{environment.deploymentPolicy}</dd></div>
            </dl>
            <Button className="mt-4 w-full" variant="subtle" size="sm" onClick={() => inspectEnvironment(environment.id)}>Inspect environment</Button>
          </article>
        ))}
      </div>
    </ProductionPanel>
  );
}
