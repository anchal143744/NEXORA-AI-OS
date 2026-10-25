export const FIELD_SERVICE_RBAC_ROLES = [
  'FIELD_SERVICE_ADMIN',
  'DISPATCH_MANAGER',
  'SERVICE_MANAGER',
  'TECHNICIAN',
  'MOBILE_WORKER',
  'CUSTOMER_SERVICE_MANAGER',
  'FIELD_ANALYST',
] as const;

export const FIELD_SERVICE_PERMISSIONS = [
  'field-service:create',
  'field-service:read',
  'field-service:update',
  'field-service:dispatch',
  'field-service:complete',
  'field-service:escalate',
  'field-service:optimize',
  'field-service:recommend',
] as const;

