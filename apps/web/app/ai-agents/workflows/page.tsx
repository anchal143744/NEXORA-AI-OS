import { WorkflowAutomationCenter } from '@/features/ai-agents/workflow-automation-center';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><WorkflowAutomationCenter /></EnterpriseShell>;
}
