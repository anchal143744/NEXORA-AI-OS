'use client';

import { useMemo, type DragEvent } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Bell, Bot, Boxes, BrainCircuit, CheckCircle2, Clock3, FileCheck2, GitBranch, Handshake, Hourglass, Layers3, Move, Play, RefreshCw, Route, SearchCode, ShieldCheck, Sparkles, Webhook, ZoomIn, ZoomOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWorkflowBuilderStore } from '@/stores/workflow-builder-store';
import type { ExecutionQueueItem, WorkflowBuilderEdge, WorkflowBuilderNode, WorkflowNodeGroup, WorkflowNodeType } from './workflow-types';

const palette: Array<{ type: WorkflowNodeType; label: string }> = [
  { type: 'trigger', label: 'Trigger' },
  { type: 'condition', label: 'Condition' },
  { type: 'ai_decision', label: 'AI Decision' },
  { type: 'delay', label: 'Delay' },
  { type: 'approval', label: 'Approval' },
  { type: 'action', label: 'Action' },
  { type: 'notification', label: 'Notification' },
  { type: 'webhook', label: 'Webhook' },
  { type: 'crm', label: 'CRM' },
  { type: 'finance', label: 'Finance' },
  { type: 'hr', label: 'HR' },
  { type: 'inventory', label: 'Inventory' },
];

