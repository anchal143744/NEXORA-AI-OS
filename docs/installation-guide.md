# Installation Guide

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- PostgreSQL for production/staging database validation
- Redis for sessions, queues, cache and realtime infrastructure
- Windows users can use npm.cmd when PowerShell script execution blocks npm.ps1.

## Install

1. Open a terminal at C:\Users\Acer\OneDrive\Desktop\NEXORA_AI.
2. Run npm.cmd install.
3. Create environment files for API and web before running the platform.
4. Validate Prisma with npx.cmd prisma validate --schema prisma/schema.prisma.
5. Generate Prisma Client with npx.cmd prisma generate --schema prisma/schema.prisma.

## Minimum Environment Variables

- DATABASE_URL: PostgreSQL connection string.
- JWT_ACCESS_SECRET: strong access token secret.
- JWT_REFRESH_SECRET: strong refresh token secret.
- REDIS_URL: Redis connection string.
- NEXT_PUBLIC_API_URL: http://localhost:4000/api for local development.
- OPENAI_API_KEY: required only when using live OpenAI-backed AI features.
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD or provider-specific email settings for real email delivery.

## Local Development

- API dev: npm.cmd run api:dev
- Web dev: npm.cmd run web:dev
- API typecheck: npm.cmd run api:typecheck
- Web typecheck: npm.cmd run web:typecheck

## Production Build

- API build: npm.cmd run api:build
- Web build: npm.cmd run web:build

## Installation Status

Phase 71 install validation passed, but production database migration status still needs a live PostgreSQL environment.
