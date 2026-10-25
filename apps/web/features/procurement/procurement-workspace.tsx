
'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BadgeDollarSign, BarChart3, BriefcaseBusiness, CheckCircle2, ClipboardCheck, FileCheck2, HandCoins, LineChart, PackageCheck, RefreshCw, Search, ShieldCheck, Sparkles, Tags, TrendingDown, Truck, WalletCards } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { procurementApiGroups, procurementCapabilities } from '@/services/procurement-api';

const vendorRows = [
  { vendor: 'Aster Cloud', category: 'Infrastructure', score: '92', risk: 'Low' },
  { vendor: 'Northwind Logistics', category: 'Logistics', score: '78', risk: 'Medium' },
  { vendor: 'Cobalt Talent', category: 'Services', score: '64', risk: 'Watch' },
];

const requestRows = [
  { request: 'REQ-2026-884', owner: 'Operations', amount: '$48K', status: 'Approval' },
  { request: 'REQ-2026-879', owner: 'Finance', amount: '$19K', status: 'Draft' },
  { request: 'REQ-2026-872', owner: 'IT', amount: '$82K', status: 'Submitted' },
];

const spendRows = [
  { category: 'Infrastructure', spend: '$1.8M', variance: '-7%', signal: 'Optimized' },
  { category: 'Services', spend: '$640K', variance: '+12%', signal: 'Review' },
  { category: 'Logistics', spend: '$420K', variance: '+4%', signal: 'Stable' },
];

const optimizationRows = [
  { action: 'Consolidate SaaS seats', impact: '$74K', effort: 'Medium', priority: 'High' },
  { action: 'Renegotiate logistics SLA', impact: '$38K', effort: 'Low', priority: 'Medium' },
  { action: 'Shift cloud tier', impact: '$112K', effort: 'High', priority: 'High' },
];

const centerItems = [
  { label: 'Procurement Dashboard', detail: 'Requests, approvals, purchase orders, categories, events and active workflow state.', icon: <ClipboardCheck className="size-4" /> },
  { label: 'Vendor Management Workspace', detail: 'Vendor profiles, contracts, scorecards, risk bands and performance signals.', icon: <Truck className="size-4" /> },
  { label: 'Spend Intelligence Dashboard', detail: 'Spend transactions, insights, category variance and budget impact.', icon: <LineChart className="size-4" /> },
  { label: 'Cost Optimization Workspace', detail: 'Savings recommendations with evidence, priority, effort and estimated impact.', icon: <TrendingDown className="size-4" /> },
];

export function ProcurementWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Procurement, Vendor Management & Spend Intelligence</h1>
            <Badge>Phase 41</Badge>
            <Badge className="bg-white/80">Procurement Intelligence</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Vendor lifecycle, purchase requests, approvals, purchase orders, budgets, spend intelligence and cost optimization in one tenant-aware operating layer.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search procurement"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh procurement signals"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Generate spend recommendations"><Sparkles className="size-4" />Optimize</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Truck className="size-5" />} label="Managed Vendors" value="612" detail="active suppliers" tone="primary" />
        <SignalCard icon={<ClipboardCheck className="size-5" />} label="Open Requests" value="148" detail="approval workflow" tone="green" />
        <SignalCard icon={<WalletCards className="size-5" />} label="Budget Exposure" value="$4.7M" detail="active allocations" tone="amber" />
        <SignalCard icon={<TrendingDown className="size-5" />} label="Savings Pipeline" value="$820K" detail="optimization impact" tone="red" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Truck className="size-4" />} title="Vendor Management Workspace"><DataTable rows={vendorRows} columns={['vendor', 'category', 'score', 'risk']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<ClipboardCheck className="size-4" />} title="Purchase Request System"><DataTable rows={requestRows} columns={['request', 'owner', 'amount', 'status']} /></DataPanel>
            <DataPanel icon={<BarChart3 className="size-4" />} title="Spend Intelligence Dashboard"><DataTable rows={spendRows} columns={['category', 'spend', 'variance', 'signal']} /></DataPanel>
          </div>
          <DataPanel icon={<TrendingDown className="size-4" />} title="Cost Optimization Workspace"><DataTable rows={optimizationRows} columns={['action', 'impact', 'effort', 'priority']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<ShieldCheck className="size-4" />} title="Procurement Center">
            <div className="grid gap-2">{centerItems.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<BadgeDollarSign className="size-4" />} title="Budget Control Dashboard">
            <ActionRow icon={<Tags className="size-4" />} label="Purchase categories" detail="Category budgets, spend policies and approval policies drive adaptive controls." />
            <ActionRow icon={<PackageCheck className="size-4" />} label="Purchase orders" detail="POs connect requests, vendors, categories, line items and spend transactions." />
            <ActionRow icon={<AlertTriangle className="size-4" />} label="Spend insights" detail="Variance, concentration and risk findings feed budget owners and workflows." />
            <ActionRow icon={<HandCoins className="size-4" />} label="Savings recommendations" detail="Optimization actions include estimated savings, confidence, evidence and effort." />
          </DataPanel>
          <DataPanel icon={<CheckCircle2 className="size-4" />} title="API Surface">
            <div className="grid gap-2">{procurementApiGroups.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped procurement API" />)}</div>
          </DataPanel>
          <DataPanel icon={<Sparkles className="size-4" />} title="Capabilities">
            <div className="grid gap-2">{procurementCapabilities.map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Enterprise procurement intelligence foundation" />)}</div>
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
