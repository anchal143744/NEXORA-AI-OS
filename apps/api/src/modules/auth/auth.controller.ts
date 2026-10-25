import { Throttle } from '@nestjs/throttler';
import { CreateContextDto, SwitchContextDto } from './dto/context.dto';
import { Body, Controller, Get, Param, Post, Req, Res, SetMetadata, UnauthorizedException, ForbiddenException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AccountRecoveryDto } from './dto/account-recovery.dto';
import { RequestEmailVerificationDto, VerifyEmailDto } from './dto/email-verification.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto, ConfirmPasswordResetDto, RequestPasswordResetDto } from './dto/password-reset.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OAuthProvider } from './oauth/oauth-provider';
import { AccessTokenPayload } from './tokens/token-payload';

type AuthenticatedRequest = Request & { auth: AccessTokenPayload };

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('signup')
  @ApiOperation({ summary: 'Email signup and first tenant bootstrap' })
  async signup(@Body() dto: SignupDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    this.assertCookieOrigin(request, dto.sessionTransport);
    return this.sessionResponse(await this.authService.signup(dto, { ipAddress: request.ip, userAgent: request.headers['user-agent'] }), response, dto.sessionTransport);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  @ApiOperation({ summary: 'Email login' })
  async login(@Body() dto: LoginDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    this.assertCookieOrigin(request, dto.sessionTransport);
    return this.sessionResponse(await this.authService.login(dto, { ipAddress: request.ip, userAgent: request.headers['user-agent'] }), response, dto.sessionTransport);
  }

  @SetMetadata('nexora.identityOnly', true)
  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout current session' })
  async logout(@Req() request: AuthenticatedRequest, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.logout({ tenantId: request.auth.tenantId, sessionId: request.auth.sessionId });
    response.clearCookie('nexora.refresh', { path: '/api/v1/auth', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return result;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() dto: RefreshTokenDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    this.assertCookieOrigin(request, dto.sessionTransport);
    const refreshToken = dto.refreshToken ?? (dto.sessionTransport === 'cookie' ? request.cookies?.['nexora.refresh'] : undefined);
    return this.sessionResponse(await this.authService.refresh({ ...dto, refreshToken }), response, dto.sessionTransport);
  }

  private assertCookieOrigin(request: Request, transport?: 'cookie') {
    if (transport === 'cookie') {
      const origin = request.headers.origin;
      if (!origin && request.headers['sec-fetch-site'] === 'cross-site') throw new UnauthorizedException('Cross-site authentication is not allowed');
      const configured = (process.env.CORS_ORIGINS ?? process.env.ALLOWED_ORIGINS ?? '').split(',').map(value => value.trim()).filter(Boolean);
      if (origin && !configured.includes(origin)) {
        let sameOrigin = false;
        try { sameOrigin = new URL(origin).host === request.headers.host; } catch {}
        if (!sameOrigin) throw new UnauthorizedException('Authentication origin is not allowed');
      }
    }
  }

  private sessionResponse(result: Awaited<ReturnType<AuthService['login']>>, response: Response, transport?: 'cookie') {
    if (transport !== 'cookie') return result;
    const { refreshToken, ...session } = result.session;
    response.cookie('nexora.refresh', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/v1/auth', maxAge: 30 * 24 * 60 * 60 * 1000 });
    return { ...result, session };
  }

  @SetMetadata('nexora.identityOnly', true)
  @Get('contexts')
  @UseGuards(JwtAuthGuard)
  contexts(@Req() request: AuthenticatedRequest) { return this.authService.contexts(request.auth); }

  @Post('contexts')
  @UseGuards(JwtAuthGuard)
  createContext(@Req() request: AuthenticatedRequest, @Body() dto: CreateContextDto) { return this.authService.createContext(request.auth, dto); }

  @SetMetadata('nexora.identityOnly', true)
  @Post('switch-context')
  @UseGuards(JwtAuthGuard)
  async switchContext(@Req() request: AuthenticatedRequest, @Body() dto: SwitchContextDto, @Res({ passthrough: true }) response: Response) {
    return this.sessionResponse(await this.authService.switchContext(request.auth, dto.workspaceId, { ipAddress: request.ip, userAgent: request.headers['user-agent'] }), response, dto.sessionTransport);
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Request password reset email' })
  forgotPassword(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Reset password with token' })
  resetPassword(@Body() dto: ConfirmPasswordResetDto) {
    return this.authService.confirmPasswordReset(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user' })
  me(@Req() request: AuthenticatedRequest) {
    return this.authService.me(request.auth);
  }

  @Post('email/request-verification')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  requestEmailVerification(@Body() dto: RequestEmailVerificationDto) {
    return this.authService.requestEmailVerification(dto);
  }

  @Post('email/verify')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @SetMetadata('nexora.identityOnly', true)
  @Post('password/change')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() dto: ChangePasswordDto, @Req() request: AuthenticatedRequest, @Res({ passthrough: true }) response: Response) {
    if (dto.tenantId !== request.auth.tenantId || dto.userId !== request.auth.userId) throw new ForbiddenException('Only your own password can be changed');
    const result = await this.authService.changePassword({ ...dto, tenantId: request.auth.tenantId, userId: request.auth.userId });
    response.clearCookie('nexora.refresh', { path: '/api/v1/auth', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return result;
  }

  @Post('account/recovery')
  recoverAccount(@Body() dto: AccountRecoveryDto) {
    return this.authService.recoverAccount(dto);
  }

  @Get('oauth/:provider/:tenantId')
  oauthUrl(@Param('provider') provider: OAuthProvider, @Param('tenantId') tenantId: string) {
    return this.authService.oauthAuthorizationUrl(provider, tenantId);
  }
}
