
'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BarChart3, Boxes, BrainCircuit, CheckCircle2, ClipboardList, Factory, LineChart, MapPinned, PackageCheck, PackageSearch, RefreshCw, Route, Search, ShieldCheck, Sparkles, Truck, Warehouse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supplyChainApiGroups, supplyChainCapabilities } from '@/services/supply-chain-api';

const inventoryRows = [
  { item: 'NX-SENSOR-100', warehouse: 'North Hub', available: '18,420', status: 'Healthy' },
  { item: 'NX-GATEWAY-4G', warehouse: 'East DC', available: '2,140', status: 'Reorder' },
  { item: 'NX-ROUTER-PRO', warehouse: 'West Hub', available: '860', status: 'Critical' },
];

const fulfillmentRows = [
  { order: 'FUL-2026-8821', warehouse: 'North Hub', carrier: 'Aster Freight', status: 'Picking' },
  { order: 'FUL-2026-8790', warehouse: 'East DC', carrier: 'BlueLine', status: 'Packed' },
  { order: 'FUL-2026-8732', warehouse: 'West Hub', carrier: 'Northwind', status: 'Shipped' },
];

const forecastRows = [
  { scenario: 'Baseline Q3', item: 'NX-SENSOR-100', demand: '42K', confidence: '88%' },
  { scenario: 'Peak Season', item: 'NX-GATEWAY-4G', demand: '9.8K', confidence: '81%' },
  { scenario: 'Supply Shock', item: 'NX-ROUTER-PRO', demand: '3.1K', confidence: '73%' },
];

const riskRows = [
  { risk: 'Carrier delay', subject: 'BlueLine', severity: 'High', action: 'Reroute' },
  { risk: 'Stockout risk', subject: 'NX-ROUTER-PRO', severity: 'Critical', action: 'Replenish' },
  { risk: 'Port disruption', subject: 'West Hub', severity: 'Medium', action: 'Monitor' },
];

const centerItems = [
  { label: 'Inventory Core', detail: 'Stock balances, batches, serials, audits and movement history.', icon: <Boxes className="size-4" /> },
  { label: 'Warehouse Management', detail: 'Warehouses, zones, bins, transfers and receiving operations.', icon: <Warehouse className="size-4" /> },
  { label: 'Fulfillment Engine', detail: 'Picking, packing, shipment processing and delivery confirmation.', icon: <PackageCheck className="size-4" /> },
  { label: 'AI Supply Chain Copilot', detail: 'Natural language questions with inventory, forecast, route and risk context.', icon: <BrainCircuit className="size-4" /> },
];

export function SupplyChainWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Supply Chain, Inventory Planning & Fulfillment Intelligence</h1>
            <Badge>Phase 42</Badge>
            <Badge className="bg-white/80">Supply Chain Intelligence</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Inventory, warehouse operations, demand forecasts, replenishment, fulfillment, distribution network planning, shipment visibility and AI supply-chain recommendations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search supply chain"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh supply chain signals"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Ask supply chain copilot"><Sparkles className="size-4" />Ask AI</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Boxes className="size-5" />} label="Inventory SKUs" value="24.8K" detail="stock tracked" tone="primary" />
        <SignalCard icon={<Warehouse className="size-5" />} label="Warehouses" value="38" detail="global nodes" tone="green" />
        <SignalCard icon={<Truck className="size-5" />} label="Shipments" value="9,420" detail="active visibility" tone="amber" />
        <SignalCard icon={<AlertTriangle className="size-5" />} label="Risk Signals" value="46" detail="open disruptions" tone="red" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<PackageSearch className="size-4" />} title="Inventory Planning"><DataTable rows={inventoryRows} columns={['item', 'warehouse', 'available', 'status']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<LineChart className="size-4" />} title="Demand Forecasting"><DataTable rows={forecastRows} columns={['scenario', 'item', 'demand', 'confidence']} /></DataPanel>
            <DataPanel icon={<PackageCheck className="size-4" />} title="Fulfillment Engine"><DataTable rows={fulfillmentRows} columns={['order', 'warehouse', 'carrier', 'status']} /></DataPanel>
          </div>
          <DataPanel icon={<ShieldCheck className="size-4" />} title="Supply Chain Intelligence"><DataTable rows={riskRows} columns={['risk', 'subject', 'severity', 'action']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Factory className="size-4" />} title="Operating Layer">
            <div className="grid gap-2">{centerItems.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<Route className="size-4" />} title="Distribution Network">
            <ActionRow icon={<MapPinned className="size-4" />} label="Route optimization" detail="Carriers, distribution centers, network roles, carbon scores and route recommendations." />
            <ActionRow icon={<Truck className="size-4" />} label="Shipment tracking" detail="ETA prediction, delay monitoring, exception handling and tracking events." />
            <ActionRow icon={<ClipboardList className="size-4" />} label="Replenishment plans" detail="Reorder points, safety stock and AI recommended quantities." />
            <ActionRow icon={<BarChart3 className="size-4" />} label="Analytics layer" detail="Inventory, forecast, fulfillment and shipment analytics roll into executive views." />
          </DataPanel>
          <DataPanel icon={<CheckCircle2 className="size-4" />} title="API Surface">
            <div className="grid gap-2">{supplyChainApiGroups.map((apiPath) => <ActionRow key={apiPath} icon={<CheckCircle2 className="size-4" />} label={apiPath} detail="Tenant-scoped supply chain API" />)}</div>
          </DataPanel>
          <DataPanel icon={<Sparkles className="size-4" />} title="Capabilities">
            <div className="grid gap-2">{supplyChainCapabilities.map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Enterprise supply chain intelligence foundation" />)}</div>
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
