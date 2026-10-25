import { create } from 'zustand';

interface PublicLaunchState {
  selectedPlan: string;
  selectedChannel: string;
  selectedRisk: string;
  setSelectedPlan: (plan: string) => void;
  setSelectedChannel: (channel: string) => void;
  setSelectedRisk: (risk: string) => void;
}

export const usePublicLaunchStore = create<PublicLaunchState>((set) => ({
  selectedPlan: 'ai-enterprise',
  selectedChannel: 'enterprise',
  selectedRisk: 'dependency-audit',
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
  setSelectedRisk: (risk) => set({ selectedRisk: risk }),
}));
