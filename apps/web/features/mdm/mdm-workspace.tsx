'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, BarChart3, Bot, Boxes, BriefcaseBusiness, DatabaseZap, Fingerprint, GitBranch, Landmark, Network, PackageSearch, Search, ShieldCheck, Sparkles, Split, Star, UserRound, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mdmApiGroups, mdmCapabilities, mdmCopilotQuestions } from '@/services/mdm-api';

const commandCenters = [
  { label: 'Master Data Domains', detail: 'Customer, vendor, product, employee and asset masters with trusted identifiers.', icon: <DatabaseZap className="size-4" /> },
  { label: 'Quality and Resolution', detail: 'Quality rules, scoring, duplicate detection, matching and entity resolution.', icon: <Fingerprint className="size-4" /> },
  { label: 'Golden Record Engine', detail: 'Survivorship, merge requests, canonical records and steward approval paths.', icon: <Star className="size-4" /> },
  { label: 'AI Data Copilot', detail: 'Natural language quality, lineage, duplicate and governance recommendations.', icon: <Bot className="size-4" /> },
];

export function MdmWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Master Data Management & Data Intelligence</h1>
            <Badge>Phase 48</Badge>
            <Badge className="bg-white/80">Trusted Data OS</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Customer, vendor, product, employee and asset masters with data quality, duplicate detection, entity resolution, golden records, governance, lineage and AI data copilot.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search master data"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Open data quality analytics"><BarChart3 className="size-4" />Analytics</Button>
          <Button title="Ask data copilot"><Sparkles className="size-4" />Ask AI</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Boxes className="size-5" />} label="MDM Models" value="48" detail="master and intelligence entities" tone="primary" />
        <SignalCard icon={<ShieldCheck className="size-5" />} label="RBAC Roles" value="7" detail="data governance roles" tone="green" />
        <SignalCard icon={<Network className="size-5" />} label="Domain Events" value="26" detail="quality and lineage ready" tone="amber" />
        <SignalCard icon={<GitBranch className="size-5" />} label="API Groups" value="12" detail="versioned MDM surfaces" tone="blue" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<DatabaseZap className="size-4" />} title="MDM Command Center">
            <div className="grid gap-3 md:grid-cols-2">{commandCenters.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<BadgeCheck className="size-4" />} title="Master Data Modules">
              <div className="grid gap-2">{mdmCapabilities.slice(0, 6).map((item) => <ActionRow key={item} icon={<PackageSearch className="size-4" />} label={item} detail="Backed by Phase 48 Prisma models, validators, services and controllers." />)}</div>
            </DataPanel>
            <DataPanel icon={<Sparkles className="size-4" />} title="Intelligence Modules">
              <div className="grid gap-2">{mdmCapabilities.slice(6).map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Connected to data quality, duplicate detection, resolution, lineage, governance and AI recommendations." />)}</div>
            </DataPanel>
          </div>
          <DataPanel icon={<Bot className="size-4" />} title="AI Data Copilot Questions">
            <div className="grid gap-2 md:grid-cols-2">{mdmCopilotQuestions.map((question) => <ActionRow key={question} icon={<Sparkles className="size-4" />} label={question} detail="Natural language request routed through governed MDM context." />)}</div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Landmark className="size-4" />} title="Readiness Coverage">
            <ActionRow icon={<UsersRound className="size-4" />} label="Customer and vendor masters" detail="Canonical profiles, identifiers, relationships and source traceability." />
            <ActionRow icon={<PackageSearch className="size-4" />} label="Product and asset masters" detail="Catalogs, attributes, hierarchies and governed identifiers." />
            <ActionRow icon={<UserRound className="size-4" />} label="Employee master" detail="Trusted employee records, profiles, identifiers and assignments." />
            <ActionRow icon={<Split className="size-4" />} label="Resolution and lineage" detail="Duplicate clusters, entity decisions, golden records and lineage records." />
          </DataPanel>
          <DataPanel icon={<BarChart3 className="size-4" />} title="API Groups">
            <div className="grid gap-2">{mdmApiGroups.map((apiPath) => <ActionRow key={apiPath} icon={<ArrowRight className="size-4" />} label={apiPath} detail="Versioned, guarded, tenant-aware MDM API" />)}</div>
          </DataPanel>
        </aside>
      </div>
    </div>
  );
}

function SignalCard({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: 'primary' | 'green' | 'amber' | 'blue' }) {
  const tones = { primary: 'border-primary-200 text-primary-950', green: 'border-emerald-200 text-emerald-950', amber: 'border-amber-200 text-amber-950', blue: 'border-sky-200 text-sky-950' };
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('rounded-lg border bg-white/78 p-4 shadow-subtle backdrop-blur-shell', tones[tone])}><div className="flex items-center justify-between gap-3"><span>{icon}</span><span className="flex size-4 items-center justify-center rounded-full bg-current/10"><span className="size-1.5 rounded-full bg-current" /></span></div><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-sm font-medium">{label}</div><div className="mt-1 text-xs opacity-70">{detail}</div></motion.div>;
}

function DataPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="rounded-lg border border-neutral-200 bg-white/78 p-4 shadow-subtle backdrop-blur-shell"><div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-primary-950">{icon}<span>{title}</span></div><Button variant="icon" size="icon" title={'Open ' + title}><ArrowRight className="size-4" /></Button></div>{children}</section>;
}

function ActionRow({ icon, label, detail }: { icon: ReactNode; label: string; detail: string }) {
  return <div className="flex min-w-0 items-start gap-3 rounded-md border border-neutral-200 bg-white/70 p-3"><span className="mt-0.5 text-primary-700">{icon}</span><div className="min-w-0"><div className="truncate text-sm font-medium text-neutral-950">{label}</div><div className="mt-0.5 text-xs leading-5 text-neutral-500">{detail}</div></div></div>;
}
