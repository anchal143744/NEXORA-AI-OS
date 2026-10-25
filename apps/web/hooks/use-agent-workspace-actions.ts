'use client';

import { useMemo } from 'react';
import { useAgentWorkspaceStore } from '@/stores/agent-workspace-store';

export function useAgentWorkspaceActions() {
  const startAgent = useAgentWorkspaceStore((state) => state.startAgent);
  const pauseAgent = useAgentWorkspaceStore((state) => state.pauseAgent);
  const stopDeployment = useAgentWorkspaceStore((state) => state.stopDeployment);
  const deployTemplate = useAgentWorkspaceStore((state) => state.deployTemplate);
  const runLocalCommand = useAgentWorkspaceStore((state) => state.runLocalCommand);

  return useMemo(() => ({ startAgent, pauseAgent, stopDeployment, deployTemplate, runLocalCommand }), [startAgent, pauseAgent, stopDeployment, deployTemplate, runLocalCommand]);
}
