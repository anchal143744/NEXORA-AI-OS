import {
  complianceAutomationSignals,
  executiveOperationsCommands,
  executionSignals,
  governanceSignals,
  healingSignals,
  incidentPredictions,
  monitoringSignals,
  operationalIntelligenceSignals,
  resilienceMetrics,
  workflowRecoverySignals,
} from '@/lib/autonomous-operations';

export async function getAutonomousOperationsSnapshot() {
  return {
    executionSignals,
    healingSignals,
    monitoringSignals,
    operationalIntelligenceSignals,
    incidentPredictions,
    governanceSignals,
    complianceAutomationSignals,
    workflowRecoverySignals,
    resilienceMetrics,
    executiveOperationsCommands,
  };
}
