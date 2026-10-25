import { monitoringSignals } from '@/lib/autonomous-operations';
import { AutonomousOperationsPanel } from './autonomous-operations-panel';

export function EnterpriseMonitoringHub() {
  return (
    <AutonomousOperationsPanel
      eyebrow="Enterprise Monitoring Hub"
      title="Monitor application, process, agent and workflow health"
      description="Tracks Application Health, Business Process Health, AI Agent Health, Workflow Health and Integration Health."
      items={monitoringSignals.map((item) => ({ title: item.domain, meta: item.signal, score: item.healthScore, detail: item.action, status: item.status }))}
    />
  );
}
