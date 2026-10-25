'use client';

import { useMemo } from 'react';
import { useEcosystemMarketplaceStore } from '@/stores/ecosystem-marketplace-store';

export function useEcosystemMarketplaceActions() {
  const setSelectedCategory = useEcosystemMarketplaceStore((state) => state.setSelectedCategory);
  const setSelectedPartnerType = useEcosystemMarketplaceStore((state) => state.setSelectedPartnerType);
  const setSelectedInstall = useEcosystemMarketplaceStore((state) => state.setSelectedInstall);

  return useMemo(() => ({
    filterCategory: (category: string) => setSelectedCategory(category),
    inspectPartnerType: (partnerType: string) => setSelectedPartnerType(partnerType),
    startInstallReview: (listingId: string) => setSelectedInstall(listingId),
  }), [setSelectedCategory, setSelectedInstall, setSelectedPartnerType]);
}
