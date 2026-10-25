import { CreateContextDto } from './dto/context.dto';
import { lock, requestHash } from '../retail/retail-transaction';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, Session, User } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EmailService } from '../email/email.service';
import { LoginAuditService } from '../security/services/login-audit.service';
import { PasswordService } from '../security/services/password.service';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';
import { AccountRecoveryDto } from './dto/account-recovery.dto';
import { RequestEmailVerificationDto, VerifyEmailDto } from './dto/email-verification.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto, ConfirmPasswordResetDto, RequestPasswordResetDto } from './dto/password-reset.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignupDto } from './dto/signup.dto';
import { OAuthProvider } from './oauth/oauth-provider';
import { OAuthService } from './oauth/oauth.service';
import { TokenService } from './tokens/token.service';

type RequestDevice = { ipAddress?: string; userAgent?: string; deviceName?: string };
type AuthWorkspaceContext = { tenantId: string; organizationId?: string; businessId?: string; workspaceId?: string };
type IssuedTokenPair = { accessToken: string; refreshToken: string; tokenFamily: string };
type AuthResponseUser = {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  displayName: string;
  roles: string[];
  organizationId?: string;
  workspaceId?: string;
  emailVerified: boolean;
};
type AuthResponseSession = {
  id: string;
  accessToken: string;
  refreshToken: string;
  tenantId: string;
  organizationId?: string;
  workspaceId?: string;
  expiresAt: string;
};
type AuthResponseBody = {
  user: AuthResponseUser;
  session: AuthResponseSession;
  verificationRequired: boolean;
};

