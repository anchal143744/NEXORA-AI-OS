export const accessibilityFoundation = {
  minimumTargetSize: 40,
  preferredTargetSize: 44,
  focusRing: '2px solid rgba(216, 180, 93, 0.78)',
  keyboardShortcuts: {
    commandPalette: 'ControlOrMeta+K',
    closeOverlay: 'Escape',
  },
  landmarks: ['banner', 'navigation', 'main', 'complementary', 'dialog'],
  contrastTargets: {
    bodyText: 'WCAG AA',
    controlText: 'WCAG AA',
    focusIndicators: 'WCAG AA enhanced target',
  },
} as const;

export function getAccessibleDescription(label: string, description?: string) {
  return description ? `${label}. ${description}` : label;
}
