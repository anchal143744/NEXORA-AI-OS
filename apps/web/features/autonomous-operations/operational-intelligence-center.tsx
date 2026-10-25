import { operationalIntelligenceSignals } from '@/lib/autonomous-operations';
import { AutonomousOperationsPanel } from './autonomous-operations-panel';

export function OperationalIntelligenceCenter() {
  return (
    <AutonomousOperationsPanel
      eyebrow="Operational Intelligence Center"
      title="Operational analytics that points to action"
      description="Analyzes Bottlenecks, Failure Patterns, Operational Risks, Productivity Issues and Resource Constraints."
      items={operationalIntelligenceSignals.map((item) => ({ title: item.insight, meta: item.source, detail: item.impact + ' ' + item.recommendation, status: item.status }))}
    />
  );
}
