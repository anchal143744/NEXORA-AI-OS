export const QUEUES = {
  EMAIL: 'email',
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports',
  EVENTS: 'events',
  AI_JOBS: 'ai-jobs',
  ACTIVITY: 'activity',
  WORKFLOW_EXECUTION: 'workflow-execution',
  WORKFLOW_RETRY: 'workflow-retry',
  AGENT_EXECUTION: 'agent-execution',
  AGENT_ANALYSIS: 'agent-analysis',
  KPI_SNAPSHOTS: 'kpi-snapshots',
  ANALYTICS: 'analytics',
  ALERTS: 'alerts',
  INTEGRATIONS: 'integrations',
  WEBHOOKS: 'webhooks',
  SYNC: 'sync',
  DEAD_LETTER: 'dead-letter',
} as const;

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES];

export const DEFAULT_JOB_OPTIONS = {
  attempts: 5,
  backoff: { type: 'exponential', delay: 2_000 },
  removeOnComplete: 500,
  removeOnFail: false,
} as const;



