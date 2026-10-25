import { useMemo } from 'react';
import { executiveCopilotCommands } from '@/lib/autonomous-enterprise';
import { useAutonomousEnterpriseStore } from '@/stores/autonomous-enterprise-store';

export function useAutonomousEnterpriseActions() {
  const selectedAdvisor = useAutonomousEnterpriseStore((state) => state.selectedAdvisor);
  const selectedScenario = useAutonomousEnterpriseStore((state) => state.selectedScenario);
  const selectedGoal = useAutonomousEnterpriseStore((state) => state.selectedGoal);

  return useMemo(() => ({
    selectedAdvisor,
    selectedScenario,
    selectedGoal,
    commandCount: executiveCopilotCommands.length,
    primaryCommand: executiveCopilotCommands[0],
  }), [selectedAdvisor, selectedScenario, selectedGoal]);
}
