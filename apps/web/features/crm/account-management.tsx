'use client';

import { Building2, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { currency } from '@/lib/crm-workspace';
import { useCrmWorkspaceStore } from '@/stores/crm-workspace-store';

export function AccountManagement() {
  const accounts = useCrmWorkspaceStore((state) => state.accounts);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Management</CardTitle>
        <CardDescription>Company profiles, customer health and revenue tracking in one account view.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-3">
        {accounts.length === 0 ? (
          <EmptyState className="xl:col-span-3" icon={Building2} title="No accounts yet" description="Company account profiles are generated from customer and opportunity records in the CRM database." />
        ) : null}
        {accounts.map((account) => (
          <article key={account.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Building2 className="mb-3 size-5 text-gold-200" />
                <div className="text-base font-semibold text-white">{account.name}</div>
                <div className="mt-1 text-sm text-graphite-300">{account.industry} - {account.region}</div>
              </div>
              <Badge variant={account.health > 85 ? 'success' : 'warning'}>{account.health} health</Badge>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-graphite-300">
              <div className="flex items-center justify-between"><span>Revenue</span><strong className="text-white">{currency(account.revenue)}</strong></div>
              <div className="flex items-center justify-between"><span>Open pipeline</span><strong className="text-white">{currency(account.openPipeline)}</strong></div>
              <div className="flex items-center justify-between"><span>Owner</span><strong className="text-white">{account.owner}</strong></div>
            </div>
            <div className="mt-4 rounded-md border border-white/10 bg-graphite-950/60 p-3 text-xs leading-5 text-graphite-300">
              <TrendingUp className="mr-1 inline size-3 text-gold-200" />{account.risk}
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
