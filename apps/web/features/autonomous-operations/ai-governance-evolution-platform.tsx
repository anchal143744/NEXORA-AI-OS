import { governanceSignals } from '@/lib/autonomous-operations';
import { AutonomousOperationsPanel } from './autonomous-operations-panel';

export function AiGovernanceEvolutionPlatform() {
  return (
    <AutonomousOperationsPanel
      eyebrow="AI Governance Evolution Platform"
      title="Governance that evolves with autonomy"
      description="Manages AI Policies, AI Audits, AI Compliance, Model Monitoring and Agent Governance."
      items={governanceSignals.map((item) => ({ title: item.control, meta: item.coverage, detail: item.evidence + ' ' + item.nextEvolution, status: item.status }))}
    />
  );
}
