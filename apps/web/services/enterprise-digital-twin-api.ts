import {
  forecastSignals,
  marketExpansionModels,
  planningSignals,
  resourceAllocations,
  revenueSimulations,
  riskSignals,
  scenarioCases,
  simulationScenarios,
  strategyCopilotCommands,
  twinEntities,
} from '@/lib/enterprise-digital-twin';

export async function getEnterpriseDigitalTwinSnapshot() {
  return {
    twinEntities,
    simulationScenarios,
    planningSignals,
    scenarioCases,
    forecastSignals,
    riskSignals,
    resourceAllocations,
    revenueSimulations,
    marketExpansionModels,
    strategyCopilotCommands,
  };
}
