import { AiAgentCopilot } from '@/features/ai-agents/ai-agent-copilot';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><AiAgentCopilot /></EnterpriseShell>;
}
