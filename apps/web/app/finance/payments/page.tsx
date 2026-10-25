import { PaymentsWorkspace } from '@/features/finance/payments-workspace';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><PaymentsWorkspace /></EnterpriseShell>;
}
