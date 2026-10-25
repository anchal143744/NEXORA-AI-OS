'use client';

import { AlertTriangle, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { currency } from '@/lib/crm-workspace';
import { useCrmWorkspaceStore } from '@/stores/crm-workspace-store';

export function OpportunityManagement() {
  const opportunities = useCrmWorkspaceStore((state) => state.opportunities);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Opportunity Management</CardTitle>
        <CardDescription>Stage tracking, risk visibility, close plans and revenue movement.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {opportunities.length === 0 ? (
          <EmptyState icon={Target} title="No opportunities yet" description="Create opportunities to track probability, expected revenue, close dates, owners and next steps." />
        ) : null}
        {opportunities.map((opportunity) => (
          <article key={opportunity.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Target className="size-4 text-gold-200" />
                <div className="font-semibold text-white">{opportunity.title}</div>
                <Badge variant="neutral">{opportunity.stage.replace('_', ' ')}</Badge>
              </div>
              <div className="mt-1 text-sm text-graphite-300">{opportunity.accountName} - {opportunity.owner}</div>
              <div className="mt-2 text-xs text-graphite-400">Next step: {opportunity.nextStep}</div>
            </div>
            <div className="text-sm text-graphite-300">
              <div className="font-semibold text-white">{currency(opportunity.value)}</div>
              <div>{opportunity.probability}% probability</div>
            </div>
            <Badge variant={opportunity.risk === 'high' ? 'warning' : opportunity.risk === 'medium' ? 'info' : 'success'}><AlertTriangle className="size-3" />{opportunity.risk} risk</Badge>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
