import { FinancialForecasting } from '@/features/finance/financial-forecasting';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><FinancialForecasting /></EnterpriseShell>;
}
