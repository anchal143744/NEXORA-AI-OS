import { executionSignals } from '@/lib/autonomous-operations';
import { AutonomousOperationsPanel } from './autonomous-operations-panel';

export function AutonomousExecutionCenter() {
  return (
    <AutonomousOperationsPanel
      eyebrow="Autonomous Execution Center"
      title="Coordinate work across systems"
      description="Coordinates AI tasks, cross-system actions, execution planning, approval workflows and autonomous recommendations with governance boundaries."
      items={executionSignals.map((item) => ({ title: item.capability, meta: item.scope, detail: item.control + ' ' + item.outcome, status: item.status }))}
    />
  );
}
