import type { NavigationItem, Permission, WorkspaceModuleConfig, WorkspaceWidgetConfig } from '@/types/workspace';

export function canAccessWorkspaceResource(userPermissions: Permission[], requiredPermissions: Permission[]) {
  if (requiredPermissions.length === 0) return true;
  if (userPermissions.includes('manage')) return true;
  return requiredPermissions.some((permission) => userPermissions.includes(permission));
}

export function filterModulesByPermissions(modules: WorkspaceModuleConfig[], permissions: Permission[]) {
  return modules.filter((module) => module.enabled).filter((module) => canAccessWorkspaceResource(permissions, module.permissions));
}

export function filterNavigationByPermissions(items: NavigationItem[], permissions: Permission[]) {
  return items.filter((item) => canAccessWorkspaceResource(permissions, item.permissions));
}

export function filterWidgetsByPermissions(widgets: WorkspaceWidgetConfig[], permissions: Permission[]) {
  return widgets.filter((widget) => canAccessWorkspaceResource(permissions, widget.permissions));
}
