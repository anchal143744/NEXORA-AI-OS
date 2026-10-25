import { ForecastingCenter } from '@/features/analytics/forecasting-center';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><ForecastingCenter /></EnterpriseShell>;
}
