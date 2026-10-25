import { autonomousMetrics } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function AutonomousEnterpriseHome() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="Autonomous Enterprise Command Center"
      title="Autonomous enterprise operating system overview"
      description="Enterprise Health, Strategic Recommendations, Opportunity Detection, Risk Detection and Autonomous Insights are unified for executive operators."
      items={autonomousMetrics.map((metric) => ({ title: metric.label, value: metric.value, detail: metric.detail, status: metric.status }))}
    />
  );
}
