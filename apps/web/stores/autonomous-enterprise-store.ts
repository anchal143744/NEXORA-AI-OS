import { create } from 'zustand';

interface AutonomousEnterpriseState {
  selectedAdvisor: string;
  selectedScenario: string;
  selectedGoal: string;
  setSelectedAdvisor: (advisor: string) => void;
  setSelectedScenario: (scenario: string) => void;
  setSelectedGoal: (goal: string) => void;
}

export const useAutonomousEnterpriseStore = create<AutonomousEnterpriseState>((set) => ({
  selectedAdvisor: 'ceo',
  selectedScenario: 'what-if',
  selectedGoal: 'assignment',
  setSelectedAdvisor: (advisor) => set({ selectedAdvisor: advisor }),
  setSelectedScenario: (scenario) => set({ selectedScenario: scenario }),
  setSelectedGoal: (goal) => set({ selectedGoal: goal }),
}));
