# NEXORA AI OS Architecture

## Overview

NEXORA AI OS is organized as a multi-tenant enterprise SaaS monorepo with clear boundaries between frontend, backend, database, shared packages, infrastructure and operational documentation.

## Monorepo Structure

- apps/api: NestJS API, workers, queues, realtime gateways and business modules.
- apps/web: Next.js App Router frontend and enterprise workspace shell.
- packages: shared types, configuration and reusable platform contracts.
- prisma: Prisma schema and database migration boundary.
- infra: NGINX and Kubernetes infrastructure artifacts.
- scripts: validation, smoke test, E2E health, security scan and performance benchmark scripts.
- docs: operational, architecture and release documentation.

## Backend Architecture

The API follows modular NestJS boundaries. Platform foundations load through ConfigModule, CommonModule, DatabaseModule, RedisModule, QueueModule, AuthModule, SecurityModule, SessionsModule, TenantsModule, WorkspacesModule and RbacModule before business modules.

Auth infrastructure is centralized through AuthCoreModule. TokenService and JwtAuthGuard are globally available through one provider registration, while RequestContextStore is exported from global CommonModule. Feature modules can use @UseGuards(JwtAuthGuard) without importing AuthModule directly.

## Request Context

RequestContextMiddleware initializes request, correlation, tenant, workspace and user context. TenantValidationMiddleware and WorkspaceValidationMiddleware enforce scoped access for protected flows. Prisma and logging layers consume RequestContextStore for isolation, auditability and correlation.

## Data Architecture

Prisma defines 818 models and 28 enums over PostgreSQL. Data is tenant and workspace scoped where applicable, with UUID identifiers, timestamps, audit-oriented fields and indexes for enterprise query patterns.

## Event And Realtime Architecture

Redis, BullMQ, WebSockets and internal event services support async work, notifications, workflow execution, AI execution telemetry and activity streams. Queue processing is instrumented for observability and failure handling.

## Frontend Architecture

The web app uses Next.js 15 with metadata-driven navigation, responsive enterprise layouts, command center surfaces, workspace pages and design-system primitives. Data access is prepared around typed services, TanStack Query and persisted client state.

## Observability

Structured logging, metrics and tracing capture HTTP, Prisma, Redis, BullMQ, event processing, auth and AI workflow boundaries. The metrics endpoint exposes Prometheus-compatible telemetry.

## Security

Security foundations include JWT authentication, RBAC, tenant/workspace isolation, request validation, security headers, rate limiting, audit logging, secret validation and environment-specific configuration.

## Production Launch Gate

Phase 10 formalizes release promotion through `scripts/production-launch-gate.mjs`. The gate checks deployment artifacts, production env templates, documentation, build artifacts, PostgreSQL, Redis, Docker, hosted web/API URLs and Lighthouse evidence before allowing a v2.0.0 Go decision.
