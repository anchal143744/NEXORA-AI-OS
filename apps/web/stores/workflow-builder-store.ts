import { create } from 'zustand';
import type { ExecutionQueueItem, WorkflowBuilderEdge, WorkflowBuilderNode, WorkflowMetricCard, WorkflowNodeGroup, WorkflowNodeType, WorkflowTemplateBlueprint } from '@/features/workflows/workflow-types';

const startingNodes: WorkflowBuilderNode[] = [
  { id: 'trigger-1', type: 'trigger', label: 'Lead created', description: 'CRM event trigger', x: 80, y: 160, group: 'revenue' },
  { id: 'ai-1', type: 'ai_decision', label: 'AI qualification', description: 'Scores fit, intent, and risk', x: 360, y: 160, group: 'revenue', risk: 'low' },
  { id: 'approval-1', type: 'approval', label: 'Manager approval', description: 'Required for high-value routes', x: 640, y: 250, group: 'risk', risk: 'medium' },
  { id: 'crm-1', type: 'crm', label: 'Create opportunity', description: 'Writes CRM pipeline action', x: 920, y: 160, group: 'revenue' },
  { id: 'notify-1', type: 'notification', label: 'Notify owner', description: 'Realtime workspace update', x: 1190, y: 160, group: 'operations' },
];

const startingEdges: WorkflowBuilderEdge[] = [
  { id: 'edge-1', source: 'trigger-1', target: 'ai-1', intent: 'primary' },
  { id: 'edge-2', source: 'ai-1', target: 'approval-1', intent: 'approval', label: 'high value' },
  { id: 'edge-3', source: 'approval-1', target: 'crm-1', intent: 'success' },
  { id: 'edge-4', source: 'crm-1', target: 'notify-1', intent: 'primary' },
];

const nodeGroups: WorkflowNodeGroup[] = [
  { id: 'revenue', label: 'Revenue path', nodeIds: ['trigger-1', 'ai-1', 'crm-1'], tone: 'revenue' },
  { id: 'risk', label: 'Approval control', nodeIds: ['approval-1'], tone: 'risk' },
  { id: 'operations', label: 'Operations signal', nodeIds: ['notify-1'], tone: 'operations' },
];

const templateBase = (industry: string, key: string, name: string, modules: string[], domainType: WorkflowNodeType): WorkflowTemplateBlueprint => ({
  industry,
  key,
  name,
  modules,
  nodes: [
    { id: `${key}-trigger`, type: 'trigger', label: `${industry} trigger`, description: 'Workspace event trigger', x: 80, y: 160, group: 'operations' },
    { id: `${key}-ai`, type: 'ai_decision', label: 'AI routing', description: 'Context-aware decision', x: 350, y: 160, group: 'operations' },
    { id: `${key}-domain`, type: domainType, label: `${modules[0]} action`, description: `${industry} module execution`, x: 630, y: 160, group: 'revenue' },
    { id: `${key}-approval`, type: 'approval', label: 'Approval gate', description: 'Risk-aware control', x: 900, y: 245, group: 'risk' },
    { id: `${key}-notify`, type: 'notification', label: 'Notify channel', description: 'Realtime completion event', x: 1180, y: 160, group: 'operations' },
  ],
  edges: [
    { id: `${key}-edge-1`, source: `${key}-trigger`, target: `${key}-ai`, intent: 'primary' },
    { id: `${key}-edge-2`, source: `${key}-ai`, target: `${key}-domain`, intent: 'primary' },
    { id: `${key}-edge-3`, source: `${key}-domain`, target: `${key}-approval`, intent: 'approval' },
    { id: `${key}-edge-4`, source: `${key}-approval`, target: `${key}-notify`, intent: 'success' },
  ],
});

