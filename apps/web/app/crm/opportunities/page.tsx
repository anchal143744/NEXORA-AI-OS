import { CrmDataBoundary } from '@/features/crm/crm-data-boundary';
import { OpportunityManagement } from '@/features/crm/opportunity-management';
import { VisualSalesPipeline } from '@/features/crm/visual-sales-pipeline';

export default function Page() {
  return (
    <CrmDataBoundary>
      <VisualSalesPipeline />
      <OpportunityManagement />
    </CrmDataBoundary>
  );
}
