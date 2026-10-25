
'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BadgeDollarSign, BarChart3, BriefcaseBusiness, CalendarClock, CheckCircle2, FileCheck2, FileText, HandCoins, HeartPulse, LineChart, RefreshCw, Repeat2, Search, ShieldCheck, Sparkles, TrendingUp, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { revenueOperationsApiGroups, revenueOperationsCapabilities } from '@/services/revenue-operations-api';

const contractRows = [
  { contract: 'ACME-ENT-2026', account: 'Acme Global', value: '$420K', status: 'Active' },
  { contract: 'NOVA-GROWTH-88', account: 'Nova Retail', value: '$96K', status: 'Renewal' },
  { contract: 'HELIOS-MFG-44', account: 'Helios Works', value: '$260K', status: 'Review' },
];

const renewalRows = [
  { account: 'Acme Global', date: 'Aug 14', amount: '$420K', risk: 'Low' },
  { account: 'Nova Retail', date: 'Jul 02', amount: '$96K', risk: 'High' },
  { account: 'Helios Works', date: 'Sep 19', amount: '$260K', risk: 'Medium' },
];

const churnRows = [
  { signal: 'Usage decline', account: 'Nova Retail', severity: 'High', owner: 'CS Lead' },
  { signal: 'Executive sponsor change', account: 'Helios Works', severity: 'Medium', owner: 'AE' },
  { signal: 'Support escalation', account: 'Acme Global', severity: 'Low', owner: 'CSM' },
];

const expansionRows = [
  { opportunity: 'Analytics add-on', account: 'Acme Global', value: '$88K', stage: 'Qualified' },
  { opportunity: 'Inventory rollout', account: 'Nova Retail', value: '$42K', stage: 'Open' },
  { opportunity: 'Finance seats', account: 'Helios Works', value: '$61K', stage: 'Review' },
];

const centerItems = [
  { label: 'Revenue Operations Dashboard', detail: 'Accounts, contracts, renewals, expansion, health, churn and forecast state.', icon: <BriefcaseBusiness className="size-4" /> },
  { label: 'Contract Management Workspace', detail: 'Contract values, terms, amendments, renewal dates and governed contract events.', icon: <FileCheck2 className="size-4" /> },
  { label: 'Renewal Center', detail: 'Schedules, forecasts, notice windows, playbooks and owner-driven renewal execution.', icon: <Repeat2 className="size-4" /> },
  { label: 'Revenue Forecast Dashboard', detail: 'Committed, upside, downside, probability and model-versioned forecast views.', icon: <LineChart className="size-4" /> },
];

export function RevenueOperationsWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Revenue Operations, Contracts & Renewal Intelligence</h1>
            <Badge>Phase 40</Badge>
            <Badge className="bg-white/80">Revenue Intelligence</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Contract lifecycle, renewal planning, churn prevention, expansion opportunities, account health, revenue events and executive revenue forecasting.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search revenue operations"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh revenue signals"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Generate revenue recommendations"><Sparkles className="size-4" />Analyze</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<BadgeDollarSign className="size-5" />} label="Revenue Accounts" value="842" detail="active managed accounts" tone="primary" />
        <SignalCard icon={<FileText className="size-5" />} label="Contract Value" value="$18.4M" detail="active TCV" tone="green" />
        <SignalCard icon={<CalendarClock className="size-5" />} label="Renewals" value="$3.2M" detail="next 90 days" tone="amber" />
        <SignalCard icon={<AlertTriangle className="size-5" />} label="Revenue Risk" value="$640K" detail="open at-risk value" tone="red" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<FileCheck2 className="size-4" />} title="Contract Management Workspace"><DataTable rows={contractRows} columns={['contract', 'account', 'value', 'status']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Repeat2 className="size-4" />} title="Renewal Center"><DataTable rows={renewalRows} columns={['account', 'date', 'amount', 'risk']} /></DataPanel>
            <DataPanel icon={<TrendingUp className="size-4" />} title="Expansion Opportunity Engine"><DataTable rows={expansionRows} columns={['opportunity', 'account', 'value', 'stage']} /></DataPanel>
          </div>
          <DataPanel icon={<HeartPulse className="size-4" />} title="Churn Intelligence Dashboard"><DataTable rows={churnRows} columns={['signal', 'account', 'severity', 'owner']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<ShieldCheck className="size-4" />} title="Revenue Operations Center">
            <div className="grid gap-2">{centerItems.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<BarChart3 className="size-4" />} title="Account Health Monitoring">
            <ActionRow icon={<UsersRound className="size-4" />} label="Account health scores" detail="Tenant-scoped revenue account scores with score bands, trend and recommendations." />
            <ActionRow icon={<AlertTriangle className="size-4" />} label="Churn signal capture" detail="Usage, sponsor, service and commercial signals feed churn prevention workflows." />
            <ActionRow icon={<HandCoins className="size-4" />} label="Expansion intelligence" detail="Upsell, cross-sell and expansion opportunities attach to revenue accounts." />
            <ActionRow icon={<LineChart className="size-4" />} label="Forecast intelligence" detail="Committed, upside and downside forecasts support executive planning." />
          </DataPanel>
          <DataPanel icon={<CheckCircle2 className="size-4" />} title="API Surface">
            <div className="grid gap-2">{revenueOperationsApiGroups.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped revenue operations API" />)}</div>
          </DataPanel>
          <DataPanel icon={<Sparkles className="size-4" />} title="Capabilities">
            <div className="grid gap-2">{revenueOperationsCapabilities.map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Enterprise revenue execution foundation" />)}</div>
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
