import type { NavigationItem, WorkspaceConfiguration } from '@/types/workspace';
import { filterNavigationByPermissions } from '@/features/workspace/permission-engine';

export function buildNavigation(config: WorkspaceConfiguration): NavigationItem[] {
  const configuredNavigation = config.modules
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

  return filterNavigationByPermissions(configuredNavigation, config.permissions);
}

export function groupNavigation(items: NavigationItem[]) {
  return items.reduce<Record<string, NavigationItem[]>>((groups, item) => {
    groups[item.group] = [...(groups[item.group] ?? []), item];
    return groups;
  }, {});
}
