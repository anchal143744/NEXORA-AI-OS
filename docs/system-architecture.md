# System Architecture

## Overview

NEXORA AI OS is structured as an adaptive multi-tenant SaaS platform:

- Next.js frontend for enterprise workspaces.
- NestJS backend for API, authentication, tenant context, RBAC, modules, AI and automation.
- PostgreSQL with Prisma for persistent data.
- Redis and BullMQ for cache, sessions and background work.
- WebSockets for realtime surfaces.
- AI provider abstraction for Copilot, agents and intelligence features.

## Phase 71 Stabilized Flow

Welcome -> Sign Up -> Tenant Bootstrap -> Login/Session -> Onboarding -> Business Discovery -> Workspace Intelligence -> Workspace Creation -> Command Center -> CRM/HR/Finance/Analytics/AI Agents.

## Tenant Context

Frontend sessions now persist the auth user, access token, refresh token, tenantId and workspaceId. API requests send Authorization, x-tenant-id and x-workspace-id headers. The JWT guard now also writes tenant and user context into the backend request context store.

## Frontend Architecture

- App Router routes under apps/web/app.
- Feature modules under apps/web/features.
- API services under apps/web/services.
- Global auth state under apps/web/stores/auth-store.ts.
- Design and adaptive shell foundations from earlier frontend phases.

## Backend Architecture

- Auth and IAM modules provide signup, login, refresh, logout, verification, password reset and me.
- Tenant and workspace modules provide isolation context.
- Business modules expose method-level endpoints across CRM, HR, finance, operations, AI, analytics and governance.
- Global response envelope is unwrapped by the frontend API client.

## Release Architecture Verdict

The architecture is broad and buildable, but production readiness depends on live migration validation, live E2E tests, dependency remediation and closing the documented functional gaps.
