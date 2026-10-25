'use client';

import { useMemo } from 'react';
import { useAnalyticsWorkspaceStore } from '@/stores/analytics-workspace-store';

export function useAnalyticsWorkspaceActions() {
  const createKpiAlert = useAnalyticsWorkspaceStore((state) => state.createKpiAlert);
  const scheduleReport = useAnalyticsWorkspaceStore((state) => state.scheduleReport);
  const runLocalCommand = useAnalyticsWorkspaceStore((state) => state.runLocalCommand);

  return useMemo(() => ({ createKpiAlert, scheduleReport, runLocalCommand }), [createKpiAlert, scheduleReport, runLocalCommand]);
}
