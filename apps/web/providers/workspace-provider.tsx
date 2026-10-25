'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { buildAiWorkspaceContext } from '@/features/workspace/ai-workspace-context';
import { defaultWorkspaceConfig } from '@/features/workspace/workspace-config';
import { loadWorkspaceConfiguration } from '@/features/workspace/workspace-config-engine';
import type { WorkspaceAiContext, WorkspaceConfiguration } from '@/types/workspace';

type WorkspaceEngineContextValue = {
  config: WorkspaceConfiguration;
  aiContext: WorkspaceAiContext;
  refreshWorkspaceConfiguration: () => void;
};

const WorkspaceContext = createContext<WorkspaceConfiguration>(defaultWorkspaceConfig);
const WorkspaceEngineContext = createContext<WorkspaceEngineContextValue>({
  config: defaultWorkspaceConfig,
  aiContext: buildAiWorkspaceContext(defaultWorkspaceConfig),
  refreshWorkspaceConfiguration: () => undefined,
});

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<WorkspaceConfiguration>(() => defaultWorkspaceConfig);

  const refreshWorkspaceConfiguration = useCallback(() => {
    setConfig(loadWorkspaceConfiguration());
  }, []);

  useEffect(() => {
    refreshWorkspaceConfiguration();
  }, [refreshWorkspaceConfiguration]);

  const aiContext = useMemo(() => buildAiWorkspaceContext(config, config.selectedModuleKey, config.selectedFilters), [config]);
  const engineValue = useMemo(() => ({ config, aiContext, refreshWorkspaceConfiguration }), [config, aiContext]);

  return (
    <WorkspaceContext.Provider value={config}>
      <WorkspaceEngineContext.Provider value={engineValue}>{children}</WorkspaceEngineContext.Provider>
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}

export function useWorkspaceEngine() {
  return useContext(WorkspaceEngineContext);
}
