import { ecosystemSignals } from '@/lib/enterprise-agi';
import { EnterpriseAgiPanel } from './enterprise-agi-panel';

export function AutonomousBusinessEcosystem() {
  return (
    <EnterpriseAgiPanel
      title="Autonomous Business Ecosystem"
      description="Enables AI-driven collaboration, business process orchestration, organizational intelligence and enterprise automation."
      metrics={[
        { label: 'Capabilities', value: String(ecosystemSignals.length) },
        { label: 'Automation', value: 'Enterprise' },
        { label: 'Collab', value: 'AI-driven' },
        { label: 'Impact', value: 'Measured' },
      ]}
      items={ecosystemSignals.map((item) => ({ id: item.id, title: item.capability, eyebrow: item.orchestration, description: item.intelligence, detail: item.businessImpact, status: item.status }))}
    />
  );
}
