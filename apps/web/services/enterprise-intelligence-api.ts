
import { apiRequest } from '@/lib/api-client';

export type UniversalCommandRequest = {
  command: string;
  workspaceId?: string;
  limit?: number;
  includeGraph?: boolean;
  context?: Record<string, unknown>;
};

export type UniversalSearchRequest = {
  query: string;
  workspaceId?: string;
  modules?: string[];
  limit?: number;
};

export const enterpriseIntelligenceApi = {
  sync: (workspaceId?: string) => apiRequest('/v1/enterprise-intelligence/sync', { method: 'POST', body: { workspaceId } }),
  search: (payload: UniversalSearchRequest) => apiRequest('/v1/enterprise-intelligence/search', { method: 'POST', body: payload }),
  command: (payload: UniversalCommandRequest) => apiRequest('/v1/enterprise-intelligence/command', { method: 'POST', body: payload }),
  decisions: (workspaceId?: string) => apiRequest('/v1/enterprise-intelligence/decisions' + (workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '')),
  executiveDashboard: (workspaceId?: string) => apiRequest('/v1/enterprise-intelligence/executive-dashboard' + (workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '')),
  activityStream: (workspaceId?: string) => apiRequest('/v1/enterprise-intelligence/activity-stream' + (workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '')),
  notifications: (workspaceId?: string) => apiRequest('/v1/enterprise-intelligence/notifications' + (workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '')),
};
