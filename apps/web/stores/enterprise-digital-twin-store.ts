import { create } from 'zustand';

interface EnterpriseDigitalTwinState {
  selectedEntity: string;
  selectedScenario: string;
  selectedMarket: string;
  setSelectedEntity: (entity: string) => void;
  setSelectedScenario: (scenario: string) => void;
  setSelectedMarket: (market: string) => void;
}

export const useEnterpriseDigitalTwinStore = create<EnterpriseDigitalTwinState>((set) => ({
  selectedEntity: 'organization',
  selectedScenario: 'expected',
  selectedMarket: 'countries',
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),
  setSelectedScenario: (scenario) => set({ selectedScenario: scenario }),
  setSelectedMarket: (market) => set({ selectedMarket: market }),
}));
