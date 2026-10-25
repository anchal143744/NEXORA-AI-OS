export type ApiClientOptions = {
  tenantId?: string;
  organizationId?: string;
  workspaceId?: string;
  token?: string;
};

type StoredAuthSession = {
  user?: { tenantId?: string; organizationId?: string; workspaceId?: string } | null;
  session?: { accessToken?: string; tenantId?: string; organizationId?: string; workspaceId?: string } | null;
};

const AUTH_STORAGE_KEY = 'nexora.auth.session';
const DEFAULT_API_BASE_URL = '/api';

function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');
}

function normalizeApiPath(path: string) {
  const normalized = path.startsWith('/') ? path : '/' + path;
  if (normalized.startsWith('/api/')) return normalized.slice('/api'.length);
  return normalized.startsWith('/v1/') ? normalized : '/v1' + normalized;
}

function getStoredAuthSession(): StoredAuthSession {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) as StoredAuthSession : {};
  } catch {
    return {};
  }
}

export async function apiClient<T>(path: string, options: RequestInit & ApiClientOptions = {}): Promise<T> {
  const { tenantId, organizationId, workspaceId, token, headers, ...init } = options;
  const stored = getStoredAuthSession();
  const resolvedTenantId = tenantId ?? stored.session?.tenantId ?? stored.user?.tenantId;
  const resolvedOrganizationId = organizationId ?? stored.session?.organizationId ?? stored.user?.organizationId;
  const resolvedWorkspaceId = workspaceId ?? stored.session?.workspaceId ?? stored.user?.workspaceId;
  const resolvedToken = token ?? stored.session?.accessToken;

  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');
  if (init.body && !requestHeaders.has('Content-Type')) requestHeaders.set('Content-Type', 'application/json');
  if (resolvedTenantId && !requestHeaders.has('x-tenant-id')) requestHeaders.set('x-tenant-id', resolvedTenantId);
  if (resolvedOrganizationId && !requestHeaders.has('x-organization-id')) requestHeaders.set('x-organization-id', resolvedOrganizationId);
  if (resolvedWorkspaceId && !requestHeaders.has('x-workspace-id')) requestHeaders.set('x-workspace-id', resolvedWorkspaceId);
  if (resolvedToken && !requestHeaders.has('Authorization')) requestHeaders.set('Authorization', `Bearer ${resolvedToken}`);

  const response = await fetch(`${apiBaseUrl()}${normalizeApiPath(path)}`, {
    ...init,
    headers: requestHeaders,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === 'object' && payload && 'message' in payload ? String(payload.message) : `NEXORA API request failed: ${response.status}`;
    throw new Error(message);
  }
  if (typeof payload === 'object' && payload && 'success' in payload && 'data' in payload) return payload.data as T;
  return payload as T;
}
