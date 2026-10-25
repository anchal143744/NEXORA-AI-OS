import { optimizationSignals } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function AutonomousWorkflowOptimization() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="Autonomous Workflow Optimization"
      title="Bottleneck detection and process improvement"
      description="Detects bottlenecks, recommends process improvements, suggests automation and identifies cost reduction opportunities."
      items={optimizationSignals.map((item) => ({ title: item.signal, meta: item.area, detail: item.recommendation + ' ' + item.impact, status: item.status }))}
    />
  );
}
