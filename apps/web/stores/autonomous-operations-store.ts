import { create } from 'zustand';

interface AutonomousOperationsState {
  selectedHealthDomain: string;
  selectedIncidentPrediction: string;
  selectedGovernanceControl: string;
  setSelectedHealthDomain: (domain: string) => void;
  setSelectedIncidentPrediction: (prediction: string) => void;
  setSelectedGovernanceControl: (control: string) => void;
}

export const useAutonomousOperationsStore = create<AutonomousOperationsState>((set) => ({
  selectedHealthDomain: 'application',
  selectedIncidentPrediction: 'service-failures',
  selectedGovernanceControl: 'policies',
  setSelectedHealthDomain: (domain) => set({ selectedHealthDomain: domain }),
  setSelectedIncidentPrediction: (prediction) => set({ selectedIncidentPrediction: prediction }),
  setSelectedGovernanceControl: (control) => set({ selectedGovernanceControl: control }),
}));
