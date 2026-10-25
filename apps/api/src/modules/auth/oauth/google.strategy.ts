import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID ?? 'not-configured',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? 'not-configured',
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL ?? '/api/v1/auth/oauth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback) {
    done(null, { provider: 'google', providerAccountId: profile.id, email: profile.emails?.[0]?.value, displayName: profile.displayName });
  }
}
