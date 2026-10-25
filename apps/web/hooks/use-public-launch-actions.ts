'use client';

import { useMemo } from 'react';
import { usePublicLaunchStore } from '@/stores/public-launch-store';

export function usePublicLaunchActions() {
  const setSelectedPlan = usePublicLaunchStore((state) => state.setSelectedPlan);
  const setSelectedChannel = usePublicLaunchStore((state) => state.setSelectedChannel);
  const setSelectedRisk = usePublicLaunchStore((state) => state.setSelectedRisk);

  return useMemo(() => ({
    inspectPlan: (plan: string) => setSelectedPlan(plan),
    inspectAcquisitionChannel: (channel: string) => setSelectedChannel(channel),
    inspectLaunchRisk: (risk: string) => setSelectedRisk(risk),
  }), [setSelectedChannel, setSelectedPlan, setSelectedRisk]);
}
