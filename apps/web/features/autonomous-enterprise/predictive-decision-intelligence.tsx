import { predictionSignals } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function PredictiveDecisionIntelligence() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="Predictive Decision Intelligence"
      title="Forecast business performance before action"
      description="Predicts Revenue, Churn, Hiring Needs, Capacity Requirements and Operational Risks for executive planning."
      items={predictionSignals.map((item) => ({ title: item.prediction, value: item.confidence, detail: item.planningUse, status: item.status }))}
    />
  );
}
