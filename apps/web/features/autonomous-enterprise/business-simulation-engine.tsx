import { simulationScenarios } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function BusinessSimulationEngine() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="Business Simulation Engine"
      title="What If Analysis and executive scenarios"
      description="Supports What If Analysis, Growth Scenarios, Budget Simulations, Resource Simulations and Risk Simulations."
      items={simulationScenarios.map((item) => ({ title: item.scenario, meta: item.model, detail: item.result + ' ' + item.decision, status: item.status }))}
    />
  );
}
