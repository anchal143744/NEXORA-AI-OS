'use client';

import { create } from 'zustand';
import { createAgentAnalytics, createAgentInsights, createAgentMetrics, createAgentWorkspaceData, createAutomationSignals, runAiAgentCommand } from '@/lib/agent-workspace';
import type { AgentDeployment, AgentStatus, AgentWorkspaceData, AiAgentCommandResult, DeploymentStatus, ExecutionStatus } from '@/types/agent-workspace';

type AgentWorkspaceState = AgentWorkspaceData & {
  agentStatusFilter: AgentStatus | 'all';
  deploymentStatusFilter: DeploymentStatus | 'all';
  executionStatusFilter: ExecutionStatus | 'all';
  searchQuery: string;
  commands: AiAgentCommandResult[];
  setSearchQuery: (query: string) => void;
  setAgentStatusFilter: (status: AgentStatus | 'all') => void;
  setDeploymentStatusFilter: (status: DeploymentStatus | 'all') => void;
  setExecutionStatusFilter: (status: ExecutionStatus | 'all') => void;
  startAgent: (agentId: string) => void;
  pauseAgent: (agentId: string) => void;
  stopDeployment: (deploymentId: string) => void;
  deployTemplate: (templateId: string) => void;
  addCommand: (command: AiAgentCommandResult) => void;
  runLocalCommand: (command: string) => AiAgentCommandResult;
};

const initial = createAgentWorkspaceData();

function rebuild() {
  return {
    metrics: createAgentMetrics(),
    analytics: createAgentAnalytics(),
    automationSignals: createAutomationSignals(),
    insights: createAgentInsights(),
  };
}

export const useAgentWorkspaceStore = create<AgentWorkspaceState>((set, get) => ({
  ...initial,
  agentStatusFilter: 'all',
  deploymentStatusFilter: 'all',
  executionStatusFilter: 'all',
  searchQuery: '',
  commands: [],
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setAgentStatusFilter: (agentStatusFilter) => set({ agentStatusFilter }),
  setDeploymentStatusFilter: (deploymentStatusFilter) => set({ deploymentStatusFilter }),
  setExecutionStatusFilter: (executionStatusFilter) => set({ executionStatusFilter }),
  startAgent: (agentId) => set((state) => ({ agents: state.agents.map((agent) => (agent.id === agentId ? { ...agent, status: 'active' } : agent)), ...rebuild() })),
  pauseAgent: (agentId) => set((state) => ({ agents: state.agents.map((agent) => (agent.id === agentId ? { ...agent, status: 'paused' } : agent)), ...rebuild() })),
  stopDeployment: (deploymentId) => set((state) => ({ deployments: state.deployments.map((deployment) => (deployment.id === deploymentId ? { ...deployment, status: 'stopped' } : deployment)), ...rebuild() })),
  deployTemplate: (templateId) => set((state) => {
    const deployment: AgentDeployment = { id: 'dep-' + templateId, agentName: templateId.replace('tpl-', '').replaceAll('-', ' '), version: 'v1.0', environment: 'workspace', status: 'draft', lastAction: 'Queued from template marketplace', approvalPolicy: 'manager' };
    return { deployments: [deployment, ...state.deployments].slice(0, 8), ...rebuild() };
  }),
  addCommand: (command) => set((state) => ({ commands: [command, ...state.commands].slice(0, 6) })),
  runLocalCommand: (command) => {
    const result = runAiAgentCommand(command, get());
    get().addCommand(result);
    return result;
  },
}));
