export const PLANNING_RBAC_ROLES = [
  'STRATEGY_ADMIN',
  'EXECUTIVE_SPONSOR',
  'PORTFOLIO_MANAGER',
  'OKR_OWNER',
  'RESOURCE_PLANNER',
  'FINANCE_PLANNER',
  'STRATEGY_ANALYST',
] as const;

export const PLANNING_PERMISSIONS = [
  'planning:create',
  'planning:read',
  'planning:update',
  'planning:approve',
  'planning:align',
  'planning:simulate',
  'planning:forecast',
  'planning:recommend',
] as const;
