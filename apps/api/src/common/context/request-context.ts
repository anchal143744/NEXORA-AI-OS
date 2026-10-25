export interface RequestContext {
  requestId: string;
  correlationId: string;
  traceId: string;
  spanId?: string;
  parentSpanId?: string;
  tenantId?: string;
  organizationId?: string;
  workspaceId?: string;
  userId?: string;
  roles: string[];
  permissions: string[];
  ipAddress?: string;
  userAgent?: string;
}