const templates: WorkflowTemplateBlueprint[] = [
  templateBase('SaaS', 'saas-trial-conversion', 'Trial conversion command loop', ['CRM', 'Analytics', 'Tasks'], 'crm'),
  templateBase('Retail', 'retail-low-stock-reorder', 'Low stock reorder control', ['Inventory', 'Finance', 'Tasks'], 'inventory'),
  templateBase('Healthcare', 'healthcare-compliance-followup', 'Compliance follow-up workflow', ['Compliance', 'HR', 'Documents'], 'hr'),
  templateBase('Manufacturing', 'manufacturing-production-exception', 'Production exception response', ['Inventory', 'Operations', 'Projects'], 'inventory'),
  templateBase('Logistics', 'logistics-delay-escalation', 'Delay escalation workflow', ['CRM', 'Tasks', 'Analytics'], 'crm'),
  templateBase('Agency', 'agency-client-onboarding', 'Client onboarding automation', ['Projects', 'CRM', 'Tasks'], 'action'),
  templateBase('Education', 'education-enrollment-followup', 'Enrollment follow-up workflow', ['CRM', 'Analytics', 'Tasks'], 'crm'),
];

const queueItems: ExecutionQueueItem[] = [
  { id: 'exec-2411', workflow: 'Trial conversion command loop', status: 'running', latencyMs: 1280, owner: 'Sales Ops', updatedAt: 'live' },
  { id: 'exec-2408', workflow: 'Low stock reorder control', status: 'queued', latencyMs: 0, owner: 'Operations', updatedAt: '2m' },
  { id: 'exec-2399', workflow: 'Compliance follow-up workflow', status: 'approval', latencyMs: 4120, owner: 'Risk', updatedAt: '7m' },
  { id: 'exec-2394', workflow: 'Delay escalation workflow', status: 'failed', latencyMs: 9310, owner: 'Customer Success', updatedAt: '18m' },
  { id: 'exec-2388', workflow: 'Production exception response', status: 'ai', latencyMs: 2680, owner: 'AI Runtime', updatedAt: '22m' },
];

const metrics: WorkflowMetricCard[] = [
  { label: 'Success rate', value: '98.4%', signal: 'healthy' },
  { label: 'Avg latency', value: '2.8s', signal: 'healthy' },
  { label: 'Pending approvals', value: '14', signal: 'watch' },
  { label: 'Failed actions', value: '3', signal: 'critical' },
  { label: 'Automation savings', value: '42h', signal: 'healthy' },
  { label: 'AI decision confidence', value: '91%', signal: 'healthy' },
];

type WorkflowBuilderState = {
  nodes: WorkflowBuilderNode[];
  edges: WorkflowBuilderEdge[];
  groups: WorkflowNodeGroup[];
  templates: WorkflowTemplateBlueprint[];
  queue: ExecutionQueueItem[];
  metrics: WorkflowMetricCard[];
  selectedNodeId?: string;
  zoom: number;
  pan: { x: number; y: number };
  activeTemplateKey: string;
  aiInstruction: string;
  setSelectedNode: (id?: string) => void;
  setZoom: (zoom: number) => void;
  panBy: (delta: { x: number; y: number }) => void;
  addNode: (type: WorkflowNodeType, position: { x: number; y: number }) => void;
  moveNode: (id: string, delta: { x: number; y: number }) => void;
  applyTemplate: (key: string) => void;
  setAiInstruction: (value: string) => void;
  generateFromPrompt: () => void;
  retryExecution: (id: string) => void;
};

