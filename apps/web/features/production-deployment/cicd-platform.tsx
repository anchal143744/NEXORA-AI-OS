'use client';

import { GitPullRequestArrow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cicdPipelines } from '@/lib/production-deployment';
import { ProductionPanel } from './production-deployment-panel';

export function CidcPlatform() {
  return (
    <ProductionPanel title="CI/CD Platform" description="Automated build, validation, approval and release pipelines are defined across GitHub Actions, Azure DevOps and GitLab CI." badge="Release Pipeline">
      <div className="grid gap-3 lg:grid-cols-3">
        {cicdPipelines.map((pipeline) => (
          <article key={pipeline.provider} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><GitPullRequestArrow className="size-4 text-gold-200" />{pipeline.provider}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {pipeline.stages.map((stage) => <Badge key={stage} variant="neutral">{stage}</Badge>)}
            </div>
            <p className="mt-4 text-sm leading-6 text-graphite-300">{pipeline.approvalGate}</p>
            <p className="mt-3 text-xs text-gold-100">{pipeline.rollbackMode}</p>
            <p className="mt-2 text-xs text-graphite-400">{pipeline.artifactPolicy}</p>
          </article>
        ))}
      </div>
    </ProductionPanel>
  );
}
