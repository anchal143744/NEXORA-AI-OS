import { CashFlowIntelligence } from '@/features/finance/cash-flow-intelligence';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><CashFlowIntelligence /></EnterpriseShell>;
}
