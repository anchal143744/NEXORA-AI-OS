export type OperationsStatus = 'healthy' | 'recovering' | 'watch' | 'critical';

export interface ExecutionSignal {
  id: string;
  capability: string;
  scope: string;
  control: string;
  outcome: string;
  status: OperationsStatus;
}

export interface HealingSignal {
  id: string;
  capability: string;
  detection: string;
  recommendation: string;
  recoveryState: string;
  status: OperationsStatus;
}

export interface MonitoringSignal {
  id: string;
  domain: string;
  healthScore: number;
  signal: string;
  action: string;
  status: OperationsStatus;
}

export interface OperationalIntelligenceSignal {
  id: string;
  insight: string;
  source: string;
  impact: string;
  recommendation: string;
  status: OperationsStatus;
}

export interface IncidentPrediction {
  id: string;
  prediction: string;
  probability: string;
  businessImpact: string;
  prevention: string;
  status: OperationsStatus;
}

export interface GovernanceSignal {
  id: string;
  control: string;
  coverage: string;
  evidence: string;
  nextEvolution: string;
  status: OperationsStatus;
}

export interface ComplianceAutomationSignal {
  id: string;
  capability: string;
  cadence: string;
  output: string;
  owner: string;
  status: OperationsStatus;
}

export interface WorkflowRecoverySignal {
  id: string;
  recovery: string;
  trigger: string;
  escalation: string;
  analytics: string;
  status: OperationsStatus;
}

export interface ResilienceMetric {
  id: string;
  metric: string;
  value: string;
  trend: string;
  insight: string;
  status: OperationsStatus;
}

export interface ExecutiveOperationsCommand {
  id: string;
  command: string;
  response: string;
}

export interface AutonomousOperationsRoute {
  path: string;
  module: string;
  marker: string;
}