export function WorkflowBuilderWorkspace() {
  const nodes = useWorkflowBuilderStore((state) => state.nodes);
  const edges = useWorkflowBuilderStore((state) => state.edges);
  const groups = useWorkflowBuilderStore((state) => state.groups);
  const templates = useWorkflowBuilderStore((state) => state.templates);
  const metrics = useWorkflowBuilderStore((state) => state.metrics);
  const queue = useWorkflowBuilderStore((state) => state.queue);
  const zoom = useWorkflowBuilderStore((state) => state.zoom);
  const pan = useWorkflowBuilderStore((state) => state.pan);
  const selectedNodeId = useWorkflowBuilderStore((state) => state.selectedNodeId);
  const activeTemplateKey = useWorkflowBuilderStore((state) => state.activeTemplateKey);
  const aiInstruction = useWorkflowBuilderStore((state) => state.aiInstruction);
  const setSelectedNode = useWorkflowBuilderStore((state) => state.setSelectedNode);
  const setZoom = useWorkflowBuilderStore((state) => state.setZoom);
  const panBy = useWorkflowBuilderStore((state) => state.panBy);
  const addNode = useWorkflowBuilderStore((state) => state.addNode);
  const moveNode = useWorkflowBuilderStore((state) => state.moveNode);
  const applyTemplate = useWorkflowBuilderStore((state) => state.applyTemplate);
  const setAiInstruction = useWorkflowBuilderStore((state) => state.setAiInstruction);
  const generateFromPrompt = useWorkflowBuilderStore((state) => state.generateFromPrompt);
  const retryExecution = useWorkflowBuilderStore((state) => state.retryExecution);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/nexora-node') as WorkflowNodeType;
    if (!type) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    addNode(type, { x: Math.round((event.clientX - bounds.left - pan.x) / zoom), y: Math.round((event.clientY - bounds.top - pan.y) / zoom) });
  }

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Workflow Builder</h1>
            <Badge>Enterprise Runtime</Badge>
            <Badge className="bg-white/80">{nodes.length} nodes</Badge>
            <Badge className="bg-white/80">{edges.length} edges</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Visual automation control plane for tenant-scoped workflows, approvals, AI decisions, and execution monitoring.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search workflows"><SearchCode className="size-4" />Search</Button>
          <Button variant="subtle" title="Run workflow"><Play className="size-4" />Run</Button>
          <Button title="Publish workflow"><CheckCircle2 className="size-4" />Publish</Button>
        </div>
      </header>

      <div className="grid flex-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <aside className="flex min-h-0 flex-col gap-4 rounded-lg border border-neutral-200 bg-white/78 p-3 shadow-subtle backdrop-blur-shell">
          <SectionTitle icon={<Layers3 className="size-4" />} label="Node Palette" />
          <div className="grid grid-cols-2 gap-2">
            {palette.map((item) => <PaletteButton key={item.type} type={item.type} label={item.label} />)}
          </div>
          <div className="h-px bg-neutral-200" />
          <SectionTitle icon={<Route className="size-4" />} label="Templates" />
          <div className="flex flex-col gap-2 overflow-auto pr-1">
            {templates.map((template) => (
              <button key={template.key} onClick={() => applyTemplate(template.key)} className={cn('rounded-md border px-3 py-2 text-left transition-colors', activeTemplateKey === template.key ? 'border-primary-600 bg-primary-100/70 text-primary-950' : 'border-neutral-200 bg-white/70 hover:border-primary-300')}>
                <div className="flex items-center justify-between gap-2 text-sm font-medium"><span>{template.industry}</span><span className="text-xs text-neutral-500">{template.modules[0]}</span></div>
                <div className="mt-1 text-xs text-neutral-500">{template.name}</div>
              </button>
            ))}
          </div>
          <div className="h-px bg-neutral-200" />
          <SectionTitle icon={<Bot className="size-4" />} label="AI Generator" />
          <textarea value={aiInstruction} onChange={(event) => setAiInstruction(event.target.value)} className="min-h-28 resize-none rounded-md border border-neutral-200 bg-white/80 p-3 text-sm outline-none focus:premium-focus" />
          <Button onClick={generateFromPrompt} title="Generate workflow"><Sparkles className="size-4" />Generate</Button>
        </aside>

        <section className="relative min-h-[700px] overflow-hidden rounded-lg border border-neutral-200 bg-[linear-gradient(180deg,#ffffff_0%,#eef6fb_100%)] shadow-subtle">
          <CanvasToolbar zoom={zoom} setZoom={setZoom} panBy={panBy} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(73,118,159,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(73,118,159,.09)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute inset-0" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} onClick={() => setSelectedNode(undefined)}>
            <div className="absolute left-0 top-0 h-[980px] w-[1540px]" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
              <GroupBands groups={groups} nodes={nodes} />
              <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                {edges.map((edge) => <WorkflowEdgePath key={edge.id} edge={edge} nodeMap={nodeMap} />)}
              </svg>
              {nodes.map((node) => <WorkflowNodeCard key={node.id} node={node} selected={node.id === selectedNodeId} onSelect={() => setSelectedNode(node.id)} onDragEnd={(_, info) => moveNode(node.id, info.offset)} />)}
            </div>
          </div>
        </section>

        <aside className="flex min-h-0 flex-col gap-4 rounded-lg border border-neutral-200 bg-white/78 p-3 shadow-subtle backdrop-blur-shell">
          <SectionTitle icon={<BrainCircuit className="size-4" />} label="Execution Console" />
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((metric) => <MetricTile key={metric.label} label={metric.label} value={metric.value} signal={metric.signal} />)}
          </div>
          <div className="h-px bg-neutral-200" />
          <div className="flex flex-col gap-2 overflow-auto pr-1">
            {queue.map((item) => <QueueRow key={item.id} item={item} onRetry={() => retryExecution(item.id)} />)}
          </div>
          {selectedNode ? <NodeInspector node={selectedNode} /> : null}
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <div className="flex items-center gap-2 text-sm font-semibold text-primary-950">{icon}<span>{label}</span></div>;
}

function PaletteButton({ type, label }: { type: WorkflowNodeType; label: string }) {
  return <button draggable onDragStart={(event) => event.dataTransfer.setData('application/nexora-node', type)} className="flex h-16 items-center gap-2 rounded-md border border-neutral-200 bg-white/80 px-2 text-left text-xs font-medium text-neutral-800 transition-colors hover:border-primary-300 hover:bg-primary-100/50" title={label}><NodeTypeIcon type={type} /><span>{label}</span></button>;
}

