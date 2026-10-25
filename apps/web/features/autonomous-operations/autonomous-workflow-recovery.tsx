import { workflowRecoverySignals } from '@/lib/autonomous-operations';
import { AutonomousOperationsPanel } from './autonomous-operations-panel';

export function AutonomousWorkflowRecovery() {
  return (
    <AutonomousOperationsPanel
      eyebrow="Autonomous Workflow Recovery"
      title="Retry, recover, escalate and learn"
      description="Retry Strategies, Recovery Suggestions, Failure Escalation and Recovery Analytics keep operations moving after failures."
      items={workflowRecoverySignals.map((item) => ({ title: item.recovery, meta: item.trigger, detail: item.escalation + ' ' + item.analytics, status: item.status }))}
    />
  );
}
