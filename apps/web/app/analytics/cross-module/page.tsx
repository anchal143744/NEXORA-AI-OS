import { CrossModuleAnalytics } from '@/features/analytics/cross-module-analytics';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><CrossModuleAnalytics /></EnterpriseShell>;
}
