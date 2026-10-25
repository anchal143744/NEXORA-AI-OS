'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BadgeCheck, Blocks, Building2, CheckCircle2, Factory, Gauge, GraduationCap, Handshake, HeartPulse, KeyRound, Layers3, Package, Plug, RefreshCw, Search, ServerCog, ShieldCheck, ShoppingBag, Sparkles, Store, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const catalogApps = [
  { name: 'Revenue Intelligence Pack', category: 'Analytics', version: '2.4.1', status: 'Published', installs: '418', risk: 'Low', permissions: 'KPI read, insight write' },
  { name: 'Slack Operations Bridge', category: 'Collaboration', version: '1.8.0', status: 'Review', installs: '126', risk: 'Medium', permissions: 'Notification send' },
  { name: 'Stripe Billing Sync', category: 'Finance', version: '3.1.2', status: 'Published', installs: '302', risk: 'High', permissions: 'Invoice read, payment write' },
  { name: 'AI Meeting Scheduler', category: 'Productivity', version: '1.2.3', status: 'Private', installs: '44', risk: 'Medium', permissions: 'Task create, calendar action' },
];

const installations = [
  { app: 'Revenue Intelligence Pack', scope: 'Workspace', workspace: 'Executive OS', health: 'Healthy', version: '2.4.1' },
  { app: 'Stripe Billing Sync', scope: 'Business', workspace: 'Retail Ops', health: 'Watching', version: '3.1.2' },
  { app: 'Slack Operations Bridge', scope: 'Tenant', workspace: 'Global', health: 'Healthy', version: '1.8.0' },
];

const hooks = [
  { key: 'invoice-paid-sync', type: 'Event', target: 'invoice.paid', priority: '20', state: 'Enabled' },
  { key: 'workflow-node-library', type: 'Workflow', target: 'workflow.node-library', priority: '40', state: 'Enabled' },
  { key: 'sidebar-extension', type: 'UI', target: 'shell.sidebar', priority: '60', state: 'Enabled' },
  { key: 'api-policy-check', type: 'API', target: 'record.detail.actions', priority: '80', state: 'Review' },
];

const partners = [
  { name: 'Nexora Solutions Group', type: 'System integrator', tier: 'Platinum', certifications: 'SOC2, AI Safety', services: 'Implementation' },
  { name: 'CloudLedger Partners', type: 'Technology', tier: 'Gold', certifications: 'Finance Apps', services: 'Connector build' },
  { name: 'OpsCraft Advisory', type: 'Consulting', tier: 'Registered', certifications: 'Workflow Automation', services: 'Process design' },
];

const templates = [
  { name: 'Healthcare', icon: <HeartPulse className="size-4" />, modules: 'CRM, HR, Finance, Documents', compliance: 'HIPAA, SOC2', status: 'Ready' },
  { name: 'Education', icon: <GraduationCap className="size-4" />, modules: 'CRM, Projects, HR', compliance: 'GDPR, FERPA-ready', status: 'Ready' },
  { name: 'Manufacturing', icon: <Factory className="size-4" />, modules: 'Inventory, Projects, Finance', compliance: 'ISO27001', status: 'Ready' },
  { name: 'Retail', icon: <ShoppingBag className="size-4" />, modules: 'Inventory, CRM, Finance', compliance: 'PCI-ready, CCPA', status: 'Ready' },
  { name: 'Professional Services', icon: <Building2 className="size-4" />, modules: 'CRM, Projects, Finance', compliance: 'SOC2, GDPR', status: 'Ready' },
];

const apiGroups = [
  { label: '/v1/marketplace', detail: 'Catalog, versions, permissions, installs' },
  { label: '/v1/extensions', detail: 'SDK, hooks, UI and API extension points' },
  { label: '/v1/partners', detail: 'Profiles, certifications, service listings' },
  { label: '/v1/industry-templates', detail: 'Template packs and workspace installation' },
];

export function MarketplaceAdminWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Marketplace & Partner Ecosystem</h1>
            <Badge>Phase 21</Badge>
            <Badge className="bg-white/80">Extension Platform</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Operate app catalog governance, installations, extension contracts, partner certifications and industry template packs from a tenant-aware ecosystem console.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search apps, partners and templates"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh ecosystem state"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Publish marketplace app"><Sparkles className="size-4" />Publish App</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Store className="size-5" />} label="Catalog Apps" value="4" detail="3 governed categories" tone="primary" />
        <SignalCard icon={<Package className="size-5" />} label="Installations" value="870" detail="workspace scoped" tone="green" />
        <SignalCard icon={<Plug className="size-5" />} label="Extension Hooks" value="24" detail="event, workflow, UI, API" tone="amber" />
        <SignalCard icon={<Handshake className="size-5" />} label="Partners" value="3" detail="certified ecosystem" tone="violet" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Store className="size-4" />} title="App Catalog Governance">
            <div className="grid gap-3 lg:grid-cols-2">
              {catalogApps.map((app) => <AppCard key={app.name} app={app} />)}
            </div>
          </DataPanel>

          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Package className="size-4" />} title="App Installations"><DataTable rows={installations} columns={['app', 'scope', 'workspace', 'health', 'version']} /></DataPanel>
            <DataPanel icon={<Plug className="size-4" />} title="Extension Hooks"><DataTable rows={hooks} columns={['key', 'type', 'target', 'priority', 'state']} /></DataPanel>
          </div>

          <DataPanel icon={<Handshake className="size-4" />} title="Partner Ecosystem">
            <div className="grid gap-3 2xl:grid-cols-3">
              {partners.map((partner) => <PartnerCard key={partner.name} partner={partner} />)}
            </div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Blocks className="size-4" />} title="Extension Framework">
            <div className="grid gap-2">
              <ActionRow icon={<Workflow className="size-4" />} title="Event hooks" detail="Subscribe to domain events with filters and retries" />
              <ActionRow icon={<Layers3 className="size-4" />} title="Workflow hooks" detail="Add workflow builder nodes and runtime actions" />
              <ActionRow icon={<ServerCog className="size-4" />} title="API extension points" detail="Policy-aware route and action extensions" />
              <ActionRow icon={<KeyRound className="size-4" />} title="Permission scopes" detail="Least-privilege grants per installation" />
            </div>
          </DataPanel>

          <DataPanel icon={<ShieldCheck className="size-4" />} title="Industry Template Packs">
            <div className="grid gap-2">
              {templates.map((template) => <TemplateRow key={template.name} template={template} />)}
            </div>
          </DataPanel>

          <DataPanel icon={<Gauge className="size-4" />} title="API Surface">
            <div className="grid gap-2">
              {apiGroups.map((group) => <ActionRow key={group.label} icon={<CheckCircle2 className="size-4" />} title={group.label} detail={group.detail} />)}
            </div>
          </DataPanel>
        </aside>
      </div>
    </div>
  );
}

