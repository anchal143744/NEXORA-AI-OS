import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { AccessTokenPayload, RefreshTokenPayload } from './token-payload';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async issueTokenPair(payload: AccessTokenPayload) {
    const tokenFamily = randomUUID();
    const refreshPayload: RefreshTokenPayload = {
      sub: payload.userId,
      tenantId: payload.tenantId,
      sessionId: payload.sessionId,
      tokenFamily,
      organizationId: payload.organizationId,
      workspaceId: payload.workspaceId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ ...payload, sub: payload.userId }, { expiresIn: '15m' }),
      this.jwtService.signAsync(refreshPayload, { expiresIn: '30d' }),
    ]);

    return { accessToken, refreshToken, tokenFamily };
  }

  async verifyAccessToken(token: string) {
    const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token);
    if (!payload.sub || !payload.userId || payload.sub !== payload.userId) {
      throw new Error('Invalid access token payload');
    }
    return payload;
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync<RefreshTokenPayload>(token);
  }

  verifyPurposeToken<T extends { purpose: string }>(token: string) {
    return this.jwtService.verifyAsync<T>(token);
  }

  signEmailVerificationToken(input: { tenantId: string; email: string }) {
    return this.jwtService.signAsync({ ...input, purpose: 'email_verification' }, { expiresIn: '24h' });
  }

  signPasswordResetToken(input: { tenantId: string; email: string }) {
    return this.jwtService.signAsync({ ...input, purpose: 'password_reset', jti: randomUUID() }, { expiresIn: '30m' });
  }
}
