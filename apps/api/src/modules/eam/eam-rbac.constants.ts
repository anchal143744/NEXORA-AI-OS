export const EAM_RBAC_ROLES = [
  'ASSET_ADMIN',
  'ASSET_MANAGER',
  'MAINTENANCE_MANAGER',
  'TECHNICIAN',
  'FIELD_ENGINEER',
  'FINANCE_MANAGER',
  'ASSET_VIEWER',
] as const;

export const EAM_PERMISSIONS = [
  'asset:create',
  'asset:read',
  'asset:update',
  'asset:approve',
  'asset:maintain',
  'asset:forecast',
  'asset:recommend',
] as const;

