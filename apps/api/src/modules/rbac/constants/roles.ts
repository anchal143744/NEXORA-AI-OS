export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORGANIZATION_OWNER: 'organization_owner',
  ADMIN: 'admin',
  MANAGER: 'manager',
  TEAM_LEAD: 'team_lead',
  EMPLOYEE: 'employee',
  VIEWER: 'viewer',
} as const;

export type RoleKey = (typeof ROLES)[keyof typeof ROLES];
