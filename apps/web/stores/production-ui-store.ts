'use client';

import { create } from 'zustand';
import { createProductionUiWorkspaceData } from '@/lib/production-ui';
import type { ProductionUiWorkspaceData } from '@/types/production-ui';

type ProductionUiState = ProductionUiWorkspaceData & {
  demoModeEnabled: boolean;
  selectedAuditArea: string;
  setDemoModeEnabled: (enabled: boolean) => void;
  setSelectedAuditArea: (area: string) => void;
  startDemoTour: (stepId: string) => void;
};

const initial = createProductionUiWorkspaceData();

export const useProductionUiStore = create<ProductionUiState>((set) => ({
  ...initial,
  demoModeEnabled: true,
  selectedAuditArea: 'All',
  setDemoModeEnabled: (demoModeEnabled) => set({ demoModeEnabled }),
  setSelectedAuditArea: (selectedAuditArea) => set({ selectedAuditArea }),
  startDemoTour: (stepId) => set((state) => ({ demoModeSteps: state.demoModeSteps.map((step) => (step.id === stepId ? { ...step, objective: step.objective + ' Tour queued.' } : step)) })),
}));
