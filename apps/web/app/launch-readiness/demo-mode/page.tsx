import { EnterpriseDemoMode } from '@/features/production-ui/enterprise-demo-mode';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><EnterpriseDemoMode /></EnterpriseShell>;
}
