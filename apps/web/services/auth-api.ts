import { apiRequest, getStoredAuthSession } from '@/lib/api-client';
import type {
  AuthProviderId,
  AuthResponse,
  AuthUser,
  EmailVerificationConfirmRequest,
  EmailVerificationRequest,
  LoginRequest,
  PasswordResetConfirmRequest,
  PasswordResetRequest,
  SignupRequest,
  SsoRequest,
} from '@/types/auth';

const authBase = '/v1/auth';

function resolveBackendUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return url.startsWith('/') ? url : '/' + url;
}

export const authApi = {
  login: (payload: LoginRequest) => {
    const stored = getStoredAuthSession();
    return apiRequest<AuthResponse, LoginRequest>(authBase + '/login', {
      method: 'POST',
      body: { ...payload, sessionTransport: 'cookie', tenantId: payload.tenantId ?? stored.session?.tenantId ?? stored.user?.tenantId },
    });
  },
  signup: (payload: SignupRequest) =>
    apiRequest<AuthResponse, SignupRequest & { displayName: string }>(authBase + '/signup', {
      method: 'POST',
      body: { ...payload, sessionTransport: 'cookie', displayName: payload.displayName ?? payload.name },
    }),
  logout: () => apiRequest<{ loggedOut: boolean }>(authBase + '/logout', { method: 'POST' }),
  refresh: () => {
    const refreshToken = getStoredAuthSession().session?.refreshToken;
    return apiRequest<AuthResponse, { refreshToken?: string; sessionTransport: 'cookie' }>(authBase + '/refresh', { method: 'POST', body: { ...(refreshToken ? { refreshToken } : {}), sessionTransport: 'cookie' } });
  },
  me: () => apiRequest<AuthUser>(authBase + '/me'),
  forgotPassword: (payload: PasswordResetRequest) =>
    apiRequest<{ sent: boolean }, PasswordResetRequest>(authBase + '/forgot-password', { method: 'POST', body: payload }),
  resetPassword: (payload: PasswordResetConfirmRequest) =>
    apiRequest<{ reset: boolean }, PasswordResetConfirmRequest>(authBase + '/reset-password', { method: 'POST', body: payload }),
  requestEmailVerification: (payload: EmailVerificationRequest) =>
    apiRequest<{ sent: boolean }, EmailVerificationRequest>(authBase + '/email/request-verification', { method: 'POST', body: payload }),
  verifyEmail: (payload: EmailVerificationConfirmRequest) =>
    apiRequest<{ tenantId: string; email: string; verified: boolean }, EmailVerificationConfirmRequest>(authBase + '/email/verify', { method: 'POST', body: payload }),
  startOAuth: async (provider: Extract<AuthProviderId, 'google' | 'microsoft'>) => {
    const tenantId = getStoredAuthSession().session?.tenantId;
    if (!tenantId) {
      window.location.href = '/auth/signup';
      return;
    }
    const response = await apiRequest<{ provider: string; url: string }>(authBase + '/oauth/' + provider + '/' + tenantId);
    window.location.href = resolveBackendUrl(response.url);
  },
  startSso: (payload: SsoRequest) => apiRequest<{ redirectUrl: string }, SsoRequest>(authBase + '/sso/start', { method: 'POST', body: payload }),
};