function SignalCard({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: 'primary' | 'green' | 'amber' | 'violet' }) {
  const tones = { primary: 'bg-primary-100/70 text-primary-950 border-primary-300/70', green: 'bg-emerald-50 text-emerald-800 border-emerald-200', amber: 'bg-amber-50 text-amber-800 border-amber-200', violet: 'bg-violet-50 text-violet-800 border-violet-200' };
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('rounded-lg border bg-white/78 p-4 shadow-subtle backdrop-blur-shell', tones[tone])}><div className="flex items-center justify-between gap-3"><span>{icon}</span><Activity className="size-4 opacity-60" /></div><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-sm font-medium">{label}</div><div className="mt-1 text-xs opacity-70">{detail}</div></motion.div>;
}

function DataPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="rounded-lg border border-neutral-200 bg-white/78 p-4 shadow-subtle backdrop-blur-shell"><div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-primary-950">{icon}<span>{title}</span></div><Button variant="icon" size="icon" title={`Open ${title}`}><ArrowRight className="size-4" /></Button></div>{children}</section>;
}

function AppCard({ app }: { app: { name: string; category: string; version: string; status: string; installs: string; risk: string; permissions: string } }) {
  return <div className="rounded-md border border-neutral-200 bg-white/84 p-3"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-semibold text-neutral-950">{app.name}</div><div className="mt-1 text-xs text-neutral-500">{app.category} · v{app.version}</div></div><StatusBadge value={app.status} /></div><div className="mt-3 grid grid-cols-3 gap-2 text-xs"><MiniMetric label="Installs" value={app.installs} /><MiniMetric label="Risk" value={app.risk} /><MiniMetric label="Scopes" value={app.permissions.split(',').length.toString()} /></div><div className="mt-3 rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-600">{app.permissions}</div></div>;
}

function PartnerCard({ partner }: { partner: { name: string; type: string; tier: string; certifications: string; services: string } }) {
  return <div className="rounded-md border border-neutral-200 bg-white/84 p-3"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-semibold text-neutral-950">{partner.name}</div><div className="mt-1 text-xs text-neutral-500">{partner.type}</div></div><BadgeCheck className="size-4 text-primary-700" /></div><div className="mt-3 flex flex-wrap gap-2"><StatusBadge value={partner.tier} /><Badge className="bg-neutral-50">{partner.services}</Badge></div><p className="mt-3 text-xs text-neutral-500">{partner.certifications}</p></div>;
}

function TemplateRow({ template }: { template: { name: string; icon: ReactNode; modules: string; compliance: string; status: string } }) {
  return <div className="rounded-md border border-neutral-200 bg-white/84 p-3"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><span className="text-primary-700">{template.icon}</span><div><div className="text-sm font-semibold text-neutral-950">{template.name}</div><div className="mt-1 text-xs text-neutral-500">{template.modules}</div></div></div><StatusBadge value={template.status} /></div><div className="mt-2 text-xs text-neutral-500">{template.compliance}</div></div>;
}

function DataTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full border-collapse text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-semibold">{label(column)}</th>)}</tr></thead><tbody className="divide-y divide-neutral-200">{rows.map((row, index) => <tr key={index} className="bg-white/80">{columns.map((column) => <td key={column} className="px-3 py-2 text-neutral-700">{String(row[column] ?? '-')}</td>)}</tr>)}</tbody></table></div>;
}

function ActionRow({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return <div className="flex items-start gap-3 rounded-md border border-neutral-200 bg-white/80 p-3"><span className="mt-0.5 text-primary-700">{icon}</span><div><div className="text-sm font-semibold text-neutral-950">{title}</div><div className="text-xs text-neutral-500">{detail}</div></div></div>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1.5"><div className="font-semibold text-primary-950">{value}</div><div className="text-[11px] text-neutral-500">{label}</div></div>;
}

function StatusBadge({ value }: { value: string }) {
  const tone = value === 'Published' || value === 'Ready' || value === 'Healthy' || value === 'Platinum' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : value === 'Review' || value === 'Watching' || value === 'Gold' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-neutral-50 text-neutral-600 border-neutral-200';
  return <span className={cn('inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold', tone)}>{value}</span>;
}

function label(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()); }