import { enterpriseAgiCapabilities } from '@/lib/enterprise-agi';
import { EnterpriseAgiPanel } from './enterprise-agi-panel';

export function EnterpriseAgiCore() {
  return (
    <EnterpriseAgiPanel
      title="Enterprise AGI Core"
      description="Enterprise-wide reasoning, multi-domain intelligence, strategic planning, business understanding and goal orchestration."
      metrics={[
        { label: 'Capabilities', value: String(enterpriseAgiCapabilities.length) },
        { label: 'Governance', value: 'RBAC' },
        { label: 'Scope', value: 'Global' },
        { label: 'Mode', value: 'Reasoning' },
      ]}
      items={enterpriseAgiCapabilities.map((item) => ({ id: item.id, title: item.capability, eyebrow: item.domain, description: item.businessSignal, detail: item.outcome, status: item.status }))}
    />
  );
}