const ORGANIZATION_OWNER_ROLE = 'Organization Owner';
const DEFAULT_OWNER_ROLES: string[] = [ORGANIZATION_OWNER_ROLE];
const DEFAULT_PLATFORM_PERMISSIONS: string[] = ['create', 'read', 'update', 'delete', 'manage', 'approve', 'execute'];

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly loginAuditService: LoginAuditService,
    private readonly oauthService: OAuthService,
    private readonly emailService: EmailService,
  ) {}

  async signup(dto: SignupDto, device: RequestDevice = {}) {
    if (dto.tenantId || dto.workspaceId) throw new UnauthorizedException('Joining an existing organization requires an authorized invitation');
    dto = { ...dto, email: dto.email.trim().toLowerCase() };
    const displayName = (dto.displayName ?? dto.name ?? dto.email.split('@')[0]).trim();
    if (!displayName) throw new BadRequestException('Your name is required');
    const passwordHash = await this.passwordService.hash(dto.password);
    // Hashing and external delivery stay outside the transaction. Account,
    // credentials and both memberships either commit or roll back together.
    const { bootstrap, user } = await this.prisma.transaction(async tx => {
      if (dto.requestKey) {
        await lock(tx, 'signup:' + dto.requestKey);
        const existing = await tx.user.findFirst({ where: { email: dto.email, deletedAt: null, metadata: { path: ['signupRequestKey'], equals: dto.requestKey } } });
        if (existing) {
          if (existing.status !== 'ACTIVE') throw new UnauthorizedException('Account is not active');
          const metadata = existing.metadata as Prisma.JsonObject;
          const credential = await tx.credential.findUnique({ where: { tenantId_userId: { tenantId: existing.tenantId, userId: existing.id } } });
          if (metadata.signupRequestHash !== requestHash({ email: dto.email, displayName, companyName: dto.companyName ?? '' }) || !credential?.passwordHash || !await this.passwordService.verify(credential.passwordHash, dto.password)) throw new ConflictException('Signup request key was already used');
          const member = await tx.workspaceMember.findFirstOrThrow({ where: { tenantId: existing.tenantId, userId: existing.id, status: 'ACTIVE', deletedAt: null }, include: { workspace: true } });
          return { bootstrap: { tenantId: existing.tenantId, organizationId: member.workspace.organizationId, workspaceId: member.workspaceId }, user: existing };
        }
      }
      const bootstrap = await this.bootstrapFirstTenant(dto, tx);
      const user = await tx.user.create({ data: { tenantId: bootstrap.tenantId, email: dto.email, displayName, status: 'ACTIVE', metadata: dto.requestKey ? { signupRequestKey: dto.requestKey, signupRequestHash: requestHash({ email: dto.email, displayName, companyName: dto.companyName ?? '' }) } : {} } });
      await tx.credential.create({ data: { tenantId: bootstrap.tenantId, userId: user.id, passwordHash, passwordChangedAt: new Date() } });
      await tx.membership.create({ data: { tenantId: bootstrap.tenantId, organizationId: bootstrap.organizationId!, userId: user.id, title: ORGANIZATION_OWNER_ROLE } });
      await tx.workspaceMember.create({ data: { tenantId: bootstrap.tenantId, workspaceId: bootstrap.workspaceId!, userId: user.id, status: 'ACTIVE' } });
      return { bootstrap, user };
    });

    const verificationToken = await this.tokenService.signEmailVerificationToken({ tenantId: bootstrap.tenantId, email: dto.email });
    await this.emailService.sendVerificationEmail(dto.email, verificationToken, bootstrap.tenantId).catch(() => ({ accepted: false }));

    const sessionId = randomUUID();
    const tokenPair = await this.issueAccessTokenPair({
      userId: user.id,
      tenantId: bootstrap.tenantId,
      organizationId: bootstrap.organizationId,
      workspaceId: bootstrap.workspaceId,
      sessionId,
      roles: DEFAULT_OWNER_ROLES,
      permissions: DEFAULT_PLATFORM_PERMISSIONS,
    });
    const session = await this.sessionsService.createSession({ tenantId: bootstrap.tenantId, userId: user.id, sessionId, refreshToken: tokenPair.refreshToken, device });
    await this.loginAuditService.recordLogin({ tenantId: bootstrap.tenantId, userId: user.id, success: true, ipAddress: device.ipAddress, userAgent: device.userAgent });

    return this.authResponse({ user, session, tokenPair, organizationId: bootstrap.organizationId, workspaceId: bootstrap.workspaceId, verificationRequired: true });
  }

  async login(dto: LoginDto, device: RequestDevice) {
    dto = { ...dto, email: dto.email.trim().toLowerCase() };
    if (!dto.tenantId && await this.prisma.user.count({ where: { email: dto.email, deletedAt: null } }) > 1) throw new UnauthorizedException('Unable to sign in. Check your email, password and business ID.');
    const user = dto.tenantId
      ? await this.usersService.findByEmail(dto.tenantId, dto.email)
      : await this.prisma.user.findFirst({ where: { email: dto.email, deletedAt: null }, orderBy: { createdAt: 'desc' } });
    const tenantId = dto.tenantId ?? user?.tenantId;

    if (!user || !tenantId || user.deletedAt || user.status !== 'ACTIVE') {
      await this.loginAuditService.recordLogin({ tenantId: dto.tenantId ?? '00000000-0000-0000-0000-000000000000', success: false, ipAddress: device.ipAddress, userAgent: device.userAgent });
      throw new UnauthorizedException('Invalid credentials');
    }

    const credential = await this.prisma.credential.findUnique({ where: { tenantId_userId: { tenantId, userId: user.id } } });
    const valid = credential?.passwordHash ? await this.passwordService.verify(credential.passwordHash, dto.password) : false;
    if (!valid) {
      await this.loginAuditService.recordLogin({ tenantId, userId: user.id, success: false, ipAddress: device.ipAddress, userAgent: device.userAgent });
      throw new UnauthorizedException('Invalid credentials');
    }

    const workspaceContext = await this.resolveUserWorkspaceContext(tenantId, user.id);
    const sessionId = randomUUID();
    const tokenPair = await this.issueAccessTokenPair({
      userId: user.id,
      tenantId,
      organizationId: workspaceContext.organizationId,
      workspaceId: workspaceContext.workspaceId,
      sessionId,
      roles: DEFAULT_OWNER_ROLES,
      permissions: DEFAULT_PLATFORM_PERMISSIONS,
    });
    const session = await this.sessionsService.createSession({ tenantId, userId: user.id, sessionId, refreshToken: tokenPair.refreshToken, device });
    await this.loginAuditService.recordLogin({ tenantId, userId: user.id, success: true, ipAddress: device.ipAddress, userAgent: device.userAgent });
    return this.authResponse({ user, session, tokenPair, organizationId: workspaceContext.organizationId, workspaceId: workspaceContext.workspaceId });
  }

  async logout(input: { tenantId: string; sessionId: string }) {
    await this.sessionsService.revokeSession(input.tenantId, input.sessionId);
    return { loggedOut: true };
  }

  async refresh(dto: RefreshTokenDto) {
    if (!dto.refreshToken) throw new UnauthorizedException('Refresh credentials are required');
    let payload;
    try { payload = await this.tokenService.verifyRefreshToken(dto.refreshToken); } catch { throw new UnauthorizedException('Invalid refresh token'); }
    const currentSession = await this.sessionsService.validateRefreshToken(payload.tenantId, payload.sessionId, dto.refreshToken);
    if (!currentSession) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.usersService.requireById(payload.tenantId, payload.sub);
    const workspaceContext = payload.workspaceId
      ? await this.authorizedContext(payload.tenantId, payload.sub, payload.workspaceId, payload.organizationId)
      : await this.resolveUserWorkspaceContext(payload.tenantId, payload.sub);
    const tokenPair = await this.issueAccessTokenPair({
      userId: payload.sub,
      tenantId: payload.tenantId,
      organizationId: workspaceContext.organizationId,
      workspaceId: workspaceContext.workspaceId,
      sessionId: payload.sessionId,
      roles: DEFAULT_OWNER_ROLES,
      permissions: DEFAULT_PLATFORM_PERMISSIONS,
    });
    const rotatedSession = await this.sessionsService.rotateRefreshToken(payload.tenantId, payload.sessionId, tokenPair.refreshToken, dto.refreshToken);
    if (!rotatedSession) throw new UnauthorizedException('Invalid refresh token');
    return this.authResponse({ user, session: rotatedSession, tokenPair, organizationId: workspaceContext.organizationId, workspaceId: workspaceContext.workspaceId });
  }

  async me(auth: { tenantId: string; userId: string; organizationId?: string; workspaceId?: string }) {
    const user = await this.usersService.requireById(auth.tenantId, auth.userId);
    if (auth.organizationId && auth.workspaceId) return this.authUser(user, auth.organizationId, auth.workspaceId);
    const workspaceContext = await this.resolveUserWorkspaceContext(auth.tenantId, auth.userId);
    return this.authUser(user, auth.organizationId ?? workspaceContext.organizationId, auth.workspaceId ?? workspaceContext.workspaceId);
  }

  async requestEmailVerification(dto: RequestEmailVerificationDto) {
    dto = { ...dto, email: dto.email.trim().toLowerCase() };
    const existing = await this.prisma.user.findFirst({ where: { tenantId: dto.tenantId, email: dto.email.trim().toLowerCase(), status: 'ACTIVE', deletedAt: null } });
    if (!existing) return { sent: true };
    const verificationToken = await this.tokenService.signEmailVerificationToken({ tenantId: dto.tenantId, email: dto.email });
    await this.emailService.sendVerificationEmail(dto.email, verificationToken, dto.tenantId);
    return { sent: true };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const payload = await this.tokenService.verifyPurposeToken<{ tenantId: string; email: string; purpose: string }>(dto.token);
    if (payload.tenantId !== dto.tenantId || payload.purpose !== 'email_verification') throw new BadRequestException('Invalid verification token');
    await this.prisma.transaction(async tx => {
      const user = await tx.user.findFirst({ where: { tenantId: dto.tenantId, email: payload.email, status: 'ACTIVE', deletedAt: null } });
      if (!user) throw new BadRequestException('Invalid verification token');
      const metadata = user.metadata && typeof user.metadata === 'object' && !Array.isArray(user.metadata) ? user.metadata : {};
      await tx.user.update({ where: { id: user.id }, data: { metadata: { ...metadata, emailVerifiedAt: new Date().toISOString() } } });
    });
    return { tenantId: dto.tenantId, email: payload.email, verified: true };
  }

  async requestPasswordReset(dto: RequestPasswordResetDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findFirst({ where: { tenantId: dto.tenantId, email, status: 'ACTIVE', deletedAt: null } });
    if (!existing) return { sent: true };
    const resetToken = await this.tokenService.signPasswordResetToken({ tenantId: dto.tenantId, email });
    // A failed or unconfigured delivery does not create a usable reset token.
    await this.emailService.sendPasswordResetEmail(email, resetToken, dto.tenantId);
    await this.prisma.transaction(async tx => {
      const user = await tx.user.findFirst({ where: { tenantId: dto.tenantId, email, status: 'ACTIVE', deletedAt: null } });
      if (!user) return;
      const metadata = user.metadata && typeof user.metadata === 'object' && !Array.isArray(user.metadata) ? user.metadata : {};
      await tx.user.update({ where: { id: user.id }, data: { metadata: { ...metadata, passwordResetTokenHash: this.sessionsService.hashToken(resetToken) } } });
    });
    return { sent: true };
  }

  async confirmPasswordReset(dto: ConfirmPasswordResetDto) {
    const payload = await this.tokenService.verifyPurposeToken<{ tenantId: string; email: string; purpose: string }>(dto.token);
    if (payload.tenantId !== dto.tenantId || payload.purpose !== 'password_reset') throw new BadRequestException('Invalid reset token');
    const passwordHash = await this.passwordService.hash(dto.newPassword);
    return this.prisma.transaction(async tx => {
      await lock(tx, 'password-reset:' + dto.tenantId + ':' + payload.email);
      const user = await tx.user.findFirst({ where: { tenantId: dto.tenantId, email: payload.email, status: 'ACTIVE', deletedAt: null } });
      if (!user) throw new BadRequestException('Invalid reset token');
      const metadata = user.metadata && typeof user.metadata === 'object' && !Array.isArray(user.metadata) ? { ...user.metadata } : {};
      if (metadata.passwordResetTokenHash !== this.sessionsService.hashToken(dto.token)) throw new BadRequestException('Invalid or already used reset token');
      delete metadata.passwordResetTokenHash;
      await tx.credential.update({ where: { tenantId_userId: { tenantId: dto.tenantId, userId: user.id } }, data: { passwordHash, passwordChangedAt: new Date() } });
      await tx.user.update({ where: { id: user.id }, data: { metadata } });
      await tx.session.updateMany({ where: { tenantId: dto.tenantId, userId: user.id, status: 'ACTIVE' }, data: { status: 'REVOKED', revokedAt: new Date() } });
      await tx.auditLog.create({ data: { tenantId: dto.tenantId, actorUserId: user.id, action: 'UPDATE', resourceType: 'auth.password_reset', resourceId: user.id } });
      return { reset: true };
    });
  }

  async changePassword(dto: ChangePasswordDto) {
    const credential = await this.prisma.database.credential.findFirst({ where: { tenantId: dto.tenantId, userId: dto.userId, deletedAt: null } });
    if (!credential?.passwordHash || !await this.passwordService.verify(credential.passwordHash, dto.currentPassword)) throw new UnauthorizedException('Current password is invalid');
    const passwordHash = await this.passwordService.hash(dto.newPassword);
    return this.prisma.transaction(async tx => {
      const user = await tx.user.findFirst({ where: { tenantId: dto.tenantId, id: dto.userId, status: 'ACTIVE', deletedAt: null } });
      if (!user) throw new UnauthorizedException('Account is not active');
      const changed = await tx.credential.updateMany({ where: { tenantId: dto.tenantId, userId: dto.userId, deletedAt: null, passwordHash: credential.passwordHash }, data: { passwordHash, passwordChangedAt: new Date() } });
      if (changed.count !== 1) throw new ConflictException('Password changed. Sign in again before retrying.');
      await tx.session.updateMany({ where: { tenantId: dto.tenantId, userId: dto.userId, status: 'ACTIVE' }, data: { status: 'REVOKED', revokedAt: new Date() } });
      const metadata = user.metadata && typeof user.metadata === 'object' && !Array.isArray(user.metadata) ? { ...user.metadata } : {};
      delete metadata.passwordResetTokenHash;
      await tx.user.update({ where: { id: user.id }, data: { metadata } });
      await tx.auditLog.create({ data: { tenantId: dto.tenantId, actorUserId: dto.userId, action: 'UPDATE', resourceType: 'auth.password', resourceId: dto.userId } });
      return { changed: true };
    });
  }

  recoverAccount(dto: AccountRecoveryDto) {
    void dto; throw new BadRequestException('Account recovery requires a configured and verified email provider');
  }

  oauthAuthorizationUrl(provider: OAuthProvider, tenantId: string) {
    return { provider, url: this.oauthService.authorizationUrl(provider, tenantId) };
  }

  private async issueAccessTokenPair(input: { userId: string; tenantId: string; organizationId?: string; workspaceId?: string; sessionId: string; roles: string[]; permissions: string[] }) {
    const authorization = await this.resolveAuthorization(input.tenantId, input.userId, input.organizationId);
    return this.tokenService.issueTokenPair({
      sub: input.userId,
      userId: input.userId,
      tenantId: input.tenantId,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      sessionId: input.sessionId,
      role: authorization.roles[0],
      roles: authorization.roles,
      permissions: authorization.permissions,
    });
  }

  private async bootstrapFirstTenant(dto: SignupDto, tx: Prisma.TransactionClient): Promise<AuthWorkspaceContext> {
    const organizationName = dto.companyName?.trim() || dto.email.split('@')[0] + "'s Organization";
    const slug = slugify(organizationName) + '-' + randomUUID().slice(0, 8);
    const tenant = await tx.tenant.create({
      data: {
        name: organizationName,
        slug,
        status: 'ACTIVE',
        primaryLocale: 'en',
        metadata: { source: 'self_signup', ownerRole: dto.role ?? ORGANIZATION_OWNER_ROLE },
      },
    });
    const organization = await tx.organization.create({
      data: {
        tenantId: tenant.id,
        name: organizationName,
        industry: 'retail',
        metadata: { source: 'self_signup' },
      },
    });
    const business = await tx.business.create({
      data: {
        tenantId: tenant.id,
        organizationId: organization.id,
        name: organizationName,
        businessType: 'retail',
        industry: 'retail',
        goals: ['customers', 'follow_ups', 'inventory', 'sales', 'profit_loss'],
      },
    });
    const workspace = await tx.workspace.create({
      data: {
        tenantId: tenant.id,
        organizationId: organization.id,
        businessId: business.id,
        name: organizationName,
        slug: slug + '-workspace',
        description: 'Retail workspace created by the business owner.',
        metadata: { source: 'self_signup', modules: ['Customers', 'Follow-ups', 'Inventory', 'Sales', 'Expenses', 'Profit & loss'] },
      },
    });

    return { tenantId: tenant.id, organizationId: organization.id, businessId: business.id, workspaceId: workspace.id };
  }

  private async resolveAuthorization(tenantId: string, userId: string, organizationId?: string) {
    const member = organizationId ? await this.prisma.database.membership.findFirst({ where: { tenantId, userId, organizationId, deletedAt: null } }) : null;
    // Retail permissions are checked against current scoped database assignments.
    // Legacy controllers only understand coarse actions, so those remain owner-only.
    return member?.title === ORGANIZATION_OWNER_ROLE
      ? { roles: DEFAULT_OWNER_ROLES, permissions: DEFAULT_PLATFORM_PERMISSIONS }
      : { roles: ['Member'], permissions: [] as string[] };
  }

  private async resolveExistingSignupContext(tenantId: string, workspaceId?: string): Promise<AuthWorkspaceContext> {
    const workspace = workspaceId
      ? await this.prisma.workspace.findFirst({ where: { tenantId, id: workspaceId, deletedAt: null } })
      : await this.prisma.workspace.findFirst({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
    return { tenantId, organizationId: workspace?.organizationId, workspaceId: workspace?.id };
  }

  private async authorizedContext(tenantId: string, userId: string, workspaceId: string, organizationId?: string, tx: Prisma.TransactionClient = this.prisma.database) {
    const workspace = await tx.workspace.findFirst({ where: { id: workspaceId, tenantId, deletedAt: null, ...(organizationId ? { organizationId } : {}), organization: { tenantId, deletedAt: null, tenant: { status: 'ACTIVE', deletedAt: null } }, members: { some: { tenantId, userId, status: 'ACTIVE', deletedAt: null, user: { tenantId, status: 'ACTIVE', deletedAt: null } } } } });
    if (!workspace || !await tx.membership.findFirst({ where: { tenantId, userId, organizationId: workspace.organizationId, deletedAt: null } })) throw new ForbiddenException('Workspace access is not permitted');
    return { organizationId: workspace.organizationId, workspaceId: workspace.id };
  }

  async contexts(auth: { tenantId: string; userId: string }) {
    const memberships = await this.prisma.database.membership.findMany({ where: { tenantId: auth.tenantId, userId: auth.userId, deletedAt: null }, select: { organizationId: true, title: true } });
    const workspaces = await this.prisma.database.workspace.findMany({ where: { tenantId: auth.tenantId, deletedAt: null, organizationId: { in: memberships.map(row => row.organizationId) }, organization: { tenantId: auth.tenantId, deletedAt: null, tenant: { status: 'ACTIVE', deletedAt: null } }, members: { some: { tenantId: auth.tenantId, userId: auth.userId, status: 'ACTIVE', deletedAt: null } } }, include: { organization: { select: { name: true } } }, orderBy: [{ name: 'asc' }, { id: 'asc' }] });
    return workspaces.map(row => ({ workspaceId: row.id, workspaceName: row.name, organizationId: row.organizationId, organizationName: row.organization.name, canManage: memberships.find(member => member.organizationId === row.organizationId)?.title === ORGANIZATION_OWNER_ROLE }));
  }

  async switchContext(auth: { tenantId: string; userId: string; sessionId: string }, workspaceId: string, device: RequestDevice = {}) {
    const result = await this.prisma.transaction(async tx => {
      await lock(tx, 'session-context:' + auth.sessionId);
      const current = await tx.session.findFirst({ where: { id: auth.sessionId, tenantId: auth.tenantId, userId: auth.userId, status: 'ACTIVE', revokedAt: null, expiresAt: { gt: new Date() } } });
      if (!current) throw new UnauthorizedException('Please sign in again');
      const target = await this.authorizedContext(auth.tenantId, auth.userId, workspaceId, undefined, tx);
      const user = await tx.user.findFirstOrThrow({ where: { id: auth.userId, tenantId: auth.tenantId, status: 'ACTIVE', deletedAt: null } });
      const member = await tx.membership.findFirstOrThrow({ where: { tenantId: auth.tenantId, userId: auth.userId, organizationId: target.organizationId, deletedAt: null } });
      const sessionId = randomUUID();
      const tokenPair = await this.tokenService.issueTokenPair({ sub: user.id, userId: user.id, tenantId: auth.tenantId, ...target, sessionId, roles: member.title === ORGANIZATION_OWNER_ROLE ? DEFAULT_OWNER_ROLES : ['Member'], permissions: member.title === ORGANIZATION_OWNER_ROLE ? DEFAULT_PLATFORM_PERMISSIONS : [] });
      const session = await tx.session.create({ data: { id: sessionId, tenantId: auth.tenantId, userId: auth.userId, refreshTokenHash: this.sessionsService.hashToken(tokenPair.refreshToken), expiresAt: new Date(Date.now() + 30 * 86400000), ipAddress: device.ipAddress, userAgent: device.userAgent } });
      await tx.session.update({ where: { id: current.id }, data: { status: 'REVOKED', revokedAt: new Date() } });
      await tx.auditLog.create({ data: { tenantId: auth.tenantId, actorUserId: auth.userId, action: 'UPDATE', resourceType: 'auth.context', resourceId: target.workspaceId, metadata: { organizationId: target.organizationId, workspaceId: target.workspaceId } } });
      return { user, session, tokenPair, ...target };
    });
    return this.authResponse(result);
  }

  async createContext(auth: { tenantId: string; userId: string; organizationId?: string; workspaceId?: string }, dto: CreateContextDto) {
    if (!auth.organizationId || !auth.workspaceId || !dto.name.trim()) throw new BadRequestException('Business context and name are required');
    return this.prisma.transaction(async tx => {
      await this.authorizedContext(auth.tenantId, auth.userId, auth.workspaceId!, auth.organizationId, tx);
      const membership = await tx.membership.findFirst({ where: { tenantId: auth.tenantId, userId: auth.userId, organizationId: auth.organizationId, deletedAt: null } });
      if (membership?.title !== ORGANIZATION_OWNER_ROLE) throw new ForbiddenException('Only the organization owner can create business contexts');
      await lock(tx, 'create-context:' + auth.tenantId + ':' + dto.requestKey);
      const hash = requestHash(dto);
      const existing = await tx.workspace.findFirst({ where: { tenantId: auth.tenantId, AND: [{ metadata: { path: ['contextRequestKey'], equals: dto.requestKey } }, { metadata: { path: ['contextCreatedBy'], equals: auth.userId } }] } });
      if (existing) { const metadata = existing.metadata as Prisma.JsonObject; if (existing.deletedAt || metadata.contextRequestHash !== hash) throw new ConflictException('Request key was already used'); return { workspaceId: existing.id, organizationId: existing.organizationId }; }
      const name = dto.name.trim(); let organizationId = auth.organizationId!;
      let businessId = (await tx.workspace.findUniqueOrThrow({ where: { id: auth.workspaceId! } })).businessId;
      if (dto.kind === 'business') {
        if (await tx.organization.findFirst({ where: { tenantId: auth.tenantId, name } })) throw new ConflictException('Choose a different business name');
        const organization = await tx.organization.create({ data: { tenantId: auth.tenantId, name } }); organizationId = organization.id;
        const business = await tx.business.create({ data: { tenantId: auth.tenantId, organizationId, name, businessType: 'retail', industry: 'retail' } }); businessId = business.id;
        await tx.membership.create({ data: { tenantId: auth.tenantId, organizationId, userId: auth.userId, title: ORGANIZATION_OWNER_ROLE } });
      }
      const workspace = await tx.workspace.create({ data: { tenantId: auth.tenantId, organizationId, businessId, name, slug: slugify(name) + '-' + randomUUID(), metadata: { contextRequestKey: dto.requestKey, contextCreatedBy: auth.userId, contextRequestHash: hash } } });
      await tx.workspaceMember.create({ data: { tenantId: auth.tenantId, workspaceId: workspace.id, userId: auth.userId, status: 'ACTIVE' } });
      await tx.auditLog.create({ data: { tenantId: auth.tenantId, actorUserId: auth.userId, action: 'CREATE', resourceType: 'auth.context', resourceId: workspace.id, metadata: { organizationId, workspaceId: workspace.id } } });
      return { workspaceId: workspace.id, organizationId };
    });
  }

  private async resolveUserWorkspaceContext(tenantId: string, userId: string) {
    const contexts = await this.contexts({ tenantId, userId });
    if (!contexts.length) throw new UnauthorizedException('No active workspace membership is available');
    return this.authorizedContext(tenantId, userId, contexts[0].workspaceId);
  }

  private ensureOrganizationMembership(tenantId: string, organizationId: string, userId: string) {
    return this.prisma.membership.upsert({
      where: { tenantId_organizationId_userId: { tenantId, organizationId, userId } },
      update: { deletedAt: null },
      create: { tenantId, organizationId, userId, title: ORGANIZATION_OWNER_ROLE },
    });
  }

  private ensureWorkspaceMembership(tenantId: string, workspaceId: string, userId: string) {
    return this.prisma.workspaceMember.upsert({
      where: { tenantId_workspaceId_userId: { tenantId, workspaceId, userId } },
      update: { status: 'ACTIVE', deletedAt: null },
      create: { tenantId, workspaceId, userId, status: 'ACTIVE' },
    });
  }

  private async authResponse(input: { user: User; session: Session; tokenPair: IssuedTokenPair; organizationId?: string; workspaceId?: string; verificationRequired?: boolean }): Promise<AuthResponseBody> {
    return {
      user: await this.authUser(input.user, input.organizationId, input.workspaceId),
      session: {
        id: input.session.id,
        accessToken: input.tokenPair.accessToken,
        refreshToken: input.tokenPair.refreshToken,
        tenantId: input.user.tenantId,
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
        expiresAt: input.session.expiresAt.toISOString(),
      },
      verificationRequired: input.verificationRequired ?? false,
    };
  }

  private async authUser(user: User, organizationId?: string, workspaceId?: string): Promise<AuthResponseUser> {
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.displayName,
      displayName: user.displayName,
      roles: (await this.resolveAuthorization(user.tenantId, user.id, organizationId)).roles,
      organizationId,
      workspaceId,
      emailVerified: Boolean(user.metadata && typeof user.metadata === 'object' && !Array.isArray(user.metadata) && user.metadata.emailVerifiedAt),
    };
  }
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 48) || 'nexora-tenant';
}
