'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, BarChart3, Bot, Cloud, CreditCard, GitBranch, Globe2, KeyRound, Link2, MessageSquare, Network, PlugZap, Search, ShieldCheck, Sparkles, TerminalSquare, Webhook, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { globalConnectivityApiGroups, globalConnectivityCapabilities, integrationCopilotQuestions } from '@/services/global-connectivity-api';

const commandCenters = [
  { label: 'Enterprise Integration Hub', detail: 'Tenant-scoped connector catalog, connection config and source-system control plane.', icon: <PlugZap className="size-4" /> },
  { label: 'OAuth and OIDC Security', detail: 'Token rotation, OpenID issuer metadata, scopes, permissions and credential references.', icon: <KeyRound className="size-4" /> },
  { label: 'Gateway and Webhooks', detail: 'API routes, gateway policies, webhook endpoints, signatures and delivery monitoring.', icon: <Webhook className="size-4" /> },
  { label: 'AI Integration Copilot', detail: 'Natural language integration health, failure, token and connector recommendations.', icon: <Bot className="size-4" /> },
];

export function GlobalConnectivityWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Global Integrations & Enterprise Connectivity</h1>
            <Badge>Phase 49</Badge>
            <Badge className="bg-white/80">Connectivity OS</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Integration hub, enterprise connectors, OAuth2, OpenID Connect, API gateway, webhooks, connector SDK, monitoring and AI integration copilot.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search integrations"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Open integration analytics"><BarChart3 className="size-4" />Analytics</Button>
          <Button title="Ask integration copilot"><Sparkles className="size-4" />Ask AI</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Network className="size-5" />} label="Connectivity Models" value="56" detail="connector and gateway entities" tone="primary" />
        <SignalCard icon={<ShieldCheck className="size-5" />} label="RBAC Roles" value="7" detail="integration governance roles" tone="green" />
        <SignalCard icon={<GitBranch className="size-5" />} label="Domain Events" value="32" detail="OAuth, sync and webhook ready" tone="amber" />
        <SignalCard icon={<Globe2 className="size-5" />} label="API Groups" value="14" detail="versioned connectivity surfaces" tone="blue" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<PlugZap className="size-4" />} title="Connectivity Command Center">
            <div className="grid gap-3 md:grid-cols-2">{commandCenters.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<BadgeCheck className="size-4" />} title="Connector Modules">
              <div className="grid gap-2">{globalConnectivityCapabilities.slice(0, 7).map((item) => <ActionRow key={item} icon={<Link2 className="size-4" />} label={item} detail="Backed by Phase 49 Prisma models, validators, services and controllers." />)}</div>
            </DataPanel>
            <DataPanel icon={<Sparkles className="size-4" />} title="Platform Modules">
              <div className="grid gap-2">{globalConnectivityCapabilities.slice(7).map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Connected to OAuth2, OIDC, API versioning, webhooks, gateway policy, monitoring and AI recommendations." />)}</div>
            </DataPanel>
          </div>
          <DataPanel icon={<Bot className="size-4" />} title="AI Integration Copilot Questions">
            <div className="grid gap-2 md:grid-cols-2">{integrationCopilotQuestions.map((question) => <ActionRow key={question} icon={<Sparkles className="size-4" />} label={question} detail="Natural language request routed through governed integration context." />)}</div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Workflow className="size-4" />} title="Readiness Coverage">
            <ActionRow icon={<Cloud className="size-4" />} label="Cloud and enterprise systems" detail="Salesforce, SAP, Oracle, Microsoft, Google Workspace and cloud providers." />
            <ActionRow icon={<MessageSquare className="size-4" />} label="Communication and payment rails" detail="Messaging routes, provider credentials, payment accounts and reconciliation jobs." />
            <ActionRow icon={<TerminalSquare className="size-4" />} label="Gateway and SDK" detail="Gateway routes, policies, consumers, connector SDK packages and extension points." />
            <ActionRow icon={<CreditCard className="size-4" />} label="Monitoring and risk" detail="Health checks, sync runs, alerts, usage metrics and AI risk signals." />
          </DataPanel>
          <DataPanel icon={<BarChart3 className="size-4" />} title="API Groups">
            <div className="grid gap-2">{globalConnectivityApiGroups.map((apiPath) => <ActionRow key={apiPath} icon={<ArrowRight className="size-4" />} label={apiPath} detail="Versioned, guarded, tenant-aware connectivity API" />)}</div>
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
