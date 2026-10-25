import { KpiManagement } from '@/features/analytics/kpi-management';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><KpiManagement /></EnterpriseShell>;
}
