import { create } from 'zustand';

interface EcosystemMarketplaceState {
  selectedCategory: string;
  selectedPartnerType: string;
  selectedInstall: string;
  setSelectedCategory: (category: string) => void;
  setSelectedPartnerType: (partnerType: string) => void;
  setSelectedInstall: (install: string) => void;
}

export const useEcosystemMarketplaceStore = create<EcosystemMarketplaceState>((set) => ({
  selectedCategory: 'ai-agents',
  selectedPartnerType: 'Technology Partner',
  selectedInstall: 'salesforce-sync',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedPartnerType: (partnerType) => set({ selectedPartnerType: partnerType }),
  setSelectedInstall: (install) => set({ selectedInstall: install }),
}));
