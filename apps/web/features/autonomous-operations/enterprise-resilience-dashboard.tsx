import { resilienceMetrics } from '@/lib/autonomous-operations';
import { AutonomousOperationsPanel } from './autonomous-operations-panel';

export function EnterpriseResilienceDashboard() {
  return (
    <AutonomousOperationsPanel
      eyebrow="Enterprise Resilience Dashboard"
      title="Reliability, recovery and operational stability"
      description="Displays Reliability Scores, Recovery Metrics, Incident Trends and Operational Stability in an executive-grade view."
      items={resilienceMetrics.map((item) => ({ title: item.metric, value: item.value, meta: item.trend, detail: item.insight, status: item.status }))}
    />
  );
}
