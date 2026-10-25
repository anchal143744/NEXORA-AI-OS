export interface AccessTokenPayload {
  sub: string;
  userId: string;
  tenantId: string;
  organizationId?: string;
  workspaceId?: string;
  sessionId: string;
  role?: string;
  roles: string[];
  permissions: string[];
}

export interface RefreshTokenPayload {
  sub: string;
  tenantId: string;
  sessionId: string;
  tokenFamily: string;
  organizationId?: string;
  workspaceId?: string;
}
