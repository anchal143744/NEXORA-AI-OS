export type AuthProviderId = 'email' | 'google' | 'microsoft' | 'sso';

export type AuthUser = {
  id: string;
  tenantId?: string;
  email: string;
  name: string;
  displayName?: string;
  roles: string[];
  organizationId?: string;
  workspaceId?: string;
  emailVerified?: boolean;
};

export type AuthSession = {
  id?: string;
  accessToken: string;
  refreshToken?: string;
  tenantId?: string;
  organizationId?: string;
  workspaceId?: string;
  expiresAt?: string;
  deviceId?: string;
};

export type LoginRequest = {
  sessionTransport?: 'cookie';
  tenantId?: string;
  email: string;
  password: string;
  rememberDevice?: boolean;
};

export type SignupRequest = {
  sessionTransport?: 'cookie';
  tenantId?: string;
  name: string;
  displayName?: string;
  email: string;
  password: string;
  companyName: string;
  role: string;
};

export type PasswordResetRequest = {
  tenantId: string;
  email: string;
};

export type PasswordResetConfirmRequest = {
  tenantId: string;
  token: string;
  newPassword: string;
};

export type EmailVerificationRequest = {
  tenantId: string;
  email: string;
};

export type EmailVerificationConfirmRequest = {
  tenantId: string;
  token: string;
};

export type AuthResponse = {
  user: AuthUser;
  session: AuthSession;
  verificationRequired?: boolean;
};

export type SsoRequest = {
  domain: string;
};
