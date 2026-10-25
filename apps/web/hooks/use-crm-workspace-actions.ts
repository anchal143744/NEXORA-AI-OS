'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { crmWorkspaceApi, type CreateCrmLeadPayload } from '@/services/crm-workspace-api';
import { useCrmWorkspaceStore } from '@/stores/crm-workspace-store';
import type { OpportunityStage, QuoteProposal } from '@/types/crm-workspace';

const crmWorkspaceQueryKey = ['crm-workspace'] as const;

export function useCrmWorkspaceQuery() {
  const hydrateWorkspace = useCrmWorkspaceStore((state) => state.hydrateWorkspace);
  return useQuery({
    queryKey: crmWorkspaceQueryKey,
    queryFn: async () => {
      const data = await crmWorkspaceApi.getWorkspace();
      hydrateWorkspace(data);
      return data;
    },
    retry: 1,
    staleTime: 30_000,
  });
}

export function useRunSalesCommand() {
  const addCommand = useCrmWorkspaceStore((state) => state.addCommand);
  return useMutation({
    mutationFn: (command: string) => crmWorkspaceApi.runSalesCommand({ command }),
    onSuccess: (result) => addCommand(result),
  });
}

export function useCreateCrmLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCrmLeadPayload) => crmWorkspaceApi.createLead(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: crmWorkspaceQueryKey });
    },
  });
}

export function useMoveOpportunityStage() {
  const queryClient = useQueryClient();
  const moveOpportunity = useCrmWorkspaceStore((state) => state.moveOpportunity);
  return useMutation({
    mutationFn: async ({ opportunityId, stage }: { opportunityId: string; stage: OpportunityStage }) => {
      moveOpportunity(opportunityId, stage);
      return crmWorkspaceApi.moveOpportunity(opportunityId, { stage });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: crmWorkspaceQueryKey });
    },
  });
}

export function useProposalActions() {
  const queryClient = useQueryClient();
  return {
    exportPdf: useMutation({
      mutationFn: (proposalId: string) => crmWorkspaceApi.exportProposalPdf(proposalId),
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey: crmWorkspaceQueryKey });
      },
    }),
    requestApproval: useMutation({
      mutationFn: (proposal: QuoteProposal) => crmWorkspaceApi.requestProposalApproval(proposal),
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey: crmWorkspaceQueryKey });
      },
    }),
  };
}
