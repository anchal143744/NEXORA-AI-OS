import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';

@Injectable()
export class MicrosoftOAuthStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor() {
    super({
      clientID: process.env.MICROSOFT_OAUTH_CLIENT_ID ?? 'not-configured',
      clientSecret: process.env.MICROSOFT_OAUTH_CLIENT_SECRET ?? 'not-configured',
      callbackURL: process.env.MICROSOFT_OAUTH_CALLBACK_URL ?? '/api/v1/auth/oauth/microsoft/callback',
      scope: ['user.read'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: any, done: (error: unknown, user?: unknown) => void) {
    done(null, { provider: 'microsoft', providerAccountId: profile.id, email: profile.emails?.[0]?.value, displayName: profile.displayName });
  }
}
