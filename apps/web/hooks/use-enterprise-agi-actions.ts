'use client';

import { useMemo } from 'react';
import { getEnterpriseAgiSnapshot } from '@/services/enterprise-agi-api';
import { useEnterpriseAgiStore } from '@/stores/enterprise-agi-store';

export function useEnterpriseAgiActions() {
  const selectedFabricModule = useEnterpriseAgiStore((state) => state.selectedFabricModule);
  const selectedObjective = useEnterpriseAgiStore((state) => state.selectedObjective);
  const selectedExecutiveCommand = useEnterpriseAgiStore((state) => state.selectedExecutiveCommand);
  const setSelectedFabricModule = useEnterpriseAgiStore((state) => state.setSelectedFabricModule);
  const setSelectedObjective = useEnterpriseAgiStore((state) => state.setSelectedObjective);
  const setSelectedExecutiveCommand = useEnterpriseAgiStore((state) => state.setSelectedExecutiveCommand);

  return useMemo(() => ({
    selectedFabricModule,
    selectedObjective,
    selectedExecutiveCommand,
    setSelectedFabricModule,
    setSelectedObjective,
    setSelectedExecutiveCommand,
    getSnapshot: getEnterpriseAgiSnapshot,
  }), [
    selectedFabricModule,
    selectedObjective,
    selectedExecutiveCommand,
    setSelectedFabricModule,
    setSelectedObjective,
    setSelectedExecutiveCommand,
  ]);
}
