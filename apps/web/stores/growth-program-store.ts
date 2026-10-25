import { create } from 'zustand';

interface GrowthProgramState {
  selectedAccount: string;
  selectedSegment: string;
  selectedRisk: string;
  setSelectedAccount: (account: string) => void;
  setSelectedSegment: (segment: string) => void;
  setSelectedRisk: (risk: string) => void;
}

export const useGrowthProgramStore = create<GrowthProgramState>((set) => ({
  selectedAccount: 'northstar',
  selectedSegment: 'Business and Enterprise plans',
  selectedRisk: 'meridian',
  setSelectedAccount: (account) => set({ selectedAccount: account }),
  setSelectedSegment: (segment) => set({ selectedSegment: segment }),
  setSelectedRisk: (risk) => set({ selectedRisk: risk }),
}));
