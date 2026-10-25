'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeDollarSign, BarChart3, BriefcaseBusiness, CheckCircle2, CreditCard, FileText, HandCoins, Handshake, HeartHandshake, Layers3, LineChart, ReceiptText, RefreshCw, Search, ShieldCheck, Sparkles, UsersRound, WalletCards } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { customerPortalApiGroups, customerPortalCapabilities } from '@/services/customer-portal-api';

const customerRows = [
  { account: 'Northstar Group', plan: 'Enterprise', health: '91', status: 'Active' },
  { account: 'Atlas Systems', plan: 'Growth', health: '76', status: 'Active' },
  { account: 'Cedar Retail', plan: 'Standard', health: '48', status: 'Watch' },
];

const invoiceRows = [
  { invoice: 'INV-2026-1082', customer: 'Northstar Group', amount: '$14,200', status: 'Open' },
  { invoice: 'INV-2026-1081', customer: 'Atlas Systems', amount: '$6,480', status: 'Paid' },
  { invoice: 'INV-2026-1079', customer: 'Cedar Retail', amount: '$2,900', status: 'Overdue' },
];

const partnerRows = [
  { partner: 'Northwind Advisors', tier: 'Platinum', referrals: '18', status: 'Active' },
  { partner: 'Orbit Integrators', tier: 'Gold', referrals: '9', status: 'Active' },
  { partner: 'Summit Cloud', tier: 'Silver', referrals: '4', status: 'Review' },
];

const usageRows = [
  { metric: 'API calls', customer: 'Northstar Group', usage: '1.8M', trend: '+12%' },
  { metric: 'AI executions', customer: 'Atlas Systems', usage: '42K', trend: '+8%' },
  { metric: 'Workflow runs', customer: 'Cedar Retail', usage: '19K', trend: '-3%' },
];

const centerItems = [
  { label: 'Customer Portal Dashboard', detail: 'Accounts, customer workspaces, subscriptions, billing and account health.', icon: <UsersRound className="size-4" /> },
  { label: 'Subscription Management UI', detail: 'Plans, entitlements, billing cycles, renewals and cancellation metadata.', icon: <Layers3 className="size-4" /> },
  { label: 'Billing Dashboard', detail: 'Billing profiles, invoices, payment methods, due amounts and usage metrics.', icon: <WalletCards className="size-4" /> },
  { label: 'Partner Portal Workspace', detail: 'Partner accounts, workspaces, commissions, referrals and self-service controls.', icon: <Handshake className="size-4" /> },
];

export function CustomerPortalWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Customer Portal, Partner Self-Service & External Billing</h1>
            <Badge>Phase 39</Badge>
            <Badge className="bg-white/80">External Revenue Experience</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Customer-facing account workspaces, subscriptions, billing, invoices, payment methods, success plans, partner self-service, referrals, commissions and usage monitoring.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search customer portal"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh portal data"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Generate portal recommendations"><Sparkles className="size-4" />Review</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<BriefcaseBusiness className="size-5" />} label="Customer Accounts" value="1,284" detail="portal enabled" tone="primary" />
        <SignalCard icon={<ReceiptText className="size-5" />} label="Open Invoices" value="$248K" detail="amount due" tone="green" />
        <SignalCard icon={<LineChart className="size-5" />} label="Usage Events" value="8.6M" detail="current cycle" tone="amber" />
        <SignalCard icon={<HandCoins className="size-5" />} label="Partner Pipeline" value="$1.2M" detail="referred value" tone="red" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<UsersRound className="size-4" />} title="Customer Portal Dashboard"><DataTable rows={customerRows} columns={['account', 'plan', 'health', 'status']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<FileText className="size-4" />} title="Invoice Center"><DataTable rows={invoiceRows} columns={['invoice', 'customer', 'amount', 'status']} /></DataPanel>
            <DataPanel icon={<Handshake className="size-4" />} title="Partner Portal Workspace"><DataTable rows={partnerRows} columns={['partner', 'tier', 'referrals', 'status']} /></DataPanel>
          </div>
          <DataPanel icon={<BarChart3 className="size-4" />} title="Usage Monitoring Center"><DataTable rows={usageRows} columns={['metric', 'customer', 'usage', 'trend']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<ShieldCheck className="size-4" />} title="External Billing Experience">
            <div className="grid gap-2">{centerItems.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<HeartHandshake className="size-4" />} title="Customer Success Workspace">
            <ActionRow icon={<Layers3 className="size-4" />} label="Subscription center" detail="Customer subscriptions connect plans, billing profiles, entitlements and renewals." />
            <ActionRow icon={<CreditCard className="size-4" />} label="Payment method management" detail="Provider, type, default state, verification and billing detail records." />
            <ActionRow icon={<ReceiptText className="size-4" />} label="Invoice management" detail="External invoice records include tax, line items, payments and due tracking." />
            <ActionRow icon={<Handshake className="size-4" />} label="Partner self-service" detail="Partner accounts, workspaces, commissions and referral lifecycle tracking." />
          </DataPanel>
          <DataPanel icon={<CheckCircle2 className="size-4" />} title="API Surface">
            <div className="grid gap-2">{customerPortalApiGroups.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped external portal API" />)}</div>
          </DataPanel>
          <DataPanel icon={<Sparkles className="size-4" />} title="Capabilities">
            <div className="grid gap-2">{customerPortalCapabilities.map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Enterprise customer and partner experience foundation" />)}</div>
          </DataPanel>
        </aside>
      </div>
    </div>
  );
}

function SignalCard({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: 'primary' | 'green' | 'amber' | 'red' }) {
  const tones = { primary: 'border-primary-200 text-primary-950', green: 'border-emerald-200 text-emerald-950', amber: 'border-amber-200 text-amber-950', red: 'border-red-200 text-red-950' };
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('rounded-lg border bg-white/78 p-4 shadow-subtle backdrop-blur-shell', tones[tone])}><div className="flex items-center justify-between gap-3"><span>{icon}</span><span className="flex size-4 items-center justify-center rounded-full bg-current/10"><span className="size-1.5 rounded-full bg-current" /></span></div><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-sm font-medium">{label}</div><div className="mt-1 text-xs opacity-70">{detail}</div></motion.div>;
}

function DataPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="rounded-lg border border-neutral-200 bg-white/78 p-4 shadow-subtle backdrop-blur-shell"><div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-primary-950">{icon}<span>{title}</span></div><Button variant="icon" size="icon" title={'Open ' + title}><ArrowRight className="size-4" /></Button></div>{children}</section>;
}

function DataTable({ rows, columns }: { rows: Record<string, string>[]; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full table-fixed text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-medium">{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row[columns[0]] + '-' + index} className="border-t border-neutral-100">{columns.map((column) => <td key={column} className="truncate px-3 py-2 text-neutral-700">{row[column]}</td>)}</tr>)}</tbody></table></div>;
}

function ActionRow({ icon, label, detail }: { icon: ReactNode; label: string; detail: string }) {
  return <div className="flex min-w-0 items-start gap-3 rounded-md border border-neutral-200 bg-white/70 p-3"><span className="mt-0.5 text-primary-700">{icon}</span><div className="min-w-0"><div className="truncate text-sm font-medium text-neutral-950">{label}</div><div className="mt-0.5 text-xs leading-5 text-neutral-500">{detail}</div></div></div>;
}
