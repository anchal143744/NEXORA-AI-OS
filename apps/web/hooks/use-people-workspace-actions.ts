'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { peopleWorkspaceApi } from '@/services/people-workspace-api';
import { useAuthStore } from '@/stores/auth-store';
import { usePeopleWorkspaceStore } from '@/stores/people-workspace-store';
import type { CandidateStage, LeaveRequest } from '@/types/people-workspace';

function usePeopleWorkspaceQueryKey() {
  const session = useAuthStore((state) => state.session);
  return ['people-workspace', session?.tenantId ?? 'anonymous', session?.organizationId ?? 'no-organization', session?.workspaceId ?? 'no-workspace'] as const;
}

export function usePeopleWorkspaceQuery() {
  const hydrateWorkspace = usePeopleWorkspaceStore((state) => state.hydrateWorkspace);
  const hydrated = useAuthStore((state) => state.hydrated);
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);
  const queryKey = usePeopleWorkspaceQueryKey();
  return useQuery({
    queryKey,
    queryFn: async () => {
      const data = await peopleWorkspaceApi.getWorkspace();
      hydrateWorkspace(data);
      return data;
    },
    enabled: hydrated && status === 'authenticated' && Boolean(session?.accessToken),
    retry: 1,
    staleTime: 30_000,
  });
}

export function useRunHrCommand() {
  const addCommand = usePeopleWorkspaceStore((state) => state.addCommand);
  return useMutation({
    mutationFn: (command: string) => peopleWorkspaceApi.runHrCommand({ command }),
    onSuccess: (result) => addCommand(result),
  });
}

export function useMoveCandidateStage() {
  const queryClient = useQueryClient();
  const queryKey = usePeopleWorkspaceQueryKey();
  const moveCandidate = usePeopleWorkspaceStore((state) => state.moveCandidate);
  return useMutation({
    mutationFn: ({ candidateId, stage }: { candidateId: string; stage: CandidateStage }) => peopleWorkspaceApi.moveCandidate(candidateId, { stage }),
    onSuccess: (_, { candidateId, stage }) => {
      moveCandidate(candidateId, stage);
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useApproveLeaveRequest() {
  const queryClient = useQueryClient();
  const queryKey = usePeopleWorkspaceQueryKey();
  const approveLeave = usePeopleWorkspaceStore((state) => state.approveLeave);
  return useMutation({
    mutationFn: (leaveRequest: LeaveRequest) => peopleWorkspaceApi.approveLeave(leaveRequest),
    onSuccess: (leaveRequest) => {
      approveLeave(leaveRequest.id);
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}
