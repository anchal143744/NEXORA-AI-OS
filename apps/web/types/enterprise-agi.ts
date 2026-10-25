export type EnterpriseAgiStatus = 'healthy' | 'watch' | 'coordinating' | 'optimizing';

export interface EnterpriseAgiCapability {
  id: string;
  capability: string;
  domain: string;
  businessSignal: string;
  governanceControl: string;
  outcome: string;
  status: EnterpriseAgiStatus;
}

export interface IntelligenceFabricConnection {
  id: string;
  module: string;
  connectedContext: string;
  sharedSignal: string;
  coordinationAction: string;
  status: EnterpriseAgiStatus;
}

export interface CoordinationSignal {
  id: string;
  capability: string;
  source: string;
  synchronization: string;
  enterpriseOutcome: string;
  status: EnterpriseAgiStatus;
}

export interface KnowledgeGraphRelation {
  id: string;
  entity: string;
  relationship: string;
  insight: string;
  action: string;
  status: EnterpriseAgiStatus;
}

export interface EcosystemSignal {
  id: string;
  capability: string;
  orchestration: string;
  intelligence: string;
  businessImpact: string;
  status: EnterpriseAgiStatus;
}

export interface AgentNetworkSignal {
  id: string;
  capability: string;
  commandPattern: string;
  sharedMemory: string;
  executionGuardrail: string;
  status: EnterpriseAgiStatus;
}

export interface EnterpriseContextSignal {
  id: string;
  context: string;
  source: string;
  memoryUse: string;
  decisionValue: string;
  status: EnterpriseAgiStatus;
}

export interface OrganizationalIntelligenceMetric {
  id: string;
  metric: string;
  value: string;
  insight: string;
  recommendation: string;
  status: EnterpriseAgiStatus;
}

export interface ExecutiveAgiCommand {
  id: string;
  command: string;
  response: string;
  evidence: string;
}

export interface StrategicCoordinationSignal {
  id: string;
  objective: string;
  initiative: string;
  alignment: string;
  tracking: string;
  status: EnterpriseAgiStatus;
}

export interface EnterpriseAgiRoute {
  path: string;
  module: string;
  marker: string;
}
