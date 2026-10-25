import { publicRuntimeEnv } from '@/lib/env';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthResponse } from '@/types/auth';

export type ApiErrorPayload = {
  message: string;
  status?: number;
  details?: unknown;
};

export class ApiClientError extends Error {
  status?: number;
  details?: unknown;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiClientError';
    this.status = payload.status;
    this.details = payload.details;
  }
}

const apiBaseUrl = publicRuntimeEnv.apiBaseUrl;
const authStorageKey = 'nexora.auth.session';
const apiTimeoutMs = 15000;
let refreshInFlight: Promise<void> | null = null;

async function refreshSession() {
  const original = getStoredAuthSession();
  if (!original.session?.accessToken) throw new ApiClientError({ message: 'Please sign in again.', status: 401 });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), apiTimeoutMs);
  try {
    const response = await fetch(apiBaseUrl + '/v1/auth/refresh', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'include', signal: controller.signal, body: JSON.stringify(original.session.refreshToken ? { refreshToken: original.session.refreshToken } : { sessionTransport: 'cookie' }) });
    if (!response.ok) throw new ApiClientError({ message: 'Your session has expired. Please sign in again.', status: response.status });
    const payload = await response.json();
    const result: AuthResponse = payload && 'success' in payload ? payload.data : payload;
    const current = getStoredAuthSession();
    // Never restore a session after logout or overwrite a different account.
    if (!result?.session?.accessToken || current.session?.accessToken !== original.session.accessToken || result.user.id !== original.user?.id || result.session.tenantId !== original.session.tenantId || result.session.organizationId !== original.session.organizationId || result.session.workspaceId !== original.session.workspaceId || result.session.id !== original.session.id) throw new ApiClientError({ message: 'The signed-in account changed. Please retry.', status: 401 });
    useAuthStore.getState().setSession(result.user, result.session);
  } finally { clearTimeout(timeout); }
}

type JsonRequestInit<TBody> = Omit<RequestInit, 'body'> & { body?: TBody };
type StoredAuthSession = {
  user?: { id?: string; tenantId?: string; organizationId?: string; workspaceId?: string } | null;
  session?: { id?: string; accessToken?: string; tenantId?: string; organizationId?: string; workspaceId?: string; refreshToken?: string } | null;
};

function normalizeApiEndpoint(endpoint: string) {
  const normalized = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  if (normalized.startsWith('/api/')) return normalized.slice('/api'.length);
  return normalized;
}

export function getStoredAuthSession(): StoredAuthSession {
  if (typeof window === 'undefined') return {};
  const live = useAuthStore.getState();
  if ('hydrated' in live) return { user: live.user, session: live.session };
  try {
    const raw = window.localStorage.getItem(authStorageKey);
    return raw ? JSON.parse(raw) as StoredAuthSession : {};
  } catch {
    return {};
  }
}

export async function apiRequest<TResponse, TBody = unknown>(
  endpoint: string,
  options: JsonRequestInit<TBody> = {},
  retried = false,
): Promise<TResponse> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  const stored = getStoredAuthSession();
  const accessToken = stored.session?.accessToken;
  const tenantId = stored.session?.tenantId ?? stored.user?.tenantId;
  const organizationId = stored.session?.organizationId ?? stored.user?.organizationId;
  const workspaceId = stored.session?.workspaceId ?? stored.user?.workspaceId;

  if (accessToken && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${accessToken}`);
  if (tenantId && !headers.has('x-tenant-id')) headers.set('x-tenant-id', tenantId);
  if (organizationId && !headers.has('x-organization-id')) headers.set('x-organization-id', organizationId);
  if (workspaceId && !headers.has('x-workspace-id')) headers.set('x-workspace-id', workspaceId);

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options.body);
  }

  const normalizedEndpoint = normalizeApiEndpoint(endpoint);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), apiTimeoutMs);
  const upstreamSignal = options.signal;
  const abortFromUpstream = () => controller.abort();
  if (upstreamSignal?.aborted) controller.abort();
  else if (upstreamSignal) upstreamSignal.addEventListener('abort', abortFromUpstream, { once: true });

  let response: Response;
  try {
    response = await fetch(apiBaseUrl + normalizedEndpoint, {
      ...options,
      headers,
      body,
      credentials: 'include',
      signal: controller.signal,
    });
  } catch (issue) {
    const message = controller.signal.aborted
      ? 'The request took too long. Check the server connection and try again.'
      : issue instanceof Error
        ? issue.message
        : 'Network request failed';
    throw new ApiClientError({ message, details: { endpoint: normalizedEndpoint } });
  } finally {
    clearTimeout(timeout);
    if (upstreamSignal) upstreamSignal.removeEventListener('abort', abortFromUpstream);
  }

  if (response.status === 401 && !retried && accessToken && !/^\/v1\/auth\/(login|signup|refresh|forgot-password|reset-password|email\/|account\/recovery|oauth\/)/.test(normalizedEndpoint) && !options.headers && !upstreamSignal?.aborted) {
    const current = getStoredAuthSession();
    if (current.session?.tenantId !== stored.session?.tenantId || current.session?.workspaceId !== stored.session?.workspaceId || current.session?.id !== stored.session?.id) throw new ApiClientError({ message: 'The signed-in account changed. Please retry.', status: 401 });
    if (current.session?.accessToken === accessToken) {
      if (!refreshInFlight) refreshInFlight = refreshSession().finally(() => { refreshInFlight = null; });
      await refreshInFlight;
    }
    if (upstreamSignal?.aborted) throw new ApiClientError({ message: 'Request cancelled.' });
    return apiRequest<TResponse, TBody>(endpoint, options, true);
  }
  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'error' in payload && typeof payload.error === 'object' && payload.error && 'message' in payload.error
        ? String(payload.error.message)
        : typeof payload === 'object' && payload && 'message' in payload
          ? String(payload.message)
          : 'Request failed';
    throw new ApiClientError({ message, status: response.status, details: payload });
  }

  if (typeof payload === 'object' && payload && 'success' in payload && 'data' in payload) {
    return payload.data as TResponse;
  }

  return payload as TResponse;
}
