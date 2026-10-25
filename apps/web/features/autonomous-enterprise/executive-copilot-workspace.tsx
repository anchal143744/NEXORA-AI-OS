import { executiveCopilotCommands } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function ExecutiveCopilotWorkspace() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="Executive Copilot Workspace"
      title="Executive commands for autonomous enterprise"
      description="Show business risks, Show growth opportunities, Optimize operations, Generate executive plan, Forecast business performance and Recommend strategic actions."
      items={executiveCopilotCommands.map((item) => ({ title: item.command, detail: item.response }))}
    />
  );
}
