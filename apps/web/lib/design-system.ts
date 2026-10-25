import { designTokens } from '@/styles/tokens';

export const designSystem = {
  version: '1.1.0',
  name: 'NEXORA Premium Enterprise Design System',
  inspiration: ['Apple', 'Notion', 'Linear', 'Stripe', 'OpenAI'],
  theme: 'Adaptive Deep Graphite with Luxury Gold Accents',
  tokens: designTokens,
  componentGroups: {
    primitives: ['Button', 'Input', 'Select', 'Badge', 'Avatar', 'Tooltip', 'Progress'],
    surfaces: ['Card', 'Modal', 'Drawer', 'Tabs', 'Table', 'Alert'],
    states: ['Skeleton', 'EmptyState', 'ErrorState', 'LoadingStates'],
    navigation: ['Sidebar', 'Topbar', 'Breadcrumbs', 'UserMenu', 'NotificationArea', 'WorkspaceSwitcher'],
    layouts: ['PublicLayout', 'AuthLayout', 'SetupWizardLayout', 'WorkspaceLayout', 'DashboardLayout'],
    ai: ['AiAvatar', 'AiMessage', 'AiInsightCard', 'AiRecommendationCard', 'AiTypingIndicator', 'AiLoadingState'],
    dashboard: ['KpiCard', 'AnalyticsCard', 'ActivityCard', 'ChartContainer', 'TaskCard', 'CalendarCard'],
  },
  accessibility: {
    focusVisible: true,
    reducedMotion: true,
    semanticLandmarks: true,
    keyboardCommandPalette: true,
    minimumContrast: 'WCAG AA target',
  },
} as const;

export type DesignSystemManifest = typeof designSystem;
