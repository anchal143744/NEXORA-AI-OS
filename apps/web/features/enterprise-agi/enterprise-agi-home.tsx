import { EnterpriseAgiPanel } from './enterprise-agi-panel';
import { enterpriseAgiCapabilities, intelligenceFabricConnections, organizationalMetrics } from '@/lib/enterprise-agi';

export function EnterpriseAgiHome() {
  const items = [
    ...enterpriseAgiCapabilities.slice(0, 3).map((item) => ({ id: item.id, title: item.capability, eyebrow: item.domain, description: item.businessSignal, detail: item.outcome, status: item.status })),
    ...intelligenceFabricConnections.slice(0, 3).map((item) => ({ id: item.id, title: item.module, eyebrow: 'Intelligence Fabric', description: item.connectedContext, detail: item.coordinationAction, status: item.status })),
  ];

  return (
    <EnterpriseAgiPanel
      title="Autonomous enterprise command center"
      description="A unified command layer for enterprise-wide reasoning, cross-module intelligence, AGI recommendations and executive-grade coordination."
      metrics={[
        { label: 'Modules', value: '10' },
        { label: 'Signals', value: '54' },
        { label: 'Routes', value: '12' },
        { label: 'Version', value: '3.0.0' },
      ]}
      items={items.concat(organizationalMetrics.slice(0, 1).map((item) => ({ id: item.id, title: item.metric, eyebrow: 'Enterprise Health', description: item.insight, detail: item.recommendation, status: item.status })))}
    />
  );
}