function CanvasToolbar({ zoom, setZoom, panBy }: { zoom: number; setZoom: (zoom: number) => void; panBy: (delta: { x: number; y: number }) => void }) {
  return <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2 rounded-md border border-neutral-200 bg-white/86 p-2 shadow-subtle backdrop-blur-shell">
    <Button variant="icon" size="icon" title="Zoom out" onClick={() => setZoom(zoom - 0.1)}><ZoomOut className="size-4" /></Button>
    <span className="w-12 text-center font-mono text-xs text-neutral-500">{Math.round(zoom * 100)}%</span>
    <Button variant="icon" size="icon" title="Zoom in" onClick={() => setZoom(zoom + 0.1)}><ZoomIn className="size-4" /></Button>
    <div className="mx-1 h-6 w-px bg-neutral-200" />
    <Button variant="icon" size="icon" title="Pan left" onClick={() => panBy({ x: 40, y: 0 })}><ArrowLeft className="size-4" /></Button>
    <Button variant="icon" size="icon" title="Pan up" onClick={() => panBy({ x: 0, y: 40 })}><ArrowUp className="size-4" /></Button>
    <Button variant="icon" size="icon" title="Pan down" onClick={() => panBy({ x: 0, y: -40 })}><ArrowDown className="size-4" /></Button>
    <Button variant="icon" size="icon" title="Pan right" onClick={() => panBy({ x: -40, y: 0 })}><ArrowRight className="size-4" /></Button>
    <div className="mx-1 h-6 w-px bg-neutral-200" />
    <Move className="size-4 text-primary-700" />
  </div>;
}

function GroupBands({ groups, nodes }: { groups: WorkflowNodeGroup[]; nodes: WorkflowBuilderNode[] }) {
  return <>{groups.map((group) => {
    const groupNodes = nodes.filter((node) => group.nodeIds.includes(node.id) || node.group === group.id);
    if (!groupNodes.length) return null;
    const minX = Math.min(...groupNodes.map((node) => node.x)) - 34;
    const minY = Math.min(...groupNodes.map((node) => node.y)) - 36;
    const maxX = Math.max(...groupNodes.map((node) => node.x)) + 232;
    const maxY = Math.max(...groupNodes.map((node) => node.y)) + 128;
    return <div key={group.id} className={cn('absolute rounded-lg border px-3 pt-2 text-xs font-semibold', group.tone === 'risk' ? 'border-amber-300/80 bg-amber-50/50 text-amber-700' : group.tone === 'revenue' ? 'border-primary-300/80 bg-primary-100/35 text-primary-950' : 'border-emerald-300/80 bg-emerald-50/50 text-emerald-700')} style={{ left: minX, top: minY, width: maxX - minX, height: maxY - minY }}>{group.label}</div>;
  })}</>;
}

function WorkflowEdgePath({ edge, nodeMap }: { edge: WorkflowBuilderEdge; nodeMap: Map<string, WorkflowBuilderNode> }) {
  const source = nodeMap.get(edge.source);
  const target = nodeMap.get(edge.target);
  if (!source || !target) return null;
  const start = { x: source.x + 190, y: source.y + 42 };
  const end = { x: target.x, y: target.y + 42 };
  const control = Math.max(80, (end.x - start.x) / 2);
  const color = edge.intent === 'approval' ? '#D97706' : edge.intent === 'success' ? '#4E8EA2' : edge.intent === 'warning' ? '#B45309' : '#0A4174';
  return <path d={`M ${start.x} ${start.y} C ${start.x + control} ${start.y}, ${end.x - control} ${end.y}, ${end.x} ${end.y}`} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />;
}

function WorkflowNodeCard({ node, selected, onSelect, onDragEnd }: { node: WorkflowBuilderNode; selected: boolean; onSelect: () => void; onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void }) {
  return <motion.button drag dragMomentum={false} onDragEnd={onDragEnd} onClick={(event) => { event.stopPropagation(); onSelect(); }} className={cn('absolute flex h-[84px] w-[190px] flex-col justify-between rounded-md border bg-white/92 p-3 text-left shadow-subtle backdrop-blur-shell transition-colors', selected ? 'border-primary-600 shadow-glow' : 'border-neutral-200 hover:border-primary-300')} style={{ left: node.x, top: node.y }} title={node.label}>
    <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2 text-sm font-semibold text-neutral-950"><NodeTypeIcon type={node.type} /><span className="truncate">{node.label}</span></div>{node.risk ? <span className={cn('rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase', node.risk === 'high' || node.risk === 'critical' ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-900')}>{node.risk}</span> : null}</div>
    <p className="line-clamp-2 text-xs text-neutral-500">{node.description}</p>
  </motion.button>;
}

