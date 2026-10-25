# Database Documentation

## Database

NEXORA uses PostgreSQL with Prisma.

## Current Schema Statistics

- Prisma models: 818
- Primary schema: prisma/schema.prisma
- Prisma Client: 6.19.3

## Phase 71 Database Validation

- prisma validate: PASSED
- prisma generate: PASSED
- migrate status: BLOCKED in this environment with Schema engine error

## Tenant Isolation

Most enterprise records are tenant scoped and many workspace records are workspace scoped. Phase 71 repaired auth bootstrap so the first signup can create a tenant, organization, business and workspace context.

## Data Integrity Concerns To Resolve

- Run live migration status against PostgreSQL.
- Apply migrations in a clean database and verify all relations.
- Add seed data for a first super admin or tenant bootstrap path.
- Run duplicate-model and naming reviews before public schema documentation.
- Add query performance checks for large cross-module dashboards.

## Release Verdict

The Prisma schema is syntactically valid and client generation works. Database production readiness is not complete until live PostgreSQL migration and E2E tests pass.
