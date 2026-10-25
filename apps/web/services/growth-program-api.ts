import {
  adoptionSignals,
  agentNetworkSignals,
  aiExpansionCapabilities,
  enterpriseAccounts,
  enterpriseSuccessMetrics,
  executiveGrowthCommands,
  expansionOpportunities,
  growthMetrics,
  retentionSignals,
  revenueExpansionMetrics,
  scaleReadinessChecks,
  usageMetrics,
} from '@/lib/growth-program';

export async function getGrowthProgramSnapshot() {
  return {
    metrics: growthMetrics,
    adoption: adoptionSignals,
    expansion: expansionOpportunities,
    accounts: enterpriseAccounts,
    aiExpansion: aiExpansionCapabilities,
    agentNetwork: agentNetworkSignals,
    usage: usageMetrics,
    revenue: revenueExpansionMetrics,
    retention: retentionSignals,
    globalScale: scaleReadinessChecks,
    success: enterpriseSuccessMetrics,
    executive: executiveGrowthCommands,
    generatedAt: new Date().toISOString(),
  };
}

export const growthProgramEndpoints = {
  growth: '/v1/growth-program',
  adoption: '/v1/growth-program/adoption',
  expansion: '/v1/growth-program/expansion',
  accounts: '/v1/growth-program/accounts',
  aiExpansion: '/v1/growth-program/ai-expansion',
  agentNetwork: '/v1/growth-program/agent-network',
  usage: '/v1/growth-program/usage',
  revenue: '/v1/growth-program/revenue',
  retention: '/v1/growth-program/retention',
  globalScale: '/v1/growth-program/global-scale',
  success: '/v1/growth-program/success',
  executive: '/v1/growth-program/executive',
};
