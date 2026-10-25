export const reliabilityOperationsApi = {
  reliability: '/v1/reliability',
  sre: '/v1/sre',
  incidents: '/v1/incidents',
  recovery: '/v1/recovery',
  uptime: '/v1/uptime',
  scaling: '/v1/scaling',
  globalOperations: '/v1/global-operations',
  health: '/v1/health',
} as const;

export type ReliabilityOperationsApiGroup = keyof typeof reliabilityOperationsApi;