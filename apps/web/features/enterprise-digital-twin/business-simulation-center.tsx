import { simulationScenarios } from '@/lib/enterprise-digital-twin';
import { DigitalTwinPanel } from './digital-twin-panel';

export function BusinessSimulationCenter() {
  return (
    <DigitalTwinPanel
      eyebrow="Business Simulation Center"
      title="Simulate enterprise business outcomes"
      description="Simulates Growth Scenarios, Revenue Changes, Hiring Plans, Budget Adjustments, Product Launches and Market Expansion."
      items={simulationScenarios.map((item) => ({ title: item.scenario, value: item.confidence, meta: item.input, detail: item.projectedImpact, status: item.status }))}
    />
  );
}
