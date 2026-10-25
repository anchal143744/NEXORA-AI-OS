import { strategyCopilotCommands } from '@/lib/enterprise-digital-twin';
import { DigitalTwinPanel } from './digital-twin-panel';

export function ExecutiveStrategyCopilot() {
  return (
    <DigitalTwinPanel
      eyebrow="Executive Strategy Copilot"
      title="Board-level strategy commands"
      description="Create strategic plan, Run business simulation, Predict revenue, Evaluate risk, Recommend expansion strategy and Generate board-level insights."
      items={strategyCopilotCommands.map((item) => ({ title: item.command, detail: item.response }))}
    />
  );
}
