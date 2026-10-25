export const REALTIME_CHANNELS = {
  WORKSPACE: 'workspace',
  NOTIFICATIONS: 'notifications',
  DASHBOARD: 'dashboard',
  ANALYTICS: 'analytics',
  ACTIVITY_FEED: 'activity-feed',
  AI_UPDATES: 'ai-updates',
} as const;

export type RealtimeChannel = (typeof REALTIME_CHANNELS)[keyof typeof REALTIME_CHANNELS];
