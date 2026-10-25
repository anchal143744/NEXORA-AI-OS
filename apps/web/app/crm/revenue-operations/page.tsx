import { CrmDataBoundary } from '@/features/crm/crm-data-boundary';
import { RevenueForecasting } from '@/features/crm/revenue-forecasting';
import { RevenueOperationsDashboard } from '@/features/crm/revenue-operations-dashboard';

export default function Page() {
  return (
    <CrmDataBoundary>
      <RevenueForecasting />
      <RevenueOperationsDashboard />
    </CrmDataBoundary>
  );
}
