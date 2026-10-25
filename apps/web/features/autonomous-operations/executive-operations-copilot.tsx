import { executiveOperationsCommands } from '@/lib/autonomous-operations';
import { AutonomousOperationsPanel } from './autonomous-operations-panel';

export function ExecutiveOperationsCopilot() {
  return (
    <AutonomousOperationsPanel
      eyebrow="Executive Operations Copilot"
      title="Executive operations commands"
      description="Show operational health, Predict failures, Analyze risks, Recommend recovery actions, Evaluate governance status and Generate executive operations report."
      items={executiveOperationsCommands.map((item) => ({ title: item.command, detail: item.response }))}
    />
  );
}
