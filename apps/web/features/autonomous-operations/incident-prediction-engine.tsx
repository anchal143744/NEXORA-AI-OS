import { incidentPredictions } from '@/lib/autonomous-operations';
import { AutonomousOperationsPanel } from './autonomous-operations-panel';

export function IncidentPredictionEngine() {
  return (
    <AutonomousOperationsPanel
      eyebrow="Incident Prediction Engine"
      title="Predict failures before customers feel them"
      description="Predicts Service Failures, Process Failures, SLA Breaches and Customer Impact Risks with prevention plans."
      items={incidentPredictions.map((item) => ({ title: item.prediction, value: item.probability, meta: item.businessImpact, detail: item.prevention, status: item.status }))}
    />
  );
}
