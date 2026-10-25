'use client';

import { create } from 'zustand';
import { createAnalyticsMetrics, createAnalyticsWorkspaceData, runAiAnalyticsCommand } from '@/lib/analytics-workspace';
import type { AiAnalyticsCommandResult, AnalyticsWorkspaceData, DashboardDomain, ForecastType } from '@/types/analytics-workspace';

type AnalyticsWorkspaceState = AnalyticsWorkspaceData & {
  dashboardFilter: DashboardDomain | 'all';
  forecastFilter: ForecastType | 'all';
  searchQuery: string;
  commands: AiAnalyticsCommandResult[];
  setSearchQuery: (query: string) => void;
  setDashboardFilter: (domain: DashboardDomain | 'all') => void;
  setForecastFilter: (type: ForecastType | 'all') => void;
  createKpiAlert: (kpiId: string) => void;
  scheduleReport: (reportId: string) => void;
  addCommand: (command: AiAnalyticsCommandResult) => void;
  runLocalCommand: (command: string) => AiAnalyticsCommandResult;
};

const initial = createAnalyticsWorkspaceData();

export const useAnalyticsWorkspaceStore = create<AnalyticsWorkspaceState>((set, get) => ({
  ...initial,
  dashboardFilter: 'all',
  forecastFilter: 'all',
  searchQuery: '',
  commands: [],
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDashboardFilter: (dashboardFilter) => set({ dashboardFilter }),
  setForecastFilter: (forecastFilter) => set({ forecastFilter }),
  createKpiAlert: (kpiId) => set((state) => ({ metrics: createAnalyticsMetrics(), kpis: state.kpis.map((kpi) => (kpi.id === kpiId ? { ...kpi, alert: 'Executive alert enabled' } : kpi)) })),
  scheduleReport: (reportId) => set((state) => ({ reports: state.reports.map((report) => (report.id === reportId ? { ...report, schedule: 'Scheduled for leadership review' } : report)) })),
  addCommand: (command) => set((state) => ({ commands: [command, ...state.commands].slice(0, 6) })),
  runLocalCommand: (command) => {
    const result = runAiAnalyticsCommand(command, get());
    get().addCommand(result);
    return result;
  },
}));
