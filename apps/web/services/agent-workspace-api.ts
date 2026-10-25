import { createAgentWorkspaceData, runAiAgentCommand } from '@/lib/agent-workspace';
import type { AiAgentCommandResult, AgentWorkspaceData } from '@/types/agent-workspace';

export const agentWorkspaceApi = {
  async getWorkspace(): Promise<AgentWorkspaceData> {
    return createAgentWorkspaceData();
  },
  async runCopilotCommand(command: string): Promise<AiAgentCommandResult> {
    return runAiAgentCommand(command);
  },
  async deployTemplate(templateId: string) {
    return { templateId, status: 'queued_for_deployment' as const };
  },
  async updateDeployment(deploymentId: string, action: 'start' | 'pause' | 'stop' | 'clone') {
    return { deploymentId, action, accepted: true };
  },
};
