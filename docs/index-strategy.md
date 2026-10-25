# Index Strategy

## Core Strategy

NEXORA AI uses tenant-scoped compound indexes as the default access pattern. This supports enterprise multi-tenancy, predictable query planning, and clean data isolation.

## Implemented Patterns

- Tenant lookups: `[tenantId, ...]`
- Active-record filtering: `[tenantId, deletedAt]`
- Slug/key uniqueness: `[tenantId, slug]`, `[tenantId, key]`, `[tenantId, code]`
- User lookup: `[tenantId, email]`
- Membership lookup: `[tenantId, userId]`, `[tenantId, workspaceId, userId]`
- Workflow execution: `[tenantId, workflowId, status]`, `[tenantId, status, createdAt]`
- Event bus: `[tenantId, topicId, status]`, `[tenantId, eventType, createdAt]`
- Audit: `[tenantId, actorUserId, createdAt]`, `[tenantId, resourceType, resourceId]`
- Metrics: `[tenantId, metricId, observedAt]`
- Billing: `[tenantId, status]`, `[tenantId, currentPeriodEnd]`
- Tasks and projects: `[tenantId, workspaceId, status]`, `[tenantId, assigneeUserId, status]`

## Future PostgreSQL Enhancements

Prisma indexes are the baseline. Future SQL migrations should add partial indexes, GIN indexes for JSONB, BRIN indexes for append-only tables, native partitioning, and RLS policy indexes.
