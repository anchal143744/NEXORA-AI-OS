import { agentCollaborationSignals } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function MultiAgentCollaborationNetwork() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="Multi-Agent Collaboration Network"
      title="Coordinated agent execution"
      description="Agent Communication, Shared Memory, Agent Teams, Task Delegation and Goal Coordination connect autonomous execution across the enterprise."
      items={agentCollaborationSignals.map((item) => ({ title: item.network, meta: item.communication, detail: item.sharedMemory + ' ' + item.delegation, status: item.status }))}
    />
  );
}
