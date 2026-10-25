import { BillingManagement } from '@/features/finance/billing-management';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><BillingManagement /></EnterpriseShell>;
}
