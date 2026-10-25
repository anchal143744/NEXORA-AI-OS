# Authentication Architecture

## Implemented Scope

Phase 3 implements backend-only authentication foundations for NEXORA AI.

## Email Authentication

Implemented files:

- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/modules/auth/dto/signup.dto.ts`
- `apps/api/src/modules/auth/dto/login.dto.ts`
- `apps/api/src/modules/auth/dto/email-verification.dto.ts`
- `apps/api/src/modules/auth/dto/password-reset.dto.ts`
- `apps/api/src/modules/auth/dto/account-recovery.dto.ts`

Supported flows:

1. Email signup
2. Email login
3. Email verification token generation and validation
4. Password reset token generation and validation
5. Change password with current-password verification
6. Account recovery token generation

## Password Security

Passwords are hashed with Argon2id through `PasswordService`. Raw passwords are never stored.

## OAuth

OAuth strategy files exist for:

- Google OAuth
- Microsoft OAuth
- GitHub OAuth

OAuth providers are isolated in `apps/api/src/modules/auth/oauth` so provider-specific details do not leak into business services.

## Token Strategy

- JWT access token lifetime: 15 minutes
- Refresh token lifetime: 30 days
- Email verification token lifetime: 24 hours
- Password reset token lifetime: 30 minutes

Token payloads include tenant, user, session, role, and permission context where appropriate.
