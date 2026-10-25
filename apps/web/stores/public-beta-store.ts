import { create } from 'zustand';

interface PublicBetaState {
  selectedCohort: string;
  selectedFeedback: string;
  selectedGate: string;
  setSelectedCohort: (cohort: string) => void;
  setSelectedFeedback: (feedback: string) => void;
  setSelectedGate: (gate: string) => void;
}

export const usePublicBetaStore = create<PublicBetaState>((set) => ({
  selectedCohort: 'founders',
  selectedFeedback: 'ux-setup',
  selectedGate: 'positioning',
  setSelectedCohort: (cohort) => set({ selectedCohort: cohort }),
  setSelectedFeedback: (feedback) => set({ selectedFeedback: feedback }),
  setSelectedGate: (gate) => set({ selectedGate: gate }),
}));
