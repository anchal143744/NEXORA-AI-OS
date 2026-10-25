'use client';

import { ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEnterpriseTrustActions } from '@/hooks/use-enterprise-trust-actions';
import { securityFindings } from '@/lib/enterprise-trust';
import { useEnterpriseTrustStore } from '@/stores/enterprise-trust-store';
import { TrustPanel } from './enterprise-trust-panel';

export function SecurityAuditCenter() {
  const selectedFinding = useEnterpriseTrustStore((state) => state.selectedFinding);
  const { inspectFinding } = useEnterpriseTrustActions();

  return (
    <TrustPanel title="Security Audit Center" description="Security assessments, reviews, findings, remediation tracking and Security Score are visible for executives and security teams." badge="Security Score">
      <div className="grid gap-3 lg:grid-cols-4">
        {securityFindings.map((finding) => (
          <article key={finding.id} className={selectedFinding === finding.id ? 'rounded-lg border border-gold-500/40 bg-gold-500/10 p-4' : 'rounded-lg border border-white/10 bg-white/[0.045] p-4'}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><ClipboardCheck className="size-4 text-gold-200" />{finding.title}</div>
              <Badge variant={finding.severity === 'high' || finding.severity === 'critical' ? 'warning' : 'neutral'}>{finding.severity}</Badge>
            </div>
            <p className="mt-3 text-xs text-primary-100">{finding.owner} - {finding.status}</p>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{finding.remediation}</p>
            <Button className="mt-4 w-full" variant="subtle" size="sm" onClick={() => inspectFinding(finding.id)}>Inspect finding</Button>
          </article>
        ))}
      </div>
    </TrustPanel>
  );
}
