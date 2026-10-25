import { EmployeeDirectory } from '@/features/people/employee-directory';
import { AiHrCopilot } from '@/features/people/ai-hr-copilot';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><div className="space-y-5"><EmployeeDirectory /><AiHrCopilot /></div></EnterpriseShell>;
}
