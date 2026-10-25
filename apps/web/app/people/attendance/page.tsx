import { AttendanceManagement } from '@/features/people/attendance-management';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><AttendanceManagement /></EnterpriseShell>;
}
