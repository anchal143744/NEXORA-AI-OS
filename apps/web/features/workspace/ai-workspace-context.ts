import type { ModuleKey, WorkspaceAiContext, WorkspaceConfiguration } from '@/types/workspace';
import { createWorkspaceAiContext } from './workspace-config-engine';

export function buildAiWorkspaceContext(config: WorkspaceConfiguration, moduleKey?: ModuleKey, selectedFilters: Record<string, string> = {}): WorkspaceAiContext {
  return createWorkspaceAiContext(config, moduleKey, selectedFilters);
}

export function summarizeAiWorkspaceContext(context: WorkspaceAiContext) {
  return {
    workspace: context.workspaceName,
    organization: context.organizationName,
    industry: context.industry,
    moduleCount: context.enabledModules.length,
    kpiCount: context.kpis.length,
    currency: context.currency,
    timezone: context.timezone,
    permissions: context.permissions,
  };
}
