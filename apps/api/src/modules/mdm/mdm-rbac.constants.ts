export const MDM_RBAC_ROLES = [
  'MDM_ADMIN',
  'DATA_STEWARD',
  'DATA_OWNER',
  'DATA_QUALITY_MANAGER',
  'GOVERNANCE_MANAGER',
  'INTEGRATION_STEWARD',
  'DATA_ANALYST',
] as const;

export const MDM_PERMISSIONS = [
  'mdm:create',
  'mdm:read',
  'mdm:update',
  'mdm:merge',
  'mdm:resolve',
  'mdm:govern',
  'mdm:lineage',
  'mdm:recommend',
] as const;
