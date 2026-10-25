'use client';

import { useMutation } from '@tanstack/react-query';
import { calculateAiReadinessScore, generateWorkspace, generateWorkspaceBlueprint, buildAiBusinessProfile } from '@/lib/workspace-intelligence';
import { workspaceIntelligenceApi } from '@/services/workspace-intelligence-api';
import { useDiscoveryStore } from '@/stores/discovery-store';
import type { DiscoveryAnswerMap, WorkspaceBlueprint } from '@/types/discovery';

export function useProfileBusiness() {
  const setProfile = useDiscoveryStore((state) => state.setProfile);
  return useMutation({
    mutationFn: async (answers: DiscoveryAnswerMap) => {
      try {
        return await workspaceIntelligenceApi.profileBusiness(answers);
      } catch {
        return buildAiBusinessProfile(answers);
      }
    },
    onSuccess: (profile) => setProfile(profile),
  });
}

export function useGenerateBlueprint() {
  const setBlueprint = useDiscoveryStore((state) => state.setBlueprint);
  const setReadinessScore = useDiscoveryStore((state) => state.setReadinessScore);
  return useMutation({
    mutationFn: async (answers: DiscoveryAnswerMap) => {
      try {
        return await workspaceIntelligenceApi.generateBlueprint(answers);
      } catch {
        return generateWorkspaceBlueprint(answers);
      }
    },
    onSuccess: (blueprint, answers) => {
      setBlueprint(blueprint);
      setReadinessScore(calculateAiReadinessScore(answers, blueprint));
    },
  });
}

export function useOneClickWorkspaceGeneration() {
  const setGenerationResult = useDiscoveryStore((state) => state.setGenerationResult);
  return useMutation({
    mutationFn: async (blueprint: WorkspaceBlueprint) => {
      try {
        return await workspaceIntelligenceApi.generateWorkspace(blueprint);
      } catch {
        return generateWorkspace(blueprint);
      }
    },
    onSuccess: (result) => setGenerationResult(result),
  });
}
