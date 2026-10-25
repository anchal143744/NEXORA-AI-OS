import { BusinessIntelligenceDashboards } from '@/features/analytics/business-intelligence-dashboards';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><BusinessIntelligenceDashboards /></EnterpriseShell>;
}
