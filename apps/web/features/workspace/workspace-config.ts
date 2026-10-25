import { buildWorkspaceConfiguration } from './workspace-config-engine';
import { registeredWorkspaceModules } from './module-registry';

export const foundationModules = registeredWorkspaceModules;
export const defaultWorkspaceConfig = buildWorkspaceConfiguration();
