'use client';

import { Download, FileText, Search, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useInvoiceActions } from '@/hooks/use-finance-workspace-actions';
import { currency } from '@/lib/finance-workspace';
import { useFinanceWorkspaceStore } from '@/stores/finance-workspace-store';
import type { InvoiceStatus } from '@/types/finance-workspace';

const statuses: Array<InvoiceStatus | 'all'> = ['all', 'draft', 'sent', 'issued', 'overdue', 'paid', 'partially_paid', 'cancelled', 'refunded'];

export function InvoicesWorkspace() {
  const invoices = useFinanceWorkspaceStore((state) => state.invoices);
  const query = useFinanceWorkspaceStore((state) => state.searchQuery);
  const setQuery = useFinanceWorkspaceStore((state) => state.setSearchQuery);
  const filter = useFinanceWorkspaceStore((state) => state.invoiceStatusFilter);
  const setFilter = useFinanceWorkspaceStore((state) => state.setInvoiceStatusFilter);
  const actions = useInvoiceActions();
  const visible = invoices.filter((invoice) => (filter === 'all' || invoice.status === filter) && (invoice.customerName.toLowerCase().includes(query.toLowerCase()) || invoice.invoiceNumber.toLowerCase().includes(query.toLowerCase())));
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Badge><FileText className="size-3" />Invoices Workspace</Badge>
          <CardTitle className="mt-2">Invoice creation, tracking, due dates and PDF generation.</CardTitle>
          <CardDescription>Keep invoice operations visible without exposing accounting complexity.</CardDescription>
        </div>
        <Button size="sm" disabled title="Invoice creation is not exposed in the V1 frontend yet">
          <FileText className="size-4" />
          Create invoice
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-graphite-500" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search invoices or customers" className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button key={status} className={'rounded-md border px-3 py-2 text-xs capitalize transition ' + (filter === status ? 'border-gold-500/45 bg-gold-500/15 text-gold-100' : 'border-white/10 bg-white/[0.05] text-graphite-300 hover:text-white')} onClick={() => setFilter(status)}>
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {visible.map((invoice) => (
            <article key={invoice.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div>
                <div className="font-semibold text-white">{invoice.invoiceNumber}</div>
                <div className="mt-1 text-sm text-graphite-300">{invoice.customerName} - due {invoice.dueDate}</div>
                <div className="mt-2 text-xs text-graphite-500">Owner: {invoice.owner} - PDF: {invoice.pdfStatus.replace('_', ' ')}</div>
              </div>
              <div className="text-base font-semibold text-white">
                {currency(invoice.amount, invoice.currency)}
                {invoice.amountDue !== undefined ? <div className="mt-1 text-xs text-graphite-300">Outstanding: {invoice.currency} {invoice.amountDue}</div> : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'warning' : 'neutral'}>{invoice.status.replace('_', ' ')}</Badge>
                {['issued', 'sent', 'overdue', 'partially_paid'].includes(invoice.status) ? <Button size="sm" variant="outline" disabled={actions.markPaid.isPending} onClick={() => actions.markPaid.mutate(invoice)}><ShieldCheck className="size-4" />Record full payment</Button> : null}
                <Button size="sm" variant="ghost" disabled title="Invoice PDF export is not exposed by the V1 Finance API yet">
                  <Download className="size-4" />
                  PDF unavailable
                </Button>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
