import { StrategicInsightsEngine } from '@/features/analytics/strategic-insights-engine';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><StrategicInsightsEngine /></EnterpriseShell>;
}
