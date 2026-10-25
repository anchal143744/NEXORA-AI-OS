import { InvoicesWorkspace } from '@/features/finance/invoices-workspace';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><InvoicesWorkspace /></EnterpriseShell>;
}
