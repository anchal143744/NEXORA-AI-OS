'use client';

import { Calculator, Download, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useProposalActions } from '@/hooks/use-crm-workspace-actions';
import { currency } from '@/lib/crm-workspace';
import { useCrmWorkspaceStore } from '@/stores/crm-workspace-store';

export function QuoteProposalWorkspace() {
  const proposals = useCrmWorkspaceStore((state) => state.proposals);
  const actions = useProposalActions();
  return (
    <Card>
      <CardHeader>
        <Badge><Calculator className="size-3" />Quote and Proposal Workspace</Badge>
        <CardTitle className="mt-2">Builder, pricing calculator, approval workflow and PDF export.</CardTitle>
        <CardDescription>Commercial packages are calculated, approval-aware and ready for proposal export.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-2">
        {proposals.length === 0 ? (
          <EmptyState className="xl:col-span-2" icon={Calculator} title="No active proposals" description="Move an opportunity into Proposal or Negotiation to generate a live proposal package from CRM data." />
        ) : null}
        {proposals.map((proposal) => (
          <article key={proposal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-base font-semibold text-white">{proposal.title}</div>
                <div className="mt-1 text-sm text-graphite-300">{proposal.accountName}</div>
              </div>
              <Badge variant={proposal.approvalStatus === 'approved' ? 'success' : proposal.approvalStatus === 'review' ? 'warning' : 'neutral'}>{proposal.approvalStatus}</Badge>
            </div>
            <div className="mt-4 space-y-2">
              {proposal.lineItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md bg-white/[0.04] px-3 py-2 text-sm text-graphite-300">
                  <span>{item.label} x {item.quantity}</span>
                  <span className="text-white">{currency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 text-sm text-graphite-300">
              <div className="flex justify-between"><span>Subtotal</span><span>{currency(proposal.subtotal)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-{currency(proposal.discount)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{currency(proposal.tax)}</span></div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-base font-semibold text-white"><span>Total</span><span>{currency(proposal.total)}</span></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => actions.requestApproval.mutate(proposal)}><ShieldCheck className="size-4" />Request approval</Button>
              <Button size="sm" onClick={() => actions.exportPdf.mutate(proposal.id)}><Download className="size-4" />Export PDF</Button>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
