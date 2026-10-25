import { executionSignals } from '@/lib/autonomous-operations';
import { AutonomousOperationsPanel } from './autonomous-operations-panel';

export function AutonomousOperationsHome() {
  return (
    <AutonomousOperationsPanel
      eyebrow="Autonomous Execution Center"
      title="Autonomous execution with enterprise control"
      description="AI Task Coordination, Cross-System Actions, Execution Planning, Approval Workflows and Autonomous Recommendations are unified for operations leaders."
      items={executionSignals.map((item) => ({ title: item.capability, meta: item.scope, detail: item.control + ' ' + item.outcome, status: item.status }))}
    />
  );
}
