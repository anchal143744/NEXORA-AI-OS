'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsWorkspaceApi } from '@/services/projects-workspace-api';
import { useAuthStore } from '@/stores/auth-store';
import type { CreateProjectPayload, CreateProjectTaskPayload, TaskStatus, UpdateProjectPayload } from '@/types/projects-workspace';

function useProjectsWorkspaceQueryKey() {
  const session = useAuthStore((state) => state.session);
  return ['projects-workspace', session?.tenantId ?? 'anonymous', session?.organizationId ?? 'no-organization', session?.workspaceId ?? 'no-workspace'] as const;
}

export function useProjectsWorkspaceQuery() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);
  const queryKey = useProjectsWorkspaceQueryKey();
  return useQuery({
    queryKey,
    queryFn: () => projectsWorkspaceApi.getWorkspace(),
    enabled: hydrated && status === 'authenticated' && Boolean(session?.accessToken),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const queryKey = useProjectsWorkspaceQueryKey();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectsWorkspaceApi.createProject(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const queryKey = useProjectsWorkspaceQueryKey();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProjectPayload }) => projectsWorkspaceApi.updateProject(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useCreateProjectTask() {
  const queryClient = useQueryClient();
  const queryKey = useProjectsWorkspaceQueryKey();
  return useMutation({
    mutationFn: (payload: CreateProjectTaskPayload) => projectsWorkspaceApi.createTask(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUpdateProjectTaskStatus() {
  const queryClient = useQueryClient();
  const queryKey = useProjectsWorkspaceQueryKey();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => projectsWorkspaceApi.updateTaskStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}
