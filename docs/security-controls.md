# Security Controls

## Implemented Controls

- Argon2id password hashing
- JWT access tokens
- Hashed refresh token storage
- Session revocation
- Login audit logs
- Tenant validation middleware
- Workspace validation middleware
- CSRF guard using header/cookie token matching
- Security headers via Helmet
- API throttling via NestJS Throttler
- Request validation via global ValidationPipe
- IP tracking service
- Global exception filter
- Standard API response interceptor

## Tenant Isolation

`TenantValidationMiddleware` enforces tenant context for tenant-scoped APIs. `WorkspaceValidationMiddleware` validates workspace context shape. Prisma access should remain tenant-scoped through service boundaries.

## Audit Logging

`LoginAuditService` writes successful and failed login activity into AuditLog. Later phases should add audit events for permission changes, API key activity, exports, destructive writes, and AI tool calls.

## CSRF

`CsrfGuard` compares `x-csrf-token` against the `csrf-token` cookie for unsafe HTTP methods. Routes that mutate browser-authenticated state should use this guard.

## Rate Limiting

`SecurityModule` registers a global ThrottlerGuard with a baseline limit of 120 requests per minute. Later phases should add tenant-plan-aware and endpoint-specific throttles.

## Headers

`main.ts` enables Helmet to add secure HTTP headers by default.
