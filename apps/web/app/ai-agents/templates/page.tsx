import { AgentTemplatesMarketplace } from '@/features/ai-agents/agent-templates-marketplace';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><AgentTemplatesMarketplace /></EnterpriseShell>;
}
