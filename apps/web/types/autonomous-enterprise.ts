export type AutonomousStatus = 'healthy' | 'accelerating' | 'watch' | 'critical';

export interface AutonomousMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  status: AutonomousStatus;
}

export interface ReasoningCapability {
  id: string;
  capability: string;
  mode: string;
  governance: string;
  outcome: string;
  status: AutonomousStatus;
}

export interface AgentCollaborationSignal {
  id: string;
  network: string;
  communication: string;
  sharedMemory: string;
  delegation: string;
  status: AutonomousStatus;
}

export interface ExecutiveAdvisorSignal {
  id: string;
  advisor: string;
  focus: string;
  recommendation: string;
  businessImpact: string;
  status: AutonomousStatus;
}

export interface OptimizationSignal {
  id: string;
  signal: string;
  area: string;
  recommendation: string;
  impact: string;
  status: AutonomousStatus;
}

export interface PredictionSignal {
  id: string;
  prediction: string;
  confidence: string;
  planningUse: string;
  status: AutonomousStatus;
}

export interface SimulationScenario {
  id: string;
  scenario: string;
  model: string;
  result: string;
  decision: string;
  status: AutonomousStatus;
}

export interface GoalAutomationSignal {
  id: string;
  goal: string;
  owner: string;
  actionPlan: string;
  progress: string;
  status: AutonomousStatus;
}

export interface KnowledgeReasoningSignal {
  id: string;
  capability: string;
  context: string;
  intelligence: string;
  status: AutonomousStatus;
}

export interface StrategyPlanSignal {
  id: string;
  plan: string;
  horizon: string;
  roadmap: string;
  outcome: string;
  status: AutonomousStatus;
}

export interface ExecutiveCopilotCommand {
  id: string;
  command: string;
  response: string;
}

export interface AutonomousEnterpriseRoute {
  path: string;
  module: string;
  marker: string;
}
