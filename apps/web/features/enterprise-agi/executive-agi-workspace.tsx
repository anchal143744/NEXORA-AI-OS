import { executiveAgiCommands } from '@/lib/enterprise-agi';
import { EnterpriseAgiPanel } from './enterprise-agi-panel';

export function ExecutiveAgiWorkspace() {
  return (
    <EnterpriseAgiPanel
      title="Executive AGI Workspace"
      description="An AGI interaction interface for executive commands, board reports, growth strategy and coordinated business execution."
      metrics={[
        { label: 'Commands', value: String(executiveAgiCommands.length) },
        { label: 'Output', value: 'Board-ready' },
        { label: 'Clarity', value: 'Executive' },
        { label: 'Action', value: 'Coordinated' },
      ]}
      items={executiveAgiCommands.map((item) => ({ id: item.id, title: item.command, eyebrow: 'Executive Command', description: item.response, detail: item.evidence, status: 'healthy' }))}
    />
  );
}
