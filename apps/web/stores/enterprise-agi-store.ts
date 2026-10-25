import { create } from 'zustand';

interface EnterpriseAgiState {
  selectedFabricModule: string;
  selectedObjective: string;
  selectedExecutiveCommand: string;
  setSelectedFabricModule: (module: string) => void;
  setSelectedObjective: (objective: string) => void;
  setSelectedExecutiveCommand: (command: string) => void;
}

export const useEnterpriseAgiStore = create<EnterpriseAgiState>((set) => ({
  selectedFabricModule: 'crm',
  selectedObjective: 'objectives',
  selectedExecutiveCommand: 'health',
  setSelectedFabricModule: (module) => set({ selectedFabricModule: module }),
  setSelectedObjective: (objective) => set({ selectedObjective: objective }),
  setSelectedExecutiveCommand: (command) => set({ selectedExecutiveCommand: command }),
}));
