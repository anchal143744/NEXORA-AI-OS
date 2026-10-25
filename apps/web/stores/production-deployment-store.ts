import { create } from 'zustand';
import type { EnvironmentTier } from '@/types/production-deployment';

interface ProductionDeploymentState {
  activeEnvironment: EnvironmentTier;
  selectedGate: string;
  setActiveEnvironment: (environment: EnvironmentTier) => void;
  setSelectedGate: (gate: string) => void;
}

export const useProductionDeploymentStore = create<ProductionDeploymentState>((set) => ({
  activeEnvironment: 'production',
  selectedGate: 'backend',
  setActiveEnvironment: (environment) => set({ activeEnvironment: environment }),
  setSelectedGate: (gate) => set({ selectedGate: gate }),
}));
