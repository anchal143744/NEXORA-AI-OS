'use client';

import { FileCheck2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEnterpriseTrustActions } from '@/hooks/use-enterprise-trust-actions';
import { complianceControls } from '@/lib/enterprise-trust';
import { useEnterpriseTrustStore } from '@/stores/enterprise-trust-store';
import { TrustPanel } from './enterprise-trust-panel';

export function ComplianceManagement() {
  const selectedFramework = useEnterpriseTrustStore((state) => state.selectedFramework);
  const { inspectFramework } = useEnterpriseTrustActions();

  return (
    <TrustPanel title="Compliance Management" description="SOC 2, ISO 27001, GDPR, HIPAA and PCI DSS readiness controls, policies, audits and compliance status are tracked." badge="SOC 2">
      <div className="grid gap-3 lg:grid-cols-5">
        {complianceControls.map((control) => (
          <article key={control.id} className={selectedFramework === control.id ? 'rounded-lg border border-gold-500/40 bg-gold-500/10 p-4' : 'rounded-lg border border-white/10 bg-white/[0.045] p-4'}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><FileCheck2 className="size-4 text-gold-200" />{control.framework}</div>
              <Badge variant={control.status === 'ready' ? 'success' : 'warning'}>{control.status}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{control.control}</p>
            <p className="mt-3 text-xs text-gold-100">{control.evidence}</p>
            <Button className="mt-4 w-full" variant="subtle" size="sm" onClick={() => inspectFramework(control.id)}>Inspect control</Button>
          </article>
        ))}
      </div>
    </TrustPanel>
  );
}
