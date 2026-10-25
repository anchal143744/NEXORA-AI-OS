import { LeaveManagement } from '@/features/people/leave-management';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><LeaveManagement /></EnterpriseShell>;
}