function MetricTile({ label, value, signal }: { label: string; value: string; signal: 'healthy' | 'watch' | 'critical' }) {
  return <div className="rounded-md border border-neutral-200 bg-white/80 p-3"><div className="text-xs text-neutral-500">{label}</div><div className="mt-1 flex items-center justify-between gap-2"><span className="text-lg font-semibold text-primary-950">{value}</span><span className={cn('size-2 rounded-full', signal === 'healthy' ? 'bg-emerald-500' : signal === 'watch' ? 'bg-amber-500' : 'bg-rose-500')} /></div></div>;
}

function QueueRow({ item, onRetry }: { item: ExecutionQueueItem; onRetry: () => void }) {
  return <div className="rounded-md border border-neutral-200 bg-white/80 p-3"><div className="flex items-start justify-between gap-2"><div><div className="text-sm font-semibold text-neutral-950">{item.workflow}</div><div className="mt-1 text-xs text-neutral-500">{item.id} · {item.owner} · {item.updatedAt}</div></div><StatusBadge status={item.status} /></div><div className="mt-3 flex items-center justify-between gap-2 text-xs text-neutral-500"><span>{item.latencyMs ? `${item.latencyMs} ms` : 'waiting'}</span>{item.status === 'failed' ? <Button variant="ghost" size="sm" onClick={onRetry} title="Retry execution"><RefreshCw className="size-3.5" />Retry</Button> : null}</div></div>;
}

function StatusBadge({ status }: { status: ExecutionQueueItem['status'] }) {
  const styles: Record<ExecutionQueueItem['status'], string> = { running: 'border-primary-300 bg-primary-100 text-primary-950', queued: 'border-neutral-200 bg-neutral-50 text-neutral-700', failed: 'border-rose-200 bg-rose-50 text-rose-700', approval: 'border-amber-200 bg-amber-50 text-amber-700', ai: 'border-violet-200 bg-violet-50 text-violet-700' };
  return <span className={cn('rounded-sm border px-2 py-0.5 text-xs font-semibold capitalize', styles[status])}>{status}</span>;
}

function NodeInspector({ node }: { node: WorkflowBuilderNode }) {
  return <div className="rounded-md border border-primary-300/70 bg-primary-100/45 p-3"><div className="flex items-center gap-2 text-sm font-semibold text-primary-950"><ShieldCheck className="size-4" />Inspector</div><dl className="mt-3 grid grid-cols-2 gap-2 text-xs"><dt className="text-neutral-500">Type</dt><dd className="font-medium text-neutral-900">{node.type}</dd><dt className="text-neutral-500">Group</dt><dd className="font-medium text-neutral-900">{node.group ?? 'none'}</dd><dt className="text-neutral-500">Risk</dt><dd className="font-medium text-neutral-900">{node.risk ?? 'low'}</dd><dt className="text-neutral-500">Position</dt><dd className="font-mono text-neutral-900">{node.x},{node.y}</dd></dl></div>;
}

function NodeTypeIcon({ type }: { type: WorkflowNodeType }) {
  const className = 'size-4 shrink-0 text-primary-700';
  if (type === 'trigger') return <GitBranch className={className} />;
  if (type === 'condition') return <Route className={className} />;
  if (type === 'ai_decision') return <BrainCircuit className={className} />;
  if (type === 'delay') return <Hourglass className={className} />;
  if (type === 'approval') return <FileCheck2 className={className} />;
  if (type === 'notification') return <Bell className={className} />;
  if (type === 'webhook') return <Webhook className={className} />;
  if (type === 'crm') return <Handshake className={className} />;
  if (type === 'finance') return <CheckCircle2 className={className} />;
  if (type === 'hr') return <Clock3 className={className} />;
  if (type === 'inventory') return <Boxes className={className} />;
  return <AlertTriangle className={className} />;
}
