# Backend Architecture

## Scope

Phase 2 establishes the backend foundation for NEXORA AI using NestJS, TypeScript, Prisma, PostgreSQL, Redis, BullMQ, WebSockets, and OpenAPI/Swagger.

## Monorepo Structure

- `apps/api`: NestJS backend application.
- `packages/shared`: shared runtime contracts and response/context types.
- `packages/types`: platform-wide API, IAM, event, and AI type contracts.
- `packages/config`: shared environment/configuration contracts.

## Core Principles

- Tenant-first request handling.
- Workspace-aware execution context.
- Request context propagation through AsyncLocalStorage.
- Configuration validation before boot.
- Modular NestJS architecture.
- Prisma as database boundary.
- Redis as cache and queue infrastructure.
- BullMQ as async job foundation.
- WebSockets for realtime channels.
- Swagger/OpenAPI for API discoverability.

## Core Backend Modules

- ConfigModule
- DatabaseModule
- RedisModule
- QueueModule
- AuthModule
- IamModule
- EventsModule
- RealtimeModule
- AiModule

## Tenant Context

The request context middleware extracts `x-tenant-id`, `x-workspace-id`, `x-user-id`, roles, permissions, request ID, IP address, and user agent. Services must resolve tenant context from `RequestContextStore` instead of accepting arbitrary tenant IDs from unsafe sources.
