import { GlobalUxAudit } from '@/features/production-ui/global-ux-audit';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><GlobalUxAudit /></EnterpriseShell>;
}
