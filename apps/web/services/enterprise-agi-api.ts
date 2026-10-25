import {
  agentNetworkSignals,
  coordinationSignals,
  ecosystemSignals,
  enterpriseAgiCapabilities,
  enterpriseContextSignals,
  executiveAgiCommands,
  intelligenceFabricConnections,
  knowledgeGraphRelations,
  organizationalMetrics,
  strategicCoordinationSignals,
} from '@/lib/enterprise-agi';

export async function getEnterpriseAgiSnapshot() {
  return {
    enterpriseAgiCapabilities,
    intelligenceFabricConnections,
    coordinationSignals,
    knowledgeGraphRelations,
    ecosystemSignals,
    agentNetworkSignals,
    enterpriseContextSignals,
    organizationalMetrics,
    executiveAgiCommands,
    strategicCoordinationSignals,
  };
}
