import { create } from 'zustand';

interface EnterpriseTrustState {
  selectedFinding: string;
  selectedFramework: string;
  selectedRisk: string;
  setSelectedFinding: (finding: string) => void;
  setSelectedFramework: (framework: string) => void;
  setSelectedRisk: (risk: string) => void;
}

export const useEnterpriseTrustStore = create<EnterpriseTrustState>((set) => ({
  selectedFinding: 'dep-high',
  selectedFramework: 'soc2',
  selectedRisk: 'dependency',
  setSelectedFinding: (finding) => set({ selectedFinding: finding }),
  setSelectedFramework: (framework) => set({ selectedFramework: framework }),
  setSelectedRisk: (risk) => set({ selectedRisk: risk }),
}));
