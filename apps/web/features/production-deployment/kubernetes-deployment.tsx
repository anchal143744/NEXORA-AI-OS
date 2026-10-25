'use client';

import { Boxes } from 'lucide-react';
import { kubernetesWorkloads } from '@/lib/production-deployment';
import { ProductionPanel } from './production-deployment-panel';

export function KubernetesDeployment() {
  return (
    <ProductionPanel title="Kubernetes Deployment" description="Kubernetes manifests cover API, web, workers, AI workers, PostgreSQL, Redis, ingress and HPA policies." badge="Kubernetes Workloads">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {kubernetesWorkloads.map((workload) => (
          <article key={workload.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><Boxes className="size-4 text-gold-200" />{workload.id}</div>
            <p className="mt-3 font-mono text-xs text-primary-100">{workload.manifest}</p>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{workload.replicas}</p>
            <p className="mt-2 text-xs text-gold-100">{workload.rollout}</p>
            <p className="mt-2 text-xs text-graphite-400">{workload.recovery}</p>
          </article>
        ))}
      </div>
    </ProductionPanel>
  );
}
