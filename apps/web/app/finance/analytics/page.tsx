import { FinancialAnalytics } from '@/features/finance/financial-analytics';
import { ExecutiveFinanceDashboard } from '@/features/finance/executive-finance-dashboard';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><div className="space-y-5"><FinancialAnalytics /><ExecutiveFinanceDashboard /></div></EnterpriseShell>;
}
