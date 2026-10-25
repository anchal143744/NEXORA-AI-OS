export const CONNECTIVITY_RBAC_ROLES = [
  'INTEGRATION_ADMIN',
  'CONNECTOR_DEVELOPER',
  'API_GATEWAY_ADMIN',
  'WEBHOOK_MANAGER',
  'OAUTH_SECURITY_MANAGER',
  'INTEGRATION_OPERATOR',
  'CONNECTIVITY_ANALYST',
] as const;

export const CONNECTIVITY_PERMISSIONS = [
  'connectivity:create',
  'connectivity:read',
  'connectivity:update',
  'connectivity:rotate-token',
  'connectivity:publish-sdk',
  'connectivity:route-api',
  'connectivity:manage-webhook',
  'connectivity:recommend',
] as const;
