import type { WorkspacePersonalization, WorkspaceWidgetConfig } from '@/types/workspace';
import { createDefaultPersonalization } from './workspace-config-engine';

const personalizationKeyPrefix = 'nexora.phase4.workspace-personalization.';

export function loadWorkspacePersonalization(workspaceId: string, widgets: WorkspaceWidgetConfig[]) {
  if (typeof window === 'undefined') return createDefaultPersonalization(widgets);

  const raw = window.localStorage.getItem(personalizationKeyPrefix + workspaceId);
  if (!raw) return createDefaultPersonalization(widgets);

  try {
    return normalizePersonalization(JSON.parse(raw) as WorkspacePersonalization, widgets);
  } catch {
    return createDefaultPersonalization(widgets);
  }
}

export function saveWorkspacePersonalization(workspaceId: string, personalization: WorkspacePersonalization) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(personalizationKeyPrefix + workspaceId, JSON.stringify(personalization));
}

export function applyWorkspacePersonalization(widgets: WorkspaceWidgetConfig[], personalization: WorkspacePersonalization) {
  const order = personalization.layoutOrder.length > 0 ? personalization.layoutOrder : widgets.map((widget) => widget.id);
  const orderMap = new Map(order.map((widgetId, index) => [widgetId, index]));

  return [...widgets].sort((a, b) => {
    const aPinned = personalization.pinnedWidgetIds.includes(a.id) ? 0 : 1;
    const bPinned = personalization.pinnedWidgetIds.includes(b.id) ? 0 : 1;
    if (aPinned !== bPinned) return aPinned - bPinned;
    return (orderMap.get(a.id) ?? a.order) - (orderMap.get(b.id) ?? b.order);
  });
}

export function togglePinnedWidget(personalization: WorkspacePersonalization, widgetId: string) {
  const pinned = personalization.pinnedWidgetIds.includes(widgetId)
    ? personalization.pinnedWidgetIds.filter((id) => id !== widgetId)
    : [...personalization.pinnedWidgetIds, widgetId];

  return {
    ...personalization,
    pinnedWidgetIds: pinned,
  };
}

export function moveWidgetInLayout(personalization: WorkspacePersonalization, widgetId: string, direction: 'left' | 'right') {
  const order = personalization.layoutOrder.length > 0 ? [...personalization.layoutOrder] : [widgetId];
  const index = order.indexOf(widgetId);
  if (index === -1) return { ...personalization, layoutOrder: order };

  const target = direction === 'left' ? index - 1 : index + 1;
  if (target < 0 || target >= order.length) return personalization;

  const next = [...order];
  const current = next[index];
  next[index] = next[target];
  next[target] = current;
  return { ...personalization, layoutOrder: next };
}

export function saveCurrentLayout(personalization: WorkspacePersonalization, label: string) {
  const updatedAt = new Date().toISOString();
  const nextLayout = {
    id: 'layout-' + updatedAt.replace(/[^0-9]/g, ''),
    label,
    widgetIds: personalization.layoutOrder,
    updatedAt,
  };
  return {
    ...personalization,
    savedLayouts: [nextLayout, ...personalization.savedLayouts].slice(0, 5),
  };
}

function normalizePersonalization(personalization: WorkspacePersonalization, widgets: WorkspaceWidgetConfig[]) {
  const widgetIds = widgets.map((widget) => widget.id);
  return {
    ...createDefaultPersonalization(widgets),
    ...personalization,
    pinnedWidgetIds: personalization.pinnedWidgetIds.filter((id) => widgetIds.includes(id)),
    layoutOrder: [
      ...personalization.layoutOrder.filter((id) => widgetIds.includes(id)),
      ...widgetIds.filter((id) => !personalization.layoutOrder.includes(id)),
    ],
  };
}
