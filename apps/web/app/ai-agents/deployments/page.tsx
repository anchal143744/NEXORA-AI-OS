import { AgentDeploymentCenter } from '@/features/ai-agents/agent-deployment-center';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><AgentDeploymentCenter /></EnterpriseShell>;
}
