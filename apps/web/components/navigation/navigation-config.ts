import type { NavigationItem, WorkspaceConfiguration } from '@/types/workspace';
import { filterNavigationByPermissions } from '@/features/workspace/permission-engine';

export type NavigationSection = {
  key: string;
  label: string;
  items: NavigationItem[];
};

export const navigationSectionLabels: Record<string, string> = {
  operate: 'Operate',
  intelligence: 'Intelligence',
  automation: 'Automation',
  system: 'System',
};

export function createNavigationSections(workspace: WorkspaceConfiguration): NavigationSection[] {
  const enabled = workspace.modules
    .filter((module) => module.enabled)
    
    .sort((a, b) => a.order - b.order)
    .map((module) => ({
      key: module.key,
      label: module.label,
      route: module.route,
      group: module.navGroup,
      icon: module.icon,
      permissions: module.permissions,
      moduleKey: module.key,
      order: module.order,
    }));

  return Object.entries(navigationSectionLabels).map(([key, label]) => ({
    key,
    label,
    items: filterNavigationByPermissions(enabled, workspace.permissions).filter((item) => item.group === key),
  })).filter((section) => section.items.length > 0);
}
