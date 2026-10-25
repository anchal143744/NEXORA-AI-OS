import { RevenueManagement } from '@/features/finance/revenue-management';
import { ExecutiveFinanceDashboard } from '@/features/finance/executive-finance-dashboard';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><div className="space-y-5"><RevenueManagement /><ExecutiveFinanceDashboard /></div></EnterpriseShell>;
}
