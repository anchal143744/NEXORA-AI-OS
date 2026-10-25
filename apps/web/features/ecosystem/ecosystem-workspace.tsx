'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BadgeCheck, BookOpenText, Boxes, CheckCircle2, CloudDownload, Code2, FileCheck2, Globe2, Handshake, KeyRound, LibraryBig, MonitorCheck, PackageCheck, RefreshCw, Search, ShieldCheck, Sparkles, Store, TerminalSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ecosystemApiGroups, ecosystemCapabilities } from '@/services/ecosystem-api';

const trustRows = [
  { report: 'SOC2 Type II Trust Report', scope: 'Platform', visibility: 'Public', status: 'Published' },
  { report: 'GDPR Data Processing Pack', scope: 'Privacy', visibility: 'Gated', status: 'Published' },
  { report: 'AI Governance Evidence', scope: 'AI', visibility: 'Private', status: 'Review' },
];

const developerRows = [
  { app: 'Revenue Insights Connector', owner: 'Northstar Labs', type: 'Integration', status: 'Approved' },
  { app: 'Workflow Event Listener', owner: 'Atlas Systems', type: 'Webhook', status: 'Review' },
  { app: 'AI Context SDK', owner: 'Internal', type: 'SDK', status: 'Published' },
];

const marketplaceRows = [
  { listing: 'Stripe Revenue Sync', partner: 'Stripe', category: 'Finance', status: 'Available' },
  { listing: 'Slack Operations Bot', partner: 'Slack', category: 'Productivity', status: 'Available' },
  { listing: 'GitHub Delivery Lens', partner: 'GitHub', category: 'Engineering', status: 'Beta' },
];

const statusRows = [
  { component: 'API Gateway', uptime: '99.99%', incident: 'None', status: 'Operational' },
  { component: 'Developer Portal', uptime: '99.96%', incident: 'Resolved', status: 'Operational' },
  { component: 'Partner Webhooks', uptime: '99.91%', incident: 'Monitoring', status: 'Degraded' },
];

const centerItems = [
  { label: 'Trust Center Dashboard', detail: 'Customer-facing reports, certifications, artifacts and trust evidence controls.', icon: <ShieldCheck className="size-4" /> },
  { label: 'Developer Portal Workspace', detail: 'Developer accounts, applications, API docs, SDK packages and onboarding signals.', icon: <TerminalSquare className="size-4" /> },
  { label: 'Integration Marketplace', detail: 'External integrations, partner listings and marketplace applications.', icon: <Store className="size-4" /> },
  { label: 'Public Status Dashboard', detail: 'Incidents, affected components, public updates and ecosystem health signals.', icon: <MonitorCheck className="size-4" /> },
];

export function EcosystemWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Trust Center, Developer Portal & External Ecosystem</h1>
            <Badge>Phase 38</Badge>
            <Badge className="bg-white/80">External Ecosystem Experience</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Trust evidence, developer onboarding, API documentation, SDK distribution, partner marketplace, integration catalog and public status operations for enterprise platform ecosystems.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search ecosystem"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh ecosystem center"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Generate ecosystem recommendations"><Sparkles className="size-4" />Review</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<ShieldCheck className="size-5" />} label="Trust Artifacts" value="186" detail="customer-ready evidence" tone="primary" />
        <SignalCard icon={<Code2 className="size-5" />} label="Developer Apps" value="64" detail="registered applications" tone="green" />
        <SignalCard icon={<CloudDownload className="size-5" />} label="SDK Packages" value="28" detail="published downloads" tone="amber" />
        <SignalCard icon={<Activity className="size-5" />} label="Status Health" value="99.97%" detail="ecosystem uptime" tone="red" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<FileCheck2 className="size-4" />} title="Trust Center Dashboard"><DataTable rows={trustRows} columns={['report', 'scope', 'visibility', 'status']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<TerminalSquare className="size-4" />} title="Developer Portal Workspace"><DataTable rows={developerRows} columns={['app', 'owner', 'type', 'status']} /></DataPanel>
            <DataPanel icon={<Store className="size-4" />} title="Integration Marketplace"><DataTable rows={marketplaceRows} columns={['listing', 'partner', 'category', 'status']} /></DataPanel>
          </div>
          <DataPanel icon={<MonitorCheck className="size-4" />} title="Public Status Dashboard"><DataTable rows={statusRows} columns={['component', 'uptime', 'incident', 'status']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Globe2 className="size-4" />} title="External Ecosystem Center">
            <div className="grid gap-2">{centerItems.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<LibraryBig className="size-4" />} title="Developer Experience">
            <ActionRow icon={<BookOpenText className="size-4" />} label="API Documentation Hub" detail="OpenAPI specs, examples, versions, audiences and publication controls." />
            <ActionRow icon={<CloudDownload className="size-4" />} label="SDK Download Center" detail="SDK language packages, release notes, checksums and package managers." />
            <ActionRow icon={<KeyRound className="size-4" />} label="Developer applications" detail="Accounts, applications, scopes, redirect URIs and approval status." />
            <ActionRow icon={<Handshake className="size-4" />} label="Partner marketplace" detail="Partner listings, certification levels, applications and integration availability." />
          </DataPanel>
          <DataPanel icon={<CheckCircle2 className="size-4" />} title="API Surface">
            <div className="grid gap-2">{ecosystemApiGroups.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped ecosystem API" />)}</div>
          </DataPanel>
          <DataPanel icon={<Boxes className="size-4" />} title="Capabilities">
            <div className="grid gap-2">{ecosystemCapabilities.map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Enterprise external ecosystem foundation" />)}</div>
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
