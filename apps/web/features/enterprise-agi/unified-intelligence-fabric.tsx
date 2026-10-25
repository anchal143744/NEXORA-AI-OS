import { intelligenceFabricConnections } from '@/lib/enterprise-agi';
import { EnterpriseAgiPanel } from './enterprise-agi-panel';

export function UnifiedIntelligenceFabric() {
  return (
    <EnterpriseAgiPanel
      title="Unified Intelligence Fabric"
      description="Connects CRM, Finance, HR, Projects, Inventory, Marketing, Customer Success, Analytics and AI Agents into one intelligence layer."
      metrics={[
        { label: 'Connected', value: String(intelligenceFabricConnections.length) },
        { label: 'Isolation', value: 'Tenant' },
        { label: 'Context', value: 'Shared' },
        { label: 'Action', value: 'Coordinated' },
      ]}
      items={intelligenceFabricConnections.map((item) => ({ id: item.id, title: item.module, eyebrow: 'Connected Module', description: item.connectedContext, detail: item.coordinationAction, status: item.status }))}
    />
  );
}
