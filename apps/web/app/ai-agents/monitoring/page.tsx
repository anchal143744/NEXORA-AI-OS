import { AgentMonitoring } from '@/features/ai-agents/agent-monitoring';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><AgentMonitoring /></EnterpriseShell>;
}
