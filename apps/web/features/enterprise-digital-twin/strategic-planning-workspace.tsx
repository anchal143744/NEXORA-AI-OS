import { planningSignals } from '@/lib/enterprise-digital-twin';
import { DigitalTwinPanel } from './digital-twin-panel';

export function StrategicPlanningWorkspace() {
  return (
    <DigitalTwinPanel
      eyebrow="Strategic Planning Workspace"
      title="Annual, quarterly, OKR, portfolio and resource planning"
      description="Transforms simulations into executive planning surfaces for annual planning, quarterly planning, OKRs, portfolio and resources."
      items={planningSignals.map((item) => ({ title: item.plan, meta: item.horizon + ' | ' + item.owner, detail: item.decisionSupport, status: item.status }))}
    />
  );
}
