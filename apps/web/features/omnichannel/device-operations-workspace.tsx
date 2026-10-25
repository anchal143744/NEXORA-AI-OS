'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BellRing, Bot, CheckCircle2, ClipboardCheck, DatabaseZap, Gauge, KeyRound, Laptop, Layers3, LockKeyhole, MonitorSmartphone, PlugZap, RefreshCw, RotateCcw, Search, ShieldCheck, Smartphone, TabletSmartphone, TerminalSquare, WifiOff, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const devices = [
  { name: 'Executive MacBook', type: 'Desktop', trust: 'Managed', status: 'Active', lastSeen: '2m' },
  { name: 'Field Sales iPhone', type: 'Mobile', trust: 'Trusted', status: 'Active', lastSeen: '7m' },
  { name: 'Warehouse Tablet', type: 'Tablet', trust: 'Known', status: 'Pending approval', lastSeen: '18m' },
];

const offlineQueue = [
  { module: 'CRM', operation: 'create lead', queue: 'record', status: 'Queued', priority: '50' },
  { module: 'Workflows', operation: 'execute approval', queue: 'workflow', status: 'Retrying', priority: '40' },
  { module: 'AI Agents', operation: 'generate insight', queue: 'ai', status: 'Queued', priority: '30' },
  { module: 'Finance', operation: 'update invoice', queue: 'record', status: 'Conflict', priority: '20' },
];

const syncRuns = [
  { run: 'mobile-field-sync', direction: 'Bidirectional', pending: '18', conflicts: '1', state: 'Running' },
  { run: 'desktop-command-center', direction: 'Pull', pending: '0', conflicts: '0', state: 'Healthy' },
  { run: 'tablet-warehouse', direction: 'Push', pending: '42', conflicts: '2', state: 'Recovering' },
];

const mobileCapabilities = [
  { title: 'Mobile command center', detail: 'Search, create, approve, sync and ask AI from compact work surfaces', icon: <Smartphone className="size-4" /> },
  { title: 'Mobile dashboard framework', detail: 'Role-aware KPI strips, task cards, approval queue and offline state', icon: <Gauge className="size-4" /> },
  { title: 'Mobile AI Copilot', detail: 'Docked AI access with offline AI request queue', icon: <Bot className="size-4" /> },
];

const desktopCapabilities = [
  { title: 'Multi-window companion', detail: 'Command center, AI Copilot, workflow console and approval queue windows', icon: <Laptop className="size-4" /> },
  { title: 'Desktop notifications', detail: 'Workspace-aware notifications with action payloads', icon: <BellRing className="size-4" /> },
  { title: 'System tray foundation', detail: 'Sync now, quick capture, queue status and notification pause actions', icon: <TerminalSquare className="size-4" /> },
];

const securityControls = [
  { label: 'Device authentication', state: 'Required' },
  { label: 'Encrypted local cache', state: 'Required' },
  { label: 'Offline permission validation', state: 'Enabled' },
  { label: 'Remote session revocation', state: 'Enabled' },
  { label: 'Device compliance checks', state: 'Enabled' },
];

const supportedModules = ['CRM', 'Finance', 'HR', 'Inventory', 'Projects', 'Workflows', 'AI Agents'];

