'use client';

import { Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { aiSecurityChecks } from '@/lib/enterprise-trust';
import { TrustPanel } from './enterprise-trust-panel';

export function AiSecurityGovernanceValidation() {
  return (
    <TrustPanel title="AI Security & Governance Validation" description="AI Governance, Model Security, Prompt Security, Agent Permissions and Data Protection are validated before enterprise trust launch." badge="Prompt Security">
      <div className="grid gap-3 lg:grid-cols-5">
        {aiSecurityChecks.map((check) => (
          <article key={check.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><Bot className="size-4 text-gold-200" />{check.domain}</div>
              <Badge variant={check.status === 'ready' ? 'success' : 'warning'}>{check.status}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{check.validation}</p>
            <p className="mt-3 text-xs text-gold-100">{check.evidence}</p>
          </article>
        ))}
      </div>
    </TrustPanel>
  );
}
