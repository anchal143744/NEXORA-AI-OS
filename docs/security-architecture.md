# Backend Security Architecture

## Authentication

The AuthModule defines the authentication boundary. Phase 2 includes token validation structure and a JWT guard placeholder. Full login, refresh token rotation, MFA, SSO, and session persistence belong to later implementation phases.

## Authorization

The IamModule defines RBAC and permission enforcement boundaries:

- `RequirePermissions` decorator attaches required permissions.
- `PermissionsGuard` reads required permissions and request permissions.
- `TenantGuard` enforces tenant context presence.
- `IamService` centralizes permission checks.
- `PolicyContext` defines future ABAC policy inputs.

## Tenant Security

- `x-tenant-id` is captured by request context middleware.
- Database access must use tenant-aware repository/service methods.
- PrismaService exposes `tenantId()` to force tenant context lookup.
- Future database migrations should add PostgreSQL RLS.

## API Security Standards

- Validation rejects unknown fields.
- Global filters prevent raw exception leakage.
- API keys and bearer auth are represented in Swagger configuration.
- All privileged actions should publish AuditLog events in later service phases.