export const useWorkflowBuilderStore = create<WorkflowBuilderState>((set, get) => ({
  nodes: startingNodes,
  edges: startingEdges,
  groups: nodeGroups,
  templates,
  queue: queueItems,
  metrics,
  selectedNodeId: 'ai-1',
  zoom: 1,
  pan: { x: 0, y: 0 },
  activeTemplateKey: 'saas-trial-conversion',
  aiInstruction: 'When a high-value lead is created, let AI qualify it, request manager approval, create an opportunity, and notify the owner.',
  setSelectedNode: (selectedNodeId) => set({ selectedNodeId }),
  setZoom: (zoom) => set({ zoom: Math.min(1.35, Math.max(0.65, zoom)) }),
  panBy: (delta) => set((state) => ({ pan: { x: state.pan.x + delta.x, y: state.pan.y + delta.y } })),
  addNode: (type, position) => set((state) => {
    const id = `${type}-${state.nodes.length + 1}`;
    return { nodes: [...state.nodes, { id, type, label: labelForType(type), description: descriptionForType(type), x: position.x, y: position.y, group: type === 'approval' ? 'risk' : 'operations' }], selectedNodeId: id };
  }),
  moveNode: (id, delta) => set((state) => ({ nodes: state.nodes.map((node) => node.id === id ? { ...node, x: Math.round(node.x + delta.x / state.zoom), y: Math.round(node.y + delta.y / state.zoom) } : node) })),
  applyTemplate: (key) => set((state) => {
    const template = state.templates.find((item) => item.key === key);
    return template ? { nodes: template.nodes, edges: template.edges, activeTemplateKey: key, selectedNodeId: template.nodes[1]?.id } : state;
  }),
  setAiInstruction: (aiInstruction) => set({ aiInstruction }),
  generateFromPrompt: () => set((state) => {
    const instruction = state.aiInstruction.toLowerCase();
    const domain: WorkflowNodeType = instruction.includes('invoice') || instruction.includes('cash') ? 'finance' : instruction.includes('stock') || instruction.includes('inventory') ? 'inventory' : instruction.includes('employee') || instruction.includes('hiring') ? 'hr' : 'crm';
    const generatedNodes: WorkflowBuilderNode[] = [
      { id: 'ai-trigger', type: 'trigger', label: triggerLabel(instruction), description: 'Generated trigger', x: 80, y: 150, group: 'operations' },
      { id: 'ai-decision', type: 'ai_decision', label: 'AI decision', description: 'Context and risk assessment', x: 360, y: 150, group: 'operations', risk: 'low' },
      { id: 'ai-domain', type: domain, label: labelForType(domain), description: descriptionForType(domain), x: 650, y: 150, group: 'revenue' },
      { id: 'ai-approval', type: 'approval', label: 'Approval gate', description: 'Policy-controlled execution', x: 930, y: 240, group: 'risk', risk: domain === 'finance' ? 'high' : 'medium' },
      { id: 'ai-notify', type: 'notification', label: 'Notify channel', description: 'Realtime update', x: 1210, y: 150, group: 'operations' },
    ];
    return { nodes: generatedNodes, edges: generatedNodes.slice(0, -1).map((node, index) => ({ id: `generated-edge-${index + 1}`, source: node.id, target: generatedNodes[index + 1].id, intent: index === 2 ? 'approval' : 'primary' })), selectedNodeId: 'ai-decision', activeTemplateKey: 'ai-generated' };
  }),
  retryExecution: (id) => set((state) => ({ queue: state.queue.map((item) => item.id === id ? { ...item, status: 'queued', updatedAt: 'now' } : item) })),
}));

function labelForType(type: WorkflowNodeType) {
  const labels: Record<WorkflowNodeType, string> = { trigger: 'Trigger', condition: 'Condition', ai_decision: 'AI decision', delay: 'Delay', approval: 'Approval', action: 'Action', notification: 'Notification', webhook: 'Webhook', crm: 'CRM action', finance: 'Finance action', hr: 'HR action', inventory: 'Inventory action' };
  return labels[type];
}

function descriptionForType(type: WorkflowNodeType) {
  const descriptions: Record<WorkflowNodeType, string> = { trigger: 'Starts from an event', condition: 'Evaluates business rules', ai_decision: 'Routes with AI context', delay: 'Waits until a schedule', approval: 'Enforces approval policy', action: 'Executes a task', notification: 'Sends realtime updates', webhook: 'Calls external systems', crm: 'Creates CRM records', finance: 'Creates finance records', hr: 'Coordinates people actions', inventory: 'Acts on stock signals' };
  return descriptions[type];
}

function triggerLabel(instruction: string) {
  if (instruction.includes('invoice')) return 'Invoice event';
  if (instruction.includes('stock') || instruction.includes('inventory')) return 'Inventory event';
  if (instruction.includes('employee')) return 'Employee event';
  return 'Lead event';
}
