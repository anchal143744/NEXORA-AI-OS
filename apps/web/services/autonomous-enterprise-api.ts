import {
  agentCollaborationSignals,
  autonomousMetrics,
  executiveAdvisorSignals,
  executiveCopilotCommands,
  goalAutomationSignals,
  knowledgeReasoningSignals,
  optimizationSignals,
  predictionSignals,
  reasoningCapabilities,
  selfOptimizingSignals,
  simulationScenarios,
  strategyPlanSignals,
} from '@/lib/autonomous-enterprise';

export async function getAutonomousEnterpriseSnapshot() {
  return {
    metrics: autonomousMetrics,
    reasoning: reasoningCapabilities,
    agents: agentCollaborationSignals,
    advisors: executiveAdvisorSignals,
    optimization: optimizationSignals,
    predictions: predictionSignals,
    simulations: simulationScenarios,
    goals: goalAutomationSignals,
    selfOptimizing: selfOptimizingSignals,
    knowledge: knowledgeReasoningSignals,
    strategy: strategyPlanSignals,
    commands: executiveCopilotCommands,
  };
}
