'use client';

import { BriefcaseBusiness } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { enterpriseAccounts } from '@/lib/growth-program';
import { GrowthPanel, GrowthStatusBadge } from './growth-program-panel';

export function EnterpriseAccountManagement() {
  return (
    <GrowthPanel title="Enterprise Account Management" description="Strategic Accounts, Renewal Tracking, Executive Relationships and Growth Plans for post-launch enterprise expansion." badge="Strategic Accounts">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {enterpriseAccounts.map((account) => (
          <article key={account.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <BriefcaseBusiness className="size-5 text-gold-200" />
              <GrowthStatusBadge status={account.status} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{account.account}</h3>
            <Badge className="mt-3">{account.renewal}</Badge>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{account.executiveRelationship}</p>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{account.growthPlan}</p>
          </article>
        ))}
      </div>
    </GrowthPanel>
  );
}
