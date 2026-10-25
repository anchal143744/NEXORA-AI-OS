export const PRODUCTION_READINESS_RBAC_ROLES = [
  'RELEASE_MANAGER',
  'SECURITY_REVIEWER',
  'SRE_LEAD',
  'PERFORMANCE_ENGINEER',
  'API_GOVERNANCE_MANAGER',
  'DOCUMENTATION_OWNER',
  'EXECUTIVE_APPROVER',
] as const;

export const PRODUCTION_READINESS_PERMISSIONS = [
  'production-readiness:create',
  'production-readiness:read',
  'production-readiness:update',
  'production-readiness:approve',
  'production-readiness:score',
  'production-readiness:validate',
  'production-readiness:remediate',
  'production-readiness:release',
] as const;
