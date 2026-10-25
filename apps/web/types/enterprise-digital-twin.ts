export type DigitalTwinStatus = 'healthy' | 'accelerating' | 'watch' | 'critical';

export interface TwinEntity {
  id: string;
  entity: string;
  signal: string;
  synchronization: number;
  insight: string;
  status: DigitalTwinStatus;
}

export interface SimulationScenario {
  id: string;
  scenario: string;
  input: string;
  projectedImpact: string;
  confidence: string;
  status: DigitalTwinStatus;
}

export interface PlanningSignal {
  id: string;
  plan: string;
  horizon: string;
  decisionSupport: string;
  owner: string;
  status: DigitalTwinStatus;
}

export interface ScenarioCase {
  id: string;
  caseName: string;
  assumptions: string;
  businessImpact: string;
  action: string;
  status: DigitalTwinStatus;
}

export interface ForecastSignal {
  id: string;
  metric: string;
  current: string;
  forecast: string;
  driver: string;
  status: DigitalTwinStatus;
}

export interface RiskSignal {
  id: string;
  risk: string;
  exposure: string;
  mitigation: string;
  owner: string;
  status: DigitalTwinStatus;
}

export interface ResourceAllocation {
  id: string;
  resource: string;
  currentAllocation: string;
  optimizedAllocation: string;
  expectedOutcome: string;
  status: DigitalTwinStatus;
}

export interface RevenueSimulation {
  id: string;
  revenueType: string;
  baseCase: string;
  simulatedCase: string;
  recommendation: string;
  status: DigitalTwinStatus;
}

export interface MarketExpansionModel {
  id: string;
  market: string;
  readiness: string;
  opportunity: string;
  risk: string;
  status: DigitalTwinStatus;
}

export interface StrategyCopilotCommand {
  id: string;
  command: string;
  response: string;
}

export interface DigitalTwinRoute {
  path: string;
  module: string;
  marker: string;
}
