import { strategicCoordinationSignals } from '@/lib/enterprise-agi';
import { EnterpriseAgiPanel } from './enterprise-agi-panel';

export function StrategicCoordinationHub() {
  return (
    <EnterpriseAgiPanel
      title="Strategic Coordination Hub"
      description="Provides enterprise objectives, strategic initiatives, organizational alignment and execution tracking."
      metrics={[
        { label: 'Signals', value: String(strategicCoordinationSignals.length) },
        { label: 'Objectives', value: 'Active' },
        { label: 'Alignment', value: 'Tracked' },
        { label: 'Execution', value: 'Visible' },
      ]}
      items={strategicCoordinationSignals.map((item) => ({ id: item.id, title: item.objective, eyebrow: item.initiative, description: item.alignment, detail: item.tracking, status: item.status }))}
    />
  );
}
