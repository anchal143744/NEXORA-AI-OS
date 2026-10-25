# Migration Plan

## Phase 1 Migration Order

1. Create PostgreSQL database.
2. Enable UUID support where required.
3. Apply Prisma enum definitions.
4. Create Tenant, Organization, Business, and Workspace tables.
5. Create User, AuthAccount, Credential, and Session tables.
6. Create Membership, WorkspaceMember, Team, TeamMember, Role, Permission, RolePermission, and RoleAssignment tables.
7. Create AuditLog, ActivityLog, and Notification tables.
8. Create Workflow, WorkflowExecution, and WorkflowStepExecution tables.
9. Create EventBusTopic, EventBusSubscription, and Event tables.
10. Create IntegrationProvider, Integration, and ApiKey tables.
11. Create SubscriptionPlan, BillingAccount, Subscription, UsageRecord, and Invoice tables.
12. Create AI conversation, message, tool call, recommendation, and insight tables.
13. Create analytics, KPI, metric, dashboard, and widget tables.
14. Create adaptive module registry and module settings tables.
15. Create CRM, finance, HR, inventory, document, file, project, task, compliance, and security monitoring tables.
16. Apply indexes and unique constraints.
17. Seed platform roles, permissions, modules, plans, topics, and default compliance frameworks.

## Production Migration Rules

- Use expand-and-contract migrations.
- Avoid destructive changes without backups.
- Review generated SQL before production deployment.
- Add nullable fields first, backfill, then enforce required constraints.
- Keep audit, activity, event, metric, AI, and workflow execution data append-only.

## Post-Prisma SQL Hardening

Some enterprise PostgreSQL features should be added through reviewed SQL migrations after the baseline Prisma migration: Row Level Security, partial indexes, JSONB GIN indexes, BRIN indexes, and partitioning.
