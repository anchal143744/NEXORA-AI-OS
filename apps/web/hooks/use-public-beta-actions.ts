import { useCallback } from 'react';
import { getPublicBetaSnapshot } from '@/services/public-beta-api';
import { usePublicBetaStore } from '@/stores/public-beta-store';

export function usePublicBetaActions() {
  const setSelectedCohort = usePublicBetaStore((state) => state.setSelectedCohort);
  const setSelectedFeedback = usePublicBetaStore((state) => state.setSelectedFeedback);
  const setSelectedGate = usePublicBetaStore((state) => state.setSelectedGate);

  const inspectCohort = useCallback((cohort: string) => {
    setSelectedCohort(cohort);
  }, [setSelectedCohort]);

  const inspectFeedback = useCallback((feedback: string) => {
    setSelectedFeedback(feedback);
  }, [setSelectedFeedback]);

  const inspectGate = useCallback((gate: string) => {
    setSelectedGate(gate);
  }, [setSelectedGate]);

  return {
    inspectCohort,
    inspectFeedback,
    inspectGate,
    loadSnapshot: getPublicBetaSnapshot,
  };
}
