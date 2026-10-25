'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeDollarSign, BarChart3, Braces, CheckCircle2, FileJson2, Gauge, KeyRound, LineChart, LockKeyhole, Network, PackageCheck, RefreshCw, Search, ShieldCheck, Sparkles, Store, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { platformGovernanceApiGroups, platformGovernanceCapabilities } from '@/services/platform-governance-api';

const contractRows = [
  { contract: 'Customer Profile API', domain: 'CRM', version: 'v3.2', status: 'Published' },
  { contract: 'Invoice Ledger Feed', domain: 'Finance', version: 'v2.1', status: 'Review' },
  { contract: 'Workflow Event Stream', domain: 'Automation', version: 'v1.8', status: 'Published' },
];

const productRows = [
  { product: 'Partner CRM Data API', plan: 'Growth', visibility: 'Private', status: 'Active' },
  { product: 'Revenue Insights API', plan: 'Enterprise', visibility: 'Partner', status: 'Active' },
  { product: 'AI Context Retrieval API', plan: 'Metered', visibility: 'Private', status: 'Draft' },
];

const billingRows = [
  { account: 'Northstar Partner', usage: '1.8M', amount: '$9,420', status: 'Open' },
  { account: 'Atlas Integrator', usage: '870K', amount: '$4,110', status: 'Paid' },
  { account: 'Internal Automation', usage: '2.4M', amount: '$0', status: 'Internal' },
];

const governanceRows = [
  { policy: 'Schema compatibility', mode: 'Enforce', scope: 'Contracts', status: 'Active' },
  { policy: 'Partner quota protection', mode: 'Enforce', scope: 'API keys', status: 'Active' },
  { policy: 'External API billing audit', mode: 'Monitor', scope: 'Billing', status: 'Review' },
];

const centerItems = [
  { label: 'Data Contract Registry', detail: 'Versioned schema contracts, consumer impact, compatibility mode and quality rules.', icon: <FileJson2 className="size-4" /> },
  { label: 'API Monetization Engine', detail: 'Products, pricing plans, subscriptions, usage records, billing and quotas.', icon: <BadgeDollarSign className="size-4" /> },
  { label: 'Platform Governance Center', detail: 'Policies, enforcement modes, approvals, rate limits and access controls.', icon: <ShieldCheck className="size-4" /> },
  { label: 'Partner API Management', detail: 'Partner access grants, permissions, subscriptions and marketplace readiness.', icon: <UsersRound className="size-4" /> },
];

export function PlatformGovernanceWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Data Contracts, API Monetization & Platform Governance</h1>
            <Badge>Phase 37</Badge>
            <Badge className="bg-white/80">Platform Economy Control Plane</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Governed data contracts, API products, usage metering, billing, quotas, rate limits, partner access and marketplace-ready platform governance for enterprise ecosystems.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search platform governance"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh API governance"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Generate governance recommendations"><Sparkles className="size-4" />Review</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Braces className="size-5" />} label="Data Contracts" value="142" detail="versioned schemas" tone="primary" />
        <SignalCard icon={<Store className="size-5" />} label="API Products" value="38" detail="marketplace ready" tone="green" />
        <SignalCard icon={<Gauge className="size-5" />} label="Metered Calls" value="5.1M" detail="current cycle" tone="amber" />
        <SignalCard icon={<LockKeyhole className="size-5" />} label="Governed Keys" value="96%" detail="quota protected" tone="red" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<FileJson2 className="size-4" />} title="Data Contract Registry"><DataTable rows={contractRows} columns={['contract', 'domain', 'version', 'status']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<PackageCheck className="size-4" />} title="API Marketplace Dashboard"><DataTable rows={productRows} columns={['product', 'plan', 'visibility', 'status']} /></DataPanel>
            <DataPanel icon={<BadgeDollarSign className="size-4" />} title="Billing Management Dashboard"><DataTable rows={billingRows} columns={['account', 'usage', 'amount', 'status']} /></DataPanel>
          </div>
          <DataPanel icon={<ShieldCheck className="size-4" />} title="API Governance Center"><DataTable rows={governanceRows} columns={['policy', 'mode', 'scope', 'status']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Network className="size-4" />} title="Platform Governance Center">
            <div className="grid gap-2">{centerItems.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<BarChart3 className="size-4" />} title="Usage Analytics Workspace">
            <ActionRow icon={<LineChart className="size-4" />} label="Usage metering" detail="Records requests, latency, billable units, dimensions and partner consumption." />
            <ActionRow icon={<Gauge className="size-4" />} label="Quota and rate limit control" detail="Applies plan, product, key and partner limits across tenant-scoped APIs." />
            <ActionRow icon={<KeyRound className="size-4" />} label="API access governance" detail="Uses existing hashed API keys with rotation, revocation and scoped permissions." />
            <ActionRow icon={<BadgeDollarSign className="size-4" />} label="Billing intelligence" detail="Connects usage, subscriptions, plans, tax-ready billing and revenue analytics." />
          </DataPanel>
          <DataPanel icon={<CheckCircle2 className="size-4" />} title="API Surface">
            <div className="grid gap-2">{platformGovernanceApiGroups.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped platform governance API" />)}</div>
          </DataPanel>
          <DataPanel icon={<Sparkles className="size-4" />} title="Capabilities">
            <div className="grid gap-2">{platformGovernanceCapabilities.map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Enterprise platform governance foundation" />)}</div>
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
