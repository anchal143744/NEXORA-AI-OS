import { revenueSimulations } from '@/lib/enterprise-digital-twin';
import { DigitalTwinPanel } from './digital-twin-panel';

export function RevenueSimulationEngine() {
  return (
    <DigitalTwinPanel
      eyebrow="Revenue Simulation Engine"
      title="Simulate MRR, ARR and enterprise revenue"
      description="Forecasts MRR, ARR, Expansion Revenue and Enterprise Contracts with strategy recommendations."
      items={revenueSimulations.map((item) => ({ title: item.revenueType, value: item.simulatedCase, meta: item.baseCase, detail: item.recommendation, status: item.status }))}
    />
  );
}