export function DeviceOperationsWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Device & Offline Operations</h1>
            <Badge>Phase 22</Badge>
            <Badge className="bg-white/80">Mobile + Desktop Companion</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Operate NEXORA across browser, desktop, tablet and mobile devices with offline queues, sync recovery, device trust controls and secure local cache governance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search devices and offline operations"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Run sync recovery"><RotateCcw className="size-4" />Recover Sync</Button>
          <Button title="Register device"><MonitorSmartphone className="size-4" />Register Device</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<MonitorSmartphone className="size-5" />} label="Registered Devices" value="3" detail="browser, desktop, mobile, tablet" tone="primary" />
        <SignalCard icon={<WifiOff className="size-5" />} label="Offline Queue" value="64" detail="7 supported modules" tone="amber" />
        <SignalCard icon={<RefreshCw className="size-5" />} label="Sync Health" value="97%" detail="automatic recovery enabled" tone="green" />
        <SignalCard icon={<ShieldCheck className="size-5" />} label="Trusted Sessions" value="28" detail="remote revoke ready" tone="violet" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <main className="flex min-w-0 flex-col gap-4">
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Smartphone className="size-4" />} title="Mobile Foundation">
              <div className="grid gap-2">{mobileCapabilities.map((item) => <ActionRow key={item.title} {...item} />)}</div>
            </DataPanel>
            <DataPanel icon={<Laptop className="size-4" />} title="Desktop Companion">
              <div className="grid gap-2">{desktopCapabilities.map((item) => <ActionRow key={item.title} {...item} />)}</div>
            </DataPanel>
          </div>

          <DataPanel icon={<MonitorSmartphone className="size-4" />} title="Device Monitoring">
            <DataTable rows={devices} columns={['name', 'type', 'trust', 'status', 'lastSeen']} />
          </DataPanel>

          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<DatabaseZap className="size-4" />} title="Offline Execution Queue"><DataTable rows={offlineQueue} columns={['module', 'operation', 'queue', 'status', 'priority']} /></DataPanel>
            <DataPanel icon={<RefreshCw className="size-4" />} title="Synchronization Monitor"><DataTable rows={syncRuns} columns={['run', 'direction', 'pending', 'conflicts', 'state']} /></DataPanel>
          </div>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<TabletSmartphone className="size-4" />} title="Offline Modules">
            <div className="grid grid-cols-2 gap-2">
              {supportedModules.map((module) => <span key={module} className="rounded-md border border-neutral-200 bg-white/80 px-3 py-2 text-sm font-medium text-neutral-800">{module}</span>)}
            </div>
          </DataPanel>

          <DataPanel icon={<LockKeyhole className="size-4" />} title="Enterprise Security">
            <div className="grid gap-2">{securityControls.map((control) => <StateRow key={control.label} {...control} />)}</div>
          </DataPanel>

          <DataPanel icon={<ClipboardCheck className="size-4" />} title="Admin Controls">
            <div className="grid gap-2">
              <ActionRow icon={<ShieldCheck className="size-4" />} title="Device approval workflows" detail="Approve, reject or elevate device trust" />
              <ActionRow icon={<KeyRound className="size-4" />} title="Device permissions" detail="Module and offline-scoped grants" />
              <ActionRow icon={<PlugZap className="size-4" />} title="Remote session revocation" detail="Revoke all sessions for a managed device" />
              <ActionRow icon={<Layers3 className="size-4" />} title="Compliance checks" detail="Trust policy, encryption, session and cache posture" />
            </div>
          </DataPanel>

          <DataPanel icon={<Workflow className="size-4" />} title="API Surface">
            <div className="grid gap-2">
              {['/v1/mobile', '/v1/desktop', '/v1/offline', '/v1/sync', '/v1/devices'].map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} title={path} detail="Tenant-scoped enterprise operation APIs" />)}
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

function ActionRow({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return <div className="flex items-start gap-3 rounded-md border border-neutral-200 bg-white/80 p-3"><span className="mt-0.5 text-primary-700">{icon}</span><div><div className="text-sm font-semibold text-neutral-950">{title}</div><div className="text-xs text-neutral-500">{detail}</div></div></div>;
}

function StateRow({ label, state }: { label: string; state: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white/80 px-3 py-2"><span className="text-sm font-medium text-neutral-900">{label}</span><span className="rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{state}</span></div>;
}

function DataTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full border-collapse text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-semibold">{label(column)}</th>)}</tr></thead><tbody className="divide-y divide-neutral-200">{rows.map((row, index) => <tr key={index} className="bg-white/80">{columns.map((column) => <td key={column} className="px-3 py-2 text-neutral-700">{String(row[column] ?? '-')}</td>)}</tr>)}</tbody></table></div>;
}

function label(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()); }