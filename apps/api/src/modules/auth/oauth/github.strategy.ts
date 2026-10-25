import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GitHubOAuthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_OAUTH_CLIENT_ID ?? 'not-configured',
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET ?? 'not-configured',
      callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL ?? '/api/v1/auth/oauth/github/callback',
      scope: ['user:email'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: any, done: (error: unknown, user?: unknown) => void) {
    done(null, { provider: 'github', providerAccountId: profile.id, email: profile.emails?.[0]?.value, displayName: profile.displayName ?? profile.username });
  }
}
