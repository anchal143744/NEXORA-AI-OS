'use client';

import { useMemo } from 'react';
import { useProductionUiStore } from '@/stores/production-ui-store';

export function useProductionUiActions() {
  const setDemoModeEnabled = useProductionUiStore((state) => state.setDemoModeEnabled);
  const setSelectedAuditArea = useProductionUiStore((state) => state.setSelectedAuditArea);
  const startDemoTour = useProductionUiStore((state) => state.startDemoTour);

  return useMemo(() => ({ setDemoModeEnabled, setSelectedAuditArea, startDemoTour }), [setDemoModeEnabled, setSelectedAuditArea, startDemoTour]);
}
