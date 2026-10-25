export const WORKFORCE_RBAC_ROLES = [
  'HR_ADMIN',
  'HR_MANAGER',
  'RECRUITER',
  'TEAM_MANAGER',
  'LEARNING_MANAGER',
  'EMPLOYEE',
] as const;

export const WORKFORCE_PERMISSIONS = [
  'workforce:create',
  'workforce:read',
  'workforce:update',
  'workforce:approve',
  'workforce:forecast',
  'workforce:recommend',
] as const;

