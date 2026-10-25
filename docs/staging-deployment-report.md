# Staging Deployment Report

## Scope

Phase 9 introduces a production-like staging deployment surface for NEXORA AI OS `1.9.0-src.1`.

## Infrastructure

- `docker-compose.staging.yml` defines API, web, worker, AI worker, PostgreSQL, Redis, MinIO and NGINX.
- `infra/env/.env.staging.example` documents environment-specific secrets and endpoints.
- `ops/staging/staging-environment-checklist.md` defines the operational release steps.

## Migration Gate

Run `npx.cmd prisma migrate status --schema prisma/schema.prisma` against staging before seeding or E2E validation. Schema drift blocks public launch.

## Deployment Gate

Staging must expose API health at `/api/v1/health/live`, readiness at `/api/v1/health/ready`, OpenAPI at `/docs-json`, and web routes for public, auth, onboarding, command center, workspace and AI Copilot surfaces.
