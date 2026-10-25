'use client';

import { create } from 'zustand';
import { createAiSalesInsights, createCrmMetrics, createEmptyCrmWorkspaceData, createForecasts, createRevOpsMetrics } from '@/lib/crm-workspace';
import type { AiSalesCommandResult, CrmWorkspaceData, LeadStatus, OpportunityStage } from '@/types/crm-workspace';

type CrmWorkspaceState = CrmWorkspaceData & {
  selectedStage: OpportunityStage | 'all';
  leadStatusFilter: LeadStatus | 'all';
  searchQuery: string;
  selectedAccountId: string;
  commands: AiSalesCommandResult[];
  hydrateWorkspace: (data: CrmWorkspaceData) => void;
  setSearchQuery: (query: string) => void;
  setSelectedStage: (stage: OpportunityStage | 'all') => void;
  setLeadStatusFilter: (status: LeadStatus | 'all') => void;
  setSelectedAccountId: (accountId: string) => void;
  moveOpportunity: (opportunityId: string, stage: OpportunityStage) => void;
  addCommand: (command: AiSalesCommandResult) => void;
};

const initial = createEmptyCrmWorkspaceData();

function rebuild(data: Pick<CrmWorkspaceData, 'leads' | 'opportunities'>) {
  return {
    metrics: createCrmMetrics(data.opportunities),
    forecasts: createForecasts(data.opportunities),
    revOps: createRevOpsMetrics(data.opportunities),
    insights: createAiSalesInsights({ leads: data.leads, opportunities: data.opportunities }),
  };
}

export const useCrmWorkspaceStore = create<CrmWorkspaceState>((set) => ({
  ...initial,
  selectedStage: 'all',
  leadStatusFilter: 'all',
  searchQuery: '',
  selectedAccountId: '',
  commands: [],
  hydrateWorkspace: (data) =>
    set((state) => ({
      ...data,
      selectedStage: state.selectedStage,
      leadStatusFilter: state.leadStatusFilter,
      searchQuery: state.searchQuery,
      selectedAccountId: state.selectedAccountId || data.accounts[0]?.id || '',
      commands: state.commands,
    })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedStage: (selectedStage) => set({ selectedStage }),
  setLeadStatusFilter: (leadStatusFilter) => set({ leadStatusFilter }),
  setSelectedAccountId: (selectedAccountId) => set({ selectedAccountId }),
  moveOpportunity: (opportunityId, stage) =>
    set((state) => {
      const opportunities = state.opportunities.map((opportunity) => (opportunity.id === opportunityId ? { ...opportunity, stage } : opportunity));
      return { opportunities, ...rebuild({ leads: state.leads, opportunities }) };
    }),
  addCommand: (command) => set((state) => ({ commands: [command, ...state.commands].slice(0, 6) })),
}));
