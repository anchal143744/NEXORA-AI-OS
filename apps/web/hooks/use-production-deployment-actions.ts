import { useCallback } from 'react';
import { getProductionDeploymentSnapshot } from '@/services/production-deployment-api';
import { useProductionDeploymentStore } from '@/stores/production-deployment-store';
import type { EnvironmentTier } from '@/types/production-deployment';

export function useProductionDeploymentActions() {
  const setActiveEnvironment = useProductionDeploymentStore((state) => state.setActiveEnvironment);
  const setSelectedGate = useProductionDeploymentStore((state) => state.setSelectedGate);

  const inspectEnvironment = useCallback((environment: EnvironmentTier) => {
    setActiveEnvironment(environment);
  }, [setActiveEnvironment]);

  const inspectGate = useCallback((gate: string) => {
    setSelectedGate(gate);
  }, [setSelectedGate]);

  return {
    inspectEnvironment,
    inspectGate,
    loadSnapshot: getProductionDeploymentSnapshot,
  };
}
