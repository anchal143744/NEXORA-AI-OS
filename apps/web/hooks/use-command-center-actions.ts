'use client';

import { useMutation } from '@tanstack/react-query';
import { runAiCommand } from '@/lib/command-center';
import { commandCenterApi } from '@/services/command-center-api';
import { useCommandCenterStore } from '@/stores/command-center-store';
import type { WorkspaceLaunchPlan } from '@/types/command-center';

export function useRunAiCommand() {
  const addCommand = useCommandCenterStore((state) => state.addCommand);
  return useMutation({
    mutationFn: async (command: string) => {
      try {
        return await commandCenterApi.runCommand({ command });
      } catch {
        return runAiCommand(command);
      }
    },
    onSuccess: (result) => addCommand(result),
  });
}

export function useCreateWorkspaceFromCommandCenter() {
  return useMutation({
    mutationFn: async (plan: WorkspaceLaunchPlan) => {
      try {
        return await commandCenterApi.createWorkspace(plan);
      } catch {
        return { workspaceId: plan.workspaceId, status: 'ready' };
      }
    },
  });
}
