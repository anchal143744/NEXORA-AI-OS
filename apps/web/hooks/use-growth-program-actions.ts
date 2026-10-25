'use client';

import { useMemo } from 'react';
import { useGrowthProgramStore } from '@/stores/growth-program-store';

export function useGrowthProgramActions() {
  const setSelectedAccount = useGrowthProgramStore((state) => state.setSelectedAccount);
  const setSelectedSegment = useGrowthProgramStore((state) => state.setSelectedSegment);
  const setSelectedRisk = useGrowthProgramStore((state) => state.setSelectedRisk);

  return useMemo(() => ({
    inspectAccount: (account: string) => setSelectedAccount(account),
    inspectSegment: (segment: string) => setSelectedSegment(segment),
    inspectRetentionRisk: (risk: string) => setSelectedRisk(risk),
  }), [setSelectedAccount, setSelectedRisk, setSelectedSegment]);
}
