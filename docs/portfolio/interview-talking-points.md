# Interview Talking Points

## Architecture

- AuthCoreModule owns authentication infrastructure while AuthModule owns auth business workflows.
- RequestContextStore carries request, tenant, workspace and user context across services.
- Prisma, Redis, BullMQ and WebSocket boundaries are instrumented for enterprise observability.

## Scale

- 818 Prisma models show broad domain coverage.
- 2013 controller endpoint decorators demonstrate enterprise API surface area.
- Docker and Kubernetes artifacts show deployment readiness.

## Security

JWT, RBAC, tenant isolation, workspace isolation, validation, security middleware, audit logging and structured telemetry are first-class architecture concerns.
