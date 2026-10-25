# NEXORA AI Database Architecture

## Purpose

This document defines the Phase 1 PostgreSQL and Prisma database foundation for NEXORA AI, an adaptive enterprise AI business operating system.

## Architecture Principles

- Multi-tenant by default
- PostgreSQL first
- Prisma schema as the application data contract
- UUID primary keys across all models
- Tenant isolation through `tenantId`
- Metadata-driven extensibility through JSON fields where appropriate
- Soft deletes on recoverable business records
- Append-only logs for audit, activity, events, metrics, AI tool calls, and workflow execution history
- Enterprise indexing strategy for tenant-scoped access patterns

## Core Domains

1. Tenancy: Tenant, Organization, Business, Workspace
2. Identity: User, AuthAccount, Credential, Session
3. IAM/RBAC: Membership, WorkspaceMember, Team, TeamMember, Role, Permission, RolePermission, RoleAssignment
4. Operations: AuditLog, ActivityLog, Notification
5. Workflow: Workflow, WorkflowExecution, WorkflowStepExecution
6. Event Bus: EventBusTopic, EventBusSubscription, Event
7. Integrations: IntegrationProvider, Integration, ApiKey
8. Billing: SubscriptionPlan, BillingAccount, Subscription, UsageRecord, Invoice
9. AI: AiConversation, AiMessage, AiToolCall, AiRecommendation, AiInsight
10. Analytics: AnalyticsDataset, KpiMetric, MetricValue, Dashboard, DashboardWidget
11. Adaptive Modules: BusinessModule, ModuleSetting
12. Business Operations: CRM, Finance, HR, Inventory, Documents, Files, Projects, Tasks
13. Governance: ComplianceFramework, ComplianceControl, SecurityFinding

## Tenant Isolation

Every tenant-owned record carries `tenantId`. Queries must always be scoped by tenant context. Future migrations should add PostgreSQL Row Level Security policies to enforce tenant boundaries at the database layer.

## Scalability Direction

High-volume tables such as Event, AuditLog, ActivityLog, MetricValue, WorkflowExecution, WorkflowStepExecution, AiMessage, and AiToolCall should be candidates for partitioning once production volume requires it.
