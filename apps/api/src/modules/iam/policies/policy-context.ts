export interface PolicyContext {
  tenantId: string;
  workspaceId?: string;
  userId: string;
  roles: string[];
  permissions: string[];
  resource?: string;
  action?: string;
}
