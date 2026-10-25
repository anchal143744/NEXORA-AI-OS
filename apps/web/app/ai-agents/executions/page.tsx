import { AgentExecutionHistory } from '@/features/ai-agents/agent-execution-history';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><AgentExecutionHistory /></EnterpriseShell>;
}
