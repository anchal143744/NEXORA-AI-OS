# Admin Guide

## Admin Responsibilities

- Configure database, Redis, secrets and email provider.
- Validate migrations before onboarding customers.
- Monitor npm audit advisories and dependency upgrades.
- Verify tenant isolation and RBAC policies.
- Configure OAuth providers if using Google, Microsoft or GitHub login.
- Review audit logs, AI action logs and security events.

## Environment Setup

- Set DATABASE_URL for PostgreSQL.
- Set REDIS_URL for cache, queue and session support.
- Set JWT secrets.
- Set NEXT_PUBLIC_API_URL to the API URL ending in /api.
- Configure SMTP or a supported email provider.
- Configure AI provider keys only in secure server environments.

## Operational Checks

- Run npm.cmd run api:typecheck.
- Run npm.cmd run web:typecheck.
- Run npm.cmd run api:build.
- Run npm.cmd run web:build.
- Run prisma validate and prisma generate.
- Run live migration and E2E smoke tests before inviting users.

## Release Gate Ownership

Admins should not approve enterprise production usage until the Phase 71 production checklist is green.
