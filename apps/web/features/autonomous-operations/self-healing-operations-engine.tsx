import { healingSignals } from '@/lib/autonomous-operations';
import { AutonomousOperationsPanel } from './autonomous-operations-panel';

export function SelfHealingOperationsEngine() {
  return (
    <AutonomousOperationsPanel
      eyebrow="Self-Healing Operations Engine"
      title="Detect, recommend and recover operations"
      description="Failure Detection, Workflow Recovery, Service Recovery Suggestions, Process Correction Plans and Operational Health Monitoring are modeled together."
      items={healingSignals.map((item) => ({ title: item.capability, meta: item.detection, value: item.recoveryState, detail: item.recommendation, status: item.status }))}
    />
  );
}
