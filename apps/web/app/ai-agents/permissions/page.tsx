import { AgentPermissions } from '@/features/ai-agents/agent-permissions';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><AgentPermissions /></EnterpriseShell>;
}
