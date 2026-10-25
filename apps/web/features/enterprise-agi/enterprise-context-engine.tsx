import { enterpriseContextSignals } from '@/lib/enterprise-agi';
import { EnterpriseAgiPanel } from './enterprise-agi-panel';

export function EnterpriseContextEngine() {
  return (
    <EnterpriseAgiPanel
      title="Enterprise Context Engine"
      description="Manages organizational memory, business history, strategic context and operational context for AGI recommendations."
      metrics={[
        { label: 'Contexts', value: String(enterpriseContextSignals.length) },
        { label: 'Memory', value: 'Scoped' },
        { label: 'History', value: 'Active' },
        { label: 'Decision', value: 'Evidence' },
      ]}
      items={enterpriseContextSignals.map((item) => ({ id: item.id, title: item.context, eyebrow: item.source, description: item.memoryUse, detail: item.decisionValue, status: item.status }))}
    />
  );
}
