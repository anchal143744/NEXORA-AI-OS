import { apiRequest } from '@/lib/api-client';
import type { AiCommand, WorkspaceLaunchPlan } from '@/types/command-center';

const base = '/v1/command-center';

export const commandCenterApi = {
  createWorkspace: (payload: WorkspaceLaunchPlan) =>
    apiRequest<{ workspaceId: string; status: string }, WorkspaceLaunchPlan>(base + '/workspaces', { method: 'POST', body: payload }),
  runCommand: (payload: { command: string }) =>
    apiRequest<AiCommand, { command: string }>(base + '/ai-command', { method: 'POST', body: payload }),
  getLaunchPlan: () => apiRequest<WorkspaceLaunchPlan>(base + '/launch-plan'),
};
