import { Injectable } from '@nestjs/common';
import { OAuthProfile, OAuthProvider } from './oauth-provider';

@Injectable()
export class OAuthService {
  authorizationUrl(provider: OAuthProvider, tenantId: string) {
    return `/api/v1/auth/oauth/${provider}/redirect?tenantId=${tenantId}`;
  }

  normalizeProfile(provider: OAuthProvider, profile: Record<string, unknown>): OAuthProfile {
    return {
      provider,
      providerAccountId: String(profile.id ?? profile.sub ?? ''),
      email: String(profile.email ?? ''),
      displayName: String(profile.displayName ?? profile.name ?? profile.email ?? ''),
      avatarUrl: profile.avatarUrl ? String(profile.avatarUrl) : undefined,
    };
  }
}
