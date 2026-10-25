'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useCrmWorkspaceQuery } from '@/hooks/use-crm-workspace-actions';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export function CrmDataBoundary({ children }: { children: ReactNode }) {
  const crmQuery = useCrmWorkspaceQuery();

  return (
    <EnterpriseShell>
      <div className="space-y-5">
        {crmQuery.isPending ? <CrmRouteLoading /> : null}
        {crmQuery.isError ? (
          <ErrorState
            title="CRM data could not load"
            description="NEXORA could not reach the CRM API for this workspace. Check the API connection and retry."
            action={<Button onClick={() => void crmQuery.refetch()}>Retry CRM sync</Button>}
          />
        ) : null}
        {!crmQuery.isPending && !crmQuery.isError ? children : null}
      </div>
    </EnterpriseShell>
  );
}

function CrmRouteLoading() {
  return (
    <div className="space-y-4" aria-label="Loading CRM route">
      <Skeleton className="h-40" />
      <Skeleton className="h-72" />
    </div>
  );
}
