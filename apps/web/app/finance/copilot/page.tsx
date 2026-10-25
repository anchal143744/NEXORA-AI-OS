import { AiFinanceCopilot } from '@/features/finance/ai-finance-copilot';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><AiFinanceCopilot /></EnterpriseShell>;
}
