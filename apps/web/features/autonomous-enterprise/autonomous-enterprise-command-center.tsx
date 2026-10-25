import { autonomousMetrics } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function AutonomousEnterpriseCommandCenter() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="Command Center"
      title="Autonomous enterprise command center"
      description="Tracks enterprise health, strategic recommendations, opportunities, risks and autonomous insights in one executive operating layer."
      items={autonomousMetrics.map((metric) => ({ title: metric.label, value: metric.value, detail: metric.detail, status: metric.status }))}
    />
  );
}
