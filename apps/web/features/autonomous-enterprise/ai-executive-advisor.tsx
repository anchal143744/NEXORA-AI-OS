import { executiveAdvisorSignals } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function AiExecutiveAdvisor() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="AI Executive Advisor"
      title="CEO, CFO, COO, CRO and CTO advisory layer"
      description="Executive advisors translate enterprise signals into focused recommendations for strategy, finance, operations, revenue and technology leadership."
      items={executiveAdvisorSignals.map((item) => ({ title: item.advisor, meta: item.focus, detail: item.recommendation + ' ' + item.businessImpact, status: item.status }))}
    />
  );
}
