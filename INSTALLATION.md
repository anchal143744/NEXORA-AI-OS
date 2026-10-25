# Installation Guide

## Prerequisites

- Windows 10/11, macOS or Linux
- Node.js 20+
- npm 10+
- PostgreSQL 15+
- Redis 7+

## Setup

```powershell
npm.cmd install
Copy-Item .env.example .env
npx.cmd prisma generate --schema prisma/schema.prisma
npm.cmd run api:typecheck
npm.cmd run api:build
```

## Database

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexora_ai?schema=public"
```

```powershell
npx.cmd prisma migrate deploy --schema prisma/schema.prisma
```

## Redis

```text
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

## Validate

```powershell
npm.cmd run api:typecheck
npm.cmd run api:build
npm.cmd run api:test
npm.cmd run api:e2e
```

## Phase 10 Runtime Requirement

The v2.0.0 production launch gate requires PostgreSQL and Redis to be online. On Windows, install Redis through Docker Desktop, WSL, Memurai, a Redis-compatible managed service or another approved Redis-compatible server before running API E2E validation.
