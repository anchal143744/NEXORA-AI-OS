import { EnterpriseAutomationDashboard } from '@/features/ai-agents/enterprise-automation-dashboard';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><EnterpriseAutomationDashboard /></EnterpriseShell>;
}
