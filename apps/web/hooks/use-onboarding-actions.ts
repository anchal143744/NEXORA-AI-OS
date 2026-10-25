'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { onboardingApi } from '@/services/onboarding-api';
import { useOnboardingStore } from '@/stores/onboarding-store';
import type { BusinessProfile, InviteDraft, RoleAssignmentDraft, WorkspaceGenerationRequest } from '@/types/onboarding';

export function useOnboardingProgress() {
  return useQuery({
    queryKey: ['onboarding', 'progress'],
    queryFn: onboardingApi.progress,
    retry: false,
  });
}

export function useSaveBusinessProfile() {
  return useMutation({
    mutationFn: (payload: BusinessProfile) => onboardingApi.saveBusinessProfile(payload),
  });
}

export function useGenerateWorkspace() {
  const setWorkspaceResult = useOnboardingStore((state) => state.setWorkspaceResult);
  return useMutation({
    mutationFn: (payload: WorkspaceGenerationRequest) => onboardingApi.generateWorkspace(payload),
    onSuccess: (result) => setWorkspaceResult(result),
  });
}

export function useSendInvite() {
  return useMutation({
    mutationFn: (payload: InviteDraft) => onboardingApi.sendInvite(payload),
  });
}

export function useAssignRole() {
  return useMutation({
    mutationFn: (payload: RoleAssignmentDraft) => onboardingApi.assignRole(payload),
  });
}
