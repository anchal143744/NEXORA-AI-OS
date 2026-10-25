import { useMemo } from 'react';
import { executiveOperationsCommands } from '@/lib/autonomous-operations';
import { useAutonomousOperationsStore } from '@/stores/autonomous-operations-store';

export function useAutonomousOperationsActions() {
  const selectedHealthDomain = useAutonomousOperationsStore((state) => state.selectedHealthDomain);
  const selectedIncidentPrediction = useAutonomousOperationsStore((state) => state.selectedIncidentPrediction);
  const selectedGovernanceControl = useAutonomousOperationsStore((state) => state.selectedGovernanceControl);

  return useMemo(() => ({
    selectedHealthDomain,
    selectedIncidentPrediction,
    selectedGovernanceControl,
    commandCount: executiveOperationsCommands.length,
    primaryCommand: executiveOperationsCommands[0],
  }), [selectedHealthDomain, selectedIncidentPrediction, selectedGovernanceControl]);
}
