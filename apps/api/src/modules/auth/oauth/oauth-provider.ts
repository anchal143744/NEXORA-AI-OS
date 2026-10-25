export type OAuthProvider = 'google' | 'microsoft' | 'github';

export interface OAuthProfile {
  provider: OAuthProvider;
  providerAccountId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}
