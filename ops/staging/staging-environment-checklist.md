# Staging Environment Checklist

## Infrastructure

- PostgreSQL 16 is configured through `DATABASE_URL` and migration status must be clean before SRC sign-off.
- Redis 7 is configured through `REDIS_URL` and supports BullMQ queues, cache, realtime and event transport.
- MinIO is available for S3-compatible storage validation.
- API, worker, AI worker, web and NGINX services are described in `docker-compose.staging.yml`.

## Required Validation

1. Copy `infra/env/.env.staging.example` to `.env.staging` and replace managed secrets.
2. Run `npx.cmd prisma validate --schema prisma/schema.prisma`.
3. Run `npx.cmd prisma migrate status --schema prisma/schema.prisma` against staging.
4. Run `npm.cmd run staging:seed -- --apply` only against isolated staging data.
5. Run `npm.cmd run staging:e2e` with `NEXORA_API_URL` and `NEXORA_WEB_URL` pointing to staging.
6. Run `npm.cmd run staging:load` after the E2E journey passes.
7. Run browser Lighthouse against the staged web URL.

## Release Rule

Public launch is blocked until Critical and High severity staging issues are closed and Lighthouse evidence is captured from the real staged deployment.
