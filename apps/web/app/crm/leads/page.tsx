import { AiSalesCopilot } from '@/features/crm/ai-sales-copilot';
import { CrmDataBoundary } from '@/features/crm/crm-data-boundary';
import { LeadManagement } from '@/features/crm/lead-management';

export default function Page() {
  return (
    <CrmDataBoundary>
      <LeadManagement />
      <AiSalesCopilot />
    </CrmDataBoundary>
  );
}
