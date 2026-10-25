import { agentNetworkSignals } from '@/lib/enterprise-agi';
import { EnterpriseAgiPanel } from './enterprise-agi-panel';

export function MultiAgentCommandNetwork() {
  return (
    <EnterpriseAgiPanel
      title="Multi-Agent Command Network"
      description="Defines agent hierarchy, agent coordination, agent communication, shared memory and collective execution."
      metrics={[
        { label: 'Signals', value: String(agentNetworkSignals.length) },
        { label: 'Memory', value: 'Shared' },
        { label: 'Guardrails', value: 'Policy' },
        { label: 'Execution', value: 'Collective' },
      ]}
      items={agentNetworkSignals.map((item) => ({ id: item.id, title: item.capability, eyebrow: item.commandPattern, description: item.sharedMemory, detail: item.executionGuardrail, status: item.status }))}
    />
  );
}
