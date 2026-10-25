import type { WorkflowBuilderEdge, WorkflowBuilderNode } from '@/features/workflows/workflow-types';

const jsonHeaders = { 'Content-Type': 'application/json' };

export interface WorkflowDefinitionPayload {
  name: string;
  slug: string;
  industry?: string;
  nodes: WorkflowBuilderNode[];
  edges: WorkflowBuilderEdge[];
  nodeGroups?: Array<Record<string, unknown>>;
  canvas?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export const workflowBuilderApi = {
  createDefinition(payload: WorkflowDefinitionPayload) {
    return fetch('/api/v1/workflow-builder/definitions', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload) });
  },
  publishDefinition(id: string) {
    return fetch(`/api/v1/workflow-builder/definitions/${id}/publish`, { method: 'POST', headers: jsonHeaders });
  },
  generateWorkflow(instruction: string, industry?: string) {
    return fetch('/api/v1/workflow-ai/generate', { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ instruction, industry }) });
  },
  retryExecution(id: string) {
    return fetch(`/api/v1/workflow-executions/${id}/retry`, { method: 'POST', headers: jsonHeaders });
  },
};
