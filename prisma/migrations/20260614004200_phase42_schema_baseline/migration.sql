-- Phase 42 schema baseline for NEXORA AI OS.
-- Reconstructs the pre-Phase43 foundation schema that was present before the checked-in Phase 43-50 migrations.
-- Generated from prisma/schema.prisma by excluding tables already created by Phase 43-50 migrations.
-- Existing databases that already match schema.prisma must mark this migration as applied; do not execute it against existing data.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('PROVISIONING', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TenantPlanTier" AS ENUM ('FREE', 'STARTER', 'GROWTH', 'BUSINESS', 'ENTERPRISE', 'GLOBAL_ENTERPRISE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('PASSWORD', 'GOOGLE', 'MICROSOFT', 'APPLE', 'SAML', 'OIDC');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'REMOVED');

-- CreateEnum
CREATE TYPE "PermissionEffect" AS ENUM ('ALLOW', 'DENY');

-- CreateEnum
CREATE TYPE "AuditActionType" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'INVITE', 'APPROVE', 'REJECT', 'EXECUTE', 'AI_ACTION', 'SECURITY_EVENT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'WORKFLOW', 'TASK', 'PROJECT', 'BILLING', 'SECURITY', 'AI', 'INTEGRATION');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('QUEUED', 'RUNNING', 'WAITING', 'SUCCEEDED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'PUBLISHED', 'CONSUMED', 'FAILED', 'DEAD_LETTER');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('CONNECTED', 'DEGRADED', 'DISCONNECTED', 'REVOKED');

-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'PAUSED');

-- CreateEnum
CREATE TYPE "AiConversationStatus" AS ENUM ('OPEN', 'RESOLVED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('OPEN', 'ACCEPTED', 'DISMISSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ModuleStatus" AS ENUM ('AVAILABLE', 'ENABLED', 'DISABLED', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "CrmStageType" AS ENUM ('LEAD', 'QUALIFIED', 'OPPORTUNITY', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED', 'VOID');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'TERMINATED');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('INBOUND', 'OUTBOUND', 'ADJUSTMENT', 'TRANSFER');

-- CreateEnum
CREATE TYPE "FileVisibility" AS ENUM ('PRIVATE', 'TEAM', 'WORKSPACE', 'TENANT', 'PUBLIC_LINK');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'CANCELED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'COMPLIANT', 'NON_COMPLIANT', 'REMEDIATED');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "TenantStatus" NOT NULL DEFAULT 'PROVISIONING',
    "planTier" "TenantPlanTier" NOT NULL DEFAULT 'FREE',
    "countryCode" VARCHAR(2),
    "primaryLocale" VARCHAR(12),
    "dataRegion" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "parentId" UUID,
    "name" TEXT NOT NULL,
    "legalName" TEXT,
    "registrationId" TEXT,
    "countryCode" VARCHAR(2),
    "industry" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "countryCode" VARCHAR(2),
    "teamSizeBand" TEXT,
    "revenueBand" TEXT,
    "goals" JSONB NOT NULL DEFAULT '[]',
    "operatingModel" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "businessId" UUID,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'INVITED',
    "timezone" TEXT,
    "locale" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthAccount" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "email" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AuthAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "passwordHash" TEXT,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecretRef" TEXT,
    "passwordChangedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "refreshTokenHash" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "workspaceId" UUID,
    "parentId" UUID,
    "name" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "teamId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "isLead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "effect" "PermissionEffect" NOT NULL DEFAULT 'ALLOW',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "conditions" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleAssignment" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "membershipId" UUID,
    "workspaceMemberId" UUID,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RoleAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "actorUserId" UUID,
    "action" "AuditActionType" NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "before" JSONB,
    "after" JSONB,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID,
    "activityType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "title" TEXT NOT NULL,
    "body" TEXT,
    "actionUrl" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'DRAFT',
    "triggerDefinition" JSONB NOT NULL DEFAULT '{}',
    "graphDefinition" JSONB NOT NULL DEFAULT '{}',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowExecution" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workflowId" UUID NOT NULL,
    "workspaceId" UUID,
    "status" "RunStatus" NOT NULL DEFAULT 'QUEUED',
    "approvalStatus" TEXT NOT NULL DEFAULT 'not_required',
    "latencyMs" INTEGER,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "executionGraph" JSONB NOT NULL DEFAULT '{}',
    "aiDecisionTrace" JSONB NOT NULL DEFAULT '[]',
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "input" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB,
    "error" JSONB,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowStepExecution" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workflowExecutionId" UUID NOT NULL,
    "stepKey" TEXT NOT NULL,
    "stepType" TEXT NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'QUEUED',
    "input" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB,
    "error" JSONB,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowStepExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventBusTopic" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "retentionDays" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EventBusTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventBusSubscription" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "topicId" UUID NOT NULL,
    "subscriberName" TEXT NOT NULL,
    "filter" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EventBusSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "topicId" UUID,
    "eventType" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "subjectType" TEXT,
    "subjectId" TEXT,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "status" "EventStatus" NOT NULL DEFAULT 'PENDING',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationProvider" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "configSchema" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "IntegrationProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "providerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'CONNECTED',
    "credentialsRef" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "scopes" JSONB NOT NULL DEFAULT '[]',
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" "TenantPlanTier" NOT NULL,
    "priceMonthly" DECIMAL(12,2),
    "priceAnnual" DECIMAL(12,2),
    "limits" JSONB NOT NULL DEFAULT '{}',
    "features" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingAccount" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "billingEmail" TEXT NOT NULL,
    "taxId" TEXT,
    "currency" VARCHAR(3) NOT NULL,
    "billingAddress" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BillingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "billingAccountId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "status" "BillingStatus" NOT NULL DEFAULT 'TRIALING',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageRecord" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "subscriptionId" UUID NOT NULL,
    "metricKey" TEXT NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "billingAccountId" UUID,
    "subscriptionId" UUID,
    "customerId" UUID,
    "supplierId" UUID,
    "templateId" UUID,
    "seriesId" UUID,
    "invoiceNumber" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "invoiceType" TEXT NOT NULL DEFAULT 'standard',
    "countryCode" VARCHAR(2),
    "currency" VARCHAR(3) NOT NULL,
    "baseCurrency" VARCHAR(3),
    "exchangeRate" DECIMAL(20,10),
    "taxMode" TEXT NOT NULL DEFAULT 'exclusive',
    "subtotal" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "discount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "tax" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "total" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "amountPaid" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "amountDue" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "issuedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "paymentTerms" TEXT,
    "lateFeeRules" JSONB NOT NULL DEFAULT '{}',
    "taxBreakdown" JSONB NOT NULL DEFAULT '[]',
    "registrationSnapshot" JSONB NOT NULL DEFAULT '{}',
    "billingAddress" JSONB NOT NULL DEFAULT '{}',
    "shippingAddress" JSONB NOT NULL DEFAULT '{}',
    "notes" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiConversation" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "title" TEXT,
    "status" "AiConversationStatus" NOT NULL DEFAULT 'OPEN',
    "modelKey" TEXT,
    "context" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiMessage" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "userId" UUID,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiToolCall" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "conversationId" UUID,
    "toolName" TEXT NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'QUEUED',
    "input" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB,
    "error" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiToolCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiRecommendation" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "Severity" NOT NULL DEFAULT 'INFO',
    "evidence" JSONB NOT NULL DEFAULT '{}',
    "recommendedAction" JSONB NOT NULL DEFAULT '{}',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AiRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiInsight" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "metricId" UUID,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'INFO',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AiInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsDataset" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "schema" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AnalyticsDataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiMetric" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "businessId" UUID,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT,
    "calculation" JSONB NOT NULL DEFAULT '{}',
    "target" DECIMAL(18,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "KpiMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricValue" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "metricId" UUID NOT NULL,
    "datasetId" UUID,
    "value" DECIMAL(18,4) NOT NULL,
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "observedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetricValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "layout" JSONB NOT NULL DEFAULT '{}',
    "filters" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardWidget" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "dashboardId" UUID NOT NULL,
    "metricId" UUID,
    "widgetType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "position" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DashboardWidget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessModule" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "ModuleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "metadataSchema" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BusinessModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleSetting" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "moduleId" UUID NOT NULL,
    "businessId" UUID,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "enabledAt" TIMESTAMP(3),
    "disabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ModuleSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmAccount" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "industry" TEXT,
    "ownerUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CrmAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmContact" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "accountId" UUID,
    "email" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "phone" TEXT,
    "title" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CrmContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmDeal" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "accountId" UUID,
    "name" TEXT NOT NULL,
    "stage" "CrmStageType" NOT NULL DEFAULT 'LEAD',
    "amount" DECIMAL(14,2),
    "currency" VARCHAR(3),
    "closeDate" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CrmDeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceAccount" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FinanceAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceTransaction" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "reference" TEXT,
    "description" TEXT,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FinanceTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeProfile" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID,
    "employeeNumber" TEXT NOT NULL,
    "department" TEXT,
    "jobTitle" TEXT,
    "employmentStatus" "EmploymentStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EmployeeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "unitOfMeasure" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryMovement" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "movementType" "InventoryMovementType" NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "location" TEXT,
    "reference" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "contentRef" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAsset" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "documentId" UUID,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "checksum" TEXT,
    "visibility" "FileVisibility" NOT NULL DEFAULT 'PRIVATE',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FileAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "teamId" UUID,
    "name" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNED',
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "projectId" UUID,
    "assigneeUserId" UUID,
    "createdByUserId" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "dueAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_frameworks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" VARCHAR(2),
    "requirements" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "compliance_frameworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_controls" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "frameworkId" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ComplianceStatus" NOT NULL DEFAULT 'OPEN',
    "ownerUserId" UUID,
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "dueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "compliance_controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityFinding" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "ownerUserId" UUID,
    "severity" "Severity" NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ComplianceStatus" NOT NULL DEFAULT 'OPEN',
    "evidence" JSONB NOT NULL DEFAULT '{}',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SecurityFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleActivation" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "workspaceId" UUID,
    "moduleKey" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "enabledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ModuleActivation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmPipeline" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "stages" JSONB NOT NULL DEFAULT '[]',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CrmPipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmLeadRecord" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "ownerUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CrmLeadRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmCustomerRecord" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "lifecycleStage" TEXT NOT NULL DEFAULT 'customer',
    "ownerUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CrmCustomerRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmOpportunity" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "pipelineId" UUID,
    "customerId" UUID,
    "name" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'open',
    "amount" DECIMAL(14,2),
    "currency" VARCHAR(3),
    "expectedCloseDate" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "closeReason" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CrmOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceExpense" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "vendor" TEXT,
    "description" TEXT,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "incurredAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FinanceExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceRevenue" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "recognizedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FinanceRevenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashflowSnapshot" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "inflow" DECIMAL(14,2) NOT NULL,
    "outflow" DECIMAL(14,2) NOT NULL,
    "netCashflow" DECIMAL(14,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CashflowSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "managerUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "checkInAt" TIMESTAMP(3),
    "checkOutAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentFolder" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "parentId" UUID,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DocumentFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadRecord" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "folderId" UUID,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "storageProvider" TEXT NOT NULL DEFAULT 'pending',
    "storageKey" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UploadRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentMemory" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" TEXT NOT NULL DEFAULT '',
    "businessId" UUID,
    "agentKey" TEXT NOT NULL DEFAULT '',
    "conversationId" UUID,
    "scope" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AgentMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiSnapshot" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" TEXT,
    "period" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "values" JSONB NOT NULL DEFAULT '{}',
    "healthScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KpiSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportRun" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" TEXT,
    "reportType" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'QUEUED',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB,
    "error" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ReportRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PredictiveAlert" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" TEXT,
    "alertType" TEXT NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'INFO',
    "score" INTEGER NOT NULL,
    "signal" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PredictiveAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationSecret" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "integrationId" UUID,
    "kind" TEXT NOT NULL,
    "encryptedValue" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "IntegrationSecret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEndpoint" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "integrationId" UUID,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secretRef" TEXT NOT NULL,
    "events" JSONB NOT NULL DEFAULT '[]',
    "inbound" BOOLEAN NOT NULL DEFAULT true,
    "outbound" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WebhookEndpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookDelivery" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "endpointId" UUID NOT NULL,
    "direction" TEXT NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'QUEUED',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "response" JSONB,
    "error" JSONB,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncRun" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" TEXT,
    "integrationId" UUID NOT NULL,
    "mode" TEXT NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'QUEUED',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB,
    "error" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SyncRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationalMetric" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "tags" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperationalMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataRetentionPolicy" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "resourceType" TEXT NOT NULL,
    "retentionDays" INTEGER NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'ARCHIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DataRetentionPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackupRun" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "backupType" TEXT NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'QUEUED',
    "manifest" JSONB NOT NULL DEFAULT '{}',
    "error" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BackupRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecoveryRun" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "backupRunId" TEXT,
    "recoveryType" TEXT NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'QUEUED',
    "strategy" JSONB NOT NULL DEFAULT '{}',
    "error" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RecoveryRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceBlueprint" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "businessId" UUID,
    "industry" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "profile" JSONB NOT NULL DEFAULT '{}',
    "blueprint" JSONB NOT NULL DEFAULT '{}',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WorkspaceBlueprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryTemplate" (
    "id" UUID NOT NULL,
    "industry" TEXT NOT NULL,
    "template" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "IndustryTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleTemplate" (
    "id" UUID NOT NULL,
    "industry" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL,
    "template" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ModuleTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardTemplate" (
    "id" UUID NOT NULL,
    "industry" TEXT NOT NULL,
    "dashboardKey" TEXT NOT NULL,
    "roleKey" TEXT,
    "template" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DashboardTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavigationTemplate" (
    "id" UUID NOT NULL,
    "industry" TEXT NOT NULL,
    "template" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "NavigationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiTemplate" (
    "id" UUID NOT NULL,
    "industry" TEXT NOT NULL,
    "kpiKey" TEXT NOT NULL,
    "template" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "KpiTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTemplate" (
    "id" UUID NOT NULL,
    "industry" TEXT NOT NULL,
    "workflowKey" TEXT NOT NULL,
    "template" JSONB NOT NULL DEFAULT '{}',
    "tenantId" UUID,
    "workspaceId" UUID,
    "templateName" TEXT NOT NULL DEFAULT 'Workflow Template',
    "description" TEXT,
    "category" TEXT,
    "nodePalette" JSONB NOT NULL DEFAULT '[]',
    "monitoringProfile" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WorkflowTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleTemplate" (
    "id" UUID NOT NULL,
    "industry" TEXT NOT NULL,
    "roleKey" TEXT NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "template" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RoleTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentTemplate" (
    "id" UUID NOT NULL,
    "industry" TEXT NOT NULL,
    "agentKey" TEXT NOT NULL,
    "template" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AgentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationTemplate" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "workspaceId" UUID,
    "businessId" UUID,
    "recommendationType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RecommendationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ontology_entities" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceId" TEXT,
    "attributes" JSONB NOT NULL DEFAULT '{}',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ontology_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ontology_relationships" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "sourceEntityId" UUID NOT NULL,
    "targetEntityId" UUID NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "label" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ontology_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_nodes" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "entityId" UUID NOT NULL,
    "nodeType" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "properties" JSONB NOT NULL DEFAULT '{}',
    "embeddingRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "knowledge_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_edges" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "sourceEntityId" UUID NOT NULL,
    "targetEntityId" UUID NOT NULL,
    "relationshipId" UUID,
    "edgeType" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "properties" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "knowledge_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_contexts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "businessId" UUID,
    "contextType" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "business_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_links" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "entityId" UUID NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "entity_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relationship_templates" (
    "id" UUID NOT NULL,
    "industry" TEXT,
    "sourceType" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "template" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "relationship_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "context_snapshots" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "businessId" UUID,
    "snapshotType" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "context_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_knowledge_models" (
    "id" UUID NOT NULL,
    "industry" TEXT NOT NULL,
    "ontology" JSONB NOT NULL DEFAULT '{}',
    "relationships" JSONB NOT NULL DEFAULT '[]',
    "contextRules" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "industry_knowledge_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_memory" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "entityId" UUID,
    "memoryType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "business_memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" UUID NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "name" TEXT NOT NULL,
    "nativeName" TEXT,
    "direction" TEXT NOT NULL DEFAULT 'ltr',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" UUID NOT NULL,
    "namespace" TEXT NOT NULL,
    "languageCode" VARCHAR(8) NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'default',
    "entries" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translation_keys" (
    "id" UUID NOT NULL,
    "namespace" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "defaultValue" TEXT,
    "description" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "translation_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translation_values" (
    "id" UUID NOT NULL,
    "translationKeyId" UUID NOT NULL,
    "languageCode" VARCHAR(8) NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'default',
    "value" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "translation_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locale_profiles" (
    "id" UUID NOT NULL,
    "locale" TEXT NOT NULL,
    "languageCode" VARCHAR(8) NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "timezone" TEXT NOT NULL,
    "dateFormat" TEXT,
    "timeFormat" TEXT,
    "numberFormat" TEXT,
    "currencyCode" VARCHAR(3),
    "businessHours" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "locale_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "language_preferences" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "scope" TEXT NOT NULL,
    "scopeId" TEXT NOT NULL DEFAULT 'default',
    "languageCode" VARCHAR(8) NOT NULL,
    "locale" TEXT NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "timezone" TEXT NOT NULL,
    "currencyCode" VARCHAR(3),
    "dateFormat" TEXT,
    "numberFormat" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "language_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" UUID NOT NULL,
    "code" VARCHAR(2) NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT,
    "currencyCode" VARCHAR(3) NOT NULL,
    "defaultTimezone" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country_profiles" (
    "id" UUID NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "locale" TEXT NOT NULL,
    "currencyCode" VARCHAR(3) NOT NULL,
    "timezones" JSONB NOT NULL DEFAULT '[]',
    "taxSystem" TEXT,
    "fiscalYearStartMonth" INTEGER NOT NULL DEFAULT 1,
    "dateFormat" TEXT,
    "numberFormat" TEXT,
    "addressFormat" JSONB NOT NULL DEFAULT '{}',
    "phoneFormat" JSONB NOT NULL DEFAULT '{}',
    "businessHours" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "country_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country_compliance" (
    "id" UUID NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "frameworkId" UUID NOT NULL,
    "requirements" JSONB NOT NULL DEFAULT '[]',
    "riskLevel" TEXT NOT NULL DEFAULT 'MEDIUM',
    "effectiveFrom" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "country_compliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country_tax_profiles" (
    "id" UUID NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "taxSystem" TEXT NOT NULL,
    "taxName" TEXT,
    "rate" DECIMAL(10,4),
    "rules" JSONB NOT NULL DEFAULT '{}',
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "country_tax_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country_business_rules" (
    "id" UUID NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "ruleType" TEXT NOT NULL,
    "ruleKey" TEXT NOT NULL,
    "rules" JSONB NOT NULL DEFAULT '{}',
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "country_business_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country_holidays" (
    "id" UUID NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "region" TEXT,
    "name" TEXT NOT NULL,
    "observedOn" TIMESTAMP(3) NOT NULL,
    "holidayType" TEXT NOT NULL DEFAULT 'PUBLIC',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "country_holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_rules" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "frameworkId" UUID NOT NULL,
    "countryCode" VARCHAR(2),
    "ruleKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requirements" JSONB NOT NULL DEFAULT '[]',
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "compliance_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "countryCode" VARCHAR(2),
    "policyKey" TEXT NOT NULL,
    "policyType" TEXT NOT NULL,
    "rules" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retention_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "countryCode" VARCHAR(2),
    "resourceType" TEXT NOT NULL,
    "retentionDays" INTEGER NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'ARCHIVE',
    "legalBasis" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "retention_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy_controls" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "countryCode" VARCHAR(2),
    "frameworkId" UUID,
    "controlKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "requirements" JSONB NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "privacy_controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" UUID NOT NULL,
    "code" VARCHAR(3) NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "precision" INTEGER NOT NULL DEFAULT 2,
    "roundingMode" TEXT NOT NULL DEFAULT 'HALF_UP',
    "symbolPosition" TEXT NOT NULL DEFAULT 'before',
    "thousandsSeparator" TEXT NOT NULL DEFAULT ',',
    "decimalSeparator" TEXT NOT NULL DEFAULT '.',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "baseCurrencyCode" VARCHAR(3) NOT NULL,
    "quoteCurrencyCode" VARCHAR(3) NOT NULL,
    "rate" DECIMAL(20,10) NOT NULL,
    "inverseRate" DECIMAL(20,10),
    "source" TEXT NOT NULL DEFAULT 'manual',
    "providerReference" TEXT,
    "rateDate" TIMESTAMP(3) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3),
    "isLatest" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_regions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "regionCode" TEXT,
    "name" TEXT NOT NULL,
    "regionType" TEXT NOT NULL DEFAULT 'country',
    "parentId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tax_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_categories" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "exempt" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tax_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_rules" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "regionId" UUID,
    "taxCategoryId" UUID,
    "taxType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DECIMAL(10,4) NOT NULL,
    "inclusive" BOOLEAN NOT NULL DEFAULT false,
    "exemptionCode" TEXT,
    "exemptionReason" TEXT,
    "reverseCharge" BOOLEAN NOT NULL DEFAULT false,
    "corporateTaxMetadata" JSONB NOT NULL DEFAULT '{}',
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tax_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_templates" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "countryCode" VARCHAR(2),
    "templateKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "invoiceFormat" JSONB NOT NULL DEFAULT '{}',
    "taxFormat" JSONB NOT NULL DEFAULT '{}',
    "registrationFormat" JSONB NOT NULL DEFAULT '{}',
    "paymentInstructions" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "invoice_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_series" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "countryCode" VARCHAR(2),
    "seriesKey" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "suffix" TEXT,
    "nextNumber" INTEGER NOT NULL DEFAULT 1,
    "padding" INTEGER NOT NULL DEFAULT 6,
    "resetPolicy" TEXT NOT NULL DEFAULT 'yearly',
    "lastIssuedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "invoice_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "invoiceId" UUID NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "itemType" TEXT NOT NULL DEFAULT 'service',
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "discount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "total" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "currency" VARCHAR(3) NOT NULL,
    "taxCategoryCode" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_taxes" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "invoiceId" UUID NOT NULL,
    "invoiceItemId" UUID,
    "taxRuleId" UUID,
    "taxType" TEXT NOT NULL,
    "taxName" TEXT NOT NULL,
    "rate" DECIMAL(10,4) NOT NULL,
    "taxableAmount" DECIMAL(18,4) NOT NULL,
    "taxAmount" DECIMAL(18,4) NOT NULL,
    "inclusive" BOOLEAN NOT NULL DEFAULT false,
    "exemptionCode" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "invoice_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_payments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "invoiceId" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "transactionReference" TEXT,
    "amount" DECIMAL(18,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "refundStatus" TEXT NOT NULL DEFAULT 'not_refunded',
    "reconciliationStatus" TEXT NOT NULL DEFAULT 'unreconciled',
    "paidAt" TIMESTAMP(3),
    "reconciledAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "invoice_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_audits" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "invoiceId" UUID NOT NULL,
    "actorUserId" UUID,
    "action" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "version" INTEGER,
    "changes" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_localization_profiles" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "profileKey" TEXT NOT NULL,
    "currencyCode" VARCHAR(3) NOT NULL,
    "locale" TEXT NOT NULL,
    "dateFormat" TEXT NOT NULL,
    "currencyFormat" JSONB NOT NULL DEFAULT '{}',
    "invoiceFormat" JSONB NOT NULL DEFAULT '{}',
    "taxFormat" JSONB NOT NULL DEFAULT '{}',
    "businessRegistrationFormat" JSONB NOT NULL DEFAULT '{}',
    "roundingRules" JSONB NOT NULL DEFAULT '{}',
    "paymentTerms" JSONB NOT NULL DEFAULT '{}',
    "lateFeeRules" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "financial_localization_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_copilots" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "businessId" UUID,
    "name" TEXT NOT NULL,
    "copilotKey" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'openai',
    "modelKey" TEXT,
    "roleScope" TEXT NOT NULL DEFAULT 'workspace',
    "capabilities" JSONB NOT NULL DEFAULT '[]',
    "policies" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_copilots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_memory" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "businessId" UUID,
    "departmentId" UUID,
    "userId" UUID,
    "copilotId" UUID,
    "conversationId" UUID,
    "memoryType" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'workspace',
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "importance" INTEGER NOT NULL DEFAULT 50,
    "source" TEXT NOT NULL DEFAULT 'copilot',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_contexts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "businessId" UUID,
    "userId" UUID,
    "departmentId" UUID,
    "conversationId" UUID,
    "contextType" TEXT NOT NULL,
    "contextHash" TEXT,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "sources" JSONB NOT NULL DEFAULT '[]',
    "tokenEstimate" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_task_suggestions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "businessId" UUID,
    "userId" UUID,
    "recommendationId" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "Severity" NOT NULL DEFAULT 'INFO',
    "suggestedAssigneeId" UUID,
    "dueAt" TIMESTAMP(3),
    "evidence" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_task_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_workflow_suggestions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "businessId" UUID,
    "recommendationId" UUID,
    "workflowKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "trigger" JSONB NOT NULL DEFAULT '{}',
    "steps" JSONB NOT NULL DEFAULT '[]',
    "expectedImpact" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_workflow_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_risk_assessments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "businessId" UUID,
    "departmentId" UUID,
    "riskType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" "Severity" NOT NULL DEFAULT 'INFO',
    "probability" INTEGER NOT NULL DEFAULT 50,
    "impact" INTEGER NOT NULL DEFAULT 50,
    "score" INTEGER NOT NULL DEFAULT 50,
    "signals" JSONB NOT NULL DEFAULT '[]',
    "mitigation" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'open',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_risk_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_opportunities" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "businessId" UUID,
    "departmentId" UUID,
    "opportunityType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "valueEstimate" DECIMAL(18,4),
    "currency" VARCHAR(3),
    "confidence" INTEGER NOT NULL DEFAULT 50,
    "evidence" JSONB NOT NULL DEFAULT '{}',
    "recommendedActions" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_knowledge_references" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "conversationId" UUID,
    "messageId" UUID,
    "contextId" UUID,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "relevanceScore" INTEGER NOT NULL DEFAULT 50,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_knowledge_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_prompt_logs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "conversationId" UUID,
    "contextId" UUID,
    "provider" TEXT NOT NULL,
    "modelKey" TEXT,
    "promptHash" TEXT NOT NULL,
    "promptMessages" JSONB NOT NULL DEFAULT '[]',
    "responseMetadata" JSONB NOT NULL DEFAULT '{}',
    "safetyMetadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_prompt_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_action_logs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "userId" UUID,
    "conversationId" UUID,
    "actionType" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "result" JSONB,
    "error" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_action_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agents" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "roleId" UUID,
    "agentKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "agentType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "riskPolicy" JSONB NOT NULL DEFAULT '{}',
    "capabilities" JSONB NOT NULL DEFAULT '[]',
    "configuration" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agent_roles" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "roleKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "approvalPolicy" JSONB NOT NULL DEFAULT '{}',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_agent_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agent_capabilities" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "capabilityKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "allowedActions" JSONB NOT NULL DEFAULT '[]',
    "policy" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_agent_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agent_executions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "agentId" UUID,
    "executionKey" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "capabilityKey" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "status" TEXT NOT NULL DEFAULT 'queued',
    "approvalStatus" TEXT NOT NULL DEFAULT 'not_required',
    "queueName" TEXT NOT NULL DEFAULT 'agent-execution',
    "attempt" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "input" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB,
    "error" JSONB,
    "rollbackStrategy" JSONB NOT NULL DEFAULT '{}',
    "logs" JSONB NOT NULL DEFAULT '[]',
    "queuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_agent_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agent_approvals" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "executionId" UUID NOT NULL,
    "approvalLevel" TEXT NOT NULL,
    "approverRole" TEXT,
    "approverUserId" UUID,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "decisionReason" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_agent_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agent_tasks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "executionId" UUID,
    "agentId" UUID,
    "taskType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignedToUserId" UUID,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" "Severity" NOT NULL DEFAULT 'INFO',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_agent_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agent_workflows" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "executionId" UUID,
    "agentId" UUID,
    "workflowId" UUID,
    "workflowKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "trigger" JSONB NOT NULL DEFAULT '{}',
    "steps" JSONB NOT NULL DEFAULT '[]',
    "rollbackPlan" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_agent_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agent_memory" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "agentId" UUID,
    "executionId" UUID,
    "outcomeId" UUID,
    "memoryType" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL DEFAULT '{}',
    "importance" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_agent_memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agent_decisions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "agentId" UUID,
    "executionId" UUID,
    "decision" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "context" JSONB NOT NULL DEFAULT '{}',
    "confidenceScore" INTEGER NOT NULL DEFAULT 50,
    "expectedImpact" JSONB NOT NULL DEFAULT '{}',
    "actualImpact" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_agent_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agent_outcomes" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "agentId" UUID,
    "executionId" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "actualImpact" JSONB NOT NULL DEFAULT '{}',
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "learnedMemory" JSONB NOT NULL DEFAULT '{}',
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_agent_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agent_audits" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "agentId" UUID,
    "executionId" UUID,
    "actorUserId" UUID,
    "action" TEXT NOT NULL,
    "riskLevel" TEXT,
    "before" JSONB,
    "after" JSONB,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_agent_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_definitions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "workflowId" UUID,
    "templateId" UUID,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "industry" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 1,
    "canvas" JSONB NOT NULL DEFAULT '{}',
    "nodeGroups" JSONB NOT NULL DEFAULT '[]',
    "viewport" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdByUserId" UUID,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "workflow_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_nodes" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "definitionId" UUID NOT NULL,
    "nodeKey" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "position" JSONB NOT NULL DEFAULT '{}',
    "size" JSONB NOT NULL DEFAULT '{}',
    "configuration" JSONB NOT NULL DEFAULT '{}',
    "validation" JSONB NOT NULL DEFAULT '{}',
    "groupKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "workflow_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_edges" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "definitionId" UUID NOT NULL,
    "edgeKey" TEXT NOT NULL,
    "sourceNodeKey" TEXT NOT NULL,
    "targetNodeKey" TEXT NOT NULL,
    "condition" JSONB NOT NULL DEFAULT '{}',
    "label" TEXT,
    "style" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "workflow_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_approvals" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "workflowId" UUID,
    "workflowExecutionId" UUID,
    "nodeKey" TEXT,
    "approvalType" TEXT NOT NULL,
    "approverRole" TEXT,
    "approverUserId" UUID,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "decisionReason" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "workflow_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_metrics" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "workflowId" UUID,
    "workflowExecutionId" UUID,
    "metricKey" TEXT NOT NULL,
    "metricValue" DECIMAL(18,4) NOT NULL,
    "unit" TEXT,
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "workflow_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_audits" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "workflowId" UUID,
    "workflowExecutionId" UUID,
    "actorUserId" UUID,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "before" JSONB,
    "after" JSONB,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "workflow_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_operations" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "workspaceId" UUID,
    "operationType" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "requestedByUserId" UUID,
    "approvedByUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "admin_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deployment_environments" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "environmentType" TEXT NOT NULL,
    "region" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentVersion" TEXT,
    "variables" JSONB NOT NULL DEFAULT '{}',
    "approvalsRequired" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "deployment_environments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "release_controls" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "environmentId" UUID,
    "version" TEXT NOT NULL,
    "releaseType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "changeSummary" TEXT,
    "approvalPolicy" JSONB NOT NULL DEFAULT '{}',
    "approvedByUserId" UUID,
    "scheduledAt" TIMESTAMP(3),
    "deployedAt" TIMESTAMP(3),
    "rolledBackAt" TIMESTAMP(3),
    "rollbackTargetVersion" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "release_controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "workspaceId" UUID,
    "flagKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "rolloutStrategy" JSONB NOT NULL DEFAULT '{}',
    "rules" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_requests" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "environmentId" UUID,
    "releaseId" UUID,
    "title" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "requestedByUserId" UUID,
    "approvedByUserId" UUID,
    "impactAssessment" JSONB NOT NULL DEFAULT '{}',
    "rollbackPlan" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "change_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_incidents" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "workspaceId" UUID,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "source" TEXT,
    "ownerUserId" UUID,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "timeline" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "admin_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_suspensions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "suspendedByUserId" UUID,
    "suspendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restoredAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tenant_suspensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_controls" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "controlKey" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "reason" TEXT,
    "activatedByUserId" UUID,
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "deactivatedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "emergency_controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_health_snapshots" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "workspaceId" UUID,
    "component" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "latencyMs" INTEGER,
    "details" JSONB NOT NULL DEFAULT '{}',
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "system_health_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage_snapshots" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "workspaceId" UUID,
    "provider" TEXT,
    "model" TEXT,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(18,6),
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_usage_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_import_jobs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "importType" TEXT NOT NULL,
    "sourceFormat" TEXT NOT NULL,
    "targetEntity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "fileName" TEXT,
    "fileHash" TEXT,
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "validRows" INTEGER NOT NULL DEFAULT 0,
    "errorRows" INTEGER NOT NULL DEFAULT 0,
    "createdByUserId" UUID,
    "mapping" JSONB NOT NULL DEFAULT '{}',
    "validationRules" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_import_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_import_batches" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "importJobId" UUID NOT NULL,
    "batchNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "rowStart" INTEGER NOT NULL,
    "rowEnd" INTEGER NOT NULL,
    "processedRows" INTEGER NOT NULL DEFAULT 0,
    "errorRows" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_import_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_import_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "importJobId" UUID NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'valid',
    "sourceData" JSONB NOT NULL DEFAULT '{}',
    "normalizedData" JSONB NOT NULL DEFAULT '{}',
    "targetEntity" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_import_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_import_errors" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "importJobId" UUID NOT NULL,
    "rowNumber" INTEGER,
    "field" TEXT,
    "code" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'error',
    "sourceData" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_import_errors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migration_connections" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "provider" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "credentialRef" TEXT,
    "connectionConfig" JSONB NOT NULL DEFAULT '{}',
    "lastValidatedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "migration_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migration_runs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "connectionId" UUID,
    "provider" TEXT NOT NULL,
    "sourceObject" TEXT NOT NULL,
    "targetEntity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "migratedRecords" INTEGER NOT NULL DEFAULT 0,
    "failedRecords" INTEGER NOT NULL DEFAULT 0,
    "mapping" JSONB NOT NULL DEFAULT '{}',
    "report" JSONB NOT NULL DEFAULT '{}',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdByUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "migration_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migration_mappings" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "connectionId" UUID,
    "provider" TEXT NOT NULL,
    "sourceObject" TEXT NOT NULL,
    "targetEntity" TEXT NOT NULL,
    "fieldMap" JSONB NOT NULL DEFAULT '{}',
    "transformRules" JSONB NOT NULL DEFAULT '[]',
    "validationRules" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "migration_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_profiles" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "organizationId" UUID,
    "businessId" UUID,
    "workspaceId" UUID,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "businessName" TEXT,
    "industry" TEXT,
    "businessType" TEXT,
    "countryCode" VARCHAR(2),
    "revenueRange" TEXT,
    "teamSizeRange" TEXT,
    "growthStage" TEXT,
    "goals" JSONB NOT NULL DEFAULT '[]',
    "selectedModules" JSONB NOT NULL DEFAULT '[]',
    "recommendedModules" JSONB NOT NULL DEFAULT '[]',
    "recommendedWorkflows" JSONB NOT NULL DEFAULT '[]',
    "recommendedAgents" JSONB NOT NULL DEFAULT '[]',
    "assistantState" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "onboarding_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_steps" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "onboardingProfileId" UUID NOT NULL,
    "stepKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "input" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB NOT NULL DEFAULT '{}',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "onboarding_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_recommendations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "onboardingProfileId" UUID NOT NULL,
    "recommendationType" TEXT NOT NULL,
    "recommendationKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rationale" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "onboarding_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_apps" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "partnerProfileId" UUID,
    "appKey" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "developerName" TEXT,
    "supportEmail" TEXT,
    "pricingModel" TEXT NOT NULL DEFAULT 'free',
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "latestVersion" TEXT,
    "iconUrl" TEXT,
    "documentationUrl" TEXT,
    "requiredScopes" JSONB NOT NULL DEFAULT '[]',
    "supportedModules" JSONB NOT NULL DEFAULT '[]',
    "supportedIndustries" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "marketplace_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_app_versions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "appId" UUID NOT NULL,
    "version" TEXT NOT NULL,
    "releaseNotes" TEXT,
    "manifest" JSONB NOT NULL DEFAULT '{}',
    "sdkVersion" TEXT,
    "minimumNexoraVersion" TEXT,
    "checksum" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "marketplace_app_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_installations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "organizationId" UUID,
    "businessId" UUID,
    "workspaceId" UUID,
    "appId" UUID NOT NULL,
    "versionId" UUID,
    "installationScope" TEXT NOT NULL DEFAULT 'workspace',
    "status" TEXT NOT NULL DEFAULT 'installed',
    "installedByUserId" UUID,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uninstalledAt" TIMESTAMP(3),
    "configuration" JSONB NOT NULL DEFAULT '{}',
    "grantedScopes" JSONB NOT NULL DEFAULT '[]',
    "healthStatus" TEXT NOT NULL DEFAULT 'healthy',
    "lastCheckedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "marketplace_installations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_permissions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "appId" UUID NOT NULL,
    "permissionKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "required" BOOLEAN NOT NULL DEFAULT false,
    "defaultGrant" BOOLEAN NOT NULL DEFAULT false,
    "conditions" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "marketplace_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extension_definitions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "appId" UUID,
    "extensionKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "extensionType" TEXT NOT NULL,
    "moduleKey" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "runtime" TEXT NOT NULL DEFAULT 'server',
    "entrypoint" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "permissionScopes" JSONB NOT NULL DEFAULT '[]',
    "configurationSchema" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "extension_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extension_hooks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "extensionId" UUID NOT NULL,
    "hookType" TEXT NOT NULL,
    "hookKey" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "retryPolicy" JSONB NOT NULL DEFAULT '{}',
    "filter" JSONB NOT NULL DEFAULT '{}',
    "handlerConfig" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "extension_hooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extension_points" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "extensionId" UUID,
    "pointKey" TEXT NOT NULL,
    "pointType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "moduleKey" TEXT,
    "contract" JSONB NOT NULL DEFAULT '{}',
    "schema" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "extension_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_profiles" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "partnerKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "partnerType" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'registered',
    "status" TEXT NOT NULL DEFAULT 'active',
    "websiteUrl" TEXT,
    "contactEmail" TEXT,
    "countryCode" VARCHAR(2),
    "description" TEXT,
    "capabilities" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "certifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "partner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_certifications" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "partnerProfileId" UUID NOT NULL,
    "certificationKey" TEXT NOT NULL,
    "certificationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "evidence" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "partner_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_service_listings" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "partnerProfileId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "description" TEXT,
    "industries" JSONB NOT NULL DEFAULT '[]',
    "regions" JSONB NOT NULL DEFAULT '[]',
    "pricingModel" TEXT NOT NULL DEFAULT 'custom',
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "partner_service_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_template_packs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "templateKey" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "modules" JSONB NOT NULL DEFAULT '[]',
    "workflows" JSONB NOT NULL DEFAULT '[]',
    "dashboards" JSONB NOT NULL DEFAULT '[]',
    "kpis" JSONB NOT NULL DEFAULT '[]',
    "aiAgents" JSONB NOT NULL DEFAULT '[]',
    "navigation" JSONB NOT NULL DEFAULT '[]',
    "compliance" JSONB NOT NULL DEFAULT '[]',
    "installCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "industry_template_packs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registered_devices" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID,
    "workspaceId" UUID,
    "deviceKey" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "trustLevel" TEXT NOT NULL DEFAULT 'untrusted',
    "osVersion" TEXT,
    "appVersion" TEXT,
    "lastIpAddress" TEXT,
    "lastUserAgent" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "registered_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_sessions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "userId" UUID,
    "workspaceId" UUID,
    "sessionId" UUID,
    "status" TEXT NOT NULL DEFAULT 'active',
    "authMethod" TEXT NOT NULL DEFAULT 'jwt',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "device_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_trust_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "policyKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deviceType" TEXT,
    "platform" TEXT,
    "requiredTrustLevel" TEXT NOT NULL DEFAULT 'trusted',
    "approvalRequired" BOOLEAN NOT NULL DEFAULT true,
    "mfaRequired" BOOLEAN NOT NULL DEFAULT true,
    "encryptionRequired" BOOLEAN NOT NULL DEFAULT true,
    "offlineAllowed" BOOLEAN NOT NULL DEFAULT false,
    "rules" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "device_trust_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_permissions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "permissionKey" TEXT NOT NULL,
    "moduleKey" TEXT,
    "scope" TEXT NOT NULL DEFAULT 'workspace',
    "allowed" BOOLEAN NOT NULL DEFAULT true,
    "offlineAllowed" BOOLEAN NOT NULL DEFAULT false,
    "conditions" JSONB NOT NULL DEFAULT '{}',
    "grantedByUserId" UUID,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "device_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_activity_logs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "deviceId" UUID,
    "userId" UUID,
    "workspaceId" UUID,
    "activityType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "device_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_approval_requests" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "requestedByUserId" UUID,
    "approverUserId" UUID,
    "requestType" TEXT NOT NULL DEFAULT 'device_trust',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "riskLevel" TEXT NOT NULL DEFAULT 'medium',
    "reason" TEXT,
    "decisionReason" TEXT,
    "requestedTrustLevel" TEXT NOT NULL DEFAULT 'trusted',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "decidedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "device_approval_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mobile_workspace_profiles" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "userId" UUID,
    "deviceId" UUID,
    "profileKey" TEXT NOT NULL,
    "layoutMode" TEXT NOT NULL DEFAULT 'adaptive',
    "navigation" JSONB NOT NULL DEFAULT '[]',
    "dashboardConfig" JSONB NOT NULL DEFAULT '{}',
    "commandCenter" JSONB NOT NULL DEFAULT '{}',
    "copilotEnabled" BOOLEAN NOT NULL DEFAULT true,
    "offlineEnabled" BOOLEAN NOT NULL DEFAULT true,
    "supportedModules" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "mobile_workspace_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "desktop_companion_profiles" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "userId" UUID,
    "deviceId" UUID,
    "profileKey" TEXT NOT NULL,
    "windowState" JSONB NOT NULL DEFAULT '{}',
    "notificationConfig" JSONB NOT NULL DEFAULT '{}',
    "trayConfig" JSONB NOT NULL DEFAULT '{}',
    "nativeCapabilities" JSONB NOT NULL DEFAULT '[]',
    "multiWindowEnabled" BOOLEAN NOT NULL DEFAULT true,
    "desktopNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "offlineEnabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "desktop_companion_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offline_stores" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "deviceId" UUID,
    "storeKey" TEXT NOT NULL,
    "storeType" TEXT NOT NULL,
    "moduleKey" TEXT,
    "encryptionStatus" TEXT NOT NULL DEFAULT 'encrypted',
    "retentionPolicy" JSONB NOT NULL DEFAULT '{}',
    "maxSizeMb" INTEGER NOT NULL DEFAULT 256,
    "currentSizeMb" INTEGER NOT NULL DEFAULT 0,
    "lastCompactedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "offline_stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offline_queue_items" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "deviceId" UUID,
    "offlineStoreId" UUID,
    "queueType" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'queued',
    "priority" INTEGER NOT NULL DEFAULT 100,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 5,
    "conflictPolicy" TEXT NOT NULL DEFAULT 'server_wins',
    "dedupeKey" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "offline_queue_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offline_conflicts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "queueItemId" UUID,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "conflictType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "localVersion" JSONB NOT NULL DEFAULT '{}',
    "remoteVersion" JSONB NOT NULL DEFAULT '{}',
    "resolutionStrategy" TEXT,
    "resolvedByUserId" UUID,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "offline_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "local_cache_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "policyKey" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL,
    "cacheStrategy" TEXT NOT NULL DEFAULT 'incremental',
    "encryptionRequired" BOOLEAN NOT NULL DEFAULT true,
    "ttlSeconds" INTEGER NOT NULL DEFAULT 86400,
    "maxRecords" INTEGER NOT NULL DEFAULT 10000,
    "allowOfflineMutation" BOOLEAN NOT NULL DEFAULT false,
    "syncOnReconnect" BOOLEAN NOT NULL DEFAULT true,
    "rules" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "local_cache_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_cursors" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "deviceId" UUID,
    "moduleKey" TEXT NOT NULL,
    "cursorKey" TEXT NOT NULL,
    "cursorValue" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "changeToken" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sync_cursors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_status_snapshots" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "deviceId" UUID,
    "syncRunKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'idle',
    "direction" TEXT NOT NULL DEFAULT 'bidirectional',
    "modules" JSONB NOT NULL DEFAULT '[]',
    "pendingItems" INTEGER NOT NULL DEFAULT 0,
    "syncedItems" INTEGER NOT NULL DEFAULT 0,
    "failedItems" INTEGER NOT NULL DEFAULT 0,
    "conflicts" INTEGER NOT NULL DEFAULT 0,
    "latencyMs" INTEGER,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sync_status_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offline_module_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "moduleKey" TEXT NOT NULL,
    "supported" BOOLEAN NOT NULL DEFAULT true,
    "readOffline" BOOLEAN NOT NULL DEFAULT true,
    "writeOffline" BOOLEAN NOT NULL DEFAULT false,
    "queueType" TEXT NOT NULL DEFAULT 'task',
    "conflictPolicy" TEXT NOT NULL DEFAULT 'server_wins',
    "permissionRules" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "offline_module_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_catalog_assets" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "assetKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "sourceSystem" TEXT,
    "entityType" TEXT,
    "classification" TEXT NOT NULL DEFAULT 'internal',
    "sensitivityLevel" TEXT NOT NULL DEFAULT 'medium',
    "ownerUserId" UUID,
    "stewardUserId" UUID,
    "businessUnit" TEXT,
    "qualityScore" DOUBLE PRECISION,
    "lineageStatus" TEXT NOT NULL DEFAULT 'unknown',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_catalog_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_classification_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "assetId" UUID,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "classification" TEXT NOT NULL,
    "sensitivityLevel" TEXT NOT NULL,
    "classifier" TEXT NOT NULL DEFAULT 'manual',
    "confidence" DOUBLE PRECISION,
    "policyKey" TEXT,
    "evidence" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "classifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_classification_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_ownership_assignments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "assetId" UUID,
    "ownerUserId" UUID,
    "stewardUserId" UUID,
    "departmentId" UUID,
    "ownershipType" TEXT NOT NULL DEFAULT 'business_owner',
    "status" TEXT NOT NULL DEFAULT 'active',
    "assignedByUserId" UUID,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_ownership_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_lineage_edges" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "sourceAssetId" UUID NOT NULL,
    "targetAssetId" UUID NOT NULL,
    "lineageKey" TEXT NOT NULL,
    "transformType" TEXT NOT NULL,
    "transformationKey" TEXT,
    "direction" TEXT NOT NULL DEFAULT 'downstream',
    "confidence" DOUBLE PRECISION,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_lineage_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_quality_checks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "assetId" UUID,
    "checkKey" TEXT NOT NULL,
    "checkType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "score" DOUBLE PRECISION,
    "threshold" DOUBLE PRECISION,
    "issues" JSONB NOT NULL DEFAULT '[]',
    "result" JSONB NOT NULL DEFAULT '{}',
    "executedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_quality_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy_consent_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "consentKey" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "lawfulBasis" TEXT,
    "status" TEXT NOT NULL DEFAULT 'granted',
    "source" TEXT,
    "grantedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "evidence" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "privacy_consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy_requests" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "requestKey" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "subjectEmail" TEXT,
    "framework" TEXT NOT NULL DEFAULT 'GDPR',
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "requesterUserId" UUID,
    "assignedUserId" UUID,
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "result" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "privacy_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy_workflow_runs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "privacyRequestId" UUID NOT NULL,
    "workflowKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "currentStep" TEXT,
    "steps" JSONB NOT NULL DEFAULT '[]',
    "output" JSONB NOT NULL DEFAULT '{}',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "privacy_workflow_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "records_lifecycle_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "policyKey" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "classification" TEXT,
    "retentionDays" INTEGER NOT NULL,
    "archiveAfterDays" INTEGER,
    "deletionMode" TEXT NOT NULL DEFAULT 'soft_delete',
    "recoveryWindowDays" INTEGER NOT NULL DEFAULT 30,
    "legalHoldExempt" BOOLEAN NOT NULL DEFAULT true,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "rules" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "records_lifecycle_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "records_lifecycle_actions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "policyId" UUID,
    "recordType" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "scheduledAt" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),
    "recoveryExpiresAt" TIMESTAMP(3),
    "legalHold" BOOLEAN NOT NULL DEFAULT false,
    "performedByUserId" UUID,
    "evidence" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "records_lifecycle_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "records_archive_jobs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "policyId" UUID,
    "archiveKey" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "archivedRecords" INTEGER NOT NULL DEFAULT 0,
    "failedRecords" INTEGER NOT NULL DEFAULT 0,
    "storageLocation" TEXT,
    "manifest" JSONB NOT NULL DEFAULT '{}',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "records_archive_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_evidence_packages" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "evidenceKey" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "controlKey" TEXT,
    "evidenceType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'generated',
    "sourceType" TEXT,
    "sourceId" TEXT,
    "generatedByUserId" UUID,
    "evidence" JSONB NOT NULL DEFAULT '{}',
    "storageLocation" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "compliance_evidence_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_monitoring_runs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "runKey" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "scope" JSONB NOT NULL DEFAULT '{}',
    "controlsChecked" INTEGER NOT NULL DEFAULT 0,
    "controlsPassing" INTEGER NOT NULL DEFAULT 0,
    "findings" JSONB NOT NULL DEFAULT '[]',
    "riskScore" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "compliance_monitoring_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_indexes" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "indexKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "indexType" TEXT NOT NULL,
    "moduleKey" TEXT,
    "entityType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "embeddingProvider" TEXT,
    "embeddingModel" TEXT,
    "dimension" INTEGER,
    "sensitivityLevel" TEXT NOT NULL DEFAULT 'internal',
    "accessPolicy" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "lastIndexedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "search_indexes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_indexed_documents" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "indexId" UUID NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "contentHash" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "sensitivityLevel" TEXT NOT NULL DEFAULT 'internal',
    "classification" TEXT NOT NULL DEFAULT 'internal',
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "searchableText" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "indexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "search_indexed_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_embedding_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "indexId" UUID NOT NULL,
    "documentId" UUID,
    "embeddingKey" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "dimensions" INTEGER NOT NULL,
    "vectorRef" TEXT,
    "vectorHash" TEXT,
    "chunkText" TEXT,
    "chunkIndex" INTEGER NOT NULL DEFAULT 0,
    "tokenCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "search_embedding_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_searches" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "ownerUserId" UUID,
    "name" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "searchScope" TEXT NOT NULL DEFAULT 'global',
    "filters" JSONB NOT NULL DEFAULT '{}',
    "sort" JSONB NOT NULL DEFAULT '{}',
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "notifyOnChange" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "saved_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_query_logs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "userId" UUID,
    "query" TEXT NOT NULL,
    "searchType" TEXT NOT NULL,
    "moduleKey" TEXT,
    "filters" JSONB NOT NULL DEFAULT '{}',
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "latencyMs" INTEGER,
    "sensitiveFilteredCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "search_query_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retrieval_sessions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "userId" UUID,
    "sessionKey" TEXT NOT NULL,
    "retrievalType" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "context" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'completed',
    "aiReady" BOOLEAN NOT NULL DEFAULT true,
    "maxResults" INTEGER NOT NULL DEFAULT 10,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "retrieval_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retrieval_results" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "sessionId" UUID NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "snippet" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "sensitivityLevel" TEXT NOT NULL DEFAULT 'internal',
    "allowed" BOOLEAN NOT NULL DEFAULT true,
    "denialReason" TEXT,
    "context" JSONB NOT NULL DEFAULT '{}',
    "citations" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "retrieval_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_access_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "indexId" UUID,
    "policyKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "moduleKey" TEXT,
    "roleKeys" JSONB NOT NULL DEFAULT '[]',
    "permissionKeys" JSONB NOT NULL DEFAULT '[]',
    "sensitivityThreshold" TEXT NOT NULL DEFAULT 'confidential',
    "filterRules" JSONB NOT NULL DEFAULT '{}',
    "maskingRules" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "search_access_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_spaces" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "spaceKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "spaceType" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'workspace',
    "status" TEXT NOT NULL DEFAULT 'active',
    "ownerUserId" UUID,
    "departmentId" UUID,
    "projectId" UUID,
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "knowledge_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_categories" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "spaceId" UUID,
    "parentCategoryId" UUID,
    "categoryKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "knowledge_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_articles" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "spaceId" UUID,
    "categoryId" UUID,
    "articleKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" JSONB NOT NULL DEFAULT '{}',
    "contentText" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 1,
    "authorUserId" UUID,
    "reviewerUserId" UUID,
    "publishedAt" TIMESTAMP(3),
    "tags" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "knowledge_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "spaceId" UUID,
    "discussionKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topicType" TEXT NOT NULL DEFAULT 'general',
    "sourceType" TEXT,
    "sourceId" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'workspace',
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdByUserId" UUID,
    "lastActivityAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "discussions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_threads" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "discussionId" UUID NOT NULL,
    "parentThreadId" UUID,
    "threadKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdByUserId" UUID,
    "lastActivityAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "discussion_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_messages" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "discussionId" UUID,
    "threadId" UUID,
    "authorUserId" UUID,
    "messageType" TEXT NOT NULL DEFAULT 'comment',
    "body" TEXT,
    "content" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'active',
    "editedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "discussion_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaboration_mentions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "messageId" UUID,
    "targetUserId" UUID,
    "targetTeamId" UUID,
    "mentionType" TEXT NOT NULL DEFAULT 'user',
    "status" TEXT NOT NULL DEFAULT 'unread',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "collaboration_mentions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaboration_reactions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "messageId" UUID,
    "actorUserId" UUID,
    "reactionType" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "collaboration_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaboration_activities" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "spaceId" UUID,
    "actorUserId" UUID,
    "activityType" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "description" TEXT,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "collaboration_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_rooms" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "spaceId" UUID,
    "roomKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "decisionType" TEXT NOT NULL DEFAULT 'operational',
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "createdByUserId" UUID,
    "facilitatorUserId" UUID,
    "dueAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "criteria" JSONB NOT NULL DEFAULT '{}',
    "context" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "decision_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_participants" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "roomId" UUID NOT NULL,
    "participantUserId" UUID,
    "participantRole" TEXT NOT NULL DEFAULT 'member',
    "status" TEXT NOT NULL DEFAULT 'invited',
    "joinedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "decision_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_votes" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "roomId" UUID NOT NULL,
    "participantId" UUID,
    "voterUserId" UUID,
    "voteValue" TEXT NOT NULL,
    "voteWeight" INTEGER NOT NULL DEFAULT 1,
    "rationale" TEXT,
    "confidence" DOUBLE PRECISION,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "decision_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_approvals" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "roomId" UUID NOT NULL,
    "approverUserId" UUID,
    "approvalLevel" TEXT NOT NULL DEFAULT 'manager',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "decision" TEXT,
    "comments" TEXT,
    "dueAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "decision_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "roomId" UUID NOT NULL,
    "recordKey" TEXT NOT NULL,
    "decisionTitle" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "rationale" TEXT,
    "selectedOption" TEXT,
    "impact" JSONB NOT NULL DEFAULT '{}',
    "decisionByUserId" UUID,
    "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "decision_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_collaboration_summaries" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "spaceId" UUID,
    "discussionId" UUID,
    "roomId" UUID,
    "summaryKey" TEXT NOT NULL,
    "summaryType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "actionItems" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "risks" JSONB NOT NULL DEFAULT '[]',
    "sourceRefs" JSONB NOT NULL DEFAULT '[]',
    "provider" TEXT,
    "model" TEXT,
    "status" TEXT NOT NULL DEFAULT 'generated',
    "generatedByUserId" UUID,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_collaboration_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaboration_action_items" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "spaceId" UUID,
    "discussionId" UUID,
    "roomId" UUID,
    "summaryId" UUID,
    "actionKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "assigneeUserId" UUID,
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "sourceType" TEXT,
    "sourceId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "collaboration_action_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication_channels" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "channelKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "channelType" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'workspace',
    "status" TEXT NOT NULL DEFAULT 'active',
    "departmentId" UUID,
    "teamId" UUID,
    "projectId" UUID,
    "createdByUserId" UUID,
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "communication_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication_members" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "channelId" UUID NOT NULL,
    "userId" UUID,
    "teamId" UUID,
    "memberRole" TEXT NOT NULL DEFAULT 'member',
    "status" TEXT NOT NULL DEFAULT 'active',
    "notificationLevel" TEXT NOT NULL DEFAULT 'mentions',
    "lastReadAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "communication_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "channelId" UUID,
    "conversationKey" TEXT NOT NULL,
    "conversationType" TEXT NOT NULL,
    "subject" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "privacy" TEXT NOT NULL DEFAULT 'workspace',
    "participantRefs" JSONB NOT NULL DEFAULT '[]',
    "createdByUserId" UUID,
    "lastMessageAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "channelId" UUID,
    "conversationId" UUID,
    "senderUserId" UUID,
    "messageType" TEXT NOT NULL DEFAULT 'text',
    "body" TEXT,
    "content" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'sent',
    "readBy" JSONB NOT NULL DEFAULT '[]',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_attachments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "messageId" UUID NOT NULL,
    "attachmentType" TEXT NOT NULL,
    "fileId" UUID,
    "fileName" TEXT,
    "url" TEXT,
    "storageKey" TEXT,
    "sizeBytes" INTEGER,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "message_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_reactions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "messageId" UUID NOT NULL,
    "actorUserId" UUID,
    "reactionType" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "message_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "announcementKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "audienceType" TEXT NOT NULL DEFAULT 'workspace',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdByUserId" UUID,
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement_recipients" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "announcementId" UUID NOT NULL,
    "recipientType" TEXT NOT NULL,
    "recipientId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "readAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "announcement_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "meetingKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "meetingType" TEXT NOT NULL DEFAULT 'standard',
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "privacy" TEXT NOT NULL DEFAULT 'workspace',
    "organizerUserId" UUID,
    "channelId" UUID,
    "conversationId" UUID,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "meetingUrl" TEXT,
    "recurrenceRule" TEXT,
    "context" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_participants" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "meetingId" UUID NOT NULL,
    "userId" UUID,
    "email" TEXT,
    "participantRole" TEXT NOT NULL DEFAULT 'attendee',
    "status" TEXT NOT NULL DEFAULT 'invited',
    "required" BOOLEAN NOT NULL DEFAULT true,
    "responseStatus" TEXT NOT NULL DEFAULT 'pending',
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "meeting_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_agendas" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "meetingId" UUID NOT NULL,
    "agendaKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "durationMinutes" INTEGER,
    "presenterUserId" UUID,
    "status" TEXT NOT NULL DEFAULT 'open',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "meeting_agendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_decisions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "meetingId" UUID NOT NULL,
    "decisionKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "rationale" TEXT,
    "decidedByUserId" UUID,
    "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "impact" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "meeting_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_action_items" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "meetingId" UUID NOT NULL,
    "summaryId" UUID,
    "actionKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "assigneeUserId" UUID,
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "sourceType" TEXT,
    "sourceId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "meeting_action_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_summaries" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "meetingId" UUID NOT NULL,
    "summaryKey" TEXT NOT NULL,
    "summaryType" TEXT NOT NULL DEFAULT 'meeting',
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "decisions" JSONB NOT NULL DEFAULT '[]',
    "actionItems" JSONB NOT NULL DEFAULT '[]',
    "risks" JSONB NOT NULL DEFAULT '[]',
    "followUps" JSONB NOT NULL DEFAULT '[]',
    "sourceRefs" JSONB NOT NULL DEFAULT '[]',
    "provider" TEXT,
    "model" TEXT,
    "generatedByUserId" UUID,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "meeting_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendars" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "calendarKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "calendarType" TEXT NOT NULL,
    "ownerUserId" UUID,
    "departmentId" UUID,
    "teamId" UUID,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "status" TEXT NOT NULL DEFAULT 'active',
    "color" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "calendars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "calendarId" UUID NOT NULL,
    "meetingId" UUID,
    "eventKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventType" TEXT NOT NULL DEFAULT 'meeting',
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "privacy" TEXT NOT NULL DEFAULT 'private',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "allDay" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceRule" TEXT,
    "location" TEXT,
    "meetingUrl" TEXT,
    "organizerUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_participants" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "eventId" UUID NOT NULL,
    "userId" UUID,
    "email" TEXT,
    "participantRole" TEXT NOT NULL DEFAULT 'attendee',
    "responseStatus" TEXT NOT NULL DEFAULT 'pending',
    "required" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "calendar_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_rules" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "calendarId" UUID,
    "ruleKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "priority" INTEGER NOT NULL DEFAULT 100,
    "workingDays" JSONB NOT NULL DEFAULT '[]',
    "constraints" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "schedule_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_windows" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "calendarId" UUID,
    "userId" UUID,
    "teamId" UUID,
    "departmentId" UUID,
    "windowKey" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "availabilityType" TEXT NOT NULL DEFAULT 'available',
    "status" TEXT NOT NULL DEFAULT 'active',
    "source" TEXT NOT NULL DEFAULT 'manual',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "availability_windows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_recommendations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "meetingId" UUID,
    "calendarId" UUID,
    "recommendationKey" TEXT NOT NULL,
    "recommendationType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "suggestedStartAt" TIMESTAMP(3),
    "suggestedEndAt" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "participants" JSONB NOT NULL DEFAULT '[]',
    "conflicts" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'open',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "meeting_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "eventId" UUID,
    "meetingId" UUID,
    "reminderKey" TEXT NOT NULL,
    "reminderType" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'in_app',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "targetUserId" UUID,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "userId" UUID,
    "preferenceKey" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'workspace',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "quietHours" JSONB NOT NULL DEFAULT '{}',
    "rules" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_sessions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "sessionKey" TEXT NOT NULL,
    "conversationId" UUID,
    "customerIdentityId" UUID,
    "channelId" UUID,
    "queueId" UUID,
    "assignedAgentUserId" UUID,
    "voiceAgentKey" TEXT,
    "direction" TEXT NOT NULL DEFAULT 'inbound',
    "provider" TEXT NOT NULL DEFAULT 'internal',
    "status" TEXT NOT NULL DEFAULT 'active',
    "language" TEXT NOT NULL DEFAULT 'en',
    "phoneNumber" TEXT,
    "callerId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "audioStorageKey" TEXT,
    "transcriptStatus" TEXT NOT NULL DEFAULT 'pending',
    "aiStatus" TEXT NOT NULL DEFAULT 'pending',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "voice_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_transcripts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "voiceSessionId" UUID NOT NULL,
    "conversationId" UUID,
    "speakerType" TEXT NOT NULL DEFAULT 'customer',
    "speakerRef" TEXT,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "transcriptText" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "language" TEXT NOT NULL DEFAULT 'en',
    "startOffsetMs" INTEGER,
    "endOffsetMs" INTEGER,
    "provider" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "voice_transcripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_participants" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "conversationId" UUID NOT NULL,
    "customerIdentityId" UUID,
    "userId" UUID,
    "participantType" TEXT NOT NULL,
    "displayName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "channelRef" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "lastReadAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_center_queues" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "queueKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "queueType" TEXT NOT NULL DEFAULT 'support',
    "status" TEXT NOT NULL DEFAULT 'active',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "departmentId" UUID,
    "teamId" UUID,
    "channelTypes" JSONB NOT NULL DEFAULT '[]',
    "routingStrategy" TEXT NOT NULL DEFAULT 'least_loaded',
    "slaTargetSeconds" INTEGER NOT NULL DEFAULT 3600,
    "maxWaitSeconds" INTEGER,
    "businessHours" JSONB NOT NULL DEFAULT '{}',
    "escalationPolicy" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "contact_center_queues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_assignments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "assignmentKey" TEXT NOT NULL,
    "queueId" UUID,
    "conversationId" UUID,
    "voiceSessionId" UUID,
    "customerIdentityId" UUID,
    "assignedUserId" UUID,
    "assignmentType" TEXT NOT NULL DEFAULT 'conversation',
    "status" TEXT NOT NULL DEFAULT 'assigned',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "slaDueAt" TIMESTAMP(3),
    "escalationLevel" INTEGER NOT NULL DEFAULT 0,
    "routingReason" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "agent_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_identities" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "identityKey" TEXT NOT NULL,
    "customerId" UUID,
    "leadId" UUID,
    "primaryName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "externalRefs" JSONB NOT NULL DEFAULT '{}',
    "channelIdentities" JSONB NOT NULL DEFAULT '[]',
    "riskLevel" TEXT NOT NULL DEFAULT 'normal',
    "lifecycleStage" TEXT NOT NULL DEFAULT 'unknown',
    "lastInteractionAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentiment_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "conversationId" UUID,
    "messageId" UUID,
    "voiceSessionId" UUID,
    "customerIdentityId" UUID,
    "sentiment" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION,
    "sourceText" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'nexora-rule-engine',
    "model" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sentiment_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intent_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "conversationId" UUID,
    "messageId" UUID,
    "voiceSessionId" UUID,
    "customerIdentityId" UUID,
    "intent" TEXT NOT NULL,
    "category" TEXT,
    "confidence" DOUBLE PRECISION,
    "entities" JSONB NOT NULL DEFAULT '[]',
    "sourceText" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'nexora-rule-engine',
    "model" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "intent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_summaries" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "summaryKey" TEXT NOT NULL,
    "conversationId" UUID,
    "voiceSessionId" UUID,
    "customerIdentityId" UUID,
    "summaryType" TEXT NOT NULL DEFAULT 'conversation',
    "title" TEXT NOT NULL,
    "summaryText" TEXT NOT NULL,
    "decisions" JSONB NOT NULL DEFAULT '[]',
    "actionItems" JSONB NOT NULL DEFAULT '[]',
    "followUps" JSONB NOT NULL DEFAULT '[]',
    "risks" JSONB NOT NULL DEFAULT '[]',
    "sentiment" JSONB NOT NULL DEFAULT '{}',
    "generatedBy" TEXT NOT NULL DEFAULT 'nexora-intelligence',
    "provider" TEXT,
    "model" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "conversation_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_agent_executions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "executionKey" TEXT NOT NULL,
    "agentType" TEXT NOT NULL,
    "voiceSessionId" UUID,
    "conversationId" UUID,
    "customerIdentityId" UUID,
    "status" TEXT NOT NULL DEFAULT 'running',
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "approvalStatus" TEXT NOT NULL DEFAULT 'not_required',
    "input" JSONB NOT NULL DEFAULT '{}',
    "plan" JSONB NOT NULL DEFAULT '{}',
    "actions" JSONB NOT NULL DEFAULT '[]',
    "output" JSONB NOT NULL DEFAULT '{}',
    "handoffRequired" BOOLEAN NOT NULL DEFAULT false,
    "handoffReason" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "voice_agent_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escalation_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "escalationKey" TEXT NOT NULL,
    "queueId" UUID,
    "conversationId" UUID,
    "voiceSessionId" UUID,
    "customerIdentityId" UUID,
    "assignmentId" UUID,
    "escalationType" TEXT NOT NULL DEFAULT 'support',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "reason" TEXT NOT NULL,
    "recommendation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "fromUserId" UUID,
    "toUserId" UUID,
    "escalatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "escalation_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_health_scores" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "accountName" TEXT,
    "scoreKey" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "scoreBand" TEXT NOT NULL DEFAULT 'stable',
    "previousScore" DOUBLE PRECISION,
    "trend" TEXT NOT NULL DEFAULT 'flat',
    "drivers" JSONB NOT NULL DEFAULT '[]',
    "risks" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculatedBy" TEXT NOT NULL DEFAULT 'nexora-health-engine',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_health_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_journeys" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "journeyKey" TEXT NOT NULL,
    "lifecycleStage" TEXT NOT NULL DEFAULT 'prospect',
    "previousStage" TEXT,
    "journeyStatus" TEXT NOT NULL DEFAULT 'active',
    "touchpoints" JSONB NOT NULL DEFAULT '[]',
    "milestones" JSONB NOT NULL DEFAULT '[]',
    "blockers" JSONB NOT NULL DEFAULT '[]',
    "ownerUserId" UUID,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastTouchAt" TIMESTAMP(3),
    "nextStepAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_journeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_feedback" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "feedbackKey" TEXT NOT NULL,
    "feedbackType" TEXT NOT NULL DEFAULT 'survey',
    "source" TEXT NOT NULL DEFAULT 'manual',
    "rating" INTEGER,
    "sentiment" TEXT NOT NULL DEFAULT 'neutral',
    "npsScore" INTEGER,
    "csatScore" INTEGER,
    "cesScore" INTEGER,
    "title" TEXT,
    "comments" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'open',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_success_plans" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "planKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "planType" TEXT NOT NULL DEFAULT 'success',
    "status" TEXT NOT NULL DEFAULT 'active',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "ownerUserId" UUID,
    "goals" JSONB NOT NULL DEFAULT '[]',
    "playbooks" JSONB NOT NULL DEFAULT '[]',
    "automations" JSONB NOT NULL DEFAULT '[]',
    "adoptionTargets" JSONB NOT NULL DEFAULT '{}',
    "renewalTargetAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_success_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_engagement_scores" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "scoreKey" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "scoreBand" TEXT NOT NULL DEFAULT 'medium',
    "activityCount" INTEGER NOT NULL DEFAULT 0,
    "adoptionRate" DOUBLE PRECISION,
    "communicationRate" DOUBLE PRECISION,
    "productUsage" JSONB NOT NULL DEFAULT '{}',
    "engagementSignals" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_engagement_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "churn_predictions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "predictionKey" TEXT NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "riskBand" TEXT NOT NULL DEFAULT 'medium',
    "predictedReason" TEXT,
    "riskDrivers" JSONB NOT NULL DEFAULT '[]',
    "preventionActions" JSONB NOT NULL DEFAULT '[]',
    "confidence" DOUBLE PRECISION,
    "modelVersion" TEXT NOT NULL DEFAULT 'nexora-cs-v1',
    "predictionWindowDays" INTEGER NOT NULL DEFAULT 90,
    "predictedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'open',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "churn_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renewal_opportunities" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "opportunityKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "renewalDate" TIMESTAMP(3),
    "contractValue" DECIMAL(18,2),
    "probability" DOUBLE PRECISION,
    "ownerUserId" UUID,
    "nextStep" TEXT,
    "risks" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "renewal_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upsell_opportunities" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "opportunityKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "productOrService" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "estimatedValue" DECIMAL(18,2),
    "probability" DOUBLE PRECISION,
    "triggerSignals" JSONB NOT NULL DEFAULT '[]',
    "recommendedActions" JSONB NOT NULL DEFAULT '[]',
    "ownerUserId" UUID,
    "expectedCloseAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "upsell_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cross_sell_opportunities" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "opportunityKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "productOrService" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "estimatedValue" DECIMAL(18,2),
    "probability" DOUBLE PRECISION,
    "complementSignals" JSONB NOT NULL DEFAULT '[]',
    "recommendedActions" JSONB NOT NULL DEFAULT '[]',
    "ownerUserId" UUID,
    "expectedCloseAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "cross_sell_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_tickets" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "ticketKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ticketType" TEXT NOT NULL DEFAULT 'support',
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "source" TEXT NOT NULL DEFAULT 'manual',
    "queueId" UUID,
    "assignedUserId" UUID,
    "conversationId" UUID,
    "slaDueAt" TIMESTAMP(3),
    "firstResponseAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "tags" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "service_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_escalations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "ticketId" UUID,
    "escalationKey" TEXT NOT NULL,
    "escalationType" TEXT NOT NULL DEFAULT 'sla',
    "severity" TEXT NOT NULL DEFAULT 'high',
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "fromUserId" UUID,
    "toUserId" UUID,
    "recommendedAction" TEXT,
    "escalatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "service_escalations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_resolutions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "ticketId" UUID NOT NULL,
    "resolutionKey" TEXT NOT NULL,
    "resolutionType" TEXT NOT NULL DEFAULT 'standard',
    "summary" TEXT NOT NULL,
    "rootCause" TEXT,
    "actionsTaken" JSONB NOT NULL DEFAULT '[]',
    "customerImpact" TEXT,
    "resolutionStatus" TEXT NOT NULL DEFAULT 'resolved',
    "resolvedByUserId" UUID,
    "resolvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerConfirmedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "service_resolutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sla_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "ticketId" UUID,
    "customerIdentityId" UUID,
    "slaKey" TEXT NOT NULL,
    "slaType" TEXT NOT NULL DEFAULT 'first_response',
    "status" TEXT NOT NULL DEFAULT 'active',
    "targetAt" TIMESTAMP(3) NOT NULL,
    "achievedAt" TIMESTAMP(3),
    "breachedAt" TIMESTAMP(3),
    "targetSeconds" INTEGER,
    "actualSeconds" INTEGER,
    "breachReason" TEXT,
    "policy" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sla_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_opportunities" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "opportunityKey" TEXT NOT NULL,
    "opportunityType" TEXT NOT NULL DEFAULT 'expansion',
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "estimatedValue" DECIMAL(18,2),
    "probability" DOUBLE PRECISION,
    "expectedCloseAt" TIMESTAMP(3),
    "source" TEXT NOT NULL DEFAULT 'ai',
    "signals" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "ownerUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "revenue_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_risks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "riskKey" TEXT NOT NULL,
    "riskType" TEXT NOT NULL DEFAULT 'renewal',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "atRiskValue" DECIMAL(18,2),
    "probability" DOUBLE PRECISION,
    "drivers" JSONB NOT NULL DEFAULT '[]',
    "mitigationActions" JSONB NOT NULL DEFAULT '[]',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "revenue_risks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_accounts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerAccountId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "accountKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "segment" TEXT NOT NULL DEFAULT 'enterprise',
    "status" TEXT NOT NULL DEFAULT 'active',
    "lifecycleStage" TEXT NOT NULL DEFAULT 'retention',
    "ownerUserId" UUID,
    "annualRecurringRevenue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalContractValue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "healthScore" DOUBLE PRECISION,
    "churnRiskScore" DOUBLE PRECISION,
    "expansionScore" DOUBLE PRECISION,
    "renewalDate" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "revenue_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_contracts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "revenueAccountId" UUID,
    "contractKey" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contractType" TEXT NOT NULL DEFAULT 'subscription',
    "status" TEXT NOT NULL DEFAULT 'active',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "contractValue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "annualRecurringRevenue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "renewalDate" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "terms" JSONB NOT NULL DEFAULT '{}',
    "obligations" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "revenue_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_amendments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "revenueContractId" UUID,
    "amendmentKey" TEXT NOT NULL,
    "amendmentNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amendmentType" TEXT NOT NULL DEFAULT 'commercial',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "effectiveAt" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "valueDelta" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "arrDelta" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "termsDelta" JSONB NOT NULL DEFAULT '{}',
    "approvals" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "contract_amendments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renewal_schedules" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "revenueAccountId" UUID,
    "revenueContractId" UUID,
    "scheduleKey" TEXT NOT NULL,
    "renewalType" TEXT NOT NULL DEFAULT 'standard',
    "status" TEXT NOT NULL DEFAULT 'open',
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "noticeDate" TIMESTAMP(3),
    "ownerUserId" UUID,
    "renewalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "probability" DOUBLE PRECISION,
    "playbook" JSONB NOT NULL DEFAULT '{}',
    "tasks" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "renewal_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renewal_forecasts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "revenueAccountId" UUID,
    "renewalScheduleId" UUID,
    "forecastKey" TEXT NOT NULL,
    "forecastPeriod" TEXT NOT NULL,
    "forecastDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedRenewalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "probability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "forecastStatus" TEXT NOT NULL DEFAULT 'active',
    "riskBand" TEXT NOT NULL DEFAULT 'medium',
    "drivers" JSONB NOT NULL DEFAULT '[]',
    "assumptions" JSONB NOT NULL DEFAULT '{}',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "renewal_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "churn_signals" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "revenueAccountId" UUID,
    "signalKey" TEXT NOT NULL,
    "signalType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "source" TEXT NOT NULL DEFAULT 'revenue_ops',
    "confidence" DOUBLE PRECISION,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signalPayload" JSONB NOT NULL DEFAULT '{}',
    "recommendedActions" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "churn_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expansion_opportunities" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "revenueAccountId" UUID,
    "opportunityKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "opportunityType" TEXT NOT NULL DEFAULT 'upsell',
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "estimatedValue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "probability" DOUBLE PRECISION,
    "expectedCloseAt" TIMESTAMP(3),
    "ownerUserId" UUID,
    "signals" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "expansion_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_health_scores" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "revenueAccountId" UUID,
    "scoreKey" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "scoreBand" TEXT NOT NULL DEFAULT 'medium',
    "previousScore" DOUBLE PRECISION,
    "trend" TEXT NOT NULL DEFAULT 'stable',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "drivers" JSONB NOT NULL DEFAULT '[]',
    "risks" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "account_health_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_forecasts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "revenueAccountId" UUID,
    "forecastKey" TEXT NOT NULL,
    "forecastType" TEXT NOT NULL DEFAULT 'revenue',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "forecastAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "committedAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "upsideAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "downsideAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "probability" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "modelVersion" TEXT NOT NULL DEFAULT 'nexora-revops-v1',
    "assumptions" JSONB NOT NULL DEFAULT '{}',
    "drivers" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "revenue_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "revenueAccountId" UUID,
    "revenueContractId" UUID,
    "eventKey" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'revenue_ops',
    "severity" TEXT NOT NULL DEFAULT 'info',
    "subjectType" TEXT,
    "subjectId" UUID,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "revenue_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "vendorKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "legalName" TEXT,
    "vendorType" TEXT NOT NULL DEFAULT 'supplier',
    "status" TEXT NOT NULL DEFAULT 'active',
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "tier" TEXT NOT NULL DEFAULT 'standard',
    "primaryEmail" TEXT,
    "countryCode" TEXT,
    "taxId" TEXT,
    "paymentTerms" TEXT,
    "ownerUserId" UUID,
    "categories" JSONB NOT NULL DEFAULT '[]',
    "capabilities" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_contracts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "vendorId" UUID,
    "contractKey" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contractType" TEXT NOT NULL DEFAULT 'master_service',
    "status" TEXT NOT NULL DEFAULT 'active',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "contractValue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "renewalDate" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "terms" JSONB NOT NULL DEFAULT '{}',
    "compliance" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendor_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_scorecards" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "vendorId" UUID,
    "scorecardKey" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "scoreBand" TEXT NOT NULL DEFAULT 'good',
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "qualityScore" DOUBLE PRECISION,
    "deliveryScore" DOUBLE PRECISION,
    "costScore" DOUBLE PRECISION,
    "riskScore" DOUBLE PRECISION,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendor_scorecards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_requests" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "vendorId" UUID,
    "purchaseCategoryId" UUID,
    "requestKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requestType" TEXT NOT NULL DEFAULT 'purchase',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "requestedByUserId" UUID,
    "departmentId" UUID,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "estimatedAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "businessJustification" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requiredBy" TIMESTAMP(3),
    "approvalPolicy" JSONB NOT NULL DEFAULT '{}',
    "lineItems" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "procurement_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_approvals" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "procurementRequestId" UUID,
    "approvalKey" TEXT NOT NULL,
    "approverUserId" UUID,
    "approverRole" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approvalLevel" INTEGER NOT NULL DEFAULT 1,
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "decisionAt" TIMESTAMP(3),
    "comments" TEXT,
    "policySnapshot" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "procurement_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "procurementRequestId" UUID,
    "vendorId" UUID,
    "purchaseCategoryId" UUID,
    "orderKey" TEXT NOT NULL,
    "purchaseOrderNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "subtotal" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "issuedAt" TIMESTAMP(3),
    "expectedDeliveryAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "lineItems" JSONB NOT NULL DEFAULT '[]',
    "terms" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_categories" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "categoryKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentCategoryId" UUID,
    "status" TEXT NOT NULL DEFAULT 'active',
    "budgetOwnerUserId" UUID,
    "spendPolicy" JSONB NOT NULL DEFAULT '{}',
    "approvalPolicy" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "purchase_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_allocations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "purchaseCategoryId" UUID,
    "budgetKey" TEXT NOT NULL,
    "departmentId" UUID,
    "ownerUserId" UUID,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "allocatedAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "committedAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "spentAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "remainingAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "thresholdPercent" DOUBLE PRECISION,
    "controls" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "budget_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spend_transactions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "vendorId" UUID,
    "purchaseOrderId" UUID,
    "purchaseCategoryId" UUID,
    "transactionKey" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'procurement',
    "spendType" TEXT NOT NULL DEFAULT 'purchase',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'posted',
    "invoiceReference" TEXT,
    "paymentReference" TEXT,
    "costCenterId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "spend_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spend_insights" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "purchaseCategoryId" UUID,
    "insightKey" TEXT NOT NULL,
    "insightType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "status" TEXT NOT NULL DEFAULT 'open',
    "timeframeStart" TIMESTAMP(3),
    "timeframeEnd" TIMESTAMP(3),
    "amountImpact" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "confidence" DOUBLE PRECISION,
    "findings" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "spend_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_optimization_recommendations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "vendorId" UUID,
    "purchaseCategoryId" UUID,
    "recommendationKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "recommendationType" TEXT NOT NULL DEFAULT 'cost_saving',
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "estimatedSavings" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "confidence" DOUBLE PRECISION,
    "implementationEffort" TEXT NOT NULL DEFAULT 'medium',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actions" JSONB NOT NULL DEFAULT '[]',
    "evidence" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "cost_optimization_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "vendorId" UUID,
    "procurementRequestId" UUID,
    "purchaseOrderId" UUID,
    "eventKey" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'procurement',
    "severity" TEXT NOT NULL DEFAULT 'info',
    "subjectType" TEXT,
    "subjectId" UUID,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "procurement_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply_chain_items" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "itemKey" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "itemType" TEXT NOT NULL DEFAULT 'inventory',
    "status" TEXT NOT NULL DEFAULT 'active',
    "category" TEXT,
    "unitOfMeasure" TEXT NOT NULL DEFAULT 'each',
    "trackBatch" BOOLEAN NOT NULL DEFAULT false,
    "trackSerial" BOOLEAN NOT NULL DEFAULT false,
    "reorderPoint" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "safetyStock" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "leadTimeDays" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "supply_chain_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "warehouseKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "warehouseType" TEXT NOT NULL DEFAULT 'standard',
    "status" TEXT NOT NULL DEFAULT 'active',
    "countryCode" TEXT,
    "region" TEXT,
    "timezone" TEXT,
    "address" JSONB NOT NULL DEFAULT '{}',
    "capabilities" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_zones" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "warehouseId" UUID,
    "zoneKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneType" TEXT NOT NULL DEFAULT 'storage',
    "status" TEXT NOT NULL DEFAULT 'active',
    "temperatureClass" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "warehouse_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_bins" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "warehouseId" UUID,
    "zoneId" UUID,
    "binKey" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "binType" TEXT NOT NULL DEFAULT 'storage',
    "status" TEXT NOT NULL DEFAULT 'active',
    "capacity" DECIMAL(18,4),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "warehouse_bins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_balances" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "itemId" UUID,
    "warehouseId" UUID,
    "zoneId" UUID,
    "binId" UUID,
    "batchId" UUID,
    "stockKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "quantityOnHand" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "quantityAvailable" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "quantityReserved" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "quantityDamaged" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "lastCountedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "stock_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_batches" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "itemId" UUID,
    "batchKey" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "manufacturedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "supplierReference" TEXT,
    "qualityStatus" TEXT NOT NULL DEFAULT 'pending',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "inventory_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_serials" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "itemId" UUID,
    "batchId" UUID,
    "serialKey" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "currentWarehouseId" UUID,
    "currentBinId" UUID,
    "activatedAt" TIMESTAMP(3),
    "warrantyExpiresAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "inventory_serials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_audits" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "itemId" UUID,
    "warehouseId" UUID,
    "auditKey" TEXT NOT NULL,
    "auditType" TEXT NOT NULL DEFAULT 'cycle_count',
    "status" TEXT NOT NULL DEFAULT 'open',
    "countedQuantity" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "expectedQuantity" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "varianceQuantity" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "auditorUserId" UUID,
    "auditedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "findings" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "inventory_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movement_history" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "itemId" UUID,
    "warehouseId" UUID,
    "sourceBinId" UUID,
    "destinationBinId" UUID,
    "movementKey" TEXT NOT NULL,
    "movementType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'posted',
    "quantity" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "referenceType" TEXT,
    "referenceId" UUID,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "inventory_movement_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_transfers" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "sourceWarehouseId" UUID,
    "destinationWarehouseId" UUID,
    "transferKey" TEXT NOT NULL,
    "transferNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "requestedByUserId" UUID,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shippedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "lineItems" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "inventory_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receiving_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "warehouseId" UUID,
    "itemId" UUID,
    "receivingKey" TEXT NOT NULL,
    "receivingNumber" TEXT NOT NULL,
    "vendorId" UUID,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "receivedQuantity" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "rejectedQuantity" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qualityStatus" TEXT NOT NULL DEFAULT 'pending',
    "documents" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "receiving_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fulfillment_orders" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "warehouseId" UUID,
    "fulfillmentKey" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" UUID,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "promisedAt" TIMESTAMP(3),
    "requestedShipAt" TIMESTAMP(3),
    "lineItems" JSONB NOT NULL DEFAULT '[]',
    "deliveryAddress" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "fulfillment_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "picking_tasks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "fulfillmentOrderId" UUID,
    "itemId" UUID,
    "sourceBinId" UUID,
    "taskKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "assignedToUserId" UUID,
    "quantity" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "pickedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "picking_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packing_tasks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "fulfillmentOrderId" UUID,
    "taskKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "assignedToUserId" UUID,
    "packageCount" INTEGER NOT NULL DEFAULT 0,
    "weight" DECIMAL(18,4),
    "packedAt" TIMESTAMP(3),
    "packaging" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "packing_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "fulfillmentOrderId" UUID,
    "warehouseId" UUID,
    "carrierId" UUID,
    "shipmentKey" TEXT NOT NULL,
    "shipmentNumber" TEXT NOT NULL,
    "trackingNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'created',
    "serviceLevel" TEXT,
    "shippedAt" TIMESTAMP(3),
    "predictedEta" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "delayRiskScore" DOUBLE PRECISION,
    "exceptionStatus" TEXT,
    "routePlan" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_tracking_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "shipmentId" UUID,
    "eventKey" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'recorded',
    "location" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eta" TIMESTAMP(3),
    "exceptionCode" TEXT,
    "exceptionMessage" TEXT,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "shipment_tracking_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carriers" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "carrierKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "carrierType" TEXT NOT NULL DEFAULT 'parcel',
    "status" TEXT NOT NULL DEFAULT 'active',
    "serviceLevels" JSONB NOT NULL DEFAULT '[]',
    "performanceScore" DOUBLE PRECISION,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "carriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distribution_centers" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "warehouseId" UUID,
    "centerKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "region" TEXT,
    "capacityScore" DOUBLE PRECISION,
    "networkRole" TEXT NOT NULL DEFAULT 'regional',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "distribution_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_optimization_plans" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "carrierId" UUID,
    "originCenterId" UUID,
    "destinationCenterId" UUID,
    "routeKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "optimizationGoal" TEXT NOT NULL DEFAULT 'cost',
    "estimatedCost" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "estimatedDurationHours" DOUBLE PRECISION,
    "carbonScore" DOUBLE PRECISION,
    "routeData" JSONB NOT NULL DEFAULT '{}',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "route_optimization_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demand_forecast_models" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "modelKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "modelType" TEXT NOT NULL DEFAULT 'statistical',
    "status" TEXT NOT NULL DEFAULT 'active',
    "horizonDays" INTEGER NOT NULL DEFAULT 90,
    "accuracyScore" DOUBLE PRECISION,
    "seasonalityProfile" JSONB NOT NULL DEFAULT '{}',
    "trendProfile" JSONB NOT NULL DEFAULT '{}',
    "parameters" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "demand_forecast_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demand_forecast_scenarios" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "modelId" UUID,
    "itemId" UUID,
    "scenarioKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scenarioType" TEXT NOT NULL DEFAULT 'baseline',
    "status" TEXT NOT NULL DEFAULT 'active',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "forecastQuantity" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "confidence" DOUBLE PRECISION,
    "trendAnalysis" JSONB NOT NULL DEFAULT '{}',
    "seasonalityAnalysis" JSONB NOT NULL DEFAULT '{}',
    "assumptions" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "demand_forecast_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "replenishment_plans" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "itemId" UUID,
    "warehouseId" UUID,
    "planKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'recommended',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "reorderPoint" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "safetyStock" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "recommendedQuantity" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "plannedOrderDate" TIMESTAMP(3),
    "expectedReceiptDate" TIMESTAMP(3),
    "aiRecommendation" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "replenishment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply_chain_risks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "riskKey" TEXT NOT NULL,
    "riskType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "subjectType" TEXT,
    "subjectId" UUID,
    "probability" DOUBLE PRECISION,
    "impactScore" DOUBLE PRECISION,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signals" JSONB NOT NULL DEFAULT '[]',
    "mitigationActions" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "supply_chain_risks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply_chain_insights" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "insightKey" TEXT NOT NULL,
    "insightType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "status" TEXT NOT NULL DEFAULT 'open',
    "confidence" DOUBLE PRECISION,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "findings" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "context" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "supply_chain_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply_chain_copilot_queries" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "queryKey" TEXT NOT NULL,
    "userId" UUID,
    "query" TEXT NOT NULL,
    "response" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "context" JSONB NOT NULL DEFAULT '{}',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "supply_chain_copilot_queries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_health_scores" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "scoreKey" TEXT NOT NULL,
    "productKey" TEXT NOT NULL DEFAULT 'nexora',
    "moduleKey" TEXT,
    "score" DOUBLE PRECISION NOT NULL,
    "scoreBand" TEXT NOT NULL DEFAULT 'healthy',
    "previousScore" DOUBLE PRECISION,
    "trend" TEXT NOT NULL DEFAULT 'flat',
    "drivers" JSONB NOT NULL DEFAULT '[]',
    "risks" JSONB NOT NULL DEFAULT '[]',
    "successMetrics" JSONB NOT NULL DEFAULT '{}',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_health_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_usage_metrics" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "metricKey" TEXT NOT NULL,
    "productKey" TEXT NOT NULL DEFAULT 'nexora',
    "moduleKey" TEXT,
    "featureKey" TEXT,
    "metricType" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'count',
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_usage_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_journeys" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "journeyKey" TEXT NOT NULL,
    "userId" UUID,
    "customerIdentityId" UUID,
    "sessionId" UUID,
    "journeyType" TEXT NOT NULL DEFAULT 'product',
    "status" TEXT NOT NULL DEFAULT 'active',
    "source" TEXT NOT NULL DEFAULT 'product',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "lastStepAt" TIMESTAMP(3),
    "entryPoint" TEXT,
    "exitPoint" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_journeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_steps" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "journeyId" UUID,
    "stepKey" TEXT NOT NULL,
    "stepName" TEXT NOT NULL,
    "stepType" TEXT NOT NULL DEFAULT 'event',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "eventName" TEXT,
    "featureKey" TEXT,
    "moduleKey" TEXT,
    "enteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "properties" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "journey_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "eventKey" TEXT NOT NULL,
    "userId" UUID,
    "customerIdentityId" UUID,
    "sessionId" UUID,
    "journeyId" UUID,
    "eventName" TEXT NOT NULL,
    "eventType" TEXT NOT NULL DEFAULT 'track',
    "productKey" TEXT NOT NULL DEFAULT 'nexora',
    "moduleKey" TEXT,
    "featureKey" TEXT,
    "source" TEXT NOT NULL DEFAULT 'web',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "properties" JSONB NOT NULL DEFAULT '{}',
    "context" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_analytics" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "sessionKey" TEXT NOT NULL,
    "userId" UUID,
    "customerIdentityId" UUID,
    "deviceId" UUID,
    "source" TEXT NOT NULL DEFAULT 'web',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "eventCount" INTEGER NOT NULL DEFAULT 0,
    "featureCount" INTEGER NOT NULL DEFAULT 0,
    "entryUrl" TEXT,
    "exitUrl" TEXT,
    "referrer" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "session_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_usage" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "usageKey" TEXT NOT NULL,
    "productKey" TEXT NOT NULL DEFAULT 'nexora',
    "moduleKey" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "userId" UUID,
    "teamId" UUID,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "adoptionRate" DOUBLE PRECISION,
    "lastUsedAt" TIMESTAMP(3),
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "feature_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funnel_definitions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "funnelKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "funnelType" TEXT NOT NULL DEFAULT 'activation',
    "status" TEXT NOT NULL DEFAULT 'active',
    "ownerUserId" UUID,
    "targetAudience" JSONB NOT NULL DEFAULT '{}',
    "conversionGoal" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "funnel_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funnel_stages" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "funnelId" UUID NOT NULL,
    "stageKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "eventName" TEXT NOT NULL,
    "criteria" JSONB NOT NULL DEFAULT '{}',
    "targetConversionRate" DOUBLE PRECISION,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "funnel_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funnel_results" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "funnelId" UUID NOT NULL,
    "resultKey" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "stageResults" JSONB NOT NULL DEFAULT '[]',
    "conversionRate" DOUBLE PRECISION,
    "dropOffRate" DOUBLE PRECISION,
    "bottlenecks" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "funnel_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "experimentKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hypothesis" TEXT,
    "experimentType" TEXT NOT NULL DEFAULT 'ab_test',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "ownerUserId" UUID,
    "targetAudience" JSONB NOT NULL DEFAULT '{}',
    "primaryMetric" TEXT,
    "secondaryMetrics" JSONB NOT NULL DEFAULT '[]',
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiment_variants" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "experimentId" UUID NOT NULL,
    "variantKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "allocationPercent" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "isControl" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "experiment_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiment_results" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "experimentId" UUID NOT NULL,
    "variantId" UUID,
    "resultKey" TEXT NOT NULL,
    "sampleSize" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION,
    "uplift" DOUBLE PRECISION,
    "pValue" DOUBLE PRECISION,
    "significant" BOOLEAN NOT NULL DEFAULT false,
    "metricResults" JSONB NOT NULL DEFAULT '{}',
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "experiment_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retention_cohorts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "cohortKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cohortType" TEXT NOT NULL DEFAULT 'weekly',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "userCount" INTEGER NOT NULL DEFAULT 0,
    "retainedUsers" INTEGER NOT NULL DEFAULT 0,
    "retentionRate" DOUBLE PRECISION,
    "churnRate" DOUBLE PRECISION,
    "segments" JSONB NOT NULL DEFAULT '{}',
    "churnSignals" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "retention_cohorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engagement_scores" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "scoreKey" TEXT NOT NULL,
    "userId" UUID,
    "customerIdentityId" UUID,
    "teamId" UUID,
    "score" DOUBLE PRECISION NOT NULL,
    "scoreBand" TEXT NOT NULL DEFAULT 'medium',
    "stickiness" DOUBLE PRECISION,
    "activityCount" INTEGER NOT NULL DEFAULT 0,
    "activeDays" INTEGER NOT NULL DEFAULT 0,
    "signals" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "engagement_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "growth_recommendations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "recommendationKey" TEXT NOT NULL,
    "recommendationType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'open',
    "impactScore" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "source" TEXT NOT NULL DEFAULT 'ai_product_copilot',
    "targetType" TEXT,
    "targetId" TEXT,
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "actions" JSONB NOT NULL DEFAULT '[]',
    "ownerUserId" UUID,
    "dueAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "growth_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecast_models" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "modelKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "forecastType" TEXT NOT NULL,
    "horizon" TEXT NOT NULL DEFAULT 'monthly',
    "cadence" TEXT NOT NULL DEFAULT 'monthly',
    "algorithm" TEXT NOT NULL DEFAULT 'ai_assisted',
    "status" TEXT NOT NULL DEFAULT 'active',
    "sourceData" JSONB NOT NULL DEFAULT '{}',
    "assumptions" JSONB NOT NULL DEFAULT '[]',
    "features" JSONB NOT NULL DEFAULT '[]',
    "confidence" DOUBLE PRECISION,
    "ownerUserId" UUID,
    "lastTrainedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "forecast_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecast_results" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "forecastModelId" UUID NOT NULL,
    "resultKey" TEXT NOT NULL,
    "forecastType" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "horizonStart" TIMESTAMP(3) NOT NULL,
    "horizonEnd" TIMESTAMP(3) NOT NULL,
    "baseValue" DOUBLE PRECISION,
    "forecastValue" DOUBLE PRECISION NOT NULL,
    "lowerBound" DOUBLE PRECISION,
    "upperBound" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "unit" TEXT NOT NULL DEFAULT 'amount',
    "currencyCode" TEXT,
    "drivers" JSONB NOT NULL DEFAULT '[]',
    "explanation" JSONB NOT NULL DEFAULT '{}',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "forecast_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prediction_models" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "modelKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "predictionType" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL DEFAULT 'ai_assisted',
    "status" TEXT NOT NULL DEFAULT 'active',
    "targetEntity" TEXT,
    "features" JSONB NOT NULL DEFAULT '[]',
    "thresholds" JSONB NOT NULL DEFAULT '{}',
    "trainingWindow" JSONB NOT NULL DEFAULT '{}',
    "confidence" DOUBLE PRECISION,
    "ownerUserId" UUID,
    "lastTrainedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "prediction_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prediction_results" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "predictionModelId" UUID NOT NULL,
    "resultKey" TEXT NOT NULL,
    "predictionType" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "score" DOUBLE PRECISION NOT NULL,
    "probability" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "band" TEXT NOT NULL DEFAULT 'medium',
    "horizonStart" TIMESTAMP(3),
    "horizonEnd" TIMESTAMP(3),
    "drivers" JSONB NOT NULL DEFAULT '[]',
    "explanation" JSONB NOT NULL DEFAULT '{}',
    "recommendedActions" JSONB NOT NULL DEFAULT '[]',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "prediction_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategic_plans" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "planKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "planType" TEXT NOT NULL DEFAULT 'annual',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "planningHorizon" TEXT NOT NULL DEFAULT 'yearly',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "ownerUserId" UUID,
    "departments" JSONB NOT NULL DEFAULT '[]',
    "kpis" JSONB NOT NULL DEFAULT '[]',
    "assumptions" JSONB NOT NULL DEFAULT '[]',
    "objectives" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "strategic_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategic_goals" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "strategicPlanId" UUID,
    "goalKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "goalType" TEXT NOT NULL DEFAULT 'growth',
    "status" TEXT NOT NULL DEFAULT 'active',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "ownerUserId" UUID,
    "targetMetric" TEXT,
    "targetValue" DOUBLE PRECISION,
    "currentValue" DOUBLE PRECISION,
    "dueAt" TIMESTAMP(3),
    "kpis" JSONB NOT NULL DEFAULT '[]',
    "milestones" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "strategic_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_models" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "strategicPlanId" UUID,
    "scenarioKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scenarioType" TEXT NOT NULL DEFAULT 'what_if',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "baseCase" JSONB NOT NULL DEFAULT '{}',
    "assumptions" JSONB NOT NULL DEFAULT '[]',
    "variables" JSONB NOT NULL DEFAULT '{}',
    "createdByUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "scenario_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_results" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "scenarioModelId" UUID NOT NULL,
    "resultKey" TEXT NOT NULL,
    "outcomeSummary" TEXT,
    "kpiImpacts" JSONB NOT NULL DEFAULT '[]',
    "financialImpact" JSONB NOT NULL DEFAULT '{}',
    "riskImpact" JSONB NOT NULL DEFAULT '{}',
    "recommendedActions" JSONB NOT NULL DEFAULT '[]',
    "confidence" DOUBLE PRECISION,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "scenario_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_plans" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "strategicPlanId" UUID,
    "budgetKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fiscalYear" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "departmentId" UUID,
    "currencyCode" TEXT NOT NULL DEFAULT 'USD',
    "plannedRevenue" DOUBLE PRECISION,
    "plannedExpenses" DOUBLE PRECISION,
    "plannedBudget" DOUBLE PRECISION,
    "allocatedBudget" DOUBLE PRECISION,
    "variance" DOUBLE PRECISION,
    "assumptions" JSONB NOT NULL DEFAULT '[]',
    "lineItems" JSONB NOT NULL DEFAULT '[]',
    "approvals" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "budget_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capacity_plans" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "strategicPlanId" UUID,
    "capacityKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacityType" TEXT NOT NULL DEFAULT 'workforce',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "departmentId" UUID,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "demandForecast" DOUBLE PRECISION,
    "currentCapacity" DOUBLE PRECISION,
    "requiredCapacity" DOUBLE PRECISION,
    "capacityGap" DOUBLE PRECISION,
    "utilizationRate" DOUBLE PRECISION,
    "constraints" JSONB NOT NULL DEFAULT '[]',
    "hiringPlan" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "capacity_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_forecasts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "riskKey" TEXT NOT NULL,
    "riskType" TEXT NOT NULL,
    "riskName" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "probability" DOUBLE PRECISION,
    "impactScore" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "horizonStart" TIMESTAMP(3),
    "horizonEnd" TIMESTAMP(3),
    "drivers" JSONB NOT NULL DEFAULT '[]',
    "mitigationActions" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'open',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "risk_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "growth_forecasts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "growthKey" TEXT NOT NULL,
    "growthType" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "baselineValue" DOUBLE PRECISION,
    "forecastValue" DOUBLE PRECISION,
    "growthRate" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "horizonStart" TIMESTAMP(3),
    "horizonEnd" TIMESTAMP(3),
    "drivers" JSONB NOT NULL DEFAULT '[]',
    "opportunities" JSONB NOT NULL DEFAULT '[]',
    "recommendedActions" JSONB NOT NULL DEFAULT '[]',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "growth_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_lakes" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataLakeKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lakeType" TEXT NOT NULL DEFAULT 'enterprise',
    "storageProvider" TEXT NOT NULL DEFAULT 's3_compatible',
    "storageUri" TEXT,
    "region" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "encryptionMode" TEXT NOT NULL DEFAULT 'managed',
    "retentionPolicy" JSONB NOT NULL DEFAULT '{}',
    "classification" TEXT NOT NULL DEFAULT 'internal',
    "zones" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_lakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_warehouses" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataLakeId" UUID,
    "warehouseKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "warehouseType" TEXT NOT NULL DEFAULT 'analytics',
    "engine" TEXT NOT NULL DEFAULT 'postgresql',
    "status" TEXT NOT NULL DEFAULT 'active',
    "schemaName" TEXT,
    "refreshCadence" TEXT NOT NULL DEFAULT 'hourly',
    "storageBytes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "queryEndpoint" TEXT,
    "governance" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_marts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "warehouseId" UUID,
    "dataMartKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "martType" TEXT NOT NULL DEFAULT 'department',
    "domain" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "ownerTeamId" UUID,
    "refreshCadence" TEXT NOT NULL DEFAULT 'daily',
    "sourceTables" JSONB NOT NULL DEFAULT '[]',
    "semanticModels" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_marts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semantic_metrics" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataMartId" UUID,
    "metricKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "metricType" TEXT NOT NULL DEFAULT 'business',
    "category" TEXT NOT NULL DEFAULT 'general',
    "formula" TEXT NOT NULL,
    "aggregation" TEXT NOT NULL DEFAULT 'sum',
    "unit" TEXT NOT NULL DEFAULT 'count',
    "certified" BOOLEAN NOT NULL DEFAULT false,
    "ownerUserId" UUID,
    "dimensions" JSONB NOT NULL DEFAULT '[]',
    "filters" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "semantic_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semantic_dimensions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataMartId" UUID,
    "dimensionKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dimensionType" TEXT NOT NULL DEFAULT 'attribute',
    "sourceField" TEXT NOT NULL,
    "hierarchy" JSONB NOT NULL DEFAULT '[]',
    "valuesPreview" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "semantic_dimensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpis" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "semanticMetricId" UUID,
    "kpiKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'executive',
    "status" TEXT NOT NULL DEFAULT 'active',
    "targetValue" DOUBLE PRECISION,
    "currentValue" DOUBLE PRECISION,
    "unit" TEXT NOT NULL DEFAULT 'count',
    "period" TEXT NOT NULL DEFAULT 'monthly',
    "ownerUserId" UUID,
    "thresholds" JSONB NOT NULL DEFAULT '{}',
    "formula" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_results" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "kpiId" UUID NOT NULL,
    "resultKey" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "actualValue" DOUBLE PRECISION NOT NULL,
    "targetValue" DOUBLE PRECISION,
    "variance" DOUBLE PRECISION,
    "score" DOUBLE PRECISION,
    "band" TEXT NOT NULL DEFAULT 'on_track',
    "drivers" JSONB NOT NULL DEFAULT '[]',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "kpi_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "executive_dashboards" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataMartId" UUID,
    "dashboardKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dashboardType" TEXT NOT NULL DEFAULT 'executive',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "audience" TEXT NOT NULL DEFAULT 'executive',
    "layout" JSONB NOT NULL DEFAULT '{}',
    "widgets" JSONB NOT NULL DEFAULT '[]',
    "filters" JSONB NOT NULL DEFAULT '[]',
    "refreshCadence" TEXT NOT NULL DEFAULT 'daily',
    "ownerUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "executive_dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_jobs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "warehouseId" UUID,
    "jobKey" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "rowsProcessed" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "warehouse_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_pipelines" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataLakeId" UUID,
    "warehouseId" UUID,
    "pipelineKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pipelineType" TEXT NOT NULL DEFAULT 'ingestion',
    "sourceSystem" TEXT NOT NULL,
    "targetSystem" TEXT NOT NULL,
    "schedule" TEXT NOT NULL DEFAULT 'manual',
    "status" TEXT NOT NULL DEFAULT 'active',
    "transformationConfig" JSONB NOT NULL DEFAULT '{}',
    "qualityRules" JSONB NOT NULL DEFAULT '[]',
    "lastRunAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_model_registries" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "registryKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registryType" TEXT NOT NULL DEFAULT 'enterprise',
    "status" TEXT NOT NULL DEFAULT 'active',
    "ownerUserId" UUID,
    "governancePolicy" JSONB NOT NULL DEFAULT '{}',
    "accessPolicy" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_model_registries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_models" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "registryId" UUID,
    "modelKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'openai',
    "modelType" TEXT NOT NULL DEFAULT 'llm',
    "domain" TEXT NOT NULL DEFAULT 'general',
    "status" TEXT NOT NULL DEFAULT 'registered',
    "riskTier" TEXT NOT NULL DEFAULT 'medium',
    "ownerUserId" UUID,
    "purpose" TEXT,
    "limitations" JSONB NOT NULL DEFAULT '[]',
    "policies" JSONB NOT NULL DEFAULT '[]',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_model_versions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "aiModelId" UUID NOT NULL,
    "versionKey" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "releaseStage" TEXT NOT NULL DEFAULT 'development',
    "artifactUri" TEXT,
    "promptTemplate" JSONB NOT NULL DEFAULT '{}',
    "parameters" JSONB NOT NULL DEFAULT '{}',
    "evaluationSummary" JSONB NOT NULL DEFAULT '{}',
    "approvedAt" TIMESTAMP(3),
    "deprecatedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_model_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_model_deployments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "aiModelId" UUID NOT NULL,
    "modelVersionId" UUID,
    "deploymentKey" TEXT NOT NULL,
    "environment" TEXT NOT NULL DEFAULT 'production',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "endpoint" TEXT,
    "trafficPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rollbackVersionId" UUID,
    "deployedAt" TIMESTAMP(3),
    "retiredAt" TIMESTAMP(3),
    "healthStatus" TEXT NOT NULL DEFAULT 'unknown',
    "runtimeConfig" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_model_deployments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_decisions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "aiModelId" UUID,
    "modelVersionId" UUID,
    "deploymentId" UUID,
    "decisionKey" TEXT NOT NULL,
    "decisionType" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT,
    "outcome" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "riskLevel" TEXT NOT NULL DEFAULT 'medium',
    "inputSummary" JSONB NOT NULL DEFAULT '{}',
    "outputSummary" JSONB NOT NULL DEFAULT '{}',
    "policyChecks" JSONB NOT NULL DEFAULT '[]',
    "humanReviewed" BOOLEAN NOT NULL DEFAULT false,
    "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_decision_reasons" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "decisionId" UUID NOT NULL,
    "reasonKey" TEXT NOT NULL,
    "reasonType" TEXT NOT NULL DEFAULT 'model',
    "description" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_decision_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_decision_risks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "decisionId" UUID NOT NULL,
    "riskKey" TEXT NOT NULL,
    "riskType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "probability" DOUBLE PRECISION,
    "impactScore" DOUBLE PRECISION,
    "mitigation" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'open',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_decision_risks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_audit_logs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "aiModelId" UUID,
    "decisionId" UUID,
    "auditKey" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorUserId" UUID,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "source" TEXT NOT NULL DEFAULT 'ai_governance',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_compliance_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "aiModelId" UUID,
    "deploymentId" UUID,
    "complianceKey" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "controlId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "findings" JSONB NOT NULL DEFAULT '[]',
    "remediation" JSONB NOT NULL DEFAULT '[]',
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assessorUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_compliance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_explainability_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "aiModelId" UUID,
    "modelVersionId" UUID,
    "decisionId" UUID,
    "explanationKey" TEXT NOT NULL,
    "explanationType" TEXT NOT NULL DEFAULT 'rationale',
    "summary" TEXT,
    "factors" JSONB NOT NULL DEFAULT '[]',
    "counterfactuals" JSONB NOT NULL DEFAULT '[]',
    "confidence" DOUBLE PRECISION,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ai_explainability_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_performance_metrics" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "aiModelId" UUID NOT NULL,
    "modelVersionId" UUID,
    "deploymentId" UUID,
    "metricKey" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "metricType" TEXT NOT NULL DEFAULT 'quality',
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'score',
    "threshold" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'ok',
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "model_performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_approval_workflows" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "aiModelId" UUID,
    "modelVersionId" UUID,
    "deploymentId" UUID,
    "workflowKey" TEXT NOT NULL,
    "workflowType" TEXT NOT NULL DEFAULT 'model_release',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "riskTier" TEXT NOT NULL DEFAULT 'medium',
    "requestedByUserId" UUID,
    "approvedByUserId" UUID,
    "steps" JSONB NOT NULL DEFAULT '[]',
    "decision" JSONB NOT NULL DEFAULT '{}',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "model_approval_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_incidents" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "incidentKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "incidentType" TEXT NOT NULL DEFAULT 'security',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "source" TEXT NOT NULL DEFAULT 'security_command_center',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "assignedUserId" UUID,
    "impact" JSONB NOT NULL DEFAULT '[]',
    "timeline" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "security_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_threats" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "threatKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "threatType" TEXT NOT NULL DEFAULT 'unknown',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'active',
    "source" TEXT NOT NULL DEFAULT 'threat_detection',
    "confidence" DOUBLE PRECISION,
    "indicators" JSONB NOT NULL DEFAULT '[]',
    "tactics" JSONB NOT NULL DEFAULT '[]',
    "mitigation" JSONB NOT NULL DEFAULT '[]',
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "security_threats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threat_detection_rules" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "ruleKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL DEFAULT 'behavioral',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'active',
    "logic" JSONB NOT NULL DEFAULT '{}',
    "conditions" JSONB NOT NULL DEFAULT '[]',
    "actions" JSONB NOT NULL DEFAULT '[]',
    "falsePositiveRate" DOUBLE PRECISION,
    "lastTriggeredAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "threat_detection_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threat_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "eventKey" TEXT NOT NULL,
    "threatId" UUID,
    "ruleId" UUID,
    "incidentId" UUID,
    "eventType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT NOT NULL DEFAULT 'threat_detection',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "indicators" JSONB NOT NULL DEFAULT '[]',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "threat_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_risks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "threatId" UUID,
    "riskKey" TEXT NOT NULL,
    "riskType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "probability" DOUBLE PRECISION,
    "impactScore" DOUBLE PRECISION,
    "riskScore" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'open',
    "ownerUserId" UUID,
    "mitigationPlan" JSONB NOT NULL DEFAULT '[]',
    "dueAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "security_risks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_scores" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "scoreKey" TEXT NOT NULL,
    "scopeType" TEXT NOT NULL DEFAULT 'workspace',
    "scopeId" UUID,
    "score" DOUBLE PRECISION NOT NULL,
    "scoreBand" TEXT NOT NULL DEFAULT 'unknown',
    "previousScore" DOUBLE PRECISION,
    "trend" TEXT NOT NULL DEFAULT 'stable',
    "factors" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "security_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_audits" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "incidentId" UUID,
    "auditKey" TEXT NOT NULL,
    "auditType" TEXT NOT NULL DEFAULT 'security',
    "action" TEXT NOT NULL,
    "actorUserId" UUID,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "source" TEXT NOT NULL DEFAULT 'security_audit',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "security_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_violations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "incidentId" UUID,
    "violationKey" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "controlId" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "description" TEXT,
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "remediation" JSONB NOT NULL DEFAULT '[]',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "compliance_violations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zero_trust_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "policyKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "policyType" TEXT NOT NULL DEFAULT 'adaptive_access',
    "status" TEXT NOT NULL DEFAULT 'active',
    "enforcementMode" TEXT NOT NULL DEFAULT 'monitor',
    "conditions" JSONB NOT NULL DEFAULT '[]',
    "actions" JSONB NOT NULL DEFAULT '[]',
    "riskThreshold" DOUBLE PRECISION,
    "appliesTo" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "zero_trust_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_verifications" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "policyId" UUID,
    "verificationKey" TEXT NOT NULL,
    "userId" UUID,
    "deviceId" UUID,
    "resourceType" TEXT NOT NULL,
    "resourceId" UUID,
    "decision" TEXT NOT NULL DEFAULT 'allow',
    "riskScore" DOUBLE PRECISION,
    "trustLevel" TEXT NOT NULL DEFAULT 'unknown',
    "reasons" JSONB NOT NULL DEFAULT '[]',
    "context" JSONB NOT NULL DEFAULT '{}',
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "access_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_alerts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "incidentId" UUID,
    "threatId" UUID,
    "alertKey" TEXT NOT NULL,
    "alertType" TEXT NOT NULL DEFAULT 'security',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "message" TEXT,
    "source" TEXT NOT NULL DEFAULT 'security_alerts',
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "security_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_investigations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "incidentId" UUID,
    "investigationKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "investigatorUserId" UUID,
    "findings" JSONB NOT NULL DEFAULT '[]',
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "actions" JSONB NOT NULL DEFAULT '[]',
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "security_investigations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_health" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "serviceKey" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL DEFAULT 'api',
    "environment" TEXT NOT NULL DEFAULT 'production',
    "region" TEXT NOT NULL DEFAULT 'global',
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "latencyMs" DOUBLE PRECISION,
    "errorRate" DOUBLE PRECISION,
    "throughput" DOUBLE PRECISION,
    "saturation" DOUBLE PRECISION,
    "dependencyStatus" JSONB NOT NULL DEFAULT '[]',
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "service_health_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_incidents" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "serviceHealthId" UUID,
    "incidentKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "incidentType" TEXT NOT NULL DEFAULT 'reliability',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "source" TEXT NOT NULL DEFAULT 'reliability_command_center',
    "region" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "assignedUserId" UUID,
    "impact" JSONB NOT NULL DEFAULT '[]',
    "timeline" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "system_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_timelines" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "incidentId" UUID NOT NULL,
    "timelineKey" TEXT NOT NULL,
    "eventType" TEXT NOT NULL DEFAULT 'update',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "actorUserId" UUID,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "incident_timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recovery_actions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "incidentId" UUID,
    "actionKey" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "automationType" TEXT NOT NULL DEFAULT 'runbook',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "rollbackAvailable" BOOLEAN NOT NULL DEFAULT false,
    "result" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "recovery_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uptime_metrics" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "serviceHealthId" UUID,
    "metricKey" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'global',
    "environment" TEXT NOT NULL DEFAULT 'production',
    "uptimePercent" DOUBLE PRECISION NOT NULL,
    "availabilitySlo" DOUBLE PRECISION,
    "downtimeMinutes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "windowEnd" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ok',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "uptime_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reliability_scores" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "scoreKey" TEXT NOT NULL,
    "scopeType" TEXT NOT NULL DEFAULT 'workspace',
    "scopeId" UUID,
    "score" DOUBLE PRECISION NOT NULL,
    "scoreBand" TEXT NOT NULL DEFAULT 'unknown',
    "previousScore" DOUBLE PRECISION,
    "trend" TEXT NOT NULL DEFAULT 'stable',
    "factors" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "reliability_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scaling_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "policyKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL DEFAULT 'api',
    "region" TEXT NOT NULL DEFAULT 'global',
    "status" TEXT NOT NULL DEFAULT 'active',
    "mode" TEXT NOT NULL DEFAULT 'automatic',
    "minInstances" INTEGER NOT NULL DEFAULT 1,
    "maxInstances" INTEGER NOT NULL DEFAULT 10,
    "targetCpu" DOUBLE PRECISION,
    "targetMemory" DOUBLE PRECISION,
    "targetLatencyMs" DOUBLE PRECISION,
    "cooldownSeconds" INTEGER NOT NULL DEFAULT 300,
    "rules" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "scaling_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scaling_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "policyId" UUID,
    "eventKey" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'global',
    "direction" TEXT NOT NULL DEFAULT 'out',
    "previousCapacity" INTEGER,
    "requestedCapacity" INTEGER,
    "newCapacity" INTEGER,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'requested',
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "scaling_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "region_health" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "regionKey" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'aws',
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "latencyMs" DOUBLE PRECISION,
    "errorRate" DOUBLE PRECISION,
    "capacityUtilization" DOUBLE PRECISION,
    "activeFailover" BOOLEAN NOT NULL DEFAULT false,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "region_health_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "failover_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "regionHealthId" UUID,
    "incidentId" UUID,
    "eventKey" TEXT NOT NULL,
    "sourceRegion" TEXT NOT NULL,
    "targetRegion" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'initiated',
    "reason" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "rollbackAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "failover_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sre_alerts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "serviceHealthId" UUID,
    "incidentId" UUID,
    "alertKey" TEXT NOT NULL,
    "alertType" TEXT NOT NULL DEFAULT 'slo',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "message" TEXT,
    "source" TEXT NOT NULL DEFAULT 'sre_automation',
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sre_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capacity_forecasts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "serviceHealthId" UUID,
    "forecastKey" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'global',
    "forecastType" TEXT NOT NULL DEFAULT 'capacity',
    "horizon" TEXT NOT NULL DEFAULT '30d',
    "demandScore" DOUBLE PRECISION,
    "recommendedCapacity" INTEGER,
    "confidence" DOUBLE PRECISION,
    "forecastAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signals" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "capacity_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_centers" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "costCenterKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT,
    "ownerUserId" UUID,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "monthlyBudget" DOUBLE PRECISION,
    "annualBudget" DOUBLE PRECISION,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "cost_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_usage" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "costCenterId" UUID,
    "usageKey" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'internal',
    "serviceName" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'global',
    "usageQuantity" DOUBLE PRECISION NOT NULL,
    "usageUnit" TEXT NOT NULL DEFAULT 'unit',
    "unitCost" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "resource_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_metrics" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "costCenterId" UUID,
    "metricKey" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "metricType" TEXT NOT NULL DEFAULT 'cost',
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "provider" TEXT,
    "serviceName" TEXT,
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "cost_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_forecasts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "costCenterId" UUID,
    "forecastKey" TEXT NOT NULL,
    "forecastType" TEXT NOT NULL DEFAULT 'monthly',
    "horizon" TEXT NOT NULL DEFAULT '30d',
    "predictedCost" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "confidence" DOUBLE PRECISION,
    "baselineCost" DOUBLE PRECISION,
    "variancePercent" DOUBLE PRECISION,
    "forecastAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signals" JSONB NOT NULL DEFAULT '[]',
    "assumptions" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "cost_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "optimization_recommendations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "costCenterId" UUID,
    "recommendationKey" TEXT NOT NULL,
    "recommendationType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "estimatedSavings" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "confidence" DOUBLE PRECISION,
    "effort" TEXT NOT NULL DEFAULT 'medium',
    "impact" JSONB NOT NULL DEFAULT '{}',
    "actions" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "optimization_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "efficiency_scores" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "costCenterId" UUID,
    "scoreKey" TEXT NOT NULL,
    "scopeType" TEXT NOT NULL DEFAULT 'workspace',
    "scopeId" UUID,
    "score" DOUBLE PRECISION NOT NULL,
    "scoreBand" TEXT NOT NULL DEFAULT 'unknown',
    "previousScore" DOUBLE PRECISION,
    "trend" TEXT NOT NULL DEFAULT 'stable',
    "costEfficiency" DOUBLE PRECISION,
    "performanceEfficiency" DOUBLE PRECISION,
    "utilizationEfficiency" DOUBLE PRECISION,
    "factors" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "efficiency_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_metrics" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "resourceUsageId" UUID,
    "metricKey" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "metricType" TEXT NOT NULL DEFAULT 'latency',
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'ms',
    "threshold" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'ok',
    "provider" TEXT,
    "serviceName" TEXT,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_allocations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "costCenterId" UUID,
    "allocationKey" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceName" TEXT NOT NULL,
    "allocationType" TEXT NOT NULL DEFAULT 'department',
    "allocatedTo" TEXT NOT NULL,
    "allocationPercent" DOUBLE PRECISION,
    "allocatedCost" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "resource_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finops_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "policyKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "policyType" TEXT NOT NULL DEFAULT 'budget',
    "status" TEXT NOT NULL DEFAULT 'active',
    "enforcementMode" TEXT NOT NULL DEFAULT 'monitor',
    "rules" JSONB NOT NULL DEFAULT '[]',
    "thresholds" JSONB NOT NULL DEFAULT '{}',
    "actions" JSONB NOT NULL DEFAULT '[]',
    "ownerUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "finops_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_tracking" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "costCenterId" UUID,
    "policyId" UUID,
    "budgetKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "period" TEXT NOT NULL DEFAULT 'monthly',
    "budgetAmount" DOUBLE PRECISION NOT NULL,
    "actualAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "forecastAmount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'tracking',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "budget_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_alerts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "costCenterId" UUID,
    "policyId" UUID,
    "budgetId" UUID,
    "alertKey" TEXT NOT NULL,
    "alertType" TEXT NOT NULL DEFAULT 'budget',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "message" TEXT,
    "thresholdAmount" DOUBLE PRECISION,
    "actualAmount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "cost_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings_opportunities" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "costCenterId" UUID,
    "recommendationId" UUID,
    "opportunityKey" TEXT NOT NULL,
    "opportunityType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "estimatedSavings" DOUBLE PRECISION NOT NULL,
    "realizedSavings" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "confidence" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "identifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetDate" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "savings_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_regions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "regionKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "regionCode" TEXT,
    "jurisdiction" TEXT NOT NULL,
    "cloudProvider" TEXT,
    "dataResidencyTier" TEXT NOT NULL DEFAULT 'standard',
    "status" TEXT NOT NULL DEFAULT 'active',
    "allowedDataClasses" JSONB NOT NULL DEFAULT '[]',
    "restrictedDataClasses" JSONB NOT NULL DEFAULT '[]',
    "encryptionRequirements" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "residency_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataRegionId" UUID,
    "policyKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "policyType" TEXT NOT NULL DEFAULT 'residency',
    "status" TEXT NOT NULL DEFAULT 'active',
    "enforcementMode" TEXT NOT NULL DEFAULT 'monitor',
    "dataClasses" JSONB NOT NULL DEFAULT '[]',
    "allowedRegions" JSONB NOT NULL DEFAULT '[]',
    "restrictedRegions" JSONB NOT NULL DEFAULT '[]',
    "retentionRules" JSONB NOT NULL DEFAULT '{}',
    "ownerUserId" UUID,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "residency_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sovereignty_rules" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "ruleKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL DEFAULT 'processing',
    "status" TEXT NOT NULL DEFAULT 'active',
    "enforcementMode" TEXT NOT NULL DEFAULT 'monitor',
    "conditions" JSONB NOT NULL DEFAULT '[]',
    "restrictions" JSONB NOT NULL DEFAULT '[]',
    "exceptions" JSONB NOT NULL DEFAULT '[]',
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sovereignty_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_frameworks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "frameworkKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "frameworkType" TEXT NOT NULL DEFAULT 'privacy',
    "countryCode" TEXT,
    "jurisdiction" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "authority" TEXT,
    "version" TEXT,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "regulatory_frameworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_requirements" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "frameworkId" UUID,
    "requirementKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requirementType" TEXT NOT NULL DEFAULT 'control',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'active',
    "controlMapping" JSONB NOT NULL DEFAULT '[]',
    "evidenceRequirements" JSONB NOT NULL DEFAULT '[]',
    "ownerUserId" UUID,
    "dueAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "compliance_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jurisdiction_rules" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataRegionId" UUID,
    "ruleKey" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL DEFAULT 'data_processing',
    "status" TEXT NOT NULL DEFAULT 'active',
    "requirements" JSONB NOT NULL DEFAULT '[]',
    "restrictions" JSONB NOT NULL DEFAULT '[]',
    "penalties" JSONB NOT NULL DEFAULT '[]',
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "jurisdiction_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_transfer_rules" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "sourceRegionId" UUID,
    "destinationRegionId" UUID,
    "ruleKey" TEXT NOT NULL,
    "transferType" TEXT NOT NULL DEFAULT 'cross_border',
    "status" TEXT NOT NULL DEFAULT 'active',
    "allowed" BOOLEAN NOT NULL DEFAULT false,
    "dataClasses" JSONB NOT NULL DEFAULT '[]',
    "safeguards" JSONB NOT NULL DEFAULT '[]',
    "approvalRequired" BOOLEAN NOT NULL DEFAULT true,
    "legalBasis" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_transfer_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_audits" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "frameworkId" UUID,
    "requirementId" UUID,
    "dataRegionId" UUID,
    "auditKey" TEXT NOT NULL,
    "auditType" TEXT NOT NULL DEFAULT 'regulatory',
    "status" TEXT NOT NULL DEFAULT 'open',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "scope" JSONB NOT NULL DEFAULT '{}',
    "findings" JSONB NOT NULL DEFAULT '[]',
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "remediation" JSONB NOT NULL DEFAULT '[]',
    "auditedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auditorUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "compliance_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_alerts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "frameworkId" UUID,
    "dataRegionId" UUID,
    "alertKey" TEXT NOT NULL,
    "alertType" TEXT NOT NULL DEFAULT 'compliance',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "message" TEXT,
    "source" TEXT NOT NULL DEFAULT 'regulatory_operations',
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "regulatory_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "residency_assignments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataRegionId" UUID,
    "policyId" UUID,
    "assignmentKey" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT,
    "dataClass" TEXT NOT NULL,
    "residencyStatus" TEXT NOT NULL DEFAULT 'assigned',
    "assignedRegion" TEXT NOT NULL,
    "enforcementMode" TEXT NOT NULL DEFAULT 'monitor',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "residency_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_locations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataRegionId" UUID,
    "locationKey" TEXT NOT NULL,
    "dataObjectType" TEXT NOT NULL,
    "dataObjectId" TEXT,
    "storageProvider" TEXT NOT NULL,
    "storageRegion" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "residencyState" TEXT NOT NULL DEFAULT 'compliant',
    "encryptionState" TEXT NOT NULL DEFAULT 'encrypted',
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_risks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "frameworkId" UUID,
    "requirementId" UUID,
    "dataRegionId" UUID,
    "riskKey" TEXT NOT NULL,
    "riskType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "probability" DOUBLE PRECISION,
    "impactScore" DOUBLE PRECISION,
    "riskScore" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'open',
    "mitigationPlan" JSONB NOT NULL DEFAULT '[]',
    "dueAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "regulatory_risks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_contracts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "contractKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "contractType" TEXT NOT NULL DEFAULT 'api',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "ownerUserId" UUID,
    "schema" JSONB NOT NULL DEFAULT '{}',
    "qualityRules" JSONB NOT NULL DEFAULT '[]',
    "consumers" JSONB NOT NULL DEFAULT '[]',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "data_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_versions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataContractId" UUID NOT NULL,
    "versionKey" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "schema" JSONB NOT NULL DEFAULT '{}',
    "changelog" JSONB NOT NULL DEFAULT '[]',
    "compatibilityMode" TEXT NOT NULL DEFAULT 'backward',
    "publishedAt" TIMESTAMP(3),
    "deprecatedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "contract_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_products" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataContractId" UUID,
    "contractVersionId" UUID,
    "productKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'platform',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "basePath" TEXT NOT NULL,
    "ownerUserId" UUID,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "api_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_plans" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "apiProductId" UUID,
    "planKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'standard',
    "status" TEXT NOT NULL DEFAULT 'active',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "priceMonthly" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "pricePerRequest" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "includedRequests" BIGINT NOT NULL DEFAULT 0,
    "overagePrice" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "features" JSONB NOT NULL DEFAULT '[]',
    "limits" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "api_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_subscriptions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "apiProductId" UUID,
    "apiPlanId" UUID,
    "apiKeyId" UUID,
    "subscriptionKey" TEXT NOT NULL,
    "subscriberType" TEXT NOT NULL DEFAULT 'partner',
    "subscriberId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "api_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_usage_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "apiProductId" UUID,
    "subscriptionId" UUID,
    "apiKeyId" UUID,
    "usageKey" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'GET',
    "statusCode" INTEGER,
    "requestCount" INTEGER NOT NULL DEFAULT 1,
    "billableUnits" DECIMAL(18,4) NOT NULL DEFAULT 1,
    "latencyMs" INTEGER,
    "costAmount" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "api_usage_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_billings" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "apiPlanId" UUID,
    "subscriptionId" UUID,
    "billingKey" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "usageUnits" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'open',
    "dueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "api_billings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "governance_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "dataContractId" UUID,
    "policyKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "policyType" TEXT NOT NULL DEFAULT 'platform',
    "status" TEXT NOT NULL DEFAULT 'active',
    "enforcementMode" TEXT NOT NULL DEFAULT 'monitor',
    "rules" JSONB NOT NULL DEFAULT '[]',
    "approvalWorkflow" JSONB NOT NULL DEFAULT '{}',
    "ownerUserId" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "governance_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_quotas" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "apiProductId" UUID,
    "apiPlanId" UUID,
    "quotaKey" TEXT NOT NULL,
    "quotaType" TEXT NOT NULL DEFAULT 'requests',
    "limit" BIGINT NOT NULL DEFAULT 0,
    "period" TEXT NOT NULL DEFAULT 'month',
    "used" BIGINT NOT NULL DEFAULT 0,
    "resetAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "api_quotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limit_policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "apiProductId" UUID,
    "policyKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scopeType" TEXT NOT NULL DEFAULT 'api_key',
    "limit" INTEGER NOT NULL,
    "windowSeconds" INTEGER NOT NULL,
    "burstLimit" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "enforcementMode" TEXT NOT NULL DEFAULT 'enforce',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "rate_limit_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_access" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "apiProductId" UUID,
    "subscriptionId" UUID,
    "partnerKey" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "partnerType" TEXT NOT NULL DEFAULT 'technology',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "accessLevel" TEXT NOT NULL DEFAULT 'read',
    "approvedByUserId" UUID,
    "approvedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "partner_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_reports" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "reportKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reportType" TEXT NOT NULL DEFAULT 'security',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "summary" TEXT,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "trust_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_certifications" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "trustReportId" UUID,
    "certificationKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "certificationType" TEXT NOT NULL DEFAULT 'security',
    "status" TEXT NOT NULL DEFAULT 'active',
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "scope" JSONB NOT NULL DEFAULT '[]',
    "evidenceUrl" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "security_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_artifacts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "trustReportId" UUID,
    "artifactKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artifactType" TEXT NOT NULL DEFAULT 'policy',
    "framework" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "classification" TEXT NOT NULL DEFAULT 'confidential',
    "storageUri" TEXT,
    "version" TEXT,
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "accessRules" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "compliance_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developer_accounts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "accountKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organizationName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "accountType" TEXT NOT NULL DEFAULT 'partner',
    "verificationStatus" TEXT NOT NULL DEFAULT 'unverified',
    "billingProfile" JSONB NOT NULL DEFAULT '{}',
    "profile" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "developer_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developer_applications" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "developerAccountId" UUID,
    "applicationKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "appType" TEXT NOT NULL DEFAULT 'integration',
    "apiProductIds" JSONB NOT NULL DEFAULT '[]',
    "redirectUris" JSONB NOT NULL DEFAULT '[]',
    "webhookUrl" TEXT,
    "scopes" JSONB NOT NULL DEFAULT '[]',
    "approvalStatus" TEXT NOT NULL DEFAULT 'pending',
    "publishedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "developer_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_documentation" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "documentationKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "apiProductId" UUID,
    "version" TEXT NOT NULL DEFAULT 'v1',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "audience" TEXT NOT NULL DEFAULT 'developers',
    "specFormat" TEXT NOT NULL DEFAULT 'openapi',
    "spec" JSONB NOT NULL DEFAULT '{}',
    "examples" JSONB NOT NULL DEFAULT '[]',
    "content" TEXT,
    "publishedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "api_documentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sdk_packages" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "apiDocumentationId" UUID,
    "packageKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "packageManager" TEXT,
    "downloadUrl" TEXT,
    "checksum" TEXT,
    "releaseNotes" TEXT,
    "publishedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sdk_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_listings" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "listingKey" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "partnerType" TEXT NOT NULL DEFAULT 'technology',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "certificationLevel" TEXT NOT NULL DEFAULT 'standard',
    "countries" JSONB NOT NULL DEFAULT '[]',
    "industries" JSONB NOT NULL DEFAULT '[]',
    "description" TEXT,
    "websiteUrl" TEXT,
    "supportUrl" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "partner_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_applications" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "developerApplicationId" UUID,
    "partnerListingId" UUID,
    "marketplaceKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'integration',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "pricingModel" TEXT NOT NULL DEFAULT 'free',
    "installCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DECIMAL(4,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    "screenshots" JSONB NOT NULL DEFAULT '[]',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "publishedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "marketplace_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_integrations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "partnerListingId" UUID,
    "marketplaceApplicationId" UUID,
    "integrationKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'business',
    "status" TEXT NOT NULL DEFAULT 'available',
    "authType" TEXT NOT NULL DEFAULT 'oauth2',
    "capabilities" JSONB NOT NULL DEFAULT '[]',
    "configurationSchema" JSONB NOT NULL DEFAULT '{}',
    "healthStatus" TEXT NOT NULL DEFAULT 'unknown',
    "lastVerifiedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "external_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_incidents" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "externalIntegrationId" UUID,
    "marketplaceApplicationId" UUID,
    "incidentKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "incidentType" TEXT NOT NULL DEFAULT 'availability',
    "severity" TEXT NOT NULL DEFAULT 'minor',
    "status" TEXT NOT NULL DEFAULT 'investigating',
    "impact" TEXT NOT NULL DEFAULT 'partial',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "updates" JSONB NOT NULL DEFAULT '[]',
    "affectedComponents" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "status_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecosystem_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "developerApplicationId" UUID,
    "externalIntegrationId" UUID,
    "eventKey" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'ecosystem',
    "subjectType" TEXT,
    "subjectId" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ecosystem_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_accounts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerIdentityId" UUID,
    "customerId" UUID,
    "accountKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "legalName" TEXT,
    "accountType" TEXT NOT NULL DEFAULT 'business',
    "status" TEXT NOT NULL DEFAULT 'active',
    "lifecycleStage" TEXT NOT NULL DEFAULT 'active',
    "primaryContactEmail" TEXT,
    "countryCode" TEXT,
    "industry" TEXT,
    "healthScore" DOUBLE PRECISION,
    "successTier" TEXT NOT NULL DEFAULT 'standard',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_workspaces" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerAccountId" UUID,
    "workspaceKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workspaceType" TEXT NOT NULL DEFAULT 'customer',
    "status" TEXT NOT NULL DEFAULT 'active',
    "accessLevel" TEXT NOT NULL DEFAULT 'member',
    "externalWorkspaceRef" TEXT,
    "activatedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "users" JSONB NOT NULL DEFAULT '[]',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_profiles" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerAccountId" UUID,
    "profileKey" TEXT NOT NULL,
    "billingName" TEXT NOT NULL,
    "billingEmail" TEXT NOT NULL,
    "taxId" TEXT,
    "countryCode" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentTerms" TEXT NOT NULL DEFAULT 'net_30',
    "status" TEXT NOT NULL DEFAULT 'active',
    "address" JSONB NOT NULL DEFAULT '{}',
    "taxMetadata" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "billing_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_subscriptions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerAccountId" UUID,
    "billingProfileId" UUID,
    "subscriptionKey" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "planTier" TEXT NOT NULL DEFAULT 'standard',
    "status" TEXT NOT NULL DEFAULT 'active',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "amountMonthly" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "renewsAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "entitlements" JSONB NOT NULL DEFAULT '[]',
    "usageLimits" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerAccountId" UUID,
    "subscriptionId" UUID,
    "billingProfileId" UUID,
    "invoiceKey" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "subtotal" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "amountPaid" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "amountDue" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "issuedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "lineItems" JSONB NOT NULL DEFAULT '[]',
    "taxBreakdown" JSONB NOT NULL DEFAULT '[]',
    "payments" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "invoice_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerAccountId" UUID,
    "billingProfileId" UUID,
    "methodKey" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'stripe',
    "methodType" TEXT NOT NULL DEFAULT 'card',
    "status" TEXT NOT NULL DEFAULT 'active',
    "brand" TEXT,
    "last4" TEXT,
    "expMonth" INTEGER,
    "expYear" INTEGER,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "billingDetails" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_metrics" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "customerAccountId" UUID,
    "subscriptionId" UUID,
    "metricKey" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "metricType" TEXT NOT NULL DEFAULT 'usage',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'count',
    "source" TEXT NOT NULL DEFAULT 'platform',
    "billable" BOOLEAN NOT NULL DEFAULT true,
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "usage_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_accounts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "partnerKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "partnerType" TEXT NOT NULL DEFAULT 'reseller',
    "status" TEXT NOT NULL DEFAULT 'active',
    "tier" TEXT NOT NULL DEFAULT 'standard',
    "primaryEmail" TEXT,
    "countryCode" TEXT,
    "commissionRate" DECIMAL(8,4) NOT NULL DEFAULT 0,
    "portalAccess" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "partner_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_workspaces" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "partnerAccountId" UUID,
    "workspaceKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "accessLevel" TEXT NOT NULL DEFAULT 'partner',
    "portalRole" TEXT NOT NULL DEFAULT 'partner_admin',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "users" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "partner_workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_commissions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "partnerAccountId" UUID,
    "commissionKey" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL DEFAULT 'subscription',
    "sourceId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "grossAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "commissionRate" DECIMAL(8,4) NOT NULL DEFAULT 0,
    "commissionAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "partner_commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_referrals" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "workspaceId" UUID,
    "partnerAccountId" UUID,
    "customerAccountId" UUID,
    "referralKey" TEXT NOT NULL,
    "leadId" UUID,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "source" TEXT NOT NULL DEFAULT 'partner_portal',
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "estimatedValue" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "convertedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "partner_referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE INDEX "Tenant_status_planTier_idx" ON "Tenant"("status", "planTier");

-- CreateIndex
CREATE INDEX "Tenant_countryCode_idx" ON "Tenant"("countryCode");

-- CreateIndex
CREATE INDEX "Tenant_deletedAt_idx" ON "Tenant"("deletedAt");

-- CreateIndex
CREATE INDEX "Organization_tenantId_parentId_idx" ON "Organization"("tenantId", "parentId");

-- CreateIndex
CREATE INDEX "Organization_tenantId_countryCode_idx" ON "Organization"("tenantId", "countryCode");

-- CreateIndex
CREATE INDEX "Organization_tenantId_deletedAt_idx" ON "Organization"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_tenantId_name_key" ON "Organization"("tenantId", "name");

-- CreateIndex
CREATE INDEX "Business_tenantId_businessType_industry_idx" ON "Business"("tenantId", "businessType", "industry");

-- CreateIndex
CREATE INDEX "Business_tenantId_countryCode_idx" ON "Business"("tenantId", "countryCode");

-- CreateIndex
CREATE INDEX "Business_tenantId_deletedAt_idx" ON "Business"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Business_tenantId_organizationId_name_key" ON "Business"("tenantId", "organizationId", "name");

-- CreateIndex
CREATE INDEX "Workspace_tenantId_organizationId_idx" ON "Workspace"("tenantId", "organizationId");

-- CreateIndex
CREATE INDEX "Workspace_tenantId_businessId_idx" ON "Workspace"("tenantId", "businessId");

-- CreateIndex
CREATE INDEX "Workspace_tenantId_deletedAt_idx" ON "Workspace"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_tenantId_slug_key" ON "Workspace"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "User_tenantId_status_idx" ON "User"("tenantId", "status");

-- CreateIndex
CREATE INDEX "User_tenantId_deletedAt_idx" ON "User"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_tenantId_email_key" ON "User"("tenantId", "email");

-- CreateIndex
CREATE INDEX "AuthAccount_tenantId_userId_idx" ON "AuthAccount"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "AuthAccount_tenantId_deletedAt_idx" ON "AuthAccount"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuthAccount_tenantId_provider_providerAccountId_key" ON "AuthAccount"("tenantId", "provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "Credential_tenantId_deletedAt_idx" ON "Credential"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_tenantId_userId_key" ON "Credential"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "Session_tenantId_userId_status_idx" ON "Session"("tenantId", "userId", "status");

-- CreateIndex
CREATE INDEX "Session_tenantId_expiresAt_idx" ON "Session"("tenantId", "expiresAt");

-- CreateIndex
CREATE INDEX "Session_tenantId_revokedAt_idx" ON "Session"("tenantId", "revokedAt");

-- CreateIndex
CREATE INDEX "Membership_tenantId_userId_idx" ON "Membership"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "Membership_tenantId_deletedAt_idx" ON "Membership"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_tenantId_organizationId_userId_key" ON "Membership"("tenantId", "organizationId", "userId");

-- CreateIndex
CREATE INDEX "WorkspaceMember_tenantId_userId_status_idx" ON "WorkspaceMember"("tenantId", "userId", "status");

-- CreateIndex
CREATE INDEX "WorkspaceMember_tenantId_deletedAt_idx" ON "WorkspaceMember"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_tenantId_workspaceId_userId_key" ON "WorkspaceMember"("tenantId", "workspaceId", "userId");

-- CreateIndex
CREATE INDEX "Team_tenantId_workspaceId_idx" ON "Team"("tenantId", "workspaceId");

-- CreateIndex
CREATE INDEX "Team_tenantId_parentId_idx" ON "Team"("tenantId", "parentId");

-- CreateIndex
CREATE INDEX "Team_tenantId_deletedAt_idx" ON "Team"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Team_tenantId_organizationId_name_key" ON "Team"("tenantId", "organizationId", "name");

-- CreateIndex
CREATE INDEX "TeamMember_tenantId_userId_idx" ON "TeamMember"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "TeamMember_tenantId_deletedAt_idx" ON "TeamMember"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_tenantId_teamId_userId_key" ON "TeamMember"("tenantId", "teamId", "userId");

-- CreateIndex
CREATE INDEX "Role_tenantId_isSystem_idx" ON "Role"("tenantId", "isSystem");

-- CreateIndex
CREATE INDEX "Role_tenantId_deletedAt_idx" ON "Role"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Role_tenantId_slug_key" ON "Role"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "Permission_tenantId_resource_action_idx" ON "Permission"("tenantId", "resource", "action");

-- CreateIndex
CREATE INDEX "Permission_tenantId_deletedAt_idx" ON "Permission"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_tenantId_resource_action_scope_key" ON "Permission"("tenantId", "resource", "action", "scope");

-- CreateIndex
CREATE INDEX "RolePermission_tenantId_permissionId_idx" ON "RolePermission"("tenantId", "permissionId");

-- CreateIndex
CREATE INDEX "RolePermission_tenantId_deletedAt_idx" ON "RolePermission"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_tenantId_roleId_permissionId_key" ON "RolePermission"("tenantId", "roleId", "permissionId");

-- CreateIndex
CREATE INDEX "RoleAssignment_tenantId_roleId_idx" ON "RoleAssignment"("tenantId", "roleId");

-- CreateIndex
CREATE INDEX "RoleAssignment_tenantId_membershipId_idx" ON "RoleAssignment"("tenantId", "membershipId");

-- CreateIndex
CREATE INDEX "RoleAssignment_tenantId_workspaceMemberId_idx" ON "RoleAssignment"("tenantId", "workspaceMemberId");

-- CreateIndex
CREATE INDEX "RoleAssignment_tenantId_deletedAt_idx" ON "RoleAssignment"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_actorUserId_createdAt_idx" ON "AuditLog"("tenantId", "actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_resourceType_resourceId_idx" ON "AuditLog"("tenantId", "resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_action_createdAt_idx" ON "AuditLog"("tenantId", "action", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_tenantId_userId_createdAt_idx" ON "ActivityLog"("tenantId", "userId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_tenantId_activityType_createdAt_idx" ON "ActivityLog"("tenantId", "activityType", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_tenantId_resourceType_resourceId_idx" ON "ActivityLog"("tenantId", "resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "Notification_tenantId_userId_status_createdAt_idx" ON "Notification"("tenantId", "userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_tenantId_type_createdAt_idx" ON "Notification"("tenantId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_tenantId_deletedAt_idx" ON "Notification"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "Workflow_tenantId_workspaceId_status_idx" ON "Workflow"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "Workflow_tenantId_deletedAt_idx" ON "Workflow"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_tenantId_slug_version_key" ON "Workflow"("tenantId", "slug", "version");

-- CreateIndex
CREATE INDEX "WorkflowExecution_tenantId_workflowId_status_idx" ON "WorkflowExecution"("tenantId", "workflowId", "status");

-- CreateIndex
CREATE INDEX "WorkflowExecution_tenantId_workspaceId_createdAt_idx" ON "WorkflowExecution"("tenantId", "workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "WorkflowExecution_tenantId_status_createdAt_idx" ON "WorkflowExecution"("tenantId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "WorkflowExecution_tenantId_approvalStatus_idx" ON "WorkflowExecution"("tenantId", "approvalStatus");

-- CreateIndex
CREATE INDEX "WorkflowStepExecution_tenantId_workflowExecutionId_status_idx" ON "WorkflowStepExecution"("tenantId", "workflowExecutionId", "status");

-- CreateIndex
CREATE INDEX "WorkflowStepExecution_tenantId_stepType_createdAt_idx" ON "WorkflowStepExecution"("tenantId", "stepType", "createdAt");

-- CreateIndex
CREATE INDEX "EventBusTopic_tenantId_deletedAt_idx" ON "EventBusTopic"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "EventBusTopic_tenantId_name_key" ON "EventBusTopic"("tenantId", "name");

-- CreateIndex
CREATE INDEX "EventBusSubscription_tenantId_isActive_idx" ON "EventBusSubscription"("tenantId", "isActive");

-- CreateIndex
CREATE INDEX "EventBusSubscription_tenantId_deletedAt_idx" ON "EventBusSubscription"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "EventBusSubscription_tenantId_topicId_subscriberName_key" ON "EventBusSubscription"("tenantId", "topicId", "subscriberName");

-- CreateIndex
CREATE INDEX "Event_tenantId_eventType_createdAt_idx" ON "Event"("tenantId", "eventType", "createdAt");

-- CreateIndex
CREATE INDEX "Event_tenantId_workspaceId_createdAt_idx" ON "Event"("tenantId", "workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "Event_tenantId_topicId_status_idx" ON "Event"("tenantId", "topicId", "status");

-- CreateIndex
CREATE INDEX "Event_tenantId_subjectType_subjectId_idx" ON "Event"("tenantId", "subjectType", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationProvider_key_key" ON "IntegrationProvider"("key");

-- CreateIndex
CREATE INDEX "IntegrationProvider_category_idx" ON "IntegrationProvider"("category");

-- CreateIndex
CREATE INDEX "IntegrationProvider_deletedAt_idx" ON "IntegrationProvider"("deletedAt");

-- CreateIndex
CREATE INDEX "Integration_tenantId_status_idx" ON "Integration"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Integration_tenantId_deletedAt_idx" ON "Integration"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_tenantId_providerId_name_key" ON "Integration"("tenantId", "providerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "ApiKey"("keyHash");

-- CreateIndex
CREATE INDEX "ApiKey_tenantId_userId_idx" ON "ApiKey"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "ApiKey_tenantId_expiresAt_idx" ON "ApiKey"("tenantId", "expiresAt");

-- CreateIndex
CREATE INDEX "ApiKey_tenantId_revokedAt_idx" ON "ApiKey"("tenantId", "revokedAt");

-- CreateIndex
CREATE INDEX "ApiKey_tenantId_deletedAt_idx" ON "ApiKey"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_code_key" ON "SubscriptionPlan"("code");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_tier_idx" ON "SubscriptionPlan"("tier");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_deletedAt_idx" ON "SubscriptionPlan"("deletedAt");

-- CreateIndex
CREATE INDEX "BillingAccount_tenantId_currency_idx" ON "BillingAccount"("tenantId", "currency");

-- CreateIndex
CREATE INDEX "BillingAccount_tenantId_deletedAt_idx" ON "BillingAccount"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "BillingAccount_tenantId_organizationId_key" ON "BillingAccount"("tenantId", "organizationId");

-- CreateIndex
CREATE INDEX "Subscription_tenantId_status_idx" ON "Subscription"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Subscription_tenantId_planId_idx" ON "Subscription"("tenantId", "planId");

-- CreateIndex
CREATE INDEX "Subscription_tenantId_currentPeriodEnd_idx" ON "Subscription"("tenantId", "currentPeriodEnd");

-- CreateIndex
CREATE INDEX "Subscription_tenantId_deletedAt_idx" ON "Subscription"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "UsageRecord_tenantId_subscriptionId_metricKey_idx" ON "UsageRecord"("tenantId", "subscriptionId", "metricKey");

-- CreateIndex
CREATE INDEX "UsageRecord_tenantId_periodStart_periodEnd_idx" ON "UsageRecord"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_workspaceId_status_idx" ON "Invoice"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_billingAccountId_status_idx" ON "Invoice"("tenantId", "billingAccountId", "status");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_customerId_status_idx" ON "Invoice"("tenantId", "customerId", "status");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_countryCode_currency_idx" ON "Invoice"("tenantId", "countryCode", "currency");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_dueAt_idx" ON "Invoice"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_deletedAt_idx" ON "Invoice"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_tenantId_invoiceNumber_key" ON "Invoice"("tenantId", "invoiceNumber");

-- CreateIndex
CREATE INDEX "AiConversation_tenantId_workspaceId_status_idx" ON "AiConversation"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "AiConversation_tenantId_modelKey_idx" ON "AiConversation"("tenantId", "modelKey");

-- CreateIndex
CREATE INDEX "AiConversation_tenantId_deletedAt_idx" ON "AiConversation"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "AiMessage_tenantId_conversationId_createdAt_idx" ON "AiMessage"("tenantId", "conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "AiMessage_tenantId_userId_createdAt_idx" ON "AiMessage"("tenantId", "userId", "createdAt");

-- CreateIndex
CREATE INDEX "AiToolCall_tenantId_conversationId_idx" ON "AiToolCall"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "AiToolCall_tenantId_toolName_status_idx" ON "AiToolCall"("tenantId", "toolName", "status");

-- CreateIndex
CREATE INDEX "AiRecommendation_tenantId_status_priority_idx" ON "AiRecommendation"("tenantId", "status", "priority");

-- CreateIndex
CREATE INDEX "AiRecommendation_tenantId_deletedAt_idx" ON "AiRecommendation"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "AiInsight_tenantId_severity_createdAt_idx" ON "AiInsight"("tenantId", "severity", "createdAt");

-- CreateIndex
CREATE INDEX "AiInsight_tenantId_metricId_idx" ON "AiInsight"("tenantId", "metricId");

-- CreateIndex
CREATE INDEX "AiInsight_tenantId_deletedAt_idx" ON "AiInsight"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "AnalyticsDataset_tenantId_source_idx" ON "AnalyticsDataset"("tenantId", "source");

-- CreateIndex
CREATE INDEX "AnalyticsDataset_tenantId_deletedAt_idx" ON "AnalyticsDataset"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsDataset_tenantId_name_key" ON "AnalyticsDataset"("tenantId", "name");

-- CreateIndex
CREATE INDEX "KpiMetric_tenantId_businessId_idx" ON "KpiMetric"("tenantId", "businessId");

-- CreateIndex
CREATE INDEX "KpiMetric_tenantId_deletedAt_idx" ON "KpiMetric"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "KpiMetric_tenantId_key_key" ON "KpiMetric"("tenantId", "key");

-- CreateIndex
CREATE INDEX "MetricValue_tenantId_metricId_observedAt_idx" ON "MetricValue"("tenantId", "metricId", "observedAt");

-- CreateIndex
CREATE INDEX "MetricValue_tenantId_datasetId_observedAt_idx" ON "MetricValue"("tenantId", "datasetId", "observedAt");

-- CreateIndex
CREATE INDEX "Dashboard_tenantId_workspaceId_idx" ON "Dashboard"("tenantId", "workspaceId");

-- CreateIndex
CREATE INDEX "Dashboard_tenantId_deletedAt_idx" ON "Dashboard"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_tenantId_slug_key" ON "Dashboard"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "DashboardWidget_tenantId_dashboardId_idx" ON "DashboardWidget"("tenantId", "dashboardId");

-- CreateIndex
CREATE INDEX "DashboardWidget_tenantId_metricId_idx" ON "DashboardWidget"("tenantId", "metricId");

-- CreateIndex
CREATE INDEX "DashboardWidget_tenantId_deletedAt_idx" ON "DashboardWidget"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "BusinessModule_tenantId_category_status_idx" ON "BusinessModule"("tenantId", "category", "status");

-- CreateIndex
CREATE INDEX "BusinessModule_tenantId_deletedAt_idx" ON "BusinessModule"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessModule_tenantId_key_key" ON "BusinessModule"("tenantId", "key");

-- CreateIndex
CREATE INDEX "ModuleSetting_tenantId_businessId_idx" ON "ModuleSetting"("tenantId", "businessId");

-- CreateIndex
CREATE INDEX "ModuleSetting_tenantId_deletedAt_idx" ON "ModuleSetting"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleSetting_tenantId_moduleId_businessId_key" ON "ModuleSetting"("tenantId", "moduleId", "businessId");

-- CreateIndex
CREATE INDEX "CrmAccount_tenantId_name_idx" ON "CrmAccount"("tenantId", "name");

-- CreateIndex
CREATE INDEX "CrmAccount_tenantId_ownerUserId_idx" ON "CrmAccount"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "CrmAccount_tenantId_deletedAt_idx" ON "CrmAccount"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "CrmContact_tenantId_accountId_idx" ON "CrmContact"("tenantId", "accountId");

-- CreateIndex
CREATE INDEX "CrmContact_tenantId_email_idx" ON "CrmContact"("tenantId", "email");

-- CreateIndex
CREATE INDEX "CrmContact_tenantId_deletedAt_idx" ON "CrmContact"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "CrmDeal_tenantId_accountId_idx" ON "CrmDeal"("tenantId", "accountId");

-- CreateIndex
CREATE INDEX "CrmDeal_tenantId_stage_closeDate_idx" ON "CrmDeal"("tenantId", "stage", "closeDate");

-- CreateIndex
CREATE INDEX "CrmDeal_tenantId_deletedAt_idx" ON "CrmDeal"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "FinanceAccount_tenantId_type_idx" ON "FinanceAccount"("tenantId", "type");

-- CreateIndex
CREATE INDEX "FinanceAccount_tenantId_deletedAt_idx" ON "FinanceAccount"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FinanceAccount_tenantId_code_key" ON "FinanceAccount"("tenantId", "code");

-- CreateIndex
CREATE INDEX "FinanceTransaction_tenantId_accountId_occurredAt_idx" ON "FinanceTransaction"("tenantId", "accountId", "occurredAt");

-- CreateIndex
CREATE INDEX "FinanceTransaction_tenantId_reference_idx" ON "FinanceTransaction"("tenantId", "reference");

-- CreateIndex
CREATE INDEX "FinanceTransaction_tenantId_deletedAt_idx" ON "FinanceTransaction"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "EmployeeProfile_tenantId_userId_idx" ON "EmployeeProfile"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "EmployeeProfile_tenantId_employmentStatus_idx" ON "EmployeeProfile"("tenantId", "employmentStatus");

-- CreateIndex
CREATE INDEX "EmployeeProfile_tenantId_deletedAt_idx" ON "EmployeeProfile"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeProfile_tenantId_employeeNumber_key" ON "EmployeeProfile"("tenantId", "employeeNumber");

-- CreateIndex
CREATE INDEX "InventoryItem_tenantId_category_idx" ON "InventoryItem"("tenantId", "category");

-- CreateIndex
CREATE INDEX "InventoryItem_tenantId_deletedAt_idx" ON "InventoryItem"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_tenantId_sku_key" ON "InventoryItem"("tenantId", "sku");

-- CreateIndex
CREATE INDEX "InventoryMovement_tenantId_itemId_occurredAt_idx" ON "InventoryMovement"("tenantId", "itemId", "occurredAt");

-- CreateIndex
CREATE INDEX "InventoryMovement_tenantId_movementType_occurredAt_idx" ON "InventoryMovement"("tenantId", "movementType", "occurredAt");

-- CreateIndex
CREATE INDEX "Document_tenantId_documentType_idx" ON "Document"("tenantId", "documentType");

-- CreateIndex
CREATE INDEX "Document_tenantId_title_idx" ON "Document"("tenantId", "title");

-- CreateIndex
CREATE INDEX "Document_tenantId_deletedAt_idx" ON "Document"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "FileAsset_tenantId_workspaceId_idx" ON "FileAsset"("tenantId", "workspaceId");

-- CreateIndex
CREATE INDEX "FileAsset_tenantId_documentId_idx" ON "FileAsset"("tenantId", "documentId");

-- CreateIndex
CREATE INDEX "FileAsset_tenantId_deletedAt_idx" ON "FileAsset"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FileAsset_tenantId_storageKey_key" ON "FileAsset"("tenantId", "storageKey");

-- CreateIndex
CREATE INDEX "Project_tenantId_workspaceId_status_idx" ON "Project"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "Project_tenantId_teamId_idx" ON "Project"("tenantId", "teamId");

-- CreateIndex
CREATE INDEX "Project_tenantId_deletedAt_idx" ON "Project"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "Task_tenantId_workspaceId_status_idx" ON "Task"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "Task_tenantId_projectId_status_idx" ON "Task"("tenantId", "projectId", "status");

-- CreateIndex
CREATE INDEX "Task_tenantId_assigneeUserId_status_idx" ON "Task"("tenantId", "assigneeUserId", "status");

-- CreateIndex
CREATE INDEX "Task_tenantId_dueAt_idx" ON "Task"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "Task_tenantId_deletedAt_idx" ON "Task"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "compliance_frameworks_tenantId_countryCode_idx" ON "compliance_frameworks"("tenantId", "countryCode");

-- CreateIndex
CREATE INDEX "compliance_frameworks_tenantId_deletedAt_idx" ON "compliance_frameworks"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_frameworks_tenantId_key_key" ON "compliance_frameworks"("tenantId", "key");

-- CreateIndex
CREATE INDEX "compliance_controls_tenantId_status_dueAt_idx" ON "compliance_controls"("tenantId", "status", "dueAt");

-- CreateIndex
CREATE INDEX "compliance_controls_tenantId_ownerUserId_idx" ON "compliance_controls"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "compliance_controls_tenantId_deletedAt_idx" ON "compliance_controls"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_controls_tenantId_frameworkId_key_key" ON "compliance_controls"("tenantId", "frameworkId", "key");

-- CreateIndex
CREATE INDEX "SecurityFinding_tenantId_severity_status_idx" ON "SecurityFinding"("tenantId", "severity", "status");

-- CreateIndex
CREATE INDEX "SecurityFinding_tenantId_source_detectedAt_idx" ON "SecurityFinding"("tenantId", "source", "detectedAt");

-- CreateIndex
CREATE INDEX "SecurityFinding_tenantId_ownerUserId_idx" ON "SecurityFinding"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "SecurityFinding_tenantId_deletedAt_idx" ON "SecurityFinding"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ModuleActivation_tenantId_workspaceId_idx" ON "ModuleActivation"("tenantId", "workspaceId");

-- CreateIndex
CREATE INDEX "ModuleActivation_tenantId_businessId_enabled_idx" ON "ModuleActivation"("tenantId", "businessId", "enabled");

-- CreateIndex
CREATE INDEX "ModuleActivation_tenantId_deletedAt_idx" ON "ModuleActivation"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleActivation_tenantId_businessId_moduleKey_key" ON "ModuleActivation"("tenantId", "businessId", "moduleKey");

-- CreateIndex
CREATE INDEX "CrmPipeline_tenantId_workspaceId_idx" ON "CrmPipeline"("tenantId", "workspaceId");

-- CreateIndex
CREATE INDEX "CrmPipeline_tenantId_deletedAt_idx" ON "CrmPipeline"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "CrmLeadRecord_tenantId_workspaceId_status_idx" ON "CrmLeadRecord"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "CrmLeadRecord_tenantId_email_idx" ON "CrmLeadRecord"("tenantId", "email");

-- CreateIndex
CREATE INDEX "CrmLeadRecord_tenantId_deletedAt_idx" ON "CrmLeadRecord"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "CrmCustomerRecord_tenantId_workspaceId_lifecycleStage_idx" ON "CrmCustomerRecord"("tenantId", "workspaceId", "lifecycleStage");

-- CreateIndex
CREATE INDEX "CrmCustomerRecord_tenantId_email_idx" ON "CrmCustomerRecord"("tenantId", "email");

-- CreateIndex
CREATE INDEX "CrmCustomerRecord_tenantId_deletedAt_idx" ON "CrmCustomerRecord"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "CrmOpportunity_tenantId_workspaceId_stage_idx" ON "CrmOpportunity"("tenantId", "workspaceId", "stage");

-- CreateIndex
CREATE INDEX "CrmOpportunity_tenantId_pipelineId_idx" ON "CrmOpportunity"("tenantId", "pipelineId");

-- CreateIndex
CREATE INDEX "CrmOpportunity_tenantId_customerId_idx" ON "CrmOpportunity"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "CrmOpportunity_tenantId_deletedAt_idx" ON "CrmOpportunity"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "FinanceExpense_tenantId_workspaceId_status_idx" ON "FinanceExpense"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "FinanceExpense_tenantId_incurredAt_idx" ON "FinanceExpense"("tenantId", "incurredAt");

-- CreateIndex
CREATE INDEX "FinanceExpense_tenantId_deletedAt_idx" ON "FinanceExpense"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "FinanceRevenue_tenantId_workspaceId_recognizedAt_idx" ON "FinanceRevenue"("tenantId", "workspaceId", "recognizedAt");

-- CreateIndex
CREATE INDEX "FinanceRevenue_tenantId_source_idx" ON "FinanceRevenue"("tenantId", "source");

-- CreateIndex
CREATE INDEX "FinanceRevenue_tenantId_deletedAt_idx" ON "FinanceRevenue"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "CashflowSnapshot_tenantId_workspaceId_periodStart_periodEnd_idx" ON "CashflowSnapshot"("tenantId", "workspaceId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "Department_tenantId_deletedAt_idx" ON "Department"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Department_tenantId_workspaceId_name_key" ON "Department"("tenantId", "workspaceId", "name");

-- CreateIndex
CREATE INDEX "AttendanceRecord_tenantId_workspaceId_employeeId_workDate_idx" ON "AttendanceRecord"("tenantId", "workspaceId", "employeeId", "workDate");

-- CreateIndex
CREATE INDEX "AttendanceRecord_tenantId_status_idx" ON "AttendanceRecord"("tenantId", "status");

-- CreateIndex
CREATE INDEX "AttendanceRecord_tenantId_deletedAt_idx" ON "AttendanceRecord"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "DocumentFolder_tenantId_parentId_idx" ON "DocumentFolder"("tenantId", "parentId");

-- CreateIndex
CREATE INDEX "DocumentFolder_tenantId_deletedAt_idx" ON "DocumentFolder"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentFolder_tenantId_workspaceId_path_key" ON "DocumentFolder"("tenantId", "workspaceId", "path");

-- CreateIndex
CREATE INDEX "UploadRecord_tenantId_workspaceId_status_idx" ON "UploadRecord"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "UploadRecord_tenantId_folderId_idx" ON "UploadRecord"("tenantId", "folderId");

-- CreateIndex
CREATE INDEX "UploadRecord_tenantId_deletedAt_idx" ON "UploadRecord"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "AgentMemory_tenantId_workspaceId_scope_idx" ON "AgentMemory"("tenantId", "workspaceId", "scope");

-- CreateIndex
CREATE INDEX "AgentMemory_tenantId_agentKey_scope_idx" ON "AgentMemory"("tenantId", "agentKey", "scope");

-- CreateIndex
CREATE INDEX "AgentMemory_tenantId_businessId_idx" ON "AgentMemory"("tenantId", "businessId");

-- CreateIndex
CREATE INDEX "AgentMemory_tenantId_conversationId_idx" ON "AgentMemory"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "AgentMemory_tenantId_deletedAt_idx" ON "AgentMemory"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AgentMemory_tenantId_scope_key_workspaceId_agentKey_key" ON "AgentMemory"("tenantId", "scope", "key", "workspaceId", "agentKey");

-- CreateIndex
CREATE INDEX "KpiSnapshot_tenantId_workspaceId_period_periodEnd_idx" ON "KpiSnapshot"("tenantId", "workspaceId", "period", "periodEnd");

-- CreateIndex
CREATE INDEX "KpiSnapshot_tenantId_createdAt_idx" ON "KpiSnapshot"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "ReportRun_tenantId_workspaceId_reportType_createdAt_idx" ON "ReportRun"("tenantId", "workspaceId", "reportType", "createdAt");

-- CreateIndex
CREATE INDEX "ReportRun_tenantId_status_idx" ON "ReportRun"("tenantId", "status");

-- CreateIndex
CREATE INDEX "ReportRun_tenantId_deletedAt_idx" ON "ReportRun"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "PredictiveAlert_tenantId_workspaceId_alertType_status_idx" ON "PredictiveAlert"("tenantId", "workspaceId", "alertType", "status");

-- CreateIndex
CREATE INDEX "PredictiveAlert_tenantId_severity_createdAt_idx" ON "PredictiveAlert"("tenantId", "severity", "createdAt");

-- CreateIndex
CREATE INDEX "PredictiveAlert_tenantId_deletedAt_idx" ON "PredictiveAlert"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "IntegrationSecret_tenantId_integrationId_kind_idx" ON "IntegrationSecret"("tenantId", "integrationId", "kind");

-- CreateIndex
CREATE INDEX "IntegrationSecret_tenantId_fingerprint_idx" ON "IntegrationSecret"("tenantId", "fingerprint");

-- CreateIndex
CREATE INDEX "IntegrationSecret_tenantId_revokedAt_idx" ON "IntegrationSecret"("tenantId", "revokedAt");

-- CreateIndex
CREATE INDEX "IntegrationSecret_tenantId_deletedAt_idx" ON "IntegrationSecret"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "WebhookEndpoint_tenantId_integrationId_idx" ON "WebhookEndpoint"("tenantId", "integrationId");

-- CreateIndex
CREATE INDEX "WebhookEndpoint_tenantId_isActive_idx" ON "WebhookEndpoint"("tenantId", "isActive");

-- CreateIndex
CREATE INDEX "WebhookEndpoint_tenantId_deletedAt_idx" ON "WebhookEndpoint"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "WebhookDelivery_tenantId_endpointId_status_idx" ON "WebhookDelivery"("tenantId", "endpointId", "status");

-- CreateIndex
CREATE INDEX "WebhookDelivery_tenantId_createdAt_idx" ON "WebhookDelivery"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "SyncRun_tenantId_workspaceId_integrationId_status_idx" ON "SyncRun"("tenantId", "workspaceId", "integrationId", "status");

-- CreateIndex
CREATE INDEX "SyncRun_tenantId_mode_createdAt_idx" ON "SyncRun"("tenantId", "mode", "createdAt");

-- CreateIndex
CREATE INDEX "SyncRun_tenantId_deletedAt_idx" ON "SyncRun"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "OperationalMetric_tenantId_name_createdAt_idx" ON "OperationalMetric"("tenantId", "name", "createdAt");

-- CreateIndex
CREATE INDEX "OperationalMetric_name_createdAt_idx" ON "OperationalMetric"("name", "createdAt");

-- CreateIndex
CREATE INDEX "DataRetentionPolicy_tenantId_deletedAt_idx" ON "DataRetentionPolicy"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DataRetentionPolicy_tenantId_resourceType_key" ON "DataRetentionPolicy"("tenantId", "resourceType");

-- CreateIndex
CREATE INDEX "BackupRun_tenantId_backupType_status_idx" ON "BackupRun"("tenantId", "backupType", "status");

-- CreateIndex
CREATE INDEX "BackupRun_tenantId_createdAt_idx" ON "BackupRun"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "BackupRun_tenantId_deletedAt_idx" ON "BackupRun"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "RecoveryRun_tenantId_recoveryType_status_idx" ON "RecoveryRun"("tenantId", "recoveryType", "status");

-- CreateIndex
CREATE INDEX "RecoveryRun_tenantId_backupRunId_idx" ON "RecoveryRun"("tenantId", "backupRunId");

-- CreateIndex
CREATE INDEX "RecoveryRun_tenantId_deletedAt_idx" ON "RecoveryRun"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "WorkspaceBlueprint_tenantId_workspaceId_version_idx" ON "WorkspaceBlueprint"("tenantId", "workspaceId", "version");

-- CreateIndex
CREATE INDEX "WorkspaceBlueprint_tenantId_businessId_idx" ON "WorkspaceBlueprint"("tenantId", "businessId");

-- CreateIndex
CREATE INDEX "WorkspaceBlueprint_tenantId_industry_businessType_idx" ON "WorkspaceBlueprint"("tenantId", "industry", "businessType");

-- CreateIndex
CREATE INDEX "WorkspaceBlueprint_tenantId_deletedAt_idx" ON "WorkspaceBlueprint"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "IndustryTemplate_industry_key" ON "IndustryTemplate"("industry");

-- CreateIndex
CREATE INDEX "IndustryTemplate_industry_deletedAt_idx" ON "IndustryTemplate"("industry", "deletedAt");

-- CreateIndex
CREATE INDEX "ModuleTemplate_industry_deletedAt_idx" ON "ModuleTemplate"("industry", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleTemplate_industry_moduleKey_key" ON "ModuleTemplate"("industry", "moduleKey");

-- CreateIndex
CREATE INDEX "DashboardTemplate_industry_dashboardKey_idx" ON "DashboardTemplate"("industry", "dashboardKey");

-- CreateIndex
CREATE INDEX "DashboardTemplate_industry_roleKey_idx" ON "DashboardTemplate"("industry", "roleKey");

-- CreateIndex
CREATE INDEX "DashboardTemplate_industry_deletedAt_idx" ON "DashboardTemplate"("industry", "deletedAt");

-- CreateIndex
CREATE INDEX "NavigationTemplate_industry_deletedAt_idx" ON "NavigationTemplate"("industry", "deletedAt");

-- CreateIndex
CREATE INDEX "KpiTemplate_industry_deletedAt_idx" ON "KpiTemplate"("industry", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "KpiTemplate_industry_kpiKey_key" ON "KpiTemplate"("industry", "kpiKey");

-- CreateIndex
CREATE INDEX "WorkflowTemplate_industry_deletedAt_idx" ON "WorkflowTemplate"("industry", "deletedAt");

-- CreateIndex
CREATE INDEX "WorkflowTemplate_tenantId_workspaceId_status_idx" ON "WorkflowTemplate"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "WorkflowTemplate_industry_enabled_status_idx" ON "WorkflowTemplate"("industry", "enabled", "status");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowTemplate_industry_workflowKey_key" ON "WorkflowTemplate"("industry", "workflowKey");

-- CreateIndex
CREATE INDEX "RoleTemplate_industry_deletedAt_idx" ON "RoleTemplate"("industry", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RoleTemplate_industry_roleKey_key" ON "RoleTemplate"("industry", "roleKey");

-- CreateIndex
CREATE INDEX "AgentTemplate_industry_deletedAt_idx" ON "AgentTemplate"("industry", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AgentTemplate_industry_agentKey_key" ON "AgentTemplate"("industry", "agentKey");

-- CreateIndex
CREATE INDEX "RecommendationTemplate_tenantId_workspaceId_recommendationT_idx" ON "RecommendationTemplate"("tenantId", "workspaceId", "recommendationType");

-- CreateIndex
CREATE INDEX "RecommendationTemplate_tenantId_businessId_idx" ON "RecommendationTemplate"("tenantId", "businessId");

-- CreateIndex
CREATE INDEX "RecommendationTemplate_recommendationType_deletedAt_idx" ON "RecommendationTemplate"("recommendationType", "deletedAt");

-- CreateIndex
CREATE INDEX "ontology_entities_tenantId_entityType_idx" ON "ontology_entities"("tenantId", "entityType");

-- CreateIndex
CREATE INDEX "ontology_entities_tenantId_sourceId_idx" ON "ontology_entities"("tenantId", "sourceId");

-- CreateIndex
CREATE INDEX "ontology_entities_tenantId_deletedAt_idx" ON "ontology_entities"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ontology_entities_tenantId_entityType_entityKey_key" ON "ontology_entities"("tenantId", "entityType", "entityKey");

-- CreateIndex
CREATE INDEX "ontology_relationships_tenantId_sourceEntityId_relationship_idx" ON "ontology_relationships"("tenantId", "sourceEntityId", "relationshipType");

-- CreateIndex
CREATE INDEX "ontology_relationships_tenantId_targetEntityId_relationship_idx" ON "ontology_relationships"("tenantId", "targetEntityId", "relationshipType");

-- CreateIndex
CREATE INDEX "ontology_relationships_tenantId_deletedAt_idx" ON "ontology_relationships"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "knowledge_nodes_tenantId_nodeType_idx" ON "knowledge_nodes"("tenantId", "nodeType");

-- CreateIndex
CREATE INDEX "knowledge_nodes_tenantId_deletedAt_idx" ON "knowledge_nodes"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_nodes_tenantId_entityId_key" ON "knowledge_nodes"("tenantId", "entityId");

-- CreateIndex
CREATE INDEX "knowledge_edges_tenantId_sourceEntityId_edgeType_idx" ON "knowledge_edges"("tenantId", "sourceEntityId", "edgeType");

-- CreateIndex
CREATE INDEX "knowledge_edges_tenantId_targetEntityId_edgeType_idx" ON "knowledge_edges"("tenantId", "targetEntityId", "edgeType");

-- CreateIndex
CREATE INDEX "knowledge_edges_tenantId_relationshipId_idx" ON "knowledge_edges"("tenantId", "relationshipId");

-- CreateIndex
CREATE INDEX "knowledge_edges_tenantId_deletedAt_idx" ON "knowledge_edges"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "business_contexts_tenantId_workspaceId_contextType_idx" ON "business_contexts"("tenantId", "workspaceId", "contextType");

-- CreateIndex
CREATE INDEX "business_contexts_tenantId_businessId_idx" ON "business_contexts"("tenantId", "businessId");

-- CreateIndex
CREATE INDEX "business_contexts_tenantId_deletedAt_idx" ON "business_contexts"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "entity_links_tenantId_resourceType_resourceId_idx" ON "entity_links"("tenantId", "resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "entity_links_tenantId_deletedAt_idx" ON "entity_links"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "entity_links_tenantId_entityId_resourceType_resourceId_key" ON "entity_links"("tenantId", "entityId", "resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "relationship_templates_industry_sourceType_targetType_idx" ON "relationship_templates"("industry", "sourceType", "targetType");

-- CreateIndex
CREATE INDEX "relationship_templates_relationshipType_idx" ON "relationship_templates"("relationshipType");

-- CreateIndex
CREATE INDEX "relationship_templates_deletedAt_idx" ON "relationship_templates"("deletedAt");

-- CreateIndex
CREATE INDEX "context_snapshots_tenantId_workspaceId_snapshotType_created_idx" ON "context_snapshots"("tenantId", "workspaceId", "snapshotType", "createdAt");

-- CreateIndex
CREATE INDEX "context_snapshots_tenantId_businessId_idx" ON "context_snapshots"("tenantId", "businessId");

-- CreateIndex
CREATE UNIQUE INDEX "industry_knowledge_models_industry_key" ON "industry_knowledge_models"("industry");

-- CreateIndex
CREATE INDEX "industry_knowledge_models_industry_deletedAt_idx" ON "industry_knowledge_models"("industry", "deletedAt");

-- CreateIndex
CREATE INDEX "business_memory_tenantId_workspaceId_memoryType_createdAt_idx" ON "business_memory"("tenantId", "workspaceId", "memoryType", "createdAt");

-- CreateIndex
CREATE INDEX "business_memory_tenantId_entityId_idx" ON "business_memory"("tenantId", "entityId");

-- CreateIndex
CREATE INDEX "business_memory_tenantId_deletedAt_idx" ON "business_memory"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "languages"("code");

-- CreateIndex
CREATE INDEX "languages_enabled_deletedAt_idx" ON "languages"("enabled", "deletedAt");

-- CreateIndex
CREATE INDEX "translations_languageCode_locale_idx" ON "translations"("languageCode", "locale");

-- CreateIndex
CREATE INDEX "translations_namespace_deletedAt_idx" ON "translations"("namespace", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "translations_namespace_languageCode_locale_key" ON "translations"("namespace", "languageCode", "locale");

-- CreateIndex
CREATE INDEX "translation_keys_namespace_deletedAt_idx" ON "translation_keys"("namespace", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "translation_keys_namespace_key_key" ON "translation_keys"("namespace", "key");

-- CreateIndex
CREATE INDEX "translation_values_languageCode_locale_idx" ON "translation_values"("languageCode", "locale");

-- CreateIndex
CREATE INDEX "translation_values_deletedAt_idx" ON "translation_values"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "translation_values_translationKeyId_languageCode_locale_key" ON "translation_values"("translationKeyId", "languageCode", "locale");

-- CreateIndex
CREATE INDEX "locale_profiles_countryCode_timezone_idx" ON "locale_profiles"("countryCode", "timezone");

-- CreateIndex
CREATE INDEX "locale_profiles_languageCode_enabled_idx" ON "locale_profiles"("languageCode", "enabled");

-- CreateIndex
CREATE INDEX "locale_profiles_deletedAt_idx" ON "locale_profiles"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "locale_profiles_locale_countryCode_timezone_key" ON "locale_profiles"("locale", "countryCode", "timezone");

-- CreateIndex
CREATE INDEX "language_preferences_tenantId_countryCode_idx" ON "language_preferences"("tenantId", "countryCode");

-- CreateIndex
CREATE INDEX "language_preferences_tenantId_locale_idx" ON "language_preferences"("tenantId", "locale");

-- CreateIndex
CREATE INDEX "language_preferences_tenantId_deletedAt_idx" ON "language_preferences"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "language_preferences_tenantId_scope_scopeId_key" ON "language_preferences"("tenantId", "scope", "scopeId");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE INDEX "countries_region_enabled_idx" ON "countries"("region", "enabled");

-- CreateIndex
CREATE INDEX "countries_currencyCode_idx" ON "countries"("currencyCode");

-- CreateIndex
CREATE INDEX "countries_deletedAt_idx" ON "countries"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "country_profiles_countryCode_key" ON "country_profiles"("countryCode");

-- CreateIndex
CREATE INDEX "country_profiles_countryCode_deletedAt_idx" ON "country_profiles"("countryCode", "deletedAt");

-- CreateIndex
CREATE INDEX "country_compliance_countryCode_riskLevel_idx" ON "country_compliance"("countryCode", "riskLevel");

-- CreateIndex
CREATE INDEX "country_compliance_deletedAt_idx" ON "country_compliance"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "country_compliance_countryCode_frameworkId_key" ON "country_compliance"("countryCode", "frameworkId");

-- CreateIndex
CREATE INDEX "country_tax_profiles_countryCode_taxSystem_idx" ON "country_tax_profiles"("countryCode", "taxSystem");

-- CreateIndex
CREATE INDEX "country_tax_profiles_countryCode_effectiveFrom_idx" ON "country_tax_profiles"("countryCode", "effectiveFrom");

-- CreateIndex
CREATE INDEX "country_tax_profiles_deletedAt_idx" ON "country_tax_profiles"("deletedAt");

-- CreateIndex
CREATE INDEX "country_business_rules_countryCode_enabled_idx" ON "country_business_rules"("countryCode", "enabled");

-- CreateIndex
CREATE INDEX "country_business_rules_ruleType_deletedAt_idx" ON "country_business_rules"("ruleType", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "country_business_rules_countryCode_ruleType_ruleKey_key" ON "country_business_rules"("countryCode", "ruleType", "ruleKey");

-- CreateIndex
CREATE INDEX "country_holidays_countryCode_observedOn_idx" ON "country_holidays"("countryCode", "observedOn");

-- CreateIndex
CREATE INDEX "country_holidays_region_observedOn_idx" ON "country_holidays"("region", "observedOn");

-- CreateIndex
CREATE INDEX "country_holidays_deletedAt_idx" ON "country_holidays"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "country_holidays_countryCode_region_observedOn_name_key" ON "country_holidays"("countryCode", "region", "observedOn", "name");

-- CreateIndex
CREATE INDEX "compliance_rules_tenantId_countryCode_idx" ON "compliance_rules"("tenantId", "countryCode");

-- CreateIndex
CREATE INDEX "compliance_rules_tenantId_enabled_idx" ON "compliance_rules"("tenantId", "enabled");

-- CreateIndex
CREATE INDEX "compliance_rules_tenantId_deletedAt_idx" ON "compliance_rules"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_rules_tenantId_frameworkId_countryCode_ruleKey_key" ON "compliance_rules"("tenantId", "frameworkId", "countryCode", "ruleKey");

-- CreateIndex
CREATE INDEX "data_policies_tenantId_policyType_idx" ON "data_policies"("tenantId", "policyType");

-- CreateIndex
CREATE INDEX "data_policies_tenantId_deletedAt_idx" ON "data_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_policies_tenantId_countryCode_policyKey_key" ON "data_policies"("tenantId", "countryCode", "policyKey");

-- CreateIndex
CREATE INDEX "retention_policies_tenantId_enabled_idx" ON "retention_policies"("tenantId", "enabled");

-- CreateIndex
CREATE INDEX "retention_policies_tenantId_deletedAt_idx" ON "retention_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "retention_policies_tenantId_countryCode_resourceType_key" ON "retention_policies"("tenantId", "countryCode", "resourceType");

-- CreateIndex
CREATE INDEX "privacy_controls_tenantId_frameworkId_idx" ON "privacy_controls"("tenantId", "frameworkId");

-- CreateIndex
CREATE INDEX "privacy_controls_tenantId_deletedAt_idx" ON "privacy_controls"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "privacy_controls_tenantId_countryCode_controlKey_key" ON "privacy_controls"("tenantId", "countryCode", "controlKey");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- CreateIndex
CREATE INDEX "currencies_enabled_deletedAt_idx" ON "currencies"("enabled", "deletedAt");

-- CreateIndex
CREATE INDEX "exchange_rates_tenantId_baseCurrencyCode_quoteCurrencyCode__idx" ON "exchange_rates"("tenantId", "baseCurrencyCode", "quoteCurrencyCode", "isLatest");

-- CreateIndex
CREATE INDEX "exchange_rates_baseCurrencyCode_quoteCurrencyCode_rateDate_idx" ON "exchange_rates"("baseCurrencyCode", "quoteCurrencyCode", "rateDate");

-- CreateIndex
CREATE INDEX "exchange_rates_tenantId_deletedAt_idx" ON "exchange_rates"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "exchange_rates_tenantId_baseCurrencyCode_quoteCurrencyCode__key" ON "exchange_rates"("tenantId", "baseCurrencyCode", "quoteCurrencyCode", "rateDate", "source");

-- CreateIndex
CREATE INDEX "tax_regions_tenantId_countryCode_regionType_idx" ON "tax_regions"("tenantId", "countryCode", "regionType");

-- CreateIndex
CREATE INDEX "tax_regions_tenantId_deletedAt_idx" ON "tax_regions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "tax_regions_tenantId_countryCode_regionCode_key" ON "tax_regions"("tenantId", "countryCode", "regionCode");

-- CreateIndex
CREATE INDEX "tax_categories_tenantId_exempt_idx" ON "tax_categories"("tenantId", "exempt");

-- CreateIndex
CREATE INDEX "tax_categories_tenantId_deletedAt_idx" ON "tax_categories"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "tax_categories_tenantId_code_key" ON "tax_categories"("tenantId", "code");

-- CreateIndex
CREATE INDEX "tax_rules_tenantId_countryCode_taxType_status_idx" ON "tax_rules"("tenantId", "countryCode", "taxType", "status");

-- CreateIndex
CREATE INDEX "tax_rules_tenantId_regionId_idx" ON "tax_rules"("tenantId", "regionId");

-- CreateIndex
CREATE INDEX "tax_rules_tenantId_taxCategoryId_idx" ON "tax_rules"("tenantId", "taxCategoryId");

-- CreateIndex
CREATE INDEX "tax_rules_tenantId_effectiveFrom_effectiveTo_idx" ON "tax_rules"("tenantId", "effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE INDEX "tax_rules_tenantId_deletedAt_idx" ON "tax_rules"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "invoice_templates_tenantId_countryCode_enabled_idx" ON "invoice_templates"("tenantId", "countryCode", "enabled");

-- CreateIndex
CREATE INDEX "invoice_templates_tenantId_deletedAt_idx" ON "invoice_templates"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_templates_tenantId_workspaceId_countryCode_template_key" ON "invoice_templates"("tenantId", "workspaceId", "countryCode", "templateKey", "version");

-- CreateIndex
CREATE INDEX "invoice_series_tenantId_countryCode_idx" ON "invoice_series"("tenantId", "countryCode");

-- CreateIndex
CREATE INDEX "invoice_series_tenantId_deletedAt_idx" ON "invoice_series"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_series_tenantId_workspaceId_countryCode_seriesKey_key" ON "invoice_series"("tenantId", "workspaceId", "countryCode", "seriesKey");

-- CreateIndex
CREATE INDEX "invoice_items_tenantId_taxCategoryCode_idx" ON "invoice_items"("tenantId", "taxCategoryCode");

-- CreateIndex
CREATE INDEX "invoice_items_tenantId_deletedAt_idx" ON "invoice_items"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_items_tenantId_invoiceId_lineNumber_key" ON "invoice_items"("tenantId", "invoiceId", "lineNumber");

-- CreateIndex
CREATE INDEX "invoice_taxes_tenantId_invoiceId_idx" ON "invoice_taxes"("tenantId", "invoiceId");

-- CreateIndex
CREATE INDEX "invoice_taxes_tenantId_taxRuleId_idx" ON "invoice_taxes"("tenantId", "taxRuleId");

-- CreateIndex
CREATE INDEX "invoice_taxes_tenantId_deletedAt_idx" ON "invoice_taxes"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "invoice_payments_tenantId_invoiceId_status_idx" ON "invoice_payments"("tenantId", "invoiceId", "status");

-- CreateIndex
CREATE INDEX "invoice_payments_tenantId_provider_transactionReference_idx" ON "invoice_payments"("tenantId", "provider", "transactionReference");

-- CreateIndex
CREATE INDEX "invoice_payments_tenantId_reconciliationStatus_idx" ON "invoice_payments"("tenantId", "reconciliationStatus");

-- CreateIndex
CREATE INDEX "invoice_payments_tenantId_deletedAt_idx" ON "invoice_payments"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "invoice_audits_tenantId_invoiceId_createdAt_idx" ON "invoice_audits"("tenantId", "invoiceId", "createdAt");

-- CreateIndex
CREATE INDEX "invoice_audits_tenantId_action_createdAt_idx" ON "invoice_audits"("tenantId", "action", "createdAt");

-- CreateIndex
CREATE INDEX "financial_localization_profiles_tenantId_countryCode_enable_idx" ON "financial_localization_profiles"("tenantId", "countryCode", "enabled");

-- CreateIndex
CREATE INDEX "financial_localization_profiles_tenantId_currencyCode_idx" ON "financial_localization_profiles"("tenantId", "currencyCode");

-- CreateIndex
CREATE INDEX "financial_localization_profiles_tenantId_deletedAt_idx" ON "financial_localization_profiles"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "financial_localization_profiles_tenantId_countryCode_profil_key" ON "financial_localization_profiles"("tenantId", "countryCode", "profileKey");

-- CreateIndex
CREATE INDEX "ai_copilots_tenantId_businessId_idx" ON "ai_copilots"("tenantId", "businessId");

-- CreateIndex
CREATE INDEX "ai_copilots_tenantId_status_idx" ON "ai_copilots"("tenantId", "status");

-- CreateIndex
CREATE INDEX "ai_copilots_tenantId_deletedAt_idx" ON "ai_copilots"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_copilots_tenantId_workspaceId_copilotKey_key" ON "ai_copilots"("tenantId", "workspaceId", "copilotKey");

-- CreateIndex
CREATE INDEX "ai_memory_tenantId_workspaceId_memoryType_importance_idx" ON "ai_memory"("tenantId", "workspaceId", "memoryType", "importance");

-- CreateIndex
CREATE INDEX "ai_memory_tenantId_businessId_memoryType_idx" ON "ai_memory"("tenantId", "businessId", "memoryType");

-- CreateIndex
CREATE INDEX "ai_memory_tenantId_departmentId_idx" ON "ai_memory"("tenantId", "departmentId");

-- CreateIndex
CREATE INDEX "ai_memory_tenantId_userId_idx" ON "ai_memory"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "ai_memory_tenantId_conversationId_idx" ON "ai_memory"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "ai_memory_tenantId_deletedAt_idx" ON "ai_memory"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_contexts_tenantId_workspaceId_contextType_createdAt_idx" ON "ai_contexts"("tenantId", "workspaceId", "contextType", "createdAt");

-- CreateIndex
CREATE INDEX "ai_contexts_tenantId_businessId_idx" ON "ai_contexts"("tenantId", "businessId");

-- CreateIndex
CREATE INDEX "ai_contexts_tenantId_conversationId_idx" ON "ai_contexts"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "ai_contexts_tenantId_userId_idx" ON "ai_contexts"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "ai_contexts_tenantId_deletedAt_idx" ON "ai_contexts"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_task_suggestions_tenantId_workspaceId_priority_status_idx" ON "ai_task_suggestions"("tenantId", "workspaceId", "priority", "status");

-- CreateIndex
CREATE INDEX "ai_task_suggestions_tenantId_recommendationId_idx" ON "ai_task_suggestions"("tenantId", "recommendationId");

-- CreateIndex
CREATE INDEX "ai_task_suggestions_tenantId_userId_idx" ON "ai_task_suggestions"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "ai_task_suggestions_tenantId_deletedAt_idx" ON "ai_task_suggestions"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_workflow_suggestions_tenantId_workspaceId_status_idx" ON "ai_workflow_suggestions"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "ai_workflow_suggestions_tenantId_workflowKey_idx" ON "ai_workflow_suggestions"("tenantId", "workflowKey");

-- CreateIndex
CREATE INDEX "ai_workflow_suggestions_tenantId_recommendationId_idx" ON "ai_workflow_suggestions"("tenantId", "recommendationId");

-- CreateIndex
CREATE INDEX "ai_workflow_suggestions_tenantId_deletedAt_idx" ON "ai_workflow_suggestions"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_risk_assessments_tenantId_workspaceId_riskType_status_idx" ON "ai_risk_assessments"("tenantId", "workspaceId", "riskType", "status");

-- CreateIndex
CREATE INDEX "ai_risk_assessments_tenantId_severity_score_idx" ON "ai_risk_assessments"("tenantId", "severity", "score");

-- CreateIndex
CREATE INDEX "ai_risk_assessments_tenantId_businessId_idx" ON "ai_risk_assessments"("tenantId", "businessId");

-- CreateIndex
CREATE INDEX "ai_risk_assessments_tenantId_deletedAt_idx" ON "ai_risk_assessments"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_opportunities_tenantId_workspaceId_opportunityType_statu_idx" ON "ai_opportunities"("tenantId", "workspaceId", "opportunityType", "status");

-- CreateIndex
CREATE INDEX "ai_opportunities_tenantId_confidence_idx" ON "ai_opportunities"("tenantId", "confidence");

-- CreateIndex
CREATE INDEX "ai_opportunities_tenantId_businessId_idx" ON "ai_opportunities"("tenantId", "businessId");

-- CreateIndex
CREATE INDEX "ai_opportunities_tenantId_deletedAt_idx" ON "ai_opportunities"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_knowledge_references_tenantId_workspaceId_sourceType_idx" ON "ai_knowledge_references"("tenantId", "workspaceId", "sourceType");

-- CreateIndex
CREATE INDEX "ai_knowledge_references_tenantId_conversationId_idx" ON "ai_knowledge_references"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "ai_knowledge_references_tenantId_messageId_idx" ON "ai_knowledge_references"("tenantId", "messageId");

-- CreateIndex
CREATE INDEX "ai_knowledge_references_tenantId_contextId_idx" ON "ai_knowledge_references"("tenantId", "contextId");

-- CreateIndex
CREATE INDEX "ai_knowledge_references_tenantId_deletedAt_idx" ON "ai_knowledge_references"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_prompt_logs_tenantId_workspaceId_createdAt_idx" ON "ai_prompt_logs"("tenantId", "workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "ai_prompt_logs_tenantId_conversationId_idx" ON "ai_prompt_logs"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "ai_prompt_logs_tenantId_provider_modelKey_idx" ON "ai_prompt_logs"("tenantId", "provider", "modelKey");

-- CreateIndex
CREATE INDEX "ai_action_logs_tenantId_workspaceId_actionType_status_idx" ON "ai_action_logs"("tenantId", "workspaceId", "actionType", "status");

-- CreateIndex
CREATE INDEX "ai_action_logs_tenantId_userId_idx" ON "ai_action_logs"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "ai_action_logs_tenantId_conversationId_idx" ON "ai_action_logs"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "ai_action_logs_tenantId_deletedAt_idx" ON "ai_action_logs"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_agents_tenantId_agentType_status_idx" ON "ai_agents"("tenantId", "agentType", "status");

-- CreateIndex
CREATE INDEX "ai_agents_tenantId_roleId_idx" ON "ai_agents"("tenantId", "roleId");

-- CreateIndex
CREATE INDEX "ai_agents_tenantId_deletedAt_idx" ON "ai_agents"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_agents_tenantId_workspaceId_agentKey_key" ON "ai_agents"("tenantId", "workspaceId", "agentKey");

-- CreateIndex
CREATE INDEX "ai_agent_roles_tenantId_deletedAt_idx" ON "ai_agent_roles"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_agent_roles_tenantId_roleKey_key" ON "ai_agent_roles"("tenantId", "roleKey");

-- CreateIndex
CREATE INDEX "ai_agent_capabilities_tenantId_riskLevel_idx" ON "ai_agent_capabilities"("tenantId", "riskLevel");

-- CreateIndex
CREATE INDEX "ai_agent_capabilities_tenantId_deletedAt_idx" ON "ai_agent_capabilities"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_agent_capabilities_tenantId_capabilityKey_key" ON "ai_agent_capabilities"("tenantId", "capabilityKey");

-- CreateIndex
CREATE INDEX "ai_agent_executions_tenantId_workspaceId_status_idx" ON "ai_agent_executions"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "ai_agent_executions_tenantId_agentId_status_idx" ON "ai_agent_executions"("tenantId", "agentId", "status");

-- CreateIndex
CREATE INDEX "ai_agent_executions_tenantId_riskLevel_approvalStatus_idx" ON "ai_agent_executions"("tenantId", "riskLevel", "approvalStatus");

-- CreateIndex
CREATE INDEX "ai_agent_executions_tenantId_queueName_queuedAt_idx" ON "ai_agent_executions"("tenantId", "queueName", "queuedAt");

-- CreateIndex
CREATE INDEX "ai_agent_executions_tenantId_deletedAt_idx" ON "ai_agent_executions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_agent_executions_tenantId_executionKey_key" ON "ai_agent_executions"("tenantId", "executionKey");

-- CreateIndex
CREATE INDEX "ai_agent_approvals_tenantId_workspaceId_status_idx" ON "ai_agent_approvals"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "ai_agent_approvals_tenantId_executionId_idx" ON "ai_agent_approvals"("tenantId", "executionId");

-- CreateIndex
CREATE INDEX "ai_agent_approvals_tenantId_approverUserId_status_idx" ON "ai_agent_approvals"("tenantId", "approverUserId", "status");

-- CreateIndex
CREATE INDEX "ai_agent_approvals_tenantId_deletedAt_idx" ON "ai_agent_approvals"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_agent_tasks_tenantId_workspaceId_status_idx" ON "ai_agent_tasks"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "ai_agent_tasks_tenantId_executionId_idx" ON "ai_agent_tasks"("tenantId", "executionId");

-- CreateIndex
CREATE INDEX "ai_agent_tasks_tenantId_assignedToUserId_status_idx" ON "ai_agent_tasks"("tenantId", "assignedToUserId", "status");

-- CreateIndex
CREATE INDEX "ai_agent_tasks_tenantId_deletedAt_idx" ON "ai_agent_tasks"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_agent_workflows_tenantId_workspaceId_status_idx" ON "ai_agent_workflows"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "ai_agent_workflows_tenantId_executionId_idx" ON "ai_agent_workflows"("tenantId", "executionId");

-- CreateIndex
CREATE INDEX "ai_agent_workflows_tenantId_workflowKey_idx" ON "ai_agent_workflows"("tenantId", "workflowKey");

-- CreateIndex
CREATE INDEX "ai_agent_workflows_tenantId_deletedAt_idx" ON "ai_agent_workflows"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_agent_memory_tenantId_agentId_memoryType_idx" ON "ai_agent_memory"("tenantId", "agentId", "memoryType");

-- CreateIndex
CREATE INDEX "ai_agent_memory_tenantId_executionId_idx" ON "ai_agent_memory"("tenantId", "executionId");

-- CreateIndex
CREATE INDEX "ai_agent_memory_tenantId_outcomeId_idx" ON "ai_agent_memory"("tenantId", "outcomeId");

-- CreateIndex
CREATE INDEX "ai_agent_memory_tenantId_deletedAt_idx" ON "ai_agent_memory"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_agent_memory_tenantId_workspaceId_agentId_memoryType_key_key" ON "ai_agent_memory"("tenantId", "workspaceId", "agentId", "memoryType", "key");

-- CreateIndex
CREATE INDEX "ai_agent_decisions_tenantId_workspaceId_createdAt_idx" ON "ai_agent_decisions"("tenantId", "workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "ai_agent_decisions_tenantId_agentId_idx" ON "ai_agent_decisions"("tenantId", "agentId");

-- CreateIndex
CREATE INDEX "ai_agent_decisions_tenantId_executionId_idx" ON "ai_agent_decisions"("tenantId", "executionId");

-- CreateIndex
CREATE INDEX "ai_agent_decisions_tenantId_confidenceScore_idx" ON "ai_agent_decisions"("tenantId", "confidenceScore");

-- CreateIndex
CREATE INDEX "ai_agent_decisions_tenantId_deletedAt_idx" ON "ai_agent_decisions"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_agent_outcomes_tenantId_workspaceId_status_idx" ON "ai_agent_outcomes"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "ai_agent_outcomes_tenantId_agentId_idx" ON "ai_agent_outcomes"("tenantId", "agentId");

-- CreateIndex
CREATE INDEX "ai_agent_outcomes_tenantId_deletedAt_idx" ON "ai_agent_outcomes"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_agent_outcomes_tenantId_executionId_key" ON "ai_agent_outcomes"("tenantId", "executionId");

-- CreateIndex
CREATE INDEX "ai_agent_audits_tenantId_workspaceId_action_createdAt_idx" ON "ai_agent_audits"("tenantId", "workspaceId", "action", "createdAt");

-- CreateIndex
CREATE INDEX "ai_agent_audits_tenantId_agentId_idx" ON "ai_agent_audits"("tenantId", "agentId");

-- CreateIndex
CREATE INDEX "ai_agent_audits_tenantId_executionId_idx" ON "ai_agent_audits"("tenantId", "executionId");

-- CreateIndex
CREATE INDEX "ai_agent_audits_tenantId_actorUserId_idx" ON "ai_agent_audits"("tenantId", "actorUserId");

-- CreateIndex
CREATE INDEX "ai_agent_audits_tenantId_deletedAt_idx" ON "ai_agent_audits"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "workflow_definitions_tenantId_workspaceId_status_idx" ON "workflow_definitions"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "workflow_definitions_tenantId_workflowId_idx" ON "workflow_definitions"("tenantId", "workflowId");

-- CreateIndex
CREATE INDEX "workflow_definitions_tenantId_industry_idx" ON "workflow_definitions"("tenantId", "industry");

-- CreateIndex
CREATE INDEX "workflow_definitions_tenantId_deletedAt_idx" ON "workflow_definitions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_definitions_tenantId_slug_version_key" ON "workflow_definitions"("tenantId", "slug", "version");

-- CreateIndex
CREATE INDEX "workflow_nodes_tenantId_workspaceId_nodeType_idx" ON "workflow_nodes"("tenantId", "workspaceId", "nodeType");

-- CreateIndex
CREATE INDEX "workflow_nodes_tenantId_definitionId_idx" ON "workflow_nodes"("tenantId", "definitionId");

-- CreateIndex
CREATE INDEX "workflow_nodes_tenantId_deletedAt_idx" ON "workflow_nodes"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_nodes_tenantId_definitionId_nodeKey_key" ON "workflow_nodes"("tenantId", "definitionId", "nodeKey");

-- CreateIndex
CREATE INDEX "workflow_edges_tenantId_definitionId_idx" ON "workflow_edges"("tenantId", "definitionId");

-- CreateIndex
CREATE INDEX "workflow_edges_tenantId_sourceNodeKey_targetNodeKey_idx" ON "workflow_edges"("tenantId", "sourceNodeKey", "targetNodeKey");

-- CreateIndex
CREATE INDEX "workflow_edges_tenantId_deletedAt_idx" ON "workflow_edges"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_edges_tenantId_definitionId_edgeKey_key" ON "workflow_edges"("tenantId", "definitionId", "edgeKey");

-- CreateIndex
CREATE INDEX "workflow_approvals_tenantId_workspaceId_status_idx" ON "workflow_approvals"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "workflow_approvals_tenantId_workflowExecutionId_idx" ON "workflow_approvals"("tenantId", "workflowExecutionId");

-- CreateIndex
CREATE INDEX "workflow_approvals_tenantId_workflowId_idx" ON "workflow_approvals"("tenantId", "workflowId");

-- CreateIndex
CREATE INDEX "workflow_approvals_tenantId_approverUserId_status_idx" ON "workflow_approvals"("tenantId", "approverUserId", "status");

-- CreateIndex
CREATE INDEX "workflow_approvals_tenantId_deletedAt_idx" ON "workflow_approvals"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "workflow_metrics_tenantId_workspaceId_metricKey_observedAt_idx" ON "workflow_metrics"("tenantId", "workspaceId", "metricKey", "observedAt");

-- CreateIndex
CREATE INDEX "workflow_metrics_tenantId_workflowId_metricKey_idx" ON "workflow_metrics"("tenantId", "workflowId", "metricKey");

-- CreateIndex
CREATE INDEX "workflow_metrics_tenantId_workflowExecutionId_idx" ON "workflow_metrics"("tenantId", "workflowExecutionId");

-- CreateIndex
CREATE INDEX "workflow_metrics_tenantId_deletedAt_idx" ON "workflow_metrics"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "workflow_audits_tenantId_workspaceId_action_createdAt_idx" ON "workflow_audits"("tenantId", "workspaceId", "action", "createdAt");

-- CreateIndex
CREATE INDEX "workflow_audits_tenantId_workflowId_idx" ON "workflow_audits"("tenantId", "workflowId");

-- CreateIndex
CREATE INDEX "workflow_audits_tenantId_workflowExecutionId_idx" ON "workflow_audits"("tenantId", "workflowExecutionId");

-- CreateIndex
CREATE INDEX "workflow_audits_tenantId_actorUserId_idx" ON "workflow_audits"("tenantId", "actorUserId");

-- CreateIndex
CREATE INDEX "workflow_audits_tenantId_deletedAt_idx" ON "workflow_audits"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "admin_operations_tenantId_workspaceId_operationType_status_idx" ON "admin_operations"("tenantId", "workspaceId", "operationType", "status");

-- CreateIndex
CREATE INDEX "admin_operations_tenantId_targetType_targetId_idx" ON "admin_operations"("tenantId", "targetType", "targetId");

-- CreateIndex
CREATE INDEX "admin_operations_tenantId_requestedByUserId_idx" ON "admin_operations"("tenantId", "requestedByUserId");

-- CreateIndex
CREATE INDEX "admin_operations_tenantId_deletedAt_idx" ON "admin_operations"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "deployment_environments_tenantId_environmentType_status_idx" ON "deployment_environments"("tenantId", "environmentType", "status");

-- CreateIndex
CREATE INDEX "deployment_environments_tenantId_deletedAt_idx" ON "deployment_environments"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "deployment_environments_tenantId_slug_key" ON "deployment_environments"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "release_controls_tenantId_environmentId_status_idx" ON "release_controls"("tenantId", "environmentId", "status");

-- CreateIndex
CREATE INDEX "release_controls_tenantId_version_idx" ON "release_controls"("tenantId", "version");

-- CreateIndex
CREATE INDEX "release_controls_tenantId_deletedAt_idx" ON "release_controls"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "feature_flags_tenantId_workspaceId_enabled_idx" ON "feature_flags"("tenantId", "workspaceId", "enabled");

-- CreateIndex
CREATE INDEX "feature_flags_tenantId_deletedAt_idx" ON "feature_flags"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_tenantId_workspaceId_flagKey_key" ON "feature_flags"("tenantId", "workspaceId", "flagKey");

-- CreateIndex
CREATE INDEX "change_requests_tenantId_environmentId_status_idx" ON "change_requests"("tenantId", "environmentId", "status");

-- CreateIndex
CREATE INDEX "change_requests_tenantId_releaseId_idx" ON "change_requests"("tenantId", "releaseId");

-- CreateIndex
CREATE INDEX "change_requests_tenantId_riskLevel_status_idx" ON "change_requests"("tenantId", "riskLevel", "status");

-- CreateIndex
CREATE INDEX "change_requests_tenantId_deletedAt_idx" ON "change_requests"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "admin_incidents_tenantId_workspaceId_severity_status_idx" ON "admin_incidents"("tenantId", "workspaceId", "severity", "status");

-- CreateIndex
CREATE INDEX "admin_incidents_tenantId_ownerUserId_idx" ON "admin_incidents"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "admin_incidents_tenantId_detectedAt_idx" ON "admin_incidents"("tenantId", "detectedAt");

-- CreateIndex
CREATE INDEX "admin_incidents_tenantId_deletedAt_idx" ON "admin_incidents"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "tenant_suspensions_tenantId_status_idx" ON "tenant_suspensions"("tenantId", "status");

-- CreateIndex
CREATE INDEX "tenant_suspensions_tenantId_suspendedAt_idx" ON "tenant_suspensions"("tenantId", "suspendedAt");

-- CreateIndex
CREATE INDEX "tenant_suspensions_tenantId_deletedAt_idx" ON "tenant_suspensions"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "emergency_controls_tenantId_status_idx" ON "emergency_controls"("tenantId", "status");

-- CreateIndex
CREATE INDEX "emergency_controls_tenantId_scope_idx" ON "emergency_controls"("tenantId", "scope");

-- CreateIndex
CREATE INDEX "emergency_controls_tenantId_deletedAt_idx" ON "emergency_controls"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_controls_tenantId_controlKey_key" ON "emergency_controls"("tenantId", "controlKey");

-- CreateIndex
CREATE INDEX "system_health_snapshots_tenantId_workspaceId_component_obse_idx" ON "system_health_snapshots"("tenantId", "workspaceId", "component", "observedAt");

-- CreateIndex
CREATE INDEX "system_health_snapshots_tenantId_status_observedAt_idx" ON "system_health_snapshots"("tenantId", "status", "observedAt");

-- CreateIndex
CREATE INDEX "system_health_snapshots_tenantId_deletedAt_idx" ON "system_health_snapshots"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_usage_snapshots_tenantId_workspaceId_periodStart_periodE_idx" ON "ai_usage_snapshots"("tenantId", "workspaceId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "ai_usage_snapshots_tenantId_provider_model_idx" ON "ai_usage_snapshots"("tenantId", "provider", "model");

-- CreateIndex
CREATE INDEX "ai_usage_snapshots_tenantId_deletedAt_idx" ON "ai_usage_snapshots"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "data_import_jobs_tenantId_workspaceId_status_idx" ON "data_import_jobs"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "data_import_jobs_tenantId_targetEntity_createdAt_idx" ON "data_import_jobs"("tenantId", "targetEntity", "createdAt");

-- CreateIndex
CREATE INDEX "data_import_jobs_tenantId_deletedAt_idx" ON "data_import_jobs"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "data_import_batches_tenantId_workspaceId_status_idx" ON "data_import_batches"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "data_import_batches_tenantId_deletedAt_idx" ON "data_import_batches"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_import_batches_tenantId_importJobId_batchNumber_key" ON "data_import_batches"("tenantId", "importJobId", "batchNumber");

-- CreateIndex
CREATE INDEX "data_import_records_tenantId_targetEntity_status_idx" ON "data_import_records"("tenantId", "targetEntity", "status");

-- CreateIndex
CREATE INDEX "data_import_records_tenantId_targetId_idx" ON "data_import_records"("tenantId", "targetId");

-- CreateIndex
CREATE INDEX "data_import_records_tenantId_deletedAt_idx" ON "data_import_records"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_import_records_tenantId_importJobId_rowNumber_key" ON "data_import_records"("tenantId", "importJobId", "rowNumber");

-- CreateIndex
CREATE INDEX "data_import_errors_tenantId_importJobId_severity_idx" ON "data_import_errors"("tenantId", "importJobId", "severity");

-- CreateIndex
CREATE INDEX "data_import_errors_tenantId_code_idx" ON "data_import_errors"("tenantId", "code");

-- CreateIndex
CREATE INDEX "data_import_errors_tenantId_deletedAt_idx" ON "data_import_errors"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "migration_connections_tenantId_provider_status_idx" ON "migration_connections"("tenantId", "provider", "status");

-- CreateIndex
CREATE INDEX "migration_connections_tenantId_deletedAt_idx" ON "migration_connections"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "migration_connections_tenantId_workspaceId_provider_name_key" ON "migration_connections"("tenantId", "workspaceId", "provider", "name");

-- CreateIndex
CREATE INDEX "migration_runs_tenantId_workspaceId_provider_status_idx" ON "migration_runs"("tenantId", "workspaceId", "provider", "status");

-- CreateIndex
CREATE INDEX "migration_runs_tenantId_targetEntity_createdAt_idx" ON "migration_runs"("tenantId", "targetEntity", "createdAt");

-- CreateIndex
CREATE INDEX "migration_runs_tenantId_deletedAt_idx" ON "migration_runs"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "migration_mappings_tenantId_provider_enabled_idx" ON "migration_mappings"("tenantId", "provider", "enabled");

-- CreateIndex
CREATE INDEX "migration_mappings_tenantId_deletedAt_idx" ON "migration_mappings"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "migration_mappings_tenantId_workspaceId_provider_sourceObje_key" ON "migration_mappings"("tenantId", "workspaceId", "provider", "sourceObject", "targetEntity");

-- CreateIndex
CREATE INDEX "onboarding_profiles_tenantId_organizationId_status_idx" ON "onboarding_profiles"("tenantId", "organizationId", "status");

-- CreateIndex
CREATE INDEX "onboarding_profiles_tenantId_workspaceId_idx" ON "onboarding_profiles"("tenantId", "workspaceId");

-- CreateIndex
CREATE INDEX "onboarding_profiles_tenantId_industry_idx" ON "onboarding_profiles"("tenantId", "industry");

-- CreateIndex
CREATE INDEX "onboarding_profiles_tenantId_deletedAt_idx" ON "onboarding_profiles"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "onboarding_steps_tenantId_status_idx" ON "onboarding_steps"("tenantId", "status");

-- CreateIndex
CREATE INDEX "onboarding_steps_tenantId_deletedAt_idx" ON "onboarding_steps"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_steps_tenantId_onboardingProfileId_stepKey_key" ON "onboarding_steps"("tenantId", "onboardingProfileId", "stepKey");

-- CreateIndex
CREATE INDEX "onboarding_recommendations_tenantId_onboardingProfileId_rec_idx" ON "onboarding_recommendations"("tenantId", "onboardingProfileId", "recommendationType");

-- CreateIndex
CREATE INDEX "onboarding_recommendations_tenantId_status_idx" ON "onboarding_recommendations"("tenantId", "status");

-- CreateIndex
CREATE INDEX "onboarding_recommendations_tenantId_deletedAt_idx" ON "onboarding_recommendations"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "marketplace_apps_tenantId_status_category_idx" ON "marketplace_apps"("tenantId", "status", "category");

-- CreateIndex
CREATE INDEX "marketplace_apps_tenantId_visibility_publishedAt_idx" ON "marketplace_apps"("tenantId", "visibility", "publishedAt");

-- CreateIndex
CREATE INDEX "marketplace_apps_tenantId_partnerProfileId_idx" ON "marketplace_apps"("tenantId", "partnerProfileId");

-- CreateIndex
CREATE INDEX "marketplace_apps_tenantId_deletedAt_idx" ON "marketplace_apps"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_apps_tenantId_appKey_key" ON "marketplace_apps"("tenantId", "appKey");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_apps_tenantId_slug_key" ON "marketplace_apps"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "marketplace_app_versions_tenantId_appId_status_idx" ON "marketplace_app_versions"("tenantId", "appId", "status");

-- CreateIndex
CREATE INDEX "marketplace_app_versions_tenantId_publishedAt_idx" ON "marketplace_app_versions"("tenantId", "publishedAt");

-- CreateIndex
CREATE INDEX "marketplace_app_versions_tenantId_deletedAt_idx" ON "marketplace_app_versions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_app_versions_tenantId_appId_version_key" ON "marketplace_app_versions"("tenantId", "appId", "version");

-- CreateIndex
CREATE INDEX "marketplace_installations_tenantId_workspaceId_status_idx" ON "marketplace_installations"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "marketplace_installations_tenantId_appId_status_idx" ON "marketplace_installations"("tenantId", "appId", "status");

-- CreateIndex
CREATE INDEX "marketplace_installations_tenantId_installationScope_idx" ON "marketplace_installations"("tenantId", "installationScope");

-- CreateIndex
CREATE INDEX "marketplace_installations_tenantId_healthStatus_idx" ON "marketplace_installations"("tenantId", "healthStatus");

-- CreateIndex
CREATE INDEX "marketplace_installations_tenantId_deletedAt_idx" ON "marketplace_installations"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "marketplace_permissions_tenantId_category_riskLevel_idx" ON "marketplace_permissions"("tenantId", "category", "riskLevel");

-- CreateIndex
CREATE INDEX "marketplace_permissions_tenantId_required_idx" ON "marketplace_permissions"("tenantId", "required");

-- CreateIndex
CREATE INDEX "marketplace_permissions_tenantId_deletedAt_idx" ON "marketplace_permissions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_permissions_tenantId_appId_permissionKey_key" ON "marketplace_permissions"("tenantId", "appId", "permissionKey");

-- CreateIndex
CREATE INDEX "extension_definitions_tenantId_appId_idx" ON "extension_definitions"("tenantId", "appId");

-- CreateIndex
CREATE INDEX "extension_definitions_tenantId_moduleKey_extensionType_idx" ON "extension_definitions"("tenantId", "moduleKey", "extensionType");

-- CreateIndex
CREATE INDEX "extension_definitions_tenantId_status_idx" ON "extension_definitions"("tenantId", "status");

-- CreateIndex
CREATE INDEX "extension_definitions_tenantId_deletedAt_idx" ON "extension_definitions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "extension_definitions_tenantId_extensionKey_key" ON "extension_definitions"("tenantId", "extensionKey");

-- CreateIndex
CREATE INDEX "extension_hooks_tenantId_hookType_enabled_idx" ON "extension_hooks"("tenantId", "hookType", "enabled");

-- CreateIndex
CREATE INDEX "extension_hooks_tenantId_target_idx" ON "extension_hooks"("tenantId", "target");

-- CreateIndex
CREATE INDEX "extension_hooks_tenantId_deletedAt_idx" ON "extension_hooks"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "extension_hooks_tenantId_extensionId_hookKey_key" ON "extension_hooks"("tenantId", "extensionId", "hookKey");

-- CreateIndex
CREATE INDEX "extension_points_tenantId_pointType_enabled_idx" ON "extension_points"("tenantId", "pointType", "enabled");

-- CreateIndex
CREATE INDEX "extension_points_tenantId_moduleKey_idx" ON "extension_points"("tenantId", "moduleKey");

-- CreateIndex
CREATE INDEX "extension_points_tenantId_deletedAt_idx" ON "extension_points"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "extension_points_tenantId_pointKey_key" ON "extension_points"("tenantId", "pointKey");

-- CreateIndex
CREATE INDEX "partner_profiles_tenantId_partnerType_status_idx" ON "partner_profiles"("tenantId", "partnerType", "status");

-- CreateIndex
CREATE INDEX "partner_profiles_tenantId_tier_idx" ON "partner_profiles"("tenantId", "tier");

-- CreateIndex
CREATE INDEX "partner_profiles_tenantId_countryCode_idx" ON "partner_profiles"("tenantId", "countryCode");

-- CreateIndex
CREATE INDEX "partner_profiles_tenantId_deletedAt_idx" ON "partner_profiles"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "partner_profiles_tenantId_partnerKey_key" ON "partner_profiles"("tenantId", "partnerKey");

-- CreateIndex
CREATE INDEX "partner_certifications_tenantId_certificationType_status_idx" ON "partner_certifications"("tenantId", "certificationType", "status");

-- CreateIndex
CREATE INDEX "partner_certifications_tenantId_expiresAt_idx" ON "partner_certifications"("tenantId", "expiresAt");

-- CreateIndex
CREATE INDEX "partner_certifications_tenantId_deletedAt_idx" ON "partner_certifications"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "partner_certifications_tenantId_partnerProfileId_certificat_key" ON "partner_certifications"("tenantId", "partnerProfileId", "certificationKey");

-- CreateIndex
CREATE INDEX "partner_service_listings_tenantId_partnerProfileId_status_idx" ON "partner_service_listings"("tenantId", "partnerProfileId", "status");

-- CreateIndex
CREATE INDEX "partner_service_listings_tenantId_serviceType_idx" ON "partner_service_listings"("tenantId", "serviceType");

-- CreateIndex
CREATE INDEX "partner_service_listings_tenantId_deletedAt_idx" ON "partner_service_listings"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "industry_template_packs_tenantId_industry_status_idx" ON "industry_template_packs"("tenantId", "industry", "status");

-- CreateIndex
CREATE INDEX "industry_template_packs_tenantId_publishedAt_idx" ON "industry_template_packs"("tenantId", "publishedAt");

-- CreateIndex
CREATE INDEX "industry_template_packs_tenantId_deletedAt_idx" ON "industry_template_packs"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "industry_template_packs_tenantId_templateKey_version_key" ON "industry_template_packs"("tenantId", "templateKey", "version");

-- CreateIndex
CREATE INDEX "registered_devices_tenantId_userId_status_idx" ON "registered_devices"("tenantId", "userId", "status");

-- CreateIndex
CREATE INDEX "registered_devices_tenantId_workspaceId_deviceType_idx" ON "registered_devices"("tenantId", "workspaceId", "deviceType");

-- CreateIndex
CREATE INDEX "registered_devices_tenantId_trustLevel_idx" ON "registered_devices"("tenantId", "trustLevel");

-- CreateIndex
CREATE INDEX "registered_devices_tenantId_lastSeenAt_idx" ON "registered_devices"("tenantId", "lastSeenAt");

-- CreateIndex
CREATE INDEX "registered_devices_tenantId_deletedAt_idx" ON "registered_devices"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "registered_devices_tenantId_deviceKey_key" ON "registered_devices"("tenantId", "deviceKey");

-- CreateIndex
CREATE INDEX "device_sessions_tenantId_deviceId_status_idx" ON "device_sessions"("tenantId", "deviceId", "status");

-- CreateIndex
CREATE INDEX "device_sessions_tenantId_userId_status_idx" ON "device_sessions"("tenantId", "userId", "status");

-- CreateIndex
CREATE INDEX "device_sessions_tenantId_workspaceId_idx" ON "device_sessions"("tenantId", "workspaceId");

-- CreateIndex
CREATE INDEX "device_sessions_tenantId_deletedAt_idx" ON "device_sessions"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "device_trust_policies_tenantId_deviceType_platform_idx" ON "device_trust_policies"("tenantId", "deviceType", "platform");

-- CreateIndex
CREATE INDEX "device_trust_policies_tenantId_requiredTrustLevel_idx" ON "device_trust_policies"("tenantId", "requiredTrustLevel");

-- CreateIndex
CREATE INDEX "device_trust_policies_tenantId_deletedAt_idx" ON "device_trust_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "device_trust_policies_tenantId_policyKey_key" ON "device_trust_policies"("tenantId", "policyKey");

-- CreateIndex
CREATE INDEX "device_permissions_tenantId_moduleKey_allowed_idx" ON "device_permissions"("tenantId", "moduleKey", "allowed");

-- CreateIndex
CREATE INDEX "device_permissions_tenantId_offlineAllowed_idx" ON "device_permissions"("tenantId", "offlineAllowed");

-- CreateIndex
CREATE INDEX "device_permissions_tenantId_deletedAt_idx" ON "device_permissions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "device_permissions_tenantId_deviceId_permissionKey_scope_key" ON "device_permissions"("tenantId", "deviceId", "permissionKey", "scope");

-- CreateIndex
CREATE INDEX "device_activity_logs_tenantId_deviceId_occurredAt_idx" ON "device_activity_logs"("tenantId", "deviceId", "occurredAt");

-- CreateIndex
CREATE INDEX "device_activity_logs_tenantId_workspaceId_activityType_idx" ON "device_activity_logs"("tenantId", "workspaceId", "activityType");

-- CreateIndex
CREATE INDEX "device_activity_logs_tenantId_severity_occurredAt_idx" ON "device_activity_logs"("tenantId", "severity", "occurredAt");

-- CreateIndex
CREATE INDEX "device_activity_logs_tenantId_deletedAt_idx" ON "device_activity_logs"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "device_approval_requests_tenantId_status_riskLevel_idx" ON "device_approval_requests"("tenantId", "status", "riskLevel");

-- CreateIndex
CREATE INDEX "device_approval_requests_tenantId_deviceId_status_idx" ON "device_approval_requests"("tenantId", "deviceId", "status");

-- CreateIndex
CREATE INDEX "device_approval_requests_tenantId_deletedAt_idx" ON "device_approval_requests"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "mobile_workspace_profiles_tenantId_workspaceId_userId_idx" ON "mobile_workspace_profiles"("tenantId", "workspaceId", "userId");

-- CreateIndex
CREATE INDEX "mobile_workspace_profiles_tenantId_deviceId_idx" ON "mobile_workspace_profiles"("tenantId", "deviceId");

-- CreateIndex
CREATE INDEX "mobile_workspace_profiles_tenantId_deletedAt_idx" ON "mobile_workspace_profiles"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "mobile_workspace_profiles_tenantId_profileKey_key" ON "mobile_workspace_profiles"("tenantId", "profileKey");

-- CreateIndex
CREATE INDEX "desktop_companion_profiles_tenantId_workspaceId_userId_idx" ON "desktop_companion_profiles"("tenantId", "workspaceId", "userId");

-- CreateIndex
CREATE INDEX "desktop_companion_profiles_tenantId_deviceId_idx" ON "desktop_companion_profiles"("tenantId", "deviceId");

-- CreateIndex
CREATE INDEX "desktop_companion_profiles_tenantId_deletedAt_idx" ON "desktop_companion_profiles"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "desktop_companion_profiles_tenantId_profileKey_key" ON "desktop_companion_profiles"("tenantId", "profileKey");

-- CreateIndex
CREATE INDEX "offline_stores_tenantId_workspaceId_moduleKey_idx" ON "offline_stores"("tenantId", "workspaceId", "moduleKey");

-- CreateIndex
CREATE INDEX "offline_stores_tenantId_deviceId_idx" ON "offline_stores"("tenantId", "deviceId");

-- CreateIndex
CREATE INDEX "offline_stores_tenantId_deletedAt_idx" ON "offline_stores"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "offline_stores_tenantId_storeKey_key" ON "offline_stores"("tenantId", "storeKey");

-- CreateIndex
CREATE INDEX "offline_queue_items_tenantId_workspaceId_status_priority_idx" ON "offline_queue_items"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "offline_queue_items_tenantId_deviceId_status_idx" ON "offline_queue_items"("tenantId", "deviceId", "status");

-- CreateIndex
CREATE INDEX "offline_queue_items_tenantId_moduleKey_queueType_idx" ON "offline_queue_items"("tenantId", "moduleKey", "queueType");

-- CreateIndex
CREATE INDEX "offline_queue_items_tenantId_dedupeKey_idx" ON "offline_queue_items"("tenantId", "dedupeKey");

-- CreateIndex
CREATE INDEX "offline_queue_items_tenantId_deletedAt_idx" ON "offline_queue_items"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "offline_conflicts_tenantId_workspaceId_status_idx" ON "offline_conflicts"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "offline_conflicts_tenantId_entityType_entityId_idx" ON "offline_conflicts"("tenantId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "offline_conflicts_tenantId_conflictType_idx" ON "offline_conflicts"("tenantId", "conflictType");

-- CreateIndex
CREATE INDEX "offline_conflicts_tenantId_deletedAt_idx" ON "offline_conflicts"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "local_cache_policies_tenantId_workspaceId_moduleKey_idx" ON "local_cache_policies"("tenantId", "workspaceId", "moduleKey");

-- CreateIndex
CREATE INDEX "local_cache_policies_tenantId_allowOfflineMutation_idx" ON "local_cache_policies"("tenantId", "allowOfflineMutation");

-- CreateIndex
CREATE INDEX "local_cache_policies_tenantId_deletedAt_idx" ON "local_cache_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "local_cache_policies_tenantId_policyKey_key" ON "local_cache_policies"("tenantId", "policyKey");

-- CreateIndex
CREATE INDEX "sync_cursors_tenantId_moduleKey_status_idx" ON "sync_cursors"("tenantId", "moduleKey", "status");

-- CreateIndex
CREATE INDEX "sync_cursors_tenantId_lastSyncedAt_idx" ON "sync_cursors"("tenantId", "lastSyncedAt");

-- CreateIndex
CREATE INDEX "sync_cursors_tenantId_deletedAt_idx" ON "sync_cursors"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "sync_cursors_tenantId_workspaceId_deviceId_moduleKey_cursor_key" ON "sync_cursors"("tenantId", "workspaceId", "deviceId", "moduleKey", "cursorKey");

-- CreateIndex
CREATE INDEX "sync_status_snapshots_tenantId_workspaceId_status_idx" ON "sync_status_snapshots"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "sync_status_snapshots_tenantId_deviceId_createdAt_idx" ON "sync_status_snapshots"("tenantId", "deviceId", "createdAt");

-- CreateIndex
CREATE INDEX "sync_status_snapshots_tenantId_syncRunKey_idx" ON "sync_status_snapshots"("tenantId", "syncRunKey");

-- CreateIndex
CREATE INDEX "sync_status_snapshots_tenantId_deletedAt_idx" ON "sync_status_snapshots"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "offline_module_policies_tenantId_supported_moduleKey_idx" ON "offline_module_policies"("tenantId", "supported", "moduleKey");

-- CreateIndex
CREATE INDEX "offline_module_policies_tenantId_writeOffline_idx" ON "offline_module_policies"("tenantId", "writeOffline");

-- CreateIndex
CREATE INDEX "offline_module_policies_tenantId_deletedAt_idx" ON "offline_module_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "offline_module_policies_tenantId_workspaceId_moduleKey_key" ON "offline_module_policies"("tenantId", "workspaceId", "moduleKey");

-- CreateIndex
CREATE INDEX "data_catalog_assets_tenantId_workspaceId_assetType_idx" ON "data_catalog_assets"("tenantId", "workspaceId", "assetType");

-- CreateIndex
CREATE INDEX "data_catalog_assets_tenantId_classification_sensitivityLeve_idx" ON "data_catalog_assets"("tenantId", "classification", "sensitivityLevel");

-- CreateIndex
CREATE INDEX "data_catalog_assets_tenantId_ownerUserId_idx" ON "data_catalog_assets"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "data_catalog_assets_tenantId_deletedAt_idx" ON "data_catalog_assets"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_catalog_assets_tenantId_assetKey_key" ON "data_catalog_assets"("tenantId", "assetKey");

-- CreateIndex
CREATE INDEX "data_classification_events_tenantId_workspaceId_classificat_idx" ON "data_classification_events"("tenantId", "workspaceId", "classification");

-- CreateIndex
CREATE INDEX "data_classification_events_tenantId_assetId_classifiedAt_idx" ON "data_classification_events"("tenantId", "assetId", "classifiedAt");

-- CreateIndex
CREATE INDEX "data_classification_events_tenantId_entityType_entityId_idx" ON "data_classification_events"("tenantId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "data_classification_events_tenantId_deletedAt_idx" ON "data_classification_events"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "data_ownership_assignments_tenantId_workspaceId_status_idx" ON "data_ownership_assignments"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "data_ownership_assignments_tenantId_assetId_ownershipType_idx" ON "data_ownership_assignments"("tenantId", "assetId", "ownershipType");

-- CreateIndex
CREATE INDEX "data_ownership_assignments_tenantId_ownerUserId_idx" ON "data_ownership_assignments"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "data_ownership_assignments_tenantId_deletedAt_idx" ON "data_ownership_assignments"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "data_lineage_edges_tenantId_sourceAssetId_idx" ON "data_lineage_edges"("tenantId", "sourceAssetId");

-- CreateIndex
CREATE INDEX "data_lineage_edges_tenantId_targetAssetId_idx" ON "data_lineage_edges"("tenantId", "targetAssetId");

-- CreateIndex
CREATE INDEX "data_lineage_edges_tenantId_workspaceId_transformType_idx" ON "data_lineage_edges"("tenantId", "workspaceId", "transformType");

-- CreateIndex
CREATE INDEX "data_lineage_edges_tenantId_deletedAt_idx" ON "data_lineage_edges"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_lineage_edges_tenantId_lineageKey_key" ON "data_lineage_edges"("tenantId", "lineageKey");

-- CreateIndex
CREATE INDEX "data_quality_checks_tenantId_workspaceId_status_idx" ON "data_quality_checks"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "data_quality_checks_tenantId_assetId_checkType_idx" ON "data_quality_checks"("tenantId", "assetId", "checkType");

-- CreateIndex
CREATE INDEX "data_quality_checks_tenantId_deletedAt_idx" ON "data_quality_checks"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_quality_checks_tenantId_checkKey_key" ON "data_quality_checks"("tenantId", "checkKey");

-- CreateIndex
CREATE INDEX "privacy_consent_records_tenantId_workspaceId_status_idx" ON "privacy_consent_records"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "privacy_consent_records_tenantId_purpose_lawfulBasis_idx" ON "privacy_consent_records"("tenantId", "purpose", "lawfulBasis");

-- CreateIndex
CREATE INDEX "privacy_consent_records_tenantId_deletedAt_idx" ON "privacy_consent_records"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "privacy_consent_records_tenantId_subjectType_subjectId_cons_key" ON "privacy_consent_records"("tenantId", "subjectType", "subjectId", "consentKey");

-- CreateIndex
CREATE INDEX "privacy_requests_tenantId_workspaceId_requestType_status_idx" ON "privacy_requests"("tenantId", "workspaceId", "requestType", "status");

-- CreateIndex
CREATE INDEX "privacy_requests_tenantId_subjectType_subjectId_idx" ON "privacy_requests"("tenantId", "subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "privacy_requests_tenantId_dueAt_idx" ON "privacy_requests"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "privacy_requests_tenantId_deletedAt_idx" ON "privacy_requests"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "privacy_requests_tenantId_requestKey_key" ON "privacy_requests"("tenantId", "requestKey");

-- CreateIndex
CREATE INDEX "privacy_workflow_runs_tenantId_privacyRequestId_status_idx" ON "privacy_workflow_runs"("tenantId", "privacyRequestId", "status");

-- CreateIndex
CREATE INDEX "privacy_workflow_runs_tenantId_workflowKey_idx" ON "privacy_workflow_runs"("tenantId", "workflowKey");

-- CreateIndex
CREATE INDEX "privacy_workflow_runs_tenantId_deletedAt_idx" ON "privacy_workflow_runs"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "records_lifecycle_policies_tenantId_workspaceId_recordType_idx" ON "records_lifecycle_policies"("tenantId", "workspaceId", "recordType");

-- CreateIndex
CREATE INDEX "records_lifecycle_policies_tenantId_enabled_idx" ON "records_lifecycle_policies"("tenantId", "enabled");

-- CreateIndex
CREATE INDEX "records_lifecycle_policies_tenantId_deletedAt_idx" ON "records_lifecycle_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "records_lifecycle_policies_tenantId_policyKey_key" ON "records_lifecycle_policies"("tenantId", "policyKey");

-- CreateIndex
CREATE INDEX "records_lifecycle_actions_tenantId_workspaceId_actionType_s_idx" ON "records_lifecycle_actions"("tenantId", "workspaceId", "actionType", "status");

-- CreateIndex
CREATE INDEX "records_lifecycle_actions_tenantId_recordType_recordId_idx" ON "records_lifecycle_actions"("tenantId", "recordType", "recordId");

-- CreateIndex
CREATE INDEX "records_lifecycle_actions_tenantId_scheduledAt_idx" ON "records_lifecycle_actions"("tenantId", "scheduledAt");

-- CreateIndex
CREATE INDEX "records_lifecycle_actions_tenantId_deletedAt_idx" ON "records_lifecycle_actions"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "records_archive_jobs_tenantId_workspaceId_status_idx" ON "records_archive_jobs"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "records_archive_jobs_tenantId_recordType_idx" ON "records_archive_jobs"("tenantId", "recordType");

-- CreateIndex
CREATE INDEX "records_archive_jobs_tenantId_deletedAt_idx" ON "records_archive_jobs"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "records_archive_jobs_tenantId_archiveKey_key" ON "records_archive_jobs"("tenantId", "archiveKey");

-- CreateIndex
CREATE INDEX "compliance_evidence_packages_tenantId_workspaceId_framework_idx" ON "compliance_evidence_packages"("tenantId", "workspaceId", "framework");

-- CreateIndex
CREATE INDEX "compliance_evidence_packages_tenantId_controlKey_status_idx" ON "compliance_evidence_packages"("tenantId", "controlKey", "status");

-- CreateIndex
CREATE INDEX "compliance_evidence_packages_tenantId_generatedAt_idx" ON "compliance_evidence_packages"("tenantId", "generatedAt");

-- CreateIndex
CREATE INDEX "compliance_evidence_packages_tenantId_deletedAt_idx" ON "compliance_evidence_packages"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_evidence_packages_tenantId_evidenceKey_key" ON "compliance_evidence_packages"("tenantId", "evidenceKey");

-- CreateIndex
CREATE INDEX "compliance_monitoring_runs_tenantId_workspaceId_framework_s_idx" ON "compliance_monitoring_runs"("tenantId", "workspaceId", "framework", "status");

-- CreateIndex
CREATE INDEX "compliance_monitoring_runs_tenantId_riskScore_idx" ON "compliance_monitoring_runs"("tenantId", "riskScore");

-- CreateIndex
CREATE INDEX "compliance_monitoring_runs_tenantId_deletedAt_idx" ON "compliance_monitoring_runs"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_monitoring_runs_tenantId_runKey_key" ON "compliance_monitoring_runs"("tenantId", "runKey");

-- CreateIndex
CREATE INDEX "search_indexes_tenantId_workspaceId_indexType_idx" ON "search_indexes"("tenantId", "workspaceId", "indexType");

-- CreateIndex
CREATE INDEX "search_indexes_tenantId_moduleKey_status_idx" ON "search_indexes"("tenantId", "moduleKey", "status");

-- CreateIndex
CREATE INDEX "search_indexes_tenantId_sensitivityLevel_idx" ON "search_indexes"("tenantId", "sensitivityLevel");

-- CreateIndex
CREATE INDEX "search_indexes_tenantId_deletedAt_idx" ON "search_indexes"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "search_indexes_tenantId_indexKey_key" ON "search_indexes"("tenantId", "indexKey");

-- CreateIndex
CREATE INDEX "search_indexed_documents_tenantId_workspaceId_moduleKey_idx" ON "search_indexed_documents"("tenantId", "workspaceId", "moduleKey");

-- CreateIndex
CREATE INDEX "search_indexed_documents_tenantId_sourceType_sourceId_idx" ON "search_indexed_documents"("tenantId", "sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "search_indexed_documents_tenantId_classification_sensitivit_idx" ON "search_indexed_documents"("tenantId", "classification", "sensitivityLevel");

-- CreateIndex
CREATE INDEX "search_indexed_documents_tenantId_deletedAt_idx" ON "search_indexed_documents"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "search_indexed_documents_tenantId_indexId_sourceType_source_key" ON "search_indexed_documents"("tenantId", "indexId", "sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "search_embedding_records_tenantId_indexId_model_idx" ON "search_embedding_records"("tenantId", "indexId", "model");

-- CreateIndex
CREATE INDEX "search_embedding_records_tenantId_documentId_idx" ON "search_embedding_records"("tenantId", "documentId");

-- CreateIndex
CREATE INDEX "search_embedding_records_tenantId_deletedAt_idx" ON "search_embedding_records"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "search_embedding_records_tenantId_embeddingKey_key" ON "search_embedding_records"("tenantId", "embeddingKey");

-- CreateIndex
CREATE INDEX "saved_searches_tenantId_workspaceId_ownerUserId_idx" ON "saved_searches"("tenantId", "workspaceId", "ownerUserId");

-- CreateIndex
CREATE INDEX "saved_searches_tenantId_searchScope_visibility_idx" ON "saved_searches"("tenantId", "searchScope", "visibility");

-- CreateIndex
CREATE INDEX "saved_searches_tenantId_deletedAt_idx" ON "saved_searches"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "search_query_logs_tenantId_workspaceId_searchType_idx" ON "search_query_logs"("tenantId", "workspaceId", "searchType");

-- CreateIndex
CREATE INDEX "search_query_logs_tenantId_userId_createdAt_idx" ON "search_query_logs"("tenantId", "userId", "createdAt");

-- CreateIndex
CREATE INDEX "search_query_logs_tenantId_moduleKey_idx" ON "search_query_logs"("tenantId", "moduleKey");

-- CreateIndex
CREATE INDEX "search_query_logs_tenantId_deletedAt_idx" ON "search_query_logs"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "retrieval_sessions_tenantId_workspaceId_retrievalType_idx" ON "retrieval_sessions"("tenantId", "workspaceId", "retrievalType");

-- CreateIndex
CREATE INDEX "retrieval_sessions_tenantId_userId_createdAt_idx" ON "retrieval_sessions"("tenantId", "userId", "createdAt");

-- CreateIndex
CREATE INDEX "retrieval_sessions_tenantId_deletedAt_idx" ON "retrieval_sessions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "retrieval_sessions_tenantId_sessionKey_key" ON "retrieval_sessions"("tenantId", "sessionKey");

-- CreateIndex
CREATE INDEX "retrieval_results_tenantId_sessionId_rank_idx" ON "retrieval_results"("tenantId", "sessionId", "rank");

-- CreateIndex
CREATE INDEX "retrieval_results_tenantId_workspaceId_sourceType_idx" ON "retrieval_results"("tenantId", "workspaceId", "sourceType");

-- CreateIndex
CREATE INDEX "retrieval_results_tenantId_sensitivityLevel_allowed_idx" ON "retrieval_results"("tenantId", "sensitivityLevel", "allowed");

-- CreateIndex
CREATE INDEX "retrieval_results_tenantId_deletedAt_idx" ON "retrieval_results"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "search_access_policies_tenantId_workspaceId_enabled_idx" ON "search_access_policies"("tenantId", "workspaceId", "enabled");

-- CreateIndex
CREATE INDEX "search_access_policies_tenantId_indexId_idx" ON "search_access_policies"("tenantId", "indexId");

-- CreateIndex
CREATE INDEX "search_access_policies_tenantId_moduleKey_idx" ON "search_access_policies"("tenantId", "moduleKey");

-- CreateIndex
CREATE INDEX "search_access_policies_tenantId_deletedAt_idx" ON "search_access_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "search_access_policies_tenantId_policyKey_key" ON "search_access_policies"("tenantId", "policyKey");

-- CreateIndex
CREATE INDEX "knowledge_spaces_tenantId_workspaceId_spaceType_status_idx" ON "knowledge_spaces"("tenantId", "workspaceId", "spaceType", "status");

-- CreateIndex
CREATE INDEX "knowledge_spaces_tenantId_ownerUserId_idx" ON "knowledge_spaces"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "knowledge_spaces_tenantId_departmentId_idx" ON "knowledge_spaces"("tenantId", "departmentId");

-- CreateIndex
CREATE INDEX "knowledge_spaces_tenantId_projectId_idx" ON "knowledge_spaces"("tenantId", "projectId");

-- CreateIndex
CREATE INDEX "knowledge_spaces_tenantId_deletedAt_idx" ON "knowledge_spaces"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_spaces_tenantId_spaceKey_key" ON "knowledge_spaces"("tenantId", "spaceKey");

-- CreateIndex
CREATE INDEX "knowledge_categories_tenantId_workspaceId_spaceId_idx" ON "knowledge_categories"("tenantId", "workspaceId", "spaceId");

-- CreateIndex
CREATE INDEX "knowledge_categories_tenantId_parentCategoryId_idx" ON "knowledge_categories"("tenantId", "parentCategoryId");

-- CreateIndex
CREATE INDEX "knowledge_categories_tenantId_deletedAt_idx" ON "knowledge_categories"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_categories_tenantId_categoryKey_key" ON "knowledge_categories"("tenantId", "categoryKey");

-- CreateIndex
CREATE INDEX "knowledge_articles_tenantId_workspaceId_status_idx" ON "knowledge_articles"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "knowledge_articles_tenantId_spaceId_categoryId_idx" ON "knowledge_articles"("tenantId", "spaceId", "categoryId");

-- CreateIndex
CREATE INDEX "knowledge_articles_tenantId_authorUserId_idx" ON "knowledge_articles"("tenantId", "authorUserId");

-- CreateIndex
CREATE INDEX "knowledge_articles_tenantId_publishedAt_idx" ON "knowledge_articles"("tenantId", "publishedAt");

-- CreateIndex
CREATE INDEX "knowledge_articles_tenantId_deletedAt_idx" ON "knowledge_articles"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_articles_tenantId_articleKey_key" ON "knowledge_articles"("tenantId", "articleKey");

-- CreateIndex
CREATE INDEX "discussions_tenantId_workspaceId_status_idx" ON "discussions"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "discussions_tenantId_spaceId_idx" ON "discussions"("tenantId", "spaceId");

-- CreateIndex
CREATE INDEX "discussions_tenantId_sourceType_sourceId_idx" ON "discussions"("tenantId", "sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "discussions_tenantId_lastActivityAt_idx" ON "discussions"("tenantId", "lastActivityAt");

-- CreateIndex
CREATE INDEX "discussions_tenantId_deletedAt_idx" ON "discussions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "discussions_tenantId_discussionKey_key" ON "discussions"("tenantId", "discussionKey");

-- CreateIndex
CREATE INDEX "discussion_threads_tenantId_workspaceId_discussionId_idx" ON "discussion_threads"("tenantId", "workspaceId", "discussionId");

-- CreateIndex
CREATE INDEX "discussion_threads_tenantId_parentThreadId_idx" ON "discussion_threads"("tenantId", "parentThreadId");

-- CreateIndex
CREATE INDEX "discussion_threads_tenantId_deletedAt_idx" ON "discussion_threads"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "discussion_threads_tenantId_threadKey_key" ON "discussion_threads"("tenantId", "threadKey");

-- CreateIndex
CREATE INDEX "discussion_messages_tenantId_workspaceId_discussionId_idx" ON "discussion_messages"("tenantId", "workspaceId", "discussionId");

-- CreateIndex
CREATE INDEX "discussion_messages_tenantId_threadId_idx" ON "discussion_messages"("tenantId", "threadId");

-- CreateIndex
CREATE INDEX "discussion_messages_tenantId_authorUserId_idx" ON "discussion_messages"("tenantId", "authorUserId");

-- CreateIndex
CREATE INDEX "discussion_messages_tenantId_createdAt_idx" ON "discussion_messages"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "discussion_messages_tenantId_deletedAt_idx" ON "discussion_messages"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "collaboration_mentions_tenantId_workspaceId_status_idx" ON "collaboration_mentions"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "collaboration_mentions_tenantId_messageId_idx" ON "collaboration_mentions"("tenantId", "messageId");

-- CreateIndex
CREATE INDEX "collaboration_mentions_tenantId_targetUserId_idx" ON "collaboration_mentions"("tenantId", "targetUserId");

-- CreateIndex
CREATE INDEX "collaboration_mentions_tenantId_targetTeamId_idx" ON "collaboration_mentions"("tenantId", "targetTeamId");

-- CreateIndex
CREATE INDEX "collaboration_mentions_tenantId_deletedAt_idx" ON "collaboration_mentions"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "collaboration_reactions_tenantId_workspaceId_reactionType_idx" ON "collaboration_reactions"("tenantId", "workspaceId", "reactionType");

-- CreateIndex
CREATE INDEX "collaboration_reactions_tenantId_actorUserId_idx" ON "collaboration_reactions"("tenantId", "actorUserId");

-- CreateIndex
CREATE INDEX "collaboration_reactions_tenantId_deletedAt_idx" ON "collaboration_reactions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "collaboration_reactions_tenantId_messageId_actorUserId_reac_key" ON "collaboration_reactions"("tenantId", "messageId", "actorUserId", "reactionType");

-- CreateIndex
CREATE INDEX "collaboration_activities_tenantId_workspaceId_activityType_idx" ON "collaboration_activities"("tenantId", "workspaceId", "activityType");

-- CreateIndex
CREATE INDEX "collaboration_activities_tenantId_spaceId_createdAt_idx" ON "collaboration_activities"("tenantId", "spaceId", "createdAt");

-- CreateIndex
CREATE INDEX "collaboration_activities_tenantId_subjectType_subjectId_idx" ON "collaboration_activities"("tenantId", "subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "collaboration_activities_tenantId_actorUserId_idx" ON "collaboration_activities"("tenantId", "actorUserId");

-- CreateIndex
CREATE INDEX "collaboration_activities_tenantId_deletedAt_idx" ON "collaboration_activities"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "decision_rooms_tenantId_workspaceId_status_idx" ON "decision_rooms"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "decision_rooms_tenantId_spaceId_idx" ON "decision_rooms"("tenantId", "spaceId");

-- CreateIndex
CREATE INDEX "decision_rooms_tenantId_decisionType_priority_idx" ON "decision_rooms"("tenantId", "decisionType", "priority");

-- CreateIndex
CREATE INDEX "decision_rooms_tenantId_dueAt_idx" ON "decision_rooms"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "decision_rooms_tenantId_deletedAt_idx" ON "decision_rooms"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "decision_rooms_tenantId_roomKey_key" ON "decision_rooms"("tenantId", "roomKey");

-- CreateIndex
CREATE INDEX "decision_participants_tenantId_workspaceId_status_idx" ON "decision_participants"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "decision_participants_tenantId_participantUserId_idx" ON "decision_participants"("tenantId", "participantUserId");

-- CreateIndex
CREATE INDEX "decision_participants_tenantId_deletedAt_idx" ON "decision_participants"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "decision_participants_tenantId_roomId_participantUserId_key" ON "decision_participants"("tenantId", "roomId", "participantUserId");

-- CreateIndex
CREATE INDEX "decision_votes_tenantId_workspaceId_voteValue_idx" ON "decision_votes"("tenantId", "workspaceId", "voteValue");

-- CreateIndex
CREATE INDEX "decision_votes_tenantId_roomId_voterUserId_idx" ON "decision_votes"("tenantId", "roomId", "voterUserId");

-- CreateIndex
CREATE INDEX "decision_votes_tenantId_participantId_idx" ON "decision_votes"("tenantId", "participantId");

-- CreateIndex
CREATE INDEX "decision_votes_tenantId_deletedAt_idx" ON "decision_votes"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "decision_approvals_tenantId_workspaceId_status_idx" ON "decision_approvals"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "decision_approvals_tenantId_roomId_approvalLevel_idx" ON "decision_approvals"("tenantId", "roomId", "approvalLevel");

-- CreateIndex
CREATE INDEX "decision_approvals_tenantId_approverUserId_idx" ON "decision_approvals"("tenantId", "approverUserId");

-- CreateIndex
CREATE INDEX "decision_approvals_tenantId_dueAt_idx" ON "decision_approvals"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "decision_approvals_tenantId_deletedAt_idx" ON "decision_approvals"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "decision_records_tenantId_workspaceId_decidedAt_idx" ON "decision_records"("tenantId", "workspaceId", "decidedAt");

-- CreateIndex
CREATE INDEX "decision_records_tenantId_roomId_idx" ON "decision_records"("tenantId", "roomId");

-- CreateIndex
CREATE INDEX "decision_records_tenantId_outcome_idx" ON "decision_records"("tenantId", "outcome");

-- CreateIndex
CREATE INDEX "decision_records_tenantId_deletedAt_idx" ON "decision_records"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "decision_records_tenantId_recordKey_key" ON "decision_records"("tenantId", "recordKey");

-- CreateIndex
CREATE INDEX "ai_collaboration_summaries_tenantId_workspaceId_summaryType_idx" ON "ai_collaboration_summaries"("tenantId", "workspaceId", "summaryType");

-- CreateIndex
CREATE INDEX "ai_collaboration_summaries_tenantId_spaceId_idx" ON "ai_collaboration_summaries"("tenantId", "spaceId");

-- CreateIndex
CREATE INDEX "ai_collaboration_summaries_tenantId_discussionId_idx" ON "ai_collaboration_summaries"("tenantId", "discussionId");

-- CreateIndex
CREATE INDEX "ai_collaboration_summaries_tenantId_roomId_idx" ON "ai_collaboration_summaries"("tenantId", "roomId");

-- CreateIndex
CREATE INDEX "ai_collaboration_summaries_tenantId_generatedAt_idx" ON "ai_collaboration_summaries"("tenantId", "generatedAt");

-- CreateIndex
CREATE INDEX "ai_collaboration_summaries_tenantId_deletedAt_idx" ON "ai_collaboration_summaries"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_collaboration_summaries_tenantId_summaryKey_key" ON "ai_collaboration_summaries"("tenantId", "summaryKey");

-- CreateIndex
CREATE INDEX "collaboration_action_items_tenantId_workspaceId_status_idx" ON "collaboration_action_items"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "collaboration_action_items_tenantId_spaceId_idx" ON "collaboration_action_items"("tenantId", "spaceId");

-- CreateIndex
CREATE INDEX "collaboration_action_items_tenantId_discussionId_idx" ON "collaboration_action_items"("tenantId", "discussionId");

-- CreateIndex
CREATE INDEX "collaboration_action_items_tenantId_roomId_idx" ON "collaboration_action_items"("tenantId", "roomId");

-- CreateIndex
CREATE INDEX "collaboration_action_items_tenantId_assigneeUserId_idx" ON "collaboration_action_items"("tenantId", "assigneeUserId");

-- CreateIndex
CREATE INDEX "collaboration_action_items_tenantId_dueAt_idx" ON "collaboration_action_items"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "collaboration_action_items_tenantId_deletedAt_idx" ON "collaboration_action_items"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "collaboration_action_items_tenantId_actionKey_key" ON "collaboration_action_items"("tenantId", "actionKey");

-- CreateIndex
CREATE INDEX "communication_channels_tenantId_workspaceId_channelType_sta_idx" ON "communication_channels"("tenantId", "workspaceId", "channelType", "status");

-- CreateIndex
CREATE INDEX "communication_channels_tenantId_departmentId_idx" ON "communication_channels"("tenantId", "departmentId");

-- CreateIndex
CREATE INDEX "communication_channels_tenantId_teamId_idx" ON "communication_channels"("tenantId", "teamId");

-- CreateIndex
CREATE INDEX "communication_channels_tenantId_projectId_idx" ON "communication_channels"("tenantId", "projectId");

-- CreateIndex
CREATE INDEX "communication_channels_tenantId_deletedAt_idx" ON "communication_channels"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "communication_channels_tenantId_channelKey_key" ON "communication_channels"("tenantId", "channelKey");

-- CreateIndex
CREATE INDEX "communication_members_tenantId_workspaceId_status_idx" ON "communication_members"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "communication_members_tenantId_userId_idx" ON "communication_members"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "communication_members_tenantId_teamId_idx" ON "communication_members"("tenantId", "teamId");

-- CreateIndex
CREATE INDEX "communication_members_tenantId_deletedAt_idx" ON "communication_members"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "communication_members_tenantId_channelId_userId_key" ON "communication_members"("tenantId", "channelId", "userId");

-- CreateIndex
CREATE INDEX "conversations_tenantId_workspaceId_conversationType_status_idx" ON "conversations"("tenantId", "workspaceId", "conversationType", "status");

-- CreateIndex
CREATE INDEX "conversations_tenantId_channelId_idx" ON "conversations"("tenantId", "channelId");

-- CreateIndex
CREATE INDEX "conversations_tenantId_lastMessageAt_idx" ON "conversations"("tenantId", "lastMessageAt");

-- CreateIndex
CREATE INDEX "conversations_tenantId_deletedAt_idx" ON "conversations"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_tenantId_conversationKey_key" ON "conversations"("tenantId", "conversationKey");

-- CreateIndex
CREATE INDEX "messages_tenantId_workspaceId_status_idx" ON "messages"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "messages_tenantId_channelId_sentAt_idx" ON "messages"("tenantId", "channelId", "sentAt");

-- CreateIndex
CREATE INDEX "messages_tenantId_conversationId_sentAt_idx" ON "messages"("tenantId", "conversationId", "sentAt");

-- CreateIndex
CREATE INDEX "messages_tenantId_senderUserId_idx" ON "messages"("tenantId", "senderUserId");

-- CreateIndex
CREATE INDEX "messages_tenantId_deletedAt_idx" ON "messages"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "message_attachments_tenantId_workspaceId_attachmentType_idx" ON "message_attachments"("tenantId", "workspaceId", "attachmentType");

-- CreateIndex
CREATE INDEX "message_attachments_tenantId_messageId_idx" ON "message_attachments"("tenantId", "messageId");

-- CreateIndex
CREATE INDEX "message_attachments_tenantId_fileId_idx" ON "message_attachments"("tenantId", "fileId");

-- CreateIndex
CREATE INDEX "message_attachments_tenantId_deletedAt_idx" ON "message_attachments"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "message_reactions_tenantId_workspaceId_reactionType_idx" ON "message_reactions"("tenantId", "workspaceId", "reactionType");

-- CreateIndex
CREATE INDEX "message_reactions_tenantId_actorUserId_idx" ON "message_reactions"("tenantId", "actorUserId");

-- CreateIndex
CREATE INDEX "message_reactions_tenantId_deletedAt_idx" ON "message_reactions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "message_reactions_tenantId_messageId_actorUserId_reactionTy_key" ON "message_reactions"("tenantId", "messageId", "actorUserId", "reactionType");

-- CreateIndex
CREATE INDEX "announcements_tenantId_workspaceId_status_idx" ON "announcements"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "announcements_tenantId_audienceType_priority_idx" ON "announcements"("tenantId", "audienceType", "priority");

-- CreateIndex
CREATE INDEX "announcements_tenantId_publishedAt_idx" ON "announcements"("tenantId", "publishedAt");

-- CreateIndex
CREATE INDEX "announcements_tenantId_deletedAt_idx" ON "announcements"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "announcements_tenantId_announcementKey_key" ON "announcements"("tenantId", "announcementKey");

-- CreateIndex
CREATE INDEX "announcement_recipients_tenantId_workspaceId_status_idx" ON "announcement_recipients"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "announcement_recipients_tenantId_announcementId_idx" ON "announcement_recipients"("tenantId", "announcementId");

-- CreateIndex
CREATE INDEX "announcement_recipients_tenantId_recipientType_recipientId_idx" ON "announcement_recipients"("tenantId", "recipientType", "recipientId");

-- CreateIndex
CREATE INDEX "announcement_recipients_tenantId_deletedAt_idx" ON "announcement_recipients"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "meetings_tenantId_workspaceId_status_idx" ON "meetings"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "meetings_tenantId_organizerUserId_idx" ON "meetings"("tenantId", "organizerUserId");

-- CreateIndex
CREATE INDEX "meetings_tenantId_startsAt_endsAt_idx" ON "meetings"("tenantId", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "meetings_tenantId_meetingType_idx" ON "meetings"("tenantId", "meetingType");

-- CreateIndex
CREATE INDEX "meetings_tenantId_deletedAt_idx" ON "meetings"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "meetings_tenantId_meetingKey_key" ON "meetings"("tenantId", "meetingKey");

-- CreateIndex
CREATE INDEX "meeting_participants_tenantId_workspaceId_status_idx" ON "meeting_participants"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "meeting_participants_tenantId_meetingId_idx" ON "meeting_participants"("tenantId", "meetingId");

-- CreateIndex
CREATE INDEX "meeting_participants_tenantId_userId_idx" ON "meeting_participants"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "meeting_participants_tenantId_responseStatus_idx" ON "meeting_participants"("tenantId", "responseStatus");

-- CreateIndex
CREATE INDEX "meeting_participants_tenantId_deletedAt_idx" ON "meeting_participants"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "meeting_agendas_tenantId_workspaceId_meetingId_idx" ON "meeting_agendas"("tenantId", "workspaceId", "meetingId");

-- CreateIndex
CREATE INDEX "meeting_agendas_tenantId_presenterUserId_idx" ON "meeting_agendas"("tenantId", "presenterUserId");

-- CreateIndex
CREATE INDEX "meeting_agendas_tenantId_deletedAt_idx" ON "meeting_agendas"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_agendas_tenantId_agendaKey_key" ON "meeting_agendas"("tenantId", "agendaKey");

-- CreateIndex
CREATE INDEX "meeting_decisions_tenantId_workspaceId_decidedAt_idx" ON "meeting_decisions"("tenantId", "workspaceId", "decidedAt");

-- CreateIndex
CREATE INDEX "meeting_decisions_tenantId_meetingId_idx" ON "meeting_decisions"("tenantId", "meetingId");

-- CreateIndex
CREATE INDEX "meeting_decisions_tenantId_outcome_idx" ON "meeting_decisions"("tenantId", "outcome");

-- CreateIndex
CREATE INDEX "meeting_decisions_tenantId_deletedAt_idx" ON "meeting_decisions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_decisions_tenantId_decisionKey_key" ON "meeting_decisions"("tenantId", "decisionKey");

-- CreateIndex
CREATE INDEX "meeting_action_items_tenantId_workspaceId_status_idx" ON "meeting_action_items"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "meeting_action_items_tenantId_meetingId_idx" ON "meeting_action_items"("tenantId", "meetingId");

-- CreateIndex
CREATE INDEX "meeting_action_items_tenantId_summaryId_idx" ON "meeting_action_items"("tenantId", "summaryId");

-- CreateIndex
CREATE INDEX "meeting_action_items_tenantId_assigneeUserId_idx" ON "meeting_action_items"("tenantId", "assigneeUserId");

-- CreateIndex
CREATE INDEX "meeting_action_items_tenantId_dueAt_idx" ON "meeting_action_items"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "meeting_action_items_tenantId_deletedAt_idx" ON "meeting_action_items"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_action_items_tenantId_actionKey_key" ON "meeting_action_items"("tenantId", "actionKey");

-- CreateIndex
CREATE INDEX "meeting_summaries_tenantId_workspaceId_summaryType_idx" ON "meeting_summaries"("tenantId", "workspaceId", "summaryType");

-- CreateIndex
CREATE INDEX "meeting_summaries_tenantId_meetingId_idx" ON "meeting_summaries"("tenantId", "meetingId");

-- CreateIndex
CREATE INDEX "meeting_summaries_tenantId_generatedAt_idx" ON "meeting_summaries"("tenantId", "generatedAt");

-- CreateIndex
CREATE INDEX "meeting_summaries_tenantId_deletedAt_idx" ON "meeting_summaries"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_summaries_tenantId_summaryKey_key" ON "meeting_summaries"("tenantId", "summaryKey");

-- CreateIndex
CREATE INDEX "calendars_tenantId_workspaceId_calendarType_status_idx" ON "calendars"("tenantId", "workspaceId", "calendarType", "status");

-- CreateIndex
CREATE INDEX "calendars_tenantId_ownerUserId_idx" ON "calendars"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "calendars_tenantId_departmentId_idx" ON "calendars"("tenantId", "departmentId");

-- CreateIndex
CREATE INDEX "calendars_tenantId_teamId_idx" ON "calendars"("tenantId", "teamId");

-- CreateIndex
CREATE INDEX "calendars_tenantId_deletedAt_idx" ON "calendars"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "calendars_tenantId_calendarKey_key" ON "calendars"("tenantId", "calendarKey");

-- CreateIndex
CREATE INDEX "calendar_events_tenantId_workspaceId_status_idx" ON "calendar_events"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "calendar_events_tenantId_calendarId_startsAt_idx" ON "calendar_events"("tenantId", "calendarId", "startsAt");

-- CreateIndex
CREATE INDEX "calendar_events_tenantId_meetingId_idx" ON "calendar_events"("tenantId", "meetingId");

-- CreateIndex
CREATE INDEX "calendar_events_tenantId_startsAt_endsAt_idx" ON "calendar_events"("tenantId", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "calendar_events_tenantId_deletedAt_idx" ON "calendar_events"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "calendar_events_tenantId_eventKey_key" ON "calendar_events"("tenantId", "eventKey");

-- CreateIndex
CREATE INDEX "calendar_participants_tenantId_workspaceId_responseStatus_idx" ON "calendar_participants"("tenantId", "workspaceId", "responseStatus");

-- CreateIndex
CREATE INDEX "calendar_participants_tenantId_eventId_idx" ON "calendar_participants"("tenantId", "eventId");

-- CreateIndex
CREATE INDEX "calendar_participants_tenantId_userId_idx" ON "calendar_participants"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "calendar_participants_tenantId_deletedAt_idx" ON "calendar_participants"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "schedule_rules_tenantId_workspaceId_ruleType_enabled_idx" ON "schedule_rules"("tenantId", "workspaceId", "ruleType", "enabled");

-- CreateIndex
CREATE INDEX "schedule_rules_tenantId_calendarId_idx" ON "schedule_rules"("tenantId", "calendarId");

-- CreateIndex
CREATE INDEX "schedule_rules_tenantId_priority_idx" ON "schedule_rules"("tenantId", "priority");

-- CreateIndex
CREATE INDEX "schedule_rules_tenantId_deletedAt_idx" ON "schedule_rules"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_rules_tenantId_ruleKey_key" ON "schedule_rules"("tenantId", "ruleKey");

-- CreateIndex
CREATE INDEX "availability_windows_tenantId_workspaceId_availabilityType__idx" ON "availability_windows"("tenantId", "workspaceId", "availabilityType", "status");

-- CreateIndex
CREATE INDEX "availability_windows_tenantId_calendarId_startsAt_idx" ON "availability_windows"("tenantId", "calendarId", "startsAt");

-- CreateIndex
CREATE INDEX "availability_windows_tenantId_userId_startsAt_idx" ON "availability_windows"("tenantId", "userId", "startsAt");

-- CreateIndex
CREATE INDEX "availability_windows_tenantId_teamId_idx" ON "availability_windows"("tenantId", "teamId");

-- CreateIndex
CREATE INDEX "availability_windows_tenantId_departmentId_idx" ON "availability_windows"("tenantId", "departmentId");

-- CreateIndex
CREATE INDEX "availability_windows_tenantId_deletedAt_idx" ON "availability_windows"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "availability_windows_tenantId_windowKey_key" ON "availability_windows"("tenantId", "windowKey");

-- CreateIndex
CREATE INDEX "meeting_recommendations_tenantId_workspaceId_recommendation_idx" ON "meeting_recommendations"("tenantId", "workspaceId", "recommendationType", "status");

-- CreateIndex
CREATE INDEX "meeting_recommendations_tenantId_meetingId_idx" ON "meeting_recommendations"("tenantId", "meetingId");

-- CreateIndex
CREATE INDEX "meeting_recommendations_tenantId_calendarId_idx" ON "meeting_recommendations"("tenantId", "calendarId");

-- CreateIndex
CREATE INDEX "meeting_recommendations_tenantId_score_idx" ON "meeting_recommendations"("tenantId", "score");

-- CreateIndex
CREATE INDEX "meeting_recommendations_tenantId_deletedAt_idx" ON "meeting_recommendations"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_recommendations_tenantId_recommendationKey_key" ON "meeting_recommendations"("tenantId", "recommendationKey");

-- CreateIndex
CREATE INDEX "reminders_tenantId_workspaceId_status_idx" ON "reminders"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "reminders_tenantId_eventId_idx" ON "reminders"("tenantId", "eventId");

-- CreateIndex
CREATE INDEX "reminders_tenantId_meetingId_idx" ON "reminders"("tenantId", "meetingId");

-- CreateIndex
CREATE INDEX "reminders_tenantId_targetUserId_scheduledAt_idx" ON "reminders"("tenantId", "targetUserId", "scheduledAt");

-- CreateIndex
CREATE INDEX "reminders_tenantId_deletedAt_idx" ON "reminders"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "reminders_tenantId_reminderKey_key" ON "reminders"("tenantId", "reminderKey");

-- CreateIndex
CREATE INDEX "notification_preferences_tenantId_workspaceId_channel_enabl_idx" ON "notification_preferences"("tenantId", "workspaceId", "channel", "enabled");

-- CreateIndex
CREATE INDEX "notification_preferences_tenantId_userId_idx" ON "notification_preferences"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "notification_preferences_tenantId_deletedAt_idx" ON "notification_preferences"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_tenantId_userId_preferenceKey_key" ON "notification_preferences"("tenantId", "userId", "preferenceKey");

-- CreateIndex
CREATE INDEX "voice_sessions_tenantId_workspaceId_status_idx" ON "voice_sessions"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "voice_sessions_tenantId_conversationId_idx" ON "voice_sessions"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "voice_sessions_tenantId_customerIdentityId_idx" ON "voice_sessions"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "voice_sessions_tenantId_queueId_idx" ON "voice_sessions"("tenantId", "queueId");

-- CreateIndex
CREATE INDEX "voice_sessions_tenantId_assignedAgentUserId_idx" ON "voice_sessions"("tenantId", "assignedAgentUserId");

-- CreateIndex
CREATE INDEX "voice_sessions_tenantId_startedAt_idx" ON "voice_sessions"("tenantId", "startedAt");

-- CreateIndex
CREATE INDEX "voice_sessions_tenantId_deletedAt_idx" ON "voice_sessions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "voice_sessions_tenantId_sessionKey_key" ON "voice_sessions"("tenantId", "sessionKey");

-- CreateIndex
CREATE INDEX "voice_transcripts_tenantId_workspaceId_voiceSessionId_idx" ON "voice_transcripts"("tenantId", "workspaceId", "voiceSessionId");

-- CreateIndex
CREATE INDEX "voice_transcripts_tenantId_conversationId_idx" ON "voice_transcripts"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "voice_transcripts_tenantId_speakerType_idx" ON "voice_transcripts"("tenantId", "speakerType");

-- CreateIndex
CREATE INDEX "voice_transcripts_tenantId_createdAt_idx" ON "voice_transcripts"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "voice_transcripts_tenantId_deletedAt_idx" ON "voice_transcripts"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "conversation_participants_tenantId_workspaceId_conversation_idx" ON "conversation_participants"("tenantId", "workspaceId", "conversationId");

-- CreateIndex
CREATE INDEX "conversation_participants_tenantId_customerIdentityId_idx" ON "conversation_participants"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "conversation_participants_tenantId_userId_idx" ON "conversation_participants"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "conversation_participants_tenantId_participantType_status_idx" ON "conversation_participants"("tenantId", "participantType", "status");

-- CreateIndex
CREATE INDEX "conversation_participants_tenantId_deletedAt_idx" ON "conversation_participants"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "contact_center_queues_tenantId_workspaceId_status_idx" ON "contact_center_queues"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "contact_center_queues_tenantId_queueType_priority_idx" ON "contact_center_queues"("tenantId", "queueType", "priority");

-- CreateIndex
CREATE INDEX "contact_center_queues_tenantId_departmentId_idx" ON "contact_center_queues"("tenantId", "departmentId");

-- CreateIndex
CREATE INDEX "contact_center_queues_tenantId_teamId_idx" ON "contact_center_queues"("tenantId", "teamId");

-- CreateIndex
CREATE INDEX "contact_center_queues_tenantId_deletedAt_idx" ON "contact_center_queues"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "contact_center_queues_tenantId_queueKey_key" ON "contact_center_queues"("tenantId", "queueKey");

-- CreateIndex
CREATE INDEX "agent_assignments_tenantId_workspaceId_status_idx" ON "agent_assignments"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "agent_assignments_tenantId_queueId_idx" ON "agent_assignments"("tenantId", "queueId");

-- CreateIndex
CREATE INDEX "agent_assignments_tenantId_conversationId_idx" ON "agent_assignments"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "agent_assignments_tenantId_voiceSessionId_idx" ON "agent_assignments"("tenantId", "voiceSessionId");

-- CreateIndex
CREATE INDEX "agent_assignments_tenantId_customerIdentityId_idx" ON "agent_assignments"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "agent_assignments_tenantId_assignedUserId_idx" ON "agent_assignments"("tenantId", "assignedUserId");

-- CreateIndex
CREATE INDEX "agent_assignments_tenantId_slaDueAt_idx" ON "agent_assignments"("tenantId", "slaDueAt");

-- CreateIndex
CREATE INDEX "agent_assignments_tenantId_deletedAt_idx" ON "agent_assignments"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "agent_assignments_tenantId_assignmentKey_key" ON "agent_assignments"("tenantId", "assignmentKey");

-- CreateIndex
CREATE INDEX "customer_identities_tenantId_workspaceId_lifecycleStage_idx" ON "customer_identities"("tenantId", "workspaceId", "lifecycleStage");

-- CreateIndex
CREATE INDEX "customer_identities_tenantId_customerId_idx" ON "customer_identities"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "customer_identities_tenantId_leadId_idx" ON "customer_identities"("tenantId", "leadId");

-- CreateIndex
CREATE INDEX "customer_identities_tenantId_email_idx" ON "customer_identities"("tenantId", "email");

-- CreateIndex
CREATE INDEX "customer_identities_tenantId_phone_idx" ON "customer_identities"("tenantId", "phone");

-- CreateIndex
CREATE INDEX "customer_identities_tenantId_riskLevel_idx" ON "customer_identities"("tenantId", "riskLevel");

-- CreateIndex
CREATE INDEX "customer_identities_tenantId_deletedAt_idx" ON "customer_identities"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "customer_identities_tenantId_identityKey_key" ON "customer_identities"("tenantId", "identityKey");

-- CreateIndex
CREATE INDEX "sentiment_records_tenantId_workspaceId_sentiment_idx" ON "sentiment_records"("tenantId", "workspaceId", "sentiment");

-- CreateIndex
CREATE INDEX "sentiment_records_tenantId_conversationId_idx" ON "sentiment_records"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "sentiment_records_tenantId_messageId_idx" ON "sentiment_records"("tenantId", "messageId");

-- CreateIndex
CREATE INDEX "sentiment_records_tenantId_voiceSessionId_idx" ON "sentiment_records"("tenantId", "voiceSessionId");

-- CreateIndex
CREATE INDEX "sentiment_records_tenantId_customerIdentityId_idx" ON "sentiment_records"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "sentiment_records_tenantId_detectedAt_idx" ON "sentiment_records"("tenantId", "detectedAt");

-- CreateIndex
CREATE INDEX "sentiment_records_tenantId_deletedAt_idx" ON "sentiment_records"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "intent_records_tenantId_workspaceId_intent_idx" ON "intent_records"("tenantId", "workspaceId", "intent");

-- CreateIndex
CREATE INDEX "intent_records_tenantId_category_idx" ON "intent_records"("tenantId", "category");

-- CreateIndex
CREATE INDEX "intent_records_tenantId_conversationId_idx" ON "intent_records"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "intent_records_tenantId_messageId_idx" ON "intent_records"("tenantId", "messageId");

-- CreateIndex
CREATE INDEX "intent_records_tenantId_voiceSessionId_idx" ON "intent_records"("tenantId", "voiceSessionId");

-- CreateIndex
CREATE INDEX "intent_records_tenantId_customerIdentityId_idx" ON "intent_records"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "intent_records_tenantId_detectedAt_idx" ON "intent_records"("tenantId", "detectedAt");

-- CreateIndex
CREATE INDEX "intent_records_tenantId_deletedAt_idx" ON "intent_records"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "conversation_summaries_tenantId_workspaceId_summaryType_idx" ON "conversation_summaries"("tenantId", "workspaceId", "summaryType");

-- CreateIndex
CREATE INDEX "conversation_summaries_tenantId_conversationId_idx" ON "conversation_summaries"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "conversation_summaries_tenantId_voiceSessionId_idx" ON "conversation_summaries"("tenantId", "voiceSessionId");

-- CreateIndex
CREATE INDEX "conversation_summaries_tenantId_customerIdentityId_idx" ON "conversation_summaries"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "conversation_summaries_tenantId_generatedAt_idx" ON "conversation_summaries"("tenantId", "generatedAt");

-- CreateIndex
CREATE INDEX "conversation_summaries_tenantId_deletedAt_idx" ON "conversation_summaries"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_summaries_tenantId_summaryKey_key" ON "conversation_summaries"("tenantId", "summaryKey");

-- CreateIndex
CREATE INDEX "voice_agent_executions_tenantId_workspaceId_status_idx" ON "voice_agent_executions"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "voice_agent_executions_tenantId_agentType_riskLevel_idx" ON "voice_agent_executions"("tenantId", "agentType", "riskLevel");

-- CreateIndex
CREATE INDEX "voice_agent_executions_tenantId_voiceSessionId_idx" ON "voice_agent_executions"("tenantId", "voiceSessionId");

-- CreateIndex
CREATE INDEX "voice_agent_executions_tenantId_conversationId_idx" ON "voice_agent_executions"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "voice_agent_executions_tenantId_customerIdentityId_idx" ON "voice_agent_executions"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "voice_agent_executions_tenantId_startedAt_idx" ON "voice_agent_executions"("tenantId", "startedAt");

-- CreateIndex
CREATE INDEX "voice_agent_executions_tenantId_deletedAt_idx" ON "voice_agent_executions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "voice_agent_executions_tenantId_executionKey_key" ON "voice_agent_executions"("tenantId", "executionKey");

-- CreateIndex
CREATE INDEX "escalation_events_tenantId_workspaceId_status_idx" ON "escalation_events"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "escalation_events_tenantId_queueId_idx" ON "escalation_events"("tenantId", "queueId");

-- CreateIndex
CREATE INDEX "escalation_events_tenantId_conversationId_idx" ON "escalation_events"("tenantId", "conversationId");

-- CreateIndex
CREATE INDEX "escalation_events_tenantId_voiceSessionId_idx" ON "escalation_events"("tenantId", "voiceSessionId");

-- CreateIndex
CREATE INDEX "escalation_events_tenantId_customerIdentityId_idx" ON "escalation_events"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "escalation_events_tenantId_assignmentId_idx" ON "escalation_events"("tenantId", "assignmentId");

-- CreateIndex
CREATE INDEX "escalation_events_tenantId_severity_escalationType_idx" ON "escalation_events"("tenantId", "severity", "escalationType");

-- CreateIndex
CREATE INDEX "escalation_events_tenantId_escalatedAt_idx" ON "escalation_events"("tenantId", "escalatedAt");

-- CreateIndex
CREATE INDEX "escalation_events_tenantId_deletedAt_idx" ON "escalation_events"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "escalation_events_tenantId_escalationKey_key" ON "escalation_events"("tenantId", "escalationKey");

-- CreateIndex
CREATE INDEX "customer_health_scores_tenantId_workspaceId_scoreBand_idx" ON "customer_health_scores"("tenantId", "workspaceId", "scoreBand");

-- CreateIndex
CREATE INDEX "customer_health_scores_tenantId_customerIdentityId_idx" ON "customer_health_scores"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "customer_health_scores_tenantId_customerId_idx" ON "customer_health_scores"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "customer_health_scores_tenantId_calculatedAt_idx" ON "customer_health_scores"("tenantId", "calculatedAt");

-- CreateIndex
CREATE INDEX "customer_health_scores_tenantId_deletedAt_idx" ON "customer_health_scores"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "customer_health_scores_tenantId_scoreKey_key" ON "customer_health_scores"("tenantId", "scoreKey");

-- CreateIndex
CREATE INDEX "customer_journeys_tenantId_workspaceId_lifecycleStage_journ_idx" ON "customer_journeys"("tenantId", "workspaceId", "lifecycleStage", "journeyStatus");

-- CreateIndex
CREATE INDEX "customer_journeys_tenantId_customerIdentityId_idx" ON "customer_journeys"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "customer_journeys_tenantId_customerId_idx" ON "customer_journeys"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "customer_journeys_tenantId_ownerUserId_idx" ON "customer_journeys"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "customer_journeys_tenantId_lastTouchAt_idx" ON "customer_journeys"("tenantId", "lastTouchAt");

-- CreateIndex
CREATE INDEX "customer_journeys_tenantId_deletedAt_idx" ON "customer_journeys"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "customer_journeys_tenantId_journeyKey_key" ON "customer_journeys"("tenantId", "journeyKey");

-- CreateIndex
CREATE INDEX "customer_feedback_tenantId_workspaceId_feedbackType_status_idx" ON "customer_feedback"("tenantId", "workspaceId", "feedbackType", "status");

-- CreateIndex
CREATE INDEX "customer_feedback_tenantId_customerIdentityId_idx" ON "customer_feedback"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "customer_feedback_tenantId_customerId_idx" ON "customer_feedback"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "customer_feedback_tenantId_sentiment_idx" ON "customer_feedback"("tenantId", "sentiment");

-- CreateIndex
CREATE INDEX "customer_feedback_tenantId_receivedAt_idx" ON "customer_feedback"("tenantId", "receivedAt");

-- CreateIndex
CREATE INDEX "customer_feedback_tenantId_deletedAt_idx" ON "customer_feedback"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "customer_feedback_tenantId_feedbackKey_key" ON "customer_feedback"("tenantId", "feedbackKey");

-- CreateIndex
CREATE INDEX "customer_success_plans_tenantId_workspaceId_status_priority_idx" ON "customer_success_plans"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "customer_success_plans_tenantId_customerIdentityId_idx" ON "customer_success_plans"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "customer_success_plans_tenantId_customerId_idx" ON "customer_success_plans"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "customer_success_plans_tenantId_ownerUserId_idx" ON "customer_success_plans"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "customer_success_plans_tenantId_renewalTargetAt_idx" ON "customer_success_plans"("tenantId", "renewalTargetAt");

-- CreateIndex
CREATE INDEX "customer_success_plans_tenantId_deletedAt_idx" ON "customer_success_plans"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "customer_success_plans_tenantId_planKey_key" ON "customer_success_plans"("tenantId", "planKey");

-- CreateIndex
CREATE INDEX "customer_engagement_scores_tenantId_workspaceId_scoreBand_idx" ON "customer_engagement_scores"("tenantId", "workspaceId", "scoreBand");

-- CreateIndex
CREATE INDEX "customer_engagement_scores_tenantId_customerIdentityId_idx" ON "customer_engagement_scores"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "customer_engagement_scores_tenantId_customerId_idx" ON "customer_engagement_scores"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "customer_engagement_scores_tenantId_calculatedAt_idx" ON "customer_engagement_scores"("tenantId", "calculatedAt");

-- CreateIndex
CREATE INDEX "customer_engagement_scores_tenantId_deletedAt_idx" ON "customer_engagement_scores"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "customer_engagement_scores_tenantId_scoreKey_key" ON "customer_engagement_scores"("tenantId", "scoreKey");

-- CreateIndex
CREATE INDEX "churn_predictions_tenantId_workspaceId_riskBand_status_idx" ON "churn_predictions"("tenantId", "workspaceId", "riskBand", "status");

-- CreateIndex
CREATE INDEX "churn_predictions_tenantId_customerIdentityId_idx" ON "churn_predictions"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "churn_predictions_tenantId_customerId_idx" ON "churn_predictions"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "churn_predictions_tenantId_predictedAt_idx" ON "churn_predictions"("tenantId", "predictedAt");

-- CreateIndex
CREATE INDEX "churn_predictions_tenantId_deletedAt_idx" ON "churn_predictions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "churn_predictions_tenantId_predictionKey_key" ON "churn_predictions"("tenantId", "predictionKey");

-- CreateIndex
CREATE INDEX "renewal_opportunities_tenantId_workspaceId_status_priority_idx" ON "renewal_opportunities"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "renewal_opportunities_tenantId_customerIdentityId_idx" ON "renewal_opportunities"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "renewal_opportunities_tenantId_customerId_idx" ON "renewal_opportunities"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "renewal_opportunities_tenantId_ownerUserId_idx" ON "renewal_opportunities"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "renewal_opportunities_tenantId_renewalDate_idx" ON "renewal_opportunities"("tenantId", "renewalDate");

-- CreateIndex
CREATE INDEX "renewal_opportunities_tenantId_deletedAt_idx" ON "renewal_opportunities"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "renewal_opportunities_tenantId_opportunityKey_key" ON "renewal_opportunities"("tenantId", "opportunityKey");

-- CreateIndex
CREATE INDEX "upsell_opportunities_tenantId_workspaceId_status_priority_idx" ON "upsell_opportunities"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "upsell_opportunities_tenantId_customerIdentityId_idx" ON "upsell_opportunities"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "upsell_opportunities_tenantId_customerId_idx" ON "upsell_opportunities"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "upsell_opportunities_tenantId_ownerUserId_idx" ON "upsell_opportunities"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "upsell_opportunities_tenantId_expectedCloseAt_idx" ON "upsell_opportunities"("tenantId", "expectedCloseAt");

-- CreateIndex
CREATE INDEX "upsell_opportunities_tenantId_deletedAt_idx" ON "upsell_opportunities"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "upsell_opportunities_tenantId_opportunityKey_key" ON "upsell_opportunities"("tenantId", "opportunityKey");

-- CreateIndex
CREATE INDEX "cross_sell_opportunities_tenantId_workspaceId_status_priori_idx" ON "cross_sell_opportunities"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "cross_sell_opportunities_tenantId_customerIdentityId_idx" ON "cross_sell_opportunities"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "cross_sell_opportunities_tenantId_customerId_idx" ON "cross_sell_opportunities"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "cross_sell_opportunities_tenantId_ownerUserId_idx" ON "cross_sell_opportunities"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "cross_sell_opportunities_tenantId_expectedCloseAt_idx" ON "cross_sell_opportunities"("tenantId", "expectedCloseAt");

-- CreateIndex
CREATE INDEX "cross_sell_opportunities_tenantId_deletedAt_idx" ON "cross_sell_opportunities"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "cross_sell_opportunities_tenantId_opportunityKey_key" ON "cross_sell_opportunities"("tenantId", "opportunityKey");

-- CreateIndex
CREATE INDEX "service_tickets_tenantId_workspaceId_status_priority_idx" ON "service_tickets"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "service_tickets_tenantId_customerIdentityId_idx" ON "service_tickets"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "service_tickets_tenantId_customerId_idx" ON "service_tickets"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "service_tickets_tenantId_queueId_idx" ON "service_tickets"("tenantId", "queueId");

-- CreateIndex
CREATE INDEX "service_tickets_tenantId_assignedUserId_idx" ON "service_tickets"("tenantId", "assignedUserId");

-- CreateIndex
CREATE INDEX "service_tickets_tenantId_slaDueAt_idx" ON "service_tickets"("tenantId", "slaDueAt");

-- CreateIndex
CREATE INDEX "service_tickets_tenantId_deletedAt_idx" ON "service_tickets"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "service_tickets_tenantId_ticketKey_key" ON "service_tickets"("tenantId", "ticketKey");

-- CreateIndex
CREATE INDEX "service_escalations_tenantId_workspaceId_status_idx" ON "service_escalations"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "service_escalations_tenantId_ticketId_idx" ON "service_escalations"("tenantId", "ticketId");

-- CreateIndex
CREATE INDEX "service_escalations_tenantId_severity_escalationType_idx" ON "service_escalations"("tenantId", "severity", "escalationType");

-- CreateIndex
CREATE INDEX "service_escalations_tenantId_escalatedAt_idx" ON "service_escalations"("tenantId", "escalatedAt");

-- CreateIndex
CREATE INDEX "service_escalations_tenantId_deletedAt_idx" ON "service_escalations"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "service_escalations_tenantId_escalationKey_key" ON "service_escalations"("tenantId", "escalationKey");

-- CreateIndex
CREATE INDEX "service_resolutions_tenantId_workspaceId_resolutionStatus_idx" ON "service_resolutions"("tenantId", "workspaceId", "resolutionStatus");

-- CreateIndex
CREATE INDEX "service_resolutions_tenantId_ticketId_idx" ON "service_resolutions"("tenantId", "ticketId");

-- CreateIndex
CREATE INDEX "service_resolutions_tenantId_resolvedByUserId_idx" ON "service_resolutions"("tenantId", "resolvedByUserId");

-- CreateIndex
CREATE INDEX "service_resolutions_tenantId_resolvedAt_idx" ON "service_resolutions"("tenantId", "resolvedAt");

-- CreateIndex
CREATE INDEX "service_resolutions_tenantId_deletedAt_idx" ON "service_resolutions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "service_resolutions_tenantId_resolutionKey_key" ON "service_resolutions"("tenantId", "resolutionKey");

-- CreateIndex
CREATE INDEX "sla_records_tenantId_workspaceId_status_slaType_idx" ON "sla_records"("tenantId", "workspaceId", "status", "slaType");

-- CreateIndex
CREATE INDEX "sla_records_tenantId_ticketId_idx" ON "sla_records"("tenantId", "ticketId");

-- CreateIndex
CREATE INDEX "sla_records_tenantId_customerIdentityId_idx" ON "sla_records"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "sla_records_tenantId_targetAt_idx" ON "sla_records"("tenantId", "targetAt");

-- CreateIndex
CREATE INDEX "sla_records_tenantId_breachedAt_idx" ON "sla_records"("tenantId", "breachedAt");

-- CreateIndex
CREATE INDEX "sla_records_tenantId_deletedAt_idx" ON "sla_records"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "sla_records_tenantId_slaKey_key" ON "sla_records"("tenantId", "slaKey");

-- CreateIndex
CREATE INDEX "revenue_opportunities_tenantId_workspaceId_opportunityType__idx" ON "revenue_opportunities"("tenantId", "workspaceId", "opportunityType", "status");

-- CreateIndex
CREATE INDEX "revenue_opportunities_tenantId_customerIdentityId_idx" ON "revenue_opportunities"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "revenue_opportunities_tenantId_customerId_idx" ON "revenue_opportunities"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "revenue_opportunities_tenantId_ownerUserId_idx" ON "revenue_opportunities"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "revenue_opportunities_tenantId_expectedCloseAt_idx" ON "revenue_opportunities"("tenantId", "expectedCloseAt");

-- CreateIndex
CREATE INDEX "revenue_opportunities_tenantId_deletedAt_idx" ON "revenue_opportunities"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_opportunities_tenantId_opportunityKey_key" ON "revenue_opportunities"("tenantId", "opportunityKey");

-- CreateIndex
CREATE INDEX "revenue_risks_tenantId_workspaceId_riskType_severity_idx" ON "revenue_risks"("tenantId", "workspaceId", "riskType", "severity");

-- CreateIndex
CREATE INDEX "revenue_risks_tenantId_customerIdentityId_idx" ON "revenue_risks"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "revenue_risks_tenantId_customerId_idx" ON "revenue_risks"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "revenue_risks_tenantId_ownerUserId_idx" ON "revenue_risks"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "revenue_risks_tenantId_detectedAt_idx" ON "revenue_risks"("tenantId", "detectedAt");

-- CreateIndex
CREATE INDEX "revenue_risks_tenantId_deletedAt_idx" ON "revenue_risks"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_risks_tenantId_riskKey_key" ON "revenue_risks"("tenantId", "riskKey");

-- CreateIndex
CREATE INDEX "revenue_accounts_tenantId_workspaceId_status_lifecycleStage_idx" ON "revenue_accounts"("tenantId", "workspaceId", "status", "lifecycleStage");

-- CreateIndex
CREATE INDEX "revenue_accounts_tenantId_customerAccountId_idx" ON "revenue_accounts"("tenantId", "customerAccountId");

-- CreateIndex
CREATE INDEX "revenue_accounts_tenantId_customerIdentityId_idx" ON "revenue_accounts"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "revenue_accounts_tenantId_customerId_idx" ON "revenue_accounts"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "revenue_accounts_tenantId_ownerUserId_idx" ON "revenue_accounts"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "revenue_accounts_tenantId_renewalDate_idx" ON "revenue_accounts"("tenantId", "renewalDate");

-- CreateIndex
CREATE INDEX "revenue_accounts_tenantId_deletedAt_idx" ON "revenue_accounts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_accounts_tenantId_accountKey_key" ON "revenue_accounts"("tenantId", "accountKey");

-- CreateIndex
CREATE INDEX "revenue_contracts_tenantId_workspaceId_status_contractType_idx" ON "revenue_contracts"("tenantId", "workspaceId", "status", "contractType");

-- CreateIndex
CREATE INDEX "revenue_contracts_tenantId_revenueAccountId_idx" ON "revenue_contracts"("tenantId", "revenueAccountId");

-- CreateIndex
CREATE INDEX "revenue_contracts_tenantId_contractNumber_idx" ON "revenue_contracts"("tenantId", "contractNumber");

-- CreateIndex
CREATE INDEX "revenue_contracts_tenantId_renewalDate_idx" ON "revenue_contracts"("tenantId", "renewalDate");

-- CreateIndex
CREATE INDEX "revenue_contracts_tenantId_deletedAt_idx" ON "revenue_contracts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_contracts_tenantId_contractKey_key" ON "revenue_contracts"("tenantId", "contractKey");

-- CreateIndex
CREATE INDEX "contract_amendments_tenantId_workspaceId_status_amendmentTy_idx" ON "contract_amendments"("tenantId", "workspaceId", "status", "amendmentType");

-- CreateIndex
CREATE INDEX "contract_amendments_tenantId_revenueContractId_idx" ON "contract_amendments"("tenantId", "revenueContractId");

-- CreateIndex
CREATE INDEX "contract_amendments_tenantId_effectiveAt_idx" ON "contract_amendments"("tenantId", "effectiveAt");

-- CreateIndex
CREATE INDEX "contract_amendments_tenantId_deletedAt_idx" ON "contract_amendments"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "contract_amendments_tenantId_amendmentKey_key" ON "contract_amendments"("tenantId", "amendmentKey");

-- CreateIndex
CREATE INDEX "renewal_schedules_tenantId_workspaceId_status_renewalType_idx" ON "renewal_schedules"("tenantId", "workspaceId", "status", "renewalType");

-- CreateIndex
CREATE INDEX "renewal_schedules_tenantId_revenueAccountId_idx" ON "renewal_schedules"("tenantId", "revenueAccountId");

-- CreateIndex
CREATE INDEX "renewal_schedules_tenantId_revenueContractId_idx" ON "renewal_schedules"("tenantId", "revenueContractId");

-- CreateIndex
CREATE INDEX "renewal_schedules_tenantId_ownerUserId_idx" ON "renewal_schedules"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "renewal_schedules_tenantId_renewalDate_idx" ON "renewal_schedules"("tenantId", "renewalDate");

-- CreateIndex
CREATE INDEX "renewal_schedules_tenantId_deletedAt_idx" ON "renewal_schedules"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "renewal_schedules_tenantId_scheduleKey_key" ON "renewal_schedules"("tenantId", "scheduleKey");

-- CreateIndex
CREATE INDEX "renewal_forecasts_tenantId_workspaceId_forecastStatus_riskB_idx" ON "renewal_forecasts"("tenantId", "workspaceId", "forecastStatus", "riskBand");

-- CreateIndex
CREATE INDEX "renewal_forecasts_tenantId_revenueAccountId_idx" ON "renewal_forecasts"("tenantId", "revenueAccountId");

-- CreateIndex
CREATE INDEX "renewal_forecasts_tenantId_renewalScheduleId_idx" ON "renewal_forecasts"("tenantId", "renewalScheduleId");

-- CreateIndex
CREATE INDEX "renewal_forecasts_tenantId_forecastPeriod_idx" ON "renewal_forecasts"("tenantId", "forecastPeriod");

-- CreateIndex
CREATE INDEX "renewal_forecasts_tenantId_forecastDate_idx" ON "renewal_forecasts"("tenantId", "forecastDate");

-- CreateIndex
CREATE INDEX "renewal_forecasts_tenantId_deletedAt_idx" ON "renewal_forecasts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "renewal_forecasts_tenantId_forecastKey_key" ON "renewal_forecasts"("tenantId", "forecastKey");

-- CreateIndex
CREATE INDEX "churn_signals_tenantId_workspaceId_severity_status_idx" ON "churn_signals"("tenantId", "workspaceId", "severity", "status");

-- CreateIndex
CREATE INDEX "churn_signals_tenantId_revenueAccountId_idx" ON "churn_signals"("tenantId", "revenueAccountId");

-- CreateIndex
CREATE INDEX "churn_signals_tenantId_signalType_idx" ON "churn_signals"("tenantId", "signalType");

-- CreateIndex
CREATE INDEX "churn_signals_tenantId_detectedAt_idx" ON "churn_signals"("tenantId", "detectedAt");

-- CreateIndex
CREATE INDEX "churn_signals_tenantId_deletedAt_idx" ON "churn_signals"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "churn_signals_tenantId_signalKey_key" ON "churn_signals"("tenantId", "signalKey");

-- CreateIndex
CREATE INDEX "expansion_opportunities_tenantId_workspaceId_status_priorit_idx" ON "expansion_opportunities"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "expansion_opportunities_tenantId_revenueAccountId_idx" ON "expansion_opportunities"("tenantId", "revenueAccountId");

-- CreateIndex
CREATE INDEX "expansion_opportunities_tenantId_opportunityType_idx" ON "expansion_opportunities"("tenantId", "opportunityType");

-- CreateIndex
CREATE INDEX "expansion_opportunities_tenantId_ownerUserId_idx" ON "expansion_opportunities"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "expansion_opportunities_tenantId_expectedCloseAt_idx" ON "expansion_opportunities"("tenantId", "expectedCloseAt");

-- CreateIndex
CREATE INDEX "expansion_opportunities_tenantId_deletedAt_idx" ON "expansion_opportunities"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "expansion_opportunities_tenantId_opportunityKey_key" ON "expansion_opportunities"("tenantId", "opportunityKey");

-- CreateIndex
CREATE INDEX "account_health_scores_tenantId_workspaceId_scoreBand_trend_idx" ON "account_health_scores"("tenantId", "workspaceId", "scoreBand", "trend");

-- CreateIndex
CREATE INDEX "account_health_scores_tenantId_revenueAccountId_idx" ON "account_health_scores"("tenantId", "revenueAccountId");

-- CreateIndex
CREATE INDEX "account_health_scores_tenantId_calculatedAt_idx" ON "account_health_scores"("tenantId", "calculatedAt");

-- CreateIndex
CREATE INDEX "account_health_scores_tenantId_deletedAt_idx" ON "account_health_scores"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "account_health_scores_tenantId_scoreKey_key" ON "account_health_scores"("tenantId", "scoreKey");

-- CreateIndex
CREATE INDEX "revenue_forecasts_tenantId_workspaceId_forecastType_idx" ON "revenue_forecasts"("tenantId", "workspaceId", "forecastType");

-- CreateIndex
CREATE INDEX "revenue_forecasts_tenantId_revenueAccountId_idx" ON "revenue_forecasts"("tenantId", "revenueAccountId");

-- CreateIndex
CREATE INDEX "revenue_forecasts_tenantId_periodStart_periodEnd_idx" ON "revenue_forecasts"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "revenue_forecasts_tenantId_modelVersion_idx" ON "revenue_forecasts"("tenantId", "modelVersion");

-- CreateIndex
CREATE INDEX "revenue_forecasts_tenantId_deletedAt_idx" ON "revenue_forecasts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_forecasts_tenantId_forecastKey_key" ON "revenue_forecasts"("tenantId", "forecastKey");

-- CreateIndex
CREATE INDEX "revenue_events_tenantId_workspaceId_eventType_severity_idx" ON "revenue_events"("tenantId", "workspaceId", "eventType", "severity");

-- CreateIndex
CREATE INDEX "revenue_events_tenantId_revenueAccountId_idx" ON "revenue_events"("tenantId", "revenueAccountId");

-- CreateIndex
CREATE INDEX "revenue_events_tenantId_revenueContractId_idx" ON "revenue_events"("tenantId", "revenueContractId");

-- CreateIndex
CREATE INDEX "revenue_events_tenantId_subjectType_subjectId_idx" ON "revenue_events"("tenantId", "subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "revenue_events_tenantId_occurredAt_idx" ON "revenue_events"("tenantId", "occurredAt");

-- CreateIndex
CREATE INDEX "revenue_events_tenantId_deletedAt_idx" ON "revenue_events"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_events_tenantId_eventKey_key" ON "revenue_events"("tenantId", "eventKey");

-- CreateIndex
CREATE INDEX "vendors_tenantId_workspaceId_status_riskLevel_idx" ON "vendors"("tenantId", "workspaceId", "status", "riskLevel");

-- CreateIndex
CREATE INDEX "vendors_tenantId_vendorType_tier_idx" ON "vendors"("tenantId", "vendorType", "tier");

-- CreateIndex
CREATE INDEX "vendors_tenantId_ownerUserId_idx" ON "vendors"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "vendors_tenantId_countryCode_idx" ON "vendors"("tenantId", "countryCode");

-- CreateIndex
CREATE INDEX "vendors_tenantId_deletedAt_idx" ON "vendors"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_tenantId_vendorKey_key" ON "vendors"("tenantId", "vendorKey");

-- CreateIndex
CREATE INDEX "vendor_contracts_tenantId_workspaceId_status_contractType_idx" ON "vendor_contracts"("tenantId", "workspaceId", "status", "contractType");

-- CreateIndex
CREATE INDEX "vendor_contracts_tenantId_vendorId_idx" ON "vendor_contracts"("tenantId", "vendorId");

-- CreateIndex
CREATE INDEX "vendor_contracts_tenantId_contractNumber_idx" ON "vendor_contracts"("tenantId", "contractNumber");

-- CreateIndex
CREATE INDEX "vendor_contracts_tenantId_renewalDate_idx" ON "vendor_contracts"("tenantId", "renewalDate");

-- CreateIndex
CREATE INDEX "vendor_contracts_tenantId_deletedAt_idx" ON "vendor_contracts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_contracts_tenantId_contractKey_key" ON "vendor_contracts"("tenantId", "contractKey");

-- CreateIndex
CREATE INDEX "vendor_scorecards_tenantId_workspaceId_scoreBand_idx" ON "vendor_scorecards"("tenantId", "workspaceId", "scoreBand");

-- CreateIndex
CREATE INDEX "vendor_scorecards_tenantId_vendorId_idx" ON "vendor_scorecards"("tenantId", "vendorId");

-- CreateIndex
CREATE INDEX "vendor_scorecards_tenantId_calculatedAt_idx" ON "vendor_scorecards"("tenantId", "calculatedAt");

-- CreateIndex
CREATE INDEX "vendor_scorecards_tenantId_deletedAt_idx" ON "vendor_scorecards"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_scorecards_tenantId_scorecardKey_key" ON "vendor_scorecards"("tenantId", "scorecardKey");

-- CreateIndex
CREATE INDEX "procurement_requests_tenantId_workspaceId_status_priority_idx" ON "procurement_requests"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "procurement_requests_tenantId_vendorId_idx" ON "procurement_requests"("tenantId", "vendorId");

-- CreateIndex
CREATE INDEX "procurement_requests_tenantId_purchaseCategoryId_idx" ON "procurement_requests"("tenantId", "purchaseCategoryId");

-- CreateIndex
CREATE INDEX "procurement_requests_tenantId_requestedByUserId_idx" ON "procurement_requests"("tenantId", "requestedByUserId");

-- CreateIndex
CREATE INDEX "procurement_requests_tenantId_departmentId_idx" ON "procurement_requests"("tenantId", "departmentId");

-- CreateIndex
CREATE INDEX "procurement_requests_tenantId_requestedAt_idx" ON "procurement_requests"("tenantId", "requestedAt");

-- CreateIndex
CREATE INDEX "procurement_requests_tenantId_deletedAt_idx" ON "procurement_requests"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_requests_tenantId_requestKey_key" ON "procurement_requests"("tenantId", "requestKey");

-- CreateIndex
CREATE INDEX "procurement_approvals_tenantId_workspaceId_status_riskLevel_idx" ON "procurement_approvals"("tenantId", "workspaceId", "status", "riskLevel");

-- CreateIndex
CREATE INDEX "procurement_approvals_tenantId_procurementRequestId_idx" ON "procurement_approvals"("tenantId", "procurementRequestId");

-- CreateIndex
CREATE INDEX "procurement_approvals_tenantId_approverUserId_idx" ON "procurement_approvals"("tenantId", "approverUserId");

-- CreateIndex
CREATE INDEX "procurement_approvals_tenantId_decisionAt_idx" ON "procurement_approvals"("tenantId", "decisionAt");

-- CreateIndex
CREATE INDEX "procurement_approvals_tenantId_deletedAt_idx" ON "procurement_approvals"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_approvals_tenantId_approvalKey_key" ON "procurement_approvals"("tenantId", "approvalKey");

-- CreateIndex
CREATE INDEX "purchase_orders_tenantId_workspaceId_status_idx" ON "purchase_orders"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "purchase_orders_tenantId_procurementRequestId_idx" ON "purchase_orders"("tenantId", "procurementRequestId");

-- CreateIndex
CREATE INDEX "purchase_orders_tenantId_vendorId_idx" ON "purchase_orders"("tenantId", "vendorId");

-- CreateIndex
CREATE INDEX "purchase_orders_tenantId_purchaseCategoryId_idx" ON "purchase_orders"("tenantId", "purchaseCategoryId");

-- CreateIndex
CREATE INDEX "purchase_orders_tenantId_purchaseOrderNumber_idx" ON "purchase_orders"("tenantId", "purchaseOrderNumber");

-- CreateIndex
CREATE INDEX "purchase_orders_tenantId_issuedAt_idx" ON "purchase_orders"("tenantId", "issuedAt");

-- CreateIndex
CREATE INDEX "purchase_orders_tenantId_deletedAt_idx" ON "purchase_orders"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_tenantId_orderKey_key" ON "purchase_orders"("tenantId", "orderKey");

-- CreateIndex
CREATE INDEX "purchase_categories_tenantId_workspaceId_status_idx" ON "purchase_categories"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "purchase_categories_tenantId_parentCategoryId_idx" ON "purchase_categories"("tenantId", "parentCategoryId");

-- CreateIndex
CREATE INDEX "purchase_categories_tenantId_budgetOwnerUserId_idx" ON "purchase_categories"("tenantId", "budgetOwnerUserId");

-- CreateIndex
CREATE INDEX "purchase_categories_tenantId_deletedAt_idx" ON "purchase_categories"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_categories_tenantId_categoryKey_key" ON "purchase_categories"("tenantId", "categoryKey");

-- CreateIndex
CREATE INDEX "budget_allocations_tenantId_workspaceId_status_idx" ON "budget_allocations"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "budget_allocations_tenantId_purchaseCategoryId_idx" ON "budget_allocations"("tenantId", "purchaseCategoryId");

-- CreateIndex
CREATE INDEX "budget_allocations_tenantId_departmentId_idx" ON "budget_allocations"("tenantId", "departmentId");

-- CreateIndex
CREATE INDEX "budget_allocations_tenantId_ownerUserId_idx" ON "budget_allocations"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "budget_allocations_tenantId_periodStart_periodEnd_idx" ON "budget_allocations"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "budget_allocations_tenantId_deletedAt_idx" ON "budget_allocations"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "budget_allocations_tenantId_budgetKey_key" ON "budget_allocations"("tenantId", "budgetKey");

-- CreateIndex
CREATE INDEX "spend_transactions_tenantId_workspaceId_status_spendType_idx" ON "spend_transactions"("tenantId", "workspaceId", "status", "spendType");

-- CreateIndex
CREATE INDEX "spend_transactions_tenantId_vendorId_idx" ON "spend_transactions"("tenantId", "vendorId");

-- CreateIndex
CREATE INDEX "spend_transactions_tenantId_purchaseOrderId_idx" ON "spend_transactions"("tenantId", "purchaseOrderId");

-- CreateIndex
CREATE INDEX "spend_transactions_tenantId_purchaseCategoryId_idx" ON "spend_transactions"("tenantId", "purchaseCategoryId");

-- CreateIndex
CREATE INDEX "spend_transactions_tenantId_costCenterId_idx" ON "spend_transactions"("tenantId", "costCenterId");

-- CreateIndex
CREATE INDEX "spend_transactions_tenantId_transactionDate_idx" ON "spend_transactions"("tenantId", "transactionDate");

-- CreateIndex
CREATE INDEX "spend_transactions_tenantId_deletedAt_idx" ON "spend_transactions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "spend_transactions_tenantId_transactionKey_key" ON "spend_transactions"("tenantId", "transactionKey");

-- CreateIndex
CREATE INDEX "spend_insights_tenantId_workspaceId_severity_status_idx" ON "spend_insights"("tenantId", "workspaceId", "severity", "status");

-- CreateIndex
CREATE INDEX "spend_insights_tenantId_insightType_idx" ON "spend_insights"("tenantId", "insightType");

-- CreateIndex
CREATE INDEX "spend_insights_tenantId_purchaseCategoryId_idx" ON "spend_insights"("tenantId", "purchaseCategoryId");

-- CreateIndex
CREATE INDEX "spend_insights_tenantId_timeframeStart_timeframeEnd_idx" ON "spend_insights"("tenantId", "timeframeStart", "timeframeEnd");

-- CreateIndex
CREATE INDEX "spend_insights_tenantId_deletedAt_idx" ON "spend_insights"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "spend_insights_tenantId_insightKey_key" ON "spend_insights"("tenantId", "insightKey");

-- CreateIndex
CREATE INDEX "cost_optimization_recommendations_tenantId_workspaceId_stat_idx" ON "cost_optimization_recommendations"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "cost_optimization_recommendations_tenantId_recommendationTy_idx" ON "cost_optimization_recommendations"("tenantId", "recommendationType");

-- CreateIndex
CREATE INDEX "cost_optimization_recommendations_tenantId_vendorId_idx" ON "cost_optimization_recommendations"("tenantId", "vendorId");

-- CreateIndex
CREATE INDEX "cost_optimization_recommendations_tenantId_purchaseCategory_idx" ON "cost_optimization_recommendations"("tenantId", "purchaseCategoryId");

-- CreateIndex
CREATE INDEX "cost_optimization_recommendations_tenantId_detectedAt_idx" ON "cost_optimization_recommendations"("tenantId", "detectedAt");

-- CreateIndex
CREATE INDEX "cost_optimization_recommendations_tenantId_deletedAt_idx" ON "cost_optimization_recommendations"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "cost_optimization_recommendations_tenantId_recommendationKe_key" ON "cost_optimization_recommendations"("tenantId", "recommendationKey");

-- CreateIndex
CREATE INDEX "procurement_events_tenantId_workspaceId_eventType_severity_idx" ON "procurement_events"("tenantId", "workspaceId", "eventType", "severity");

-- CreateIndex
CREATE INDEX "procurement_events_tenantId_vendorId_idx" ON "procurement_events"("tenantId", "vendorId");

-- CreateIndex
CREATE INDEX "procurement_events_tenantId_procurementRequestId_idx" ON "procurement_events"("tenantId", "procurementRequestId");

-- CreateIndex
CREATE INDEX "procurement_events_tenantId_purchaseOrderId_idx" ON "procurement_events"("tenantId", "purchaseOrderId");

-- CreateIndex
CREATE INDEX "procurement_events_tenantId_subjectType_subjectId_idx" ON "procurement_events"("tenantId", "subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "procurement_events_tenantId_occurredAt_idx" ON "procurement_events"("tenantId", "occurredAt");

-- CreateIndex
CREATE INDEX "procurement_events_tenantId_deletedAt_idx" ON "procurement_events"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_events_tenantId_eventKey_key" ON "procurement_events"("tenantId", "eventKey");

-- CreateIndex
CREATE INDEX "supply_chain_items_tenantId_workspaceId_status_itemType_idx" ON "supply_chain_items"("tenantId", "workspaceId", "status", "itemType");

-- CreateIndex
CREATE INDEX "supply_chain_items_tenantId_category_idx" ON "supply_chain_items"("tenantId", "category");

-- CreateIndex
CREATE INDEX "supply_chain_items_tenantId_deletedAt_idx" ON "supply_chain_items"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "supply_chain_items_tenantId_itemKey_key" ON "supply_chain_items"("tenantId", "itemKey");

-- CreateIndex
CREATE UNIQUE INDEX "supply_chain_items_tenantId_sku_key" ON "supply_chain_items"("tenantId", "sku");

-- CreateIndex
CREATE INDEX "warehouses_tenantId_workspaceId_status_warehouseType_idx" ON "warehouses"("tenantId", "workspaceId", "status", "warehouseType");

-- CreateIndex
CREATE INDEX "warehouses_tenantId_countryCode_region_idx" ON "warehouses"("tenantId", "countryCode", "region");

-- CreateIndex
CREATE INDEX "warehouses_tenantId_deletedAt_idx" ON "warehouses"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_tenantId_warehouseKey_key" ON "warehouses"("tenantId", "warehouseKey");

-- CreateIndex
CREATE INDEX "warehouse_zones_tenantId_workspaceId_status_zoneType_idx" ON "warehouse_zones"("tenantId", "workspaceId", "status", "zoneType");

-- CreateIndex
CREATE INDEX "warehouse_zones_tenantId_warehouseId_idx" ON "warehouse_zones"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "warehouse_zones_tenantId_deletedAt_idx" ON "warehouse_zones"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_zones_tenantId_zoneKey_key" ON "warehouse_zones"("tenantId", "zoneKey");

-- CreateIndex
CREATE INDEX "warehouse_bins_tenantId_workspaceId_status_binType_idx" ON "warehouse_bins"("tenantId", "workspaceId", "status", "binType");

-- CreateIndex
CREATE INDEX "warehouse_bins_tenantId_warehouseId_idx" ON "warehouse_bins"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "warehouse_bins_tenantId_zoneId_idx" ON "warehouse_bins"("tenantId", "zoneId");

-- CreateIndex
CREATE INDEX "warehouse_bins_tenantId_code_idx" ON "warehouse_bins"("tenantId", "code");

-- CreateIndex
CREATE INDEX "warehouse_bins_tenantId_deletedAt_idx" ON "warehouse_bins"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_bins_tenantId_binKey_key" ON "warehouse_bins"("tenantId", "binKey");

-- CreateIndex
CREATE INDEX "stock_balances_tenantId_workspaceId_status_idx" ON "stock_balances"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "stock_balances_tenantId_itemId_idx" ON "stock_balances"("tenantId", "itemId");

-- CreateIndex
CREATE INDEX "stock_balances_tenantId_warehouseId_zoneId_binId_idx" ON "stock_balances"("tenantId", "warehouseId", "zoneId", "binId");

-- CreateIndex
CREATE INDEX "stock_balances_tenantId_batchId_idx" ON "stock_balances"("tenantId", "batchId");

-- CreateIndex
CREATE INDEX "stock_balances_tenantId_deletedAt_idx" ON "stock_balances"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "stock_balances_tenantId_stockKey_key" ON "stock_balances"("tenantId", "stockKey");

-- CreateIndex
CREATE INDEX "inventory_batches_tenantId_workspaceId_status_qualityStatus_idx" ON "inventory_batches"("tenantId", "workspaceId", "status", "qualityStatus");

-- CreateIndex
CREATE INDEX "inventory_batches_tenantId_itemId_idx" ON "inventory_batches"("tenantId", "itemId");

-- CreateIndex
CREATE INDEX "inventory_batches_tenantId_batchNumber_idx" ON "inventory_batches"("tenantId", "batchNumber");

-- CreateIndex
CREATE INDEX "inventory_batches_tenantId_expiresAt_idx" ON "inventory_batches"("tenantId", "expiresAt");

-- CreateIndex
CREATE INDEX "inventory_batches_tenantId_deletedAt_idx" ON "inventory_batches"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_batches_tenantId_batchKey_key" ON "inventory_batches"("tenantId", "batchKey");

-- CreateIndex
CREATE INDEX "inventory_serials_tenantId_workspaceId_status_idx" ON "inventory_serials"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "inventory_serials_tenantId_itemId_idx" ON "inventory_serials"("tenantId", "itemId");

-- CreateIndex
CREATE INDEX "inventory_serials_tenantId_batchId_idx" ON "inventory_serials"("tenantId", "batchId");

-- CreateIndex
CREATE INDEX "inventory_serials_tenantId_currentWarehouseId_currentBinId_idx" ON "inventory_serials"("tenantId", "currentWarehouseId", "currentBinId");

-- CreateIndex
CREATE INDEX "inventory_serials_tenantId_deletedAt_idx" ON "inventory_serials"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_serials_tenantId_serialKey_key" ON "inventory_serials"("tenantId", "serialKey");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_serials_tenantId_serialNumber_key" ON "inventory_serials"("tenantId", "serialNumber");

-- CreateIndex
CREATE INDEX "inventory_audits_tenantId_workspaceId_status_auditType_idx" ON "inventory_audits"("tenantId", "workspaceId", "status", "auditType");

-- CreateIndex
CREATE INDEX "inventory_audits_tenantId_itemId_idx" ON "inventory_audits"("tenantId", "itemId");

-- CreateIndex
CREATE INDEX "inventory_audits_tenantId_warehouseId_idx" ON "inventory_audits"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "inventory_audits_tenantId_auditedAt_idx" ON "inventory_audits"("tenantId", "auditedAt");

-- CreateIndex
CREATE INDEX "inventory_audits_tenantId_deletedAt_idx" ON "inventory_audits"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_audits_tenantId_auditKey_key" ON "inventory_audits"("tenantId", "auditKey");

-- CreateIndex
CREATE INDEX "inventory_movement_history_tenantId_workspaceId_status_move_idx" ON "inventory_movement_history"("tenantId", "workspaceId", "status", "movementType");

-- CreateIndex
CREATE INDEX "inventory_movement_history_tenantId_itemId_idx" ON "inventory_movement_history"("tenantId", "itemId");

-- CreateIndex
CREATE INDEX "inventory_movement_history_tenantId_warehouseId_idx" ON "inventory_movement_history"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "inventory_movement_history_tenantId_referenceType_reference_idx" ON "inventory_movement_history"("tenantId", "referenceType", "referenceId");

-- CreateIndex
CREATE INDEX "inventory_movement_history_tenantId_occurredAt_idx" ON "inventory_movement_history"("tenantId", "occurredAt");

-- CreateIndex
CREATE INDEX "inventory_movement_history_tenantId_deletedAt_idx" ON "inventory_movement_history"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_movement_history_tenantId_movementKey_key" ON "inventory_movement_history"("tenantId", "movementKey");

-- CreateIndex
CREATE INDEX "inventory_transfers_tenantId_workspaceId_status_priority_idx" ON "inventory_transfers"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "inventory_transfers_tenantId_sourceWarehouseId_idx" ON "inventory_transfers"("tenantId", "sourceWarehouseId");

-- CreateIndex
CREATE INDEX "inventory_transfers_tenantId_destinationWarehouseId_idx" ON "inventory_transfers"("tenantId", "destinationWarehouseId");

-- CreateIndex
CREATE INDEX "inventory_transfers_tenantId_requestedAt_idx" ON "inventory_transfers"("tenantId", "requestedAt");

-- CreateIndex
CREATE INDEX "inventory_transfers_tenantId_deletedAt_idx" ON "inventory_transfers"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_transfers_tenantId_transferKey_key" ON "inventory_transfers"("tenantId", "transferKey");

-- CreateIndex
CREATE INDEX "receiving_records_tenantId_workspaceId_status_qualityStatus_idx" ON "receiving_records"("tenantId", "workspaceId", "status", "qualityStatus");

-- CreateIndex
CREATE INDEX "receiving_records_tenantId_warehouseId_idx" ON "receiving_records"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "receiving_records_tenantId_itemId_idx" ON "receiving_records"("tenantId", "itemId");

-- CreateIndex
CREATE INDEX "receiving_records_tenantId_vendorId_idx" ON "receiving_records"("tenantId", "vendorId");

-- CreateIndex
CREATE INDEX "receiving_records_tenantId_receivedAt_idx" ON "receiving_records"("tenantId", "receivedAt");

-- CreateIndex
CREATE INDEX "receiving_records_tenantId_deletedAt_idx" ON "receiving_records"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "receiving_records_tenantId_receivingKey_key" ON "receiving_records"("tenantId", "receivingKey");

-- CreateIndex
CREATE INDEX "fulfillment_orders_tenantId_workspaceId_status_priority_idx" ON "fulfillment_orders"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "fulfillment_orders_tenantId_warehouseId_idx" ON "fulfillment_orders"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "fulfillment_orders_tenantId_customerId_idx" ON "fulfillment_orders"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "fulfillment_orders_tenantId_promisedAt_idx" ON "fulfillment_orders"("tenantId", "promisedAt");

-- CreateIndex
CREATE INDEX "fulfillment_orders_tenantId_deletedAt_idx" ON "fulfillment_orders"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "fulfillment_orders_tenantId_fulfillmentKey_key" ON "fulfillment_orders"("tenantId", "fulfillmentKey");

-- CreateIndex
CREATE UNIQUE INDEX "fulfillment_orders_tenantId_orderNumber_key" ON "fulfillment_orders"("tenantId", "orderNumber");

-- CreateIndex
CREATE INDEX "picking_tasks_tenantId_workspaceId_status_priority_idx" ON "picking_tasks"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "picking_tasks_tenantId_fulfillmentOrderId_idx" ON "picking_tasks"("tenantId", "fulfillmentOrderId");

-- CreateIndex
CREATE INDEX "picking_tasks_tenantId_itemId_idx" ON "picking_tasks"("tenantId", "itemId");

-- CreateIndex
CREATE INDEX "picking_tasks_tenantId_sourceBinId_idx" ON "picking_tasks"("tenantId", "sourceBinId");

-- CreateIndex
CREATE INDEX "picking_tasks_tenantId_assignedToUserId_idx" ON "picking_tasks"("tenantId", "assignedToUserId");

-- CreateIndex
CREATE INDEX "picking_tasks_tenantId_deletedAt_idx" ON "picking_tasks"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "picking_tasks_tenantId_taskKey_key" ON "picking_tasks"("tenantId", "taskKey");

-- CreateIndex
CREATE INDEX "packing_tasks_tenantId_workspaceId_status_idx" ON "packing_tasks"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "packing_tasks_tenantId_fulfillmentOrderId_idx" ON "packing_tasks"("tenantId", "fulfillmentOrderId");

-- CreateIndex
CREATE INDEX "packing_tasks_tenantId_assignedToUserId_idx" ON "packing_tasks"("tenantId", "assignedToUserId");

-- CreateIndex
CREATE INDEX "packing_tasks_tenantId_deletedAt_idx" ON "packing_tasks"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "packing_tasks_tenantId_taskKey_key" ON "packing_tasks"("tenantId", "taskKey");

-- CreateIndex
CREATE INDEX "shipments_tenantId_workspaceId_status_idx" ON "shipments"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "shipments_tenantId_trackingNumber_idx" ON "shipments"("tenantId", "trackingNumber");

-- CreateIndex
CREATE INDEX "shipments_tenantId_fulfillmentOrderId_idx" ON "shipments"("tenantId", "fulfillmentOrderId");

-- CreateIndex
CREATE INDEX "shipments_tenantId_warehouseId_idx" ON "shipments"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "shipments_tenantId_carrierId_idx" ON "shipments"("tenantId", "carrierId");

-- CreateIndex
CREATE INDEX "shipments_tenantId_predictedEta_idx" ON "shipments"("tenantId", "predictedEta");

-- CreateIndex
CREATE INDEX "shipments_tenantId_deletedAt_idx" ON "shipments"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_tenantId_shipmentKey_key" ON "shipments"("tenantId", "shipmentKey");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_tenantId_shipmentNumber_key" ON "shipments"("tenantId", "shipmentNumber");

-- CreateIndex
CREATE INDEX "shipment_tracking_events_tenantId_workspaceId_eventType_sta_idx" ON "shipment_tracking_events"("tenantId", "workspaceId", "eventType", "status");

-- CreateIndex
CREATE INDEX "shipment_tracking_events_tenantId_shipmentId_idx" ON "shipment_tracking_events"("tenantId", "shipmentId");

-- CreateIndex
CREATE INDEX "shipment_tracking_events_tenantId_occurredAt_idx" ON "shipment_tracking_events"("tenantId", "occurredAt");

-- CreateIndex
CREATE INDEX "shipment_tracking_events_tenantId_exceptionCode_idx" ON "shipment_tracking_events"("tenantId", "exceptionCode");

-- CreateIndex
CREATE INDEX "shipment_tracking_events_tenantId_deletedAt_idx" ON "shipment_tracking_events"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "shipment_tracking_events_tenantId_eventKey_key" ON "shipment_tracking_events"("tenantId", "eventKey");

-- CreateIndex
CREATE INDEX "carriers_tenantId_workspaceId_status_carrierType_idx" ON "carriers"("tenantId", "workspaceId", "status", "carrierType");

-- CreateIndex
CREATE INDEX "carriers_tenantId_deletedAt_idx" ON "carriers"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "carriers_tenantId_carrierKey_key" ON "carriers"("tenantId", "carrierKey");

-- CreateIndex
CREATE INDEX "distribution_centers_tenantId_workspaceId_status_networkRol_idx" ON "distribution_centers"("tenantId", "workspaceId", "status", "networkRole");

-- CreateIndex
CREATE INDEX "distribution_centers_tenantId_warehouseId_idx" ON "distribution_centers"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "distribution_centers_tenantId_region_idx" ON "distribution_centers"("tenantId", "region");

-- CreateIndex
CREATE INDEX "distribution_centers_tenantId_deletedAt_idx" ON "distribution_centers"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_centers_tenantId_centerKey_key" ON "distribution_centers"("tenantId", "centerKey");

-- CreateIndex
CREATE INDEX "route_optimization_plans_tenantId_workspaceId_status_optimi_idx" ON "route_optimization_plans"("tenantId", "workspaceId", "status", "optimizationGoal");

-- CreateIndex
CREATE INDEX "route_optimization_plans_tenantId_carrierId_idx" ON "route_optimization_plans"("tenantId", "carrierId");

-- CreateIndex
CREATE INDEX "route_optimization_plans_tenantId_originCenterId_idx" ON "route_optimization_plans"("tenantId", "originCenterId");

-- CreateIndex
CREATE INDEX "route_optimization_plans_tenantId_destinationCenterId_idx" ON "route_optimization_plans"("tenantId", "destinationCenterId");

-- CreateIndex
CREATE INDEX "route_optimization_plans_tenantId_deletedAt_idx" ON "route_optimization_plans"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "route_optimization_plans_tenantId_routeKey_key" ON "route_optimization_plans"("tenantId", "routeKey");

-- CreateIndex
CREATE INDEX "demand_forecast_models_tenantId_workspaceId_status_modelTyp_idx" ON "demand_forecast_models"("tenantId", "workspaceId", "status", "modelType");

-- CreateIndex
CREATE INDEX "demand_forecast_models_tenantId_accuracyScore_idx" ON "demand_forecast_models"("tenantId", "accuracyScore");

-- CreateIndex
CREATE INDEX "demand_forecast_models_tenantId_deletedAt_idx" ON "demand_forecast_models"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "demand_forecast_models_tenantId_modelKey_key" ON "demand_forecast_models"("tenantId", "modelKey");

-- CreateIndex
CREATE INDEX "demand_forecast_scenarios_tenantId_workspaceId_status_scena_idx" ON "demand_forecast_scenarios"("tenantId", "workspaceId", "status", "scenarioType");

-- CreateIndex
CREATE INDEX "demand_forecast_scenarios_tenantId_modelId_idx" ON "demand_forecast_scenarios"("tenantId", "modelId");

-- CreateIndex
CREATE INDEX "demand_forecast_scenarios_tenantId_itemId_idx" ON "demand_forecast_scenarios"("tenantId", "itemId");

-- CreateIndex
CREATE INDEX "demand_forecast_scenarios_tenantId_periodStart_periodEnd_idx" ON "demand_forecast_scenarios"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "demand_forecast_scenarios_tenantId_deletedAt_idx" ON "demand_forecast_scenarios"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "demand_forecast_scenarios_tenantId_scenarioKey_key" ON "demand_forecast_scenarios"("tenantId", "scenarioKey");

-- CreateIndex
CREATE INDEX "replenishment_plans_tenantId_workspaceId_status_priority_idx" ON "replenishment_plans"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "replenishment_plans_tenantId_itemId_idx" ON "replenishment_plans"("tenantId", "itemId");

-- CreateIndex
CREATE INDEX "replenishment_plans_tenantId_warehouseId_idx" ON "replenishment_plans"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "replenishment_plans_tenantId_plannedOrderDate_idx" ON "replenishment_plans"("tenantId", "plannedOrderDate");

-- CreateIndex
CREATE INDEX "replenishment_plans_tenantId_deletedAt_idx" ON "replenishment_plans"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "replenishment_plans_tenantId_planKey_key" ON "replenishment_plans"("tenantId", "planKey");

-- CreateIndex
CREATE INDEX "supply_chain_risks_tenantId_workspaceId_riskType_severity_idx" ON "supply_chain_risks"("tenantId", "workspaceId", "riskType", "severity");

-- CreateIndex
CREATE INDEX "supply_chain_risks_tenantId_status_idx" ON "supply_chain_risks"("tenantId", "status");

-- CreateIndex
CREATE INDEX "supply_chain_risks_tenantId_subjectType_subjectId_idx" ON "supply_chain_risks"("tenantId", "subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "supply_chain_risks_tenantId_detectedAt_idx" ON "supply_chain_risks"("tenantId", "detectedAt");

-- CreateIndex
CREATE INDEX "supply_chain_risks_tenantId_deletedAt_idx" ON "supply_chain_risks"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "supply_chain_risks_tenantId_riskKey_key" ON "supply_chain_risks"("tenantId", "riskKey");

-- CreateIndex
CREATE INDEX "supply_chain_insights_tenantId_workspaceId_insightType_seve_idx" ON "supply_chain_insights"("tenantId", "workspaceId", "insightType", "severity");

-- CreateIndex
CREATE INDEX "supply_chain_insights_tenantId_status_idx" ON "supply_chain_insights"("tenantId", "status");

-- CreateIndex
CREATE INDEX "supply_chain_insights_tenantId_generatedAt_idx" ON "supply_chain_insights"("tenantId", "generatedAt");

-- CreateIndex
CREATE INDEX "supply_chain_insights_tenantId_deletedAt_idx" ON "supply_chain_insights"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "supply_chain_insights_tenantId_insightKey_key" ON "supply_chain_insights"("tenantId", "insightKey");

-- CreateIndex
CREATE INDEX "supply_chain_copilot_queries_tenantId_workspaceId_status_idx" ON "supply_chain_copilot_queries"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "supply_chain_copilot_queries_tenantId_userId_idx" ON "supply_chain_copilot_queries"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "supply_chain_copilot_queries_tenantId_createdAt_idx" ON "supply_chain_copilot_queries"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "supply_chain_copilot_queries_tenantId_deletedAt_idx" ON "supply_chain_copilot_queries"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "supply_chain_copilot_queries_tenantId_queryKey_key" ON "supply_chain_copilot_queries"("tenantId", "queryKey");

-- CreateIndex
CREATE INDEX "product_health_scores_tenantId_workspaceId_productKey_score_idx" ON "product_health_scores"("tenantId", "workspaceId", "productKey", "scoreBand");

-- CreateIndex
CREATE INDEX "product_health_scores_tenantId_moduleKey_idx" ON "product_health_scores"("tenantId", "moduleKey");

-- CreateIndex
CREATE INDEX "product_health_scores_tenantId_calculatedAt_idx" ON "product_health_scores"("tenantId", "calculatedAt");

-- CreateIndex
CREATE INDEX "product_health_scores_tenantId_deletedAt_idx" ON "product_health_scores"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "product_health_scores_tenantId_scoreKey_key" ON "product_health_scores"("tenantId", "scoreKey");

-- CreateIndex
CREATE INDEX "product_usage_metrics_tenantId_workspaceId_metricType_metri_idx" ON "product_usage_metrics"("tenantId", "workspaceId", "metricType", "metricName");

-- CreateIndex
CREATE INDEX "product_usage_metrics_tenantId_moduleKey_idx" ON "product_usage_metrics"("tenantId", "moduleKey");

-- CreateIndex
CREATE INDEX "product_usage_metrics_tenantId_featureKey_idx" ON "product_usage_metrics"("tenantId", "featureKey");

-- CreateIndex
CREATE INDEX "product_usage_metrics_tenantId_periodStart_periodEnd_idx" ON "product_usage_metrics"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "product_usage_metrics_tenantId_deletedAt_idx" ON "product_usage_metrics"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "product_usage_metrics_tenantId_metricKey_key" ON "product_usage_metrics"("tenantId", "metricKey");

-- CreateIndex
CREATE INDEX "user_journeys_tenantId_workspaceId_journeyType_status_idx" ON "user_journeys"("tenantId", "workspaceId", "journeyType", "status");

-- CreateIndex
CREATE INDEX "user_journeys_tenantId_userId_idx" ON "user_journeys"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "user_journeys_tenantId_customerIdentityId_idx" ON "user_journeys"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "user_journeys_tenantId_sessionId_idx" ON "user_journeys"("tenantId", "sessionId");

-- CreateIndex
CREATE INDEX "user_journeys_tenantId_startedAt_idx" ON "user_journeys"("tenantId", "startedAt");

-- CreateIndex
CREATE INDEX "user_journeys_tenantId_deletedAt_idx" ON "user_journeys"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_journeys_tenantId_journeyKey_key" ON "user_journeys"("tenantId", "journeyKey");

-- CreateIndex
CREATE INDEX "journey_steps_tenantId_workspaceId_stepType_status_idx" ON "journey_steps"("tenantId", "workspaceId", "stepType", "status");

-- CreateIndex
CREATE INDEX "journey_steps_tenantId_journeyId_orderIndex_idx" ON "journey_steps"("tenantId", "journeyId", "orderIndex");

-- CreateIndex
CREATE INDEX "journey_steps_tenantId_featureKey_idx" ON "journey_steps"("tenantId", "featureKey");

-- CreateIndex
CREATE INDEX "journey_steps_tenantId_moduleKey_idx" ON "journey_steps"("tenantId", "moduleKey");

-- CreateIndex
CREATE INDEX "journey_steps_tenantId_enteredAt_idx" ON "journey_steps"("tenantId", "enteredAt");

-- CreateIndex
CREATE INDEX "journey_steps_tenantId_deletedAt_idx" ON "journey_steps"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "journey_steps_tenantId_stepKey_key" ON "journey_steps"("tenantId", "stepKey");

-- CreateIndex
CREATE INDEX "product_events_tenantId_workspaceId_eventName_idx" ON "product_events"("tenantId", "workspaceId", "eventName");

-- CreateIndex
CREATE INDEX "product_events_tenantId_userId_idx" ON "product_events"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "product_events_tenantId_customerIdentityId_idx" ON "product_events"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "product_events_tenantId_sessionId_idx" ON "product_events"("tenantId", "sessionId");

-- CreateIndex
CREATE INDEX "product_events_tenantId_journeyId_idx" ON "product_events"("tenantId", "journeyId");

-- CreateIndex
CREATE INDEX "product_events_tenantId_moduleKey_featureKey_idx" ON "product_events"("tenantId", "moduleKey", "featureKey");

-- CreateIndex
CREATE INDEX "product_events_tenantId_occurredAt_idx" ON "product_events"("tenantId", "occurredAt");

-- CreateIndex
CREATE INDEX "product_events_tenantId_deletedAt_idx" ON "product_events"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "product_events_tenantId_eventKey_key" ON "product_events"("tenantId", "eventKey");

-- CreateIndex
CREATE INDEX "session_analytics_tenantId_workspaceId_source_idx" ON "session_analytics"("tenantId", "workspaceId", "source");

-- CreateIndex
CREATE INDEX "session_analytics_tenantId_userId_idx" ON "session_analytics"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "session_analytics_tenantId_customerIdentityId_idx" ON "session_analytics"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "session_analytics_tenantId_deviceId_idx" ON "session_analytics"("tenantId", "deviceId");

-- CreateIndex
CREATE INDEX "session_analytics_tenantId_startedAt_idx" ON "session_analytics"("tenantId", "startedAt");

-- CreateIndex
CREATE INDEX "session_analytics_tenantId_deletedAt_idx" ON "session_analytics"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "session_analytics_tenantId_sessionKey_key" ON "session_analytics"("tenantId", "sessionKey");

-- CreateIndex
CREATE INDEX "feature_usage_tenantId_workspaceId_moduleKey_featureKey_idx" ON "feature_usage"("tenantId", "workspaceId", "moduleKey", "featureKey");

-- CreateIndex
CREATE INDEX "feature_usage_tenantId_userId_idx" ON "feature_usage"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "feature_usage_tenantId_teamId_idx" ON "feature_usage"("tenantId", "teamId");

-- CreateIndex
CREATE INDEX "feature_usage_tenantId_periodStart_periodEnd_idx" ON "feature_usage"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "feature_usage_tenantId_deletedAt_idx" ON "feature_usage"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "feature_usage_tenantId_usageKey_key" ON "feature_usage"("tenantId", "usageKey");

-- CreateIndex
CREATE INDEX "funnel_definitions_tenantId_workspaceId_funnelType_status_idx" ON "funnel_definitions"("tenantId", "workspaceId", "funnelType", "status");

-- CreateIndex
CREATE INDEX "funnel_definitions_tenantId_ownerUserId_idx" ON "funnel_definitions"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "funnel_definitions_tenantId_deletedAt_idx" ON "funnel_definitions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "funnel_definitions_tenantId_funnelKey_key" ON "funnel_definitions"("tenantId", "funnelKey");

-- CreateIndex
CREATE INDEX "funnel_stages_tenantId_workspaceId_funnelId_orderIndex_idx" ON "funnel_stages"("tenantId", "workspaceId", "funnelId", "orderIndex");

-- CreateIndex
CREATE INDEX "funnel_stages_tenantId_eventName_idx" ON "funnel_stages"("tenantId", "eventName");

-- CreateIndex
CREATE INDEX "funnel_stages_tenantId_deletedAt_idx" ON "funnel_stages"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "funnel_stages_tenantId_stageKey_key" ON "funnel_stages"("tenantId", "stageKey");

-- CreateIndex
CREATE INDEX "funnel_results_tenantId_workspaceId_funnelId_idx" ON "funnel_results"("tenantId", "workspaceId", "funnelId");

-- CreateIndex
CREATE INDEX "funnel_results_tenantId_periodStart_periodEnd_idx" ON "funnel_results"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "funnel_results_tenantId_calculatedAt_idx" ON "funnel_results"("tenantId", "calculatedAt");

-- CreateIndex
CREATE INDEX "funnel_results_tenantId_deletedAt_idx" ON "funnel_results"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "funnel_results_tenantId_resultKey_key" ON "funnel_results"("tenantId", "resultKey");

-- CreateIndex
CREATE INDEX "experiments_tenantId_workspaceId_experimentType_status_idx" ON "experiments"("tenantId", "workspaceId", "experimentType", "status");

-- CreateIndex
CREATE INDEX "experiments_tenantId_ownerUserId_idx" ON "experiments"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "experiments_tenantId_startedAt_idx" ON "experiments"("tenantId", "startedAt");

-- CreateIndex
CREATE INDEX "experiments_tenantId_deletedAt_idx" ON "experiments"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "experiments_tenantId_experimentKey_key" ON "experiments"("tenantId", "experimentKey");

-- CreateIndex
CREATE INDEX "experiment_variants_tenantId_workspaceId_experimentId_idx" ON "experiment_variants"("tenantId", "workspaceId", "experimentId");

-- CreateIndex
CREATE INDEX "experiment_variants_tenantId_isControl_idx" ON "experiment_variants"("tenantId", "isControl");

-- CreateIndex
CREATE INDEX "experiment_variants_tenantId_deletedAt_idx" ON "experiment_variants"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "experiment_variants_tenantId_variantKey_key" ON "experiment_variants"("tenantId", "variantKey");

-- CreateIndex
CREATE INDEX "experiment_results_tenantId_workspaceId_experimentId_idx" ON "experiment_results"("tenantId", "workspaceId", "experimentId");

-- CreateIndex
CREATE INDEX "experiment_results_tenantId_variantId_idx" ON "experiment_results"("tenantId", "variantId");

-- CreateIndex
CREATE INDEX "experiment_results_tenantId_significant_idx" ON "experiment_results"("tenantId", "significant");

-- CreateIndex
CREATE INDEX "experiment_results_tenantId_evaluatedAt_idx" ON "experiment_results"("tenantId", "evaluatedAt");

-- CreateIndex
CREATE INDEX "experiment_results_tenantId_deletedAt_idx" ON "experiment_results"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "experiment_results_tenantId_resultKey_key" ON "experiment_results"("tenantId", "resultKey");

-- CreateIndex
CREATE INDEX "retention_cohorts_tenantId_workspaceId_cohortType_idx" ON "retention_cohorts"("tenantId", "workspaceId", "cohortType");

-- CreateIndex
CREATE INDEX "retention_cohorts_tenantId_periodStart_periodEnd_idx" ON "retention_cohorts"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "retention_cohorts_tenantId_calculatedAt_idx" ON "retention_cohorts"("tenantId", "calculatedAt");

-- CreateIndex
CREATE INDEX "retention_cohorts_tenantId_deletedAt_idx" ON "retention_cohorts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "retention_cohorts_tenantId_cohortKey_key" ON "retention_cohorts"("tenantId", "cohortKey");

-- CreateIndex
CREATE INDEX "engagement_scores_tenantId_workspaceId_scoreBand_idx" ON "engagement_scores"("tenantId", "workspaceId", "scoreBand");

-- CreateIndex
CREATE INDEX "engagement_scores_tenantId_userId_idx" ON "engagement_scores"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "engagement_scores_tenantId_customerIdentityId_idx" ON "engagement_scores"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "engagement_scores_tenantId_teamId_idx" ON "engagement_scores"("tenantId", "teamId");

-- CreateIndex
CREATE INDEX "engagement_scores_tenantId_calculatedAt_idx" ON "engagement_scores"("tenantId", "calculatedAt");

-- CreateIndex
CREATE INDEX "engagement_scores_tenantId_deletedAt_idx" ON "engagement_scores"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "engagement_scores_tenantId_scoreKey_key" ON "engagement_scores"("tenantId", "scoreKey");

-- CreateIndex
CREATE INDEX "growth_recommendations_tenantId_workspaceId_recommendationT_idx" ON "growth_recommendations"("tenantId", "workspaceId", "recommendationType", "status");

-- CreateIndex
CREATE INDEX "growth_recommendations_tenantId_priority_idx" ON "growth_recommendations"("tenantId", "priority");

-- CreateIndex
CREATE INDEX "growth_recommendations_tenantId_targetType_targetId_idx" ON "growth_recommendations"("tenantId", "targetType", "targetId");

-- CreateIndex
CREATE INDEX "growth_recommendations_tenantId_ownerUserId_idx" ON "growth_recommendations"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "growth_recommendations_tenantId_dueAt_idx" ON "growth_recommendations"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "growth_recommendations_tenantId_deletedAt_idx" ON "growth_recommendations"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "growth_recommendations_tenantId_recommendationKey_key" ON "growth_recommendations"("tenantId", "recommendationKey");

-- CreateIndex
CREATE INDEX "forecast_models_tenantId_workspaceId_forecastType_status_idx" ON "forecast_models"("tenantId", "workspaceId", "forecastType", "status");

-- CreateIndex
CREATE INDEX "forecast_models_tenantId_ownerUserId_idx" ON "forecast_models"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "forecast_models_tenantId_lastTrainedAt_idx" ON "forecast_models"("tenantId", "lastTrainedAt");

-- CreateIndex
CREATE INDEX "forecast_models_tenantId_deletedAt_idx" ON "forecast_models"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "forecast_models_tenantId_modelKey_key" ON "forecast_models"("tenantId", "modelKey");

-- CreateIndex
CREATE INDEX "forecast_results_tenantId_workspaceId_forecastType_idx" ON "forecast_results"("tenantId", "workspaceId", "forecastType");

-- CreateIndex
CREATE INDEX "forecast_results_tenantId_forecastModelId_idx" ON "forecast_results"("tenantId", "forecastModelId");

-- CreateIndex
CREATE INDEX "forecast_results_tenantId_horizonStart_horizonEnd_idx" ON "forecast_results"("tenantId", "horizonStart", "horizonEnd");

-- CreateIndex
CREATE INDEX "forecast_results_tenantId_generatedAt_idx" ON "forecast_results"("tenantId", "generatedAt");

-- CreateIndex
CREATE INDEX "forecast_results_tenantId_deletedAt_idx" ON "forecast_results"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "forecast_results_tenantId_resultKey_key" ON "forecast_results"("tenantId", "resultKey");

-- CreateIndex
CREATE INDEX "prediction_models_tenantId_workspaceId_predictionType_statu_idx" ON "prediction_models"("tenantId", "workspaceId", "predictionType", "status");

-- CreateIndex
CREATE INDEX "prediction_models_tenantId_targetEntity_idx" ON "prediction_models"("tenantId", "targetEntity");

-- CreateIndex
CREATE INDEX "prediction_models_tenantId_ownerUserId_idx" ON "prediction_models"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "prediction_models_tenantId_deletedAt_idx" ON "prediction_models"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "prediction_models_tenantId_modelKey_key" ON "prediction_models"("tenantId", "modelKey");

-- CreateIndex
CREATE INDEX "prediction_results_tenantId_workspaceId_predictionType_band_idx" ON "prediction_results"("tenantId", "workspaceId", "predictionType", "band");

-- CreateIndex
CREATE INDEX "prediction_results_tenantId_predictionModelId_idx" ON "prediction_results"("tenantId", "predictionModelId");

-- CreateIndex
CREATE INDEX "prediction_results_tenantId_targetType_targetId_idx" ON "prediction_results"("tenantId", "targetType", "targetId");

-- CreateIndex
CREATE INDEX "prediction_results_tenantId_generatedAt_idx" ON "prediction_results"("tenantId", "generatedAt");

-- CreateIndex
CREATE INDEX "prediction_results_tenantId_deletedAt_idx" ON "prediction_results"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "prediction_results_tenantId_resultKey_key" ON "prediction_results"("tenantId", "resultKey");

-- CreateIndex
CREATE INDEX "strategic_plans_tenantId_workspaceId_planType_status_idx" ON "strategic_plans"("tenantId", "workspaceId", "planType", "status");

-- CreateIndex
CREATE INDEX "strategic_plans_tenantId_ownerUserId_idx" ON "strategic_plans"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "strategic_plans_tenantId_startDate_endDate_idx" ON "strategic_plans"("tenantId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "strategic_plans_tenantId_deletedAt_idx" ON "strategic_plans"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "strategic_plans_tenantId_planKey_key" ON "strategic_plans"("tenantId", "planKey");

-- CreateIndex
CREATE INDEX "strategic_goals_tenantId_workspaceId_goalType_status_idx" ON "strategic_goals"("tenantId", "workspaceId", "goalType", "status");

-- CreateIndex
CREATE INDEX "strategic_goals_tenantId_strategicPlanId_idx" ON "strategic_goals"("tenantId", "strategicPlanId");

-- CreateIndex
CREATE INDEX "strategic_goals_tenantId_priority_idx" ON "strategic_goals"("tenantId", "priority");

-- CreateIndex
CREATE INDEX "strategic_goals_tenantId_dueAt_idx" ON "strategic_goals"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "strategic_goals_tenantId_deletedAt_idx" ON "strategic_goals"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "strategic_goals_tenantId_goalKey_key" ON "strategic_goals"("tenantId", "goalKey");

-- CreateIndex
CREATE INDEX "scenario_models_tenantId_workspaceId_scenarioType_status_idx" ON "scenario_models"("tenantId", "workspaceId", "scenarioType", "status");

-- CreateIndex
CREATE INDEX "scenario_models_tenantId_strategicPlanId_idx" ON "scenario_models"("tenantId", "strategicPlanId");

-- CreateIndex
CREATE INDEX "scenario_models_tenantId_createdByUserId_idx" ON "scenario_models"("tenantId", "createdByUserId");

-- CreateIndex
CREATE INDEX "scenario_models_tenantId_deletedAt_idx" ON "scenario_models"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "scenario_models_tenantId_scenarioKey_key" ON "scenario_models"("tenantId", "scenarioKey");

-- CreateIndex
CREATE INDEX "scenario_results_tenantId_workspaceId_scenarioModelId_idx" ON "scenario_results"("tenantId", "workspaceId", "scenarioModelId");

-- CreateIndex
CREATE INDEX "scenario_results_tenantId_generatedAt_idx" ON "scenario_results"("tenantId", "generatedAt");

-- CreateIndex
CREATE INDEX "scenario_results_tenantId_deletedAt_idx" ON "scenario_results"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "scenario_results_tenantId_resultKey_key" ON "scenario_results"("tenantId", "resultKey");

-- CreateIndex
CREATE INDEX "budget_plans_tenantId_workspaceId_fiscalYear_status_idx" ON "budget_plans"("tenantId", "workspaceId", "fiscalYear", "status");

-- CreateIndex
CREATE INDEX "budget_plans_tenantId_strategicPlanId_idx" ON "budget_plans"("tenantId", "strategicPlanId");

-- CreateIndex
CREATE INDEX "budget_plans_tenantId_departmentId_idx" ON "budget_plans"("tenantId", "departmentId");

-- CreateIndex
CREATE INDEX "budget_plans_tenantId_deletedAt_idx" ON "budget_plans"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "budget_plans_tenantId_budgetKey_key" ON "budget_plans"("tenantId", "budgetKey");

-- CreateIndex
CREATE INDEX "capacity_plans_tenantId_workspaceId_capacityType_status_idx" ON "capacity_plans"("tenantId", "workspaceId", "capacityType", "status");

-- CreateIndex
CREATE INDEX "capacity_plans_tenantId_strategicPlanId_idx" ON "capacity_plans"("tenantId", "strategicPlanId");

-- CreateIndex
CREATE INDEX "capacity_plans_tenantId_departmentId_idx" ON "capacity_plans"("tenantId", "departmentId");

-- CreateIndex
CREATE INDEX "capacity_plans_tenantId_periodStart_periodEnd_idx" ON "capacity_plans"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "capacity_plans_tenantId_deletedAt_idx" ON "capacity_plans"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "capacity_plans_tenantId_capacityKey_key" ON "capacity_plans"("tenantId", "capacityKey");

-- CreateIndex
CREATE INDEX "risk_forecasts_tenantId_workspaceId_riskType_severity_statu_idx" ON "risk_forecasts"("tenantId", "workspaceId", "riskType", "severity", "status");

-- CreateIndex
CREATE INDEX "risk_forecasts_tenantId_probability_idx" ON "risk_forecasts"("tenantId", "probability");

-- CreateIndex
CREATE INDEX "risk_forecasts_tenantId_impactScore_idx" ON "risk_forecasts"("tenantId", "impactScore");

-- CreateIndex
CREATE INDEX "risk_forecasts_tenantId_generatedAt_idx" ON "risk_forecasts"("tenantId", "generatedAt");

-- CreateIndex
CREATE INDEX "risk_forecasts_tenantId_deletedAt_idx" ON "risk_forecasts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "risk_forecasts_tenantId_riskKey_key" ON "risk_forecasts"("tenantId", "riskKey");

-- CreateIndex
CREATE INDEX "growth_forecasts_tenantId_workspaceId_growthType_idx" ON "growth_forecasts"("tenantId", "workspaceId", "growthType");

-- CreateIndex
CREATE INDEX "growth_forecasts_tenantId_metricName_idx" ON "growth_forecasts"("tenantId", "metricName");

-- CreateIndex
CREATE INDEX "growth_forecasts_tenantId_horizonStart_horizonEnd_idx" ON "growth_forecasts"("tenantId", "horizonStart", "horizonEnd");

-- CreateIndex
CREATE INDEX "growth_forecasts_tenantId_generatedAt_idx" ON "growth_forecasts"("tenantId", "generatedAt");

-- CreateIndex
CREATE INDEX "growth_forecasts_tenantId_deletedAt_idx" ON "growth_forecasts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "growth_forecasts_tenantId_growthKey_key" ON "growth_forecasts"("tenantId", "growthKey");

-- CreateIndex
CREATE INDEX "data_lakes_tenantId_workspaceId_lakeType_status_idx" ON "data_lakes"("tenantId", "workspaceId", "lakeType", "status");

-- CreateIndex
CREATE INDEX "data_lakes_tenantId_storageProvider_idx" ON "data_lakes"("tenantId", "storageProvider");

-- CreateIndex
CREATE INDEX "data_lakes_tenantId_classification_idx" ON "data_lakes"("tenantId", "classification");

-- CreateIndex
CREATE INDEX "data_lakes_tenantId_deletedAt_idx" ON "data_lakes"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_lakes_tenantId_dataLakeKey_key" ON "data_lakes"("tenantId", "dataLakeKey");

-- CreateIndex
CREATE INDEX "data_warehouses_tenantId_workspaceId_warehouseType_status_idx" ON "data_warehouses"("tenantId", "workspaceId", "warehouseType", "status");

-- CreateIndex
CREATE INDEX "data_warehouses_tenantId_dataLakeId_idx" ON "data_warehouses"("tenantId", "dataLakeId");

-- CreateIndex
CREATE INDEX "data_warehouses_tenantId_engine_idx" ON "data_warehouses"("tenantId", "engine");

-- CreateIndex
CREATE INDEX "data_warehouses_tenantId_deletedAt_idx" ON "data_warehouses"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_warehouses_tenantId_warehouseKey_key" ON "data_warehouses"("tenantId", "warehouseKey");

-- CreateIndex
CREATE INDEX "data_marts_tenantId_workspaceId_domain_status_idx" ON "data_marts"("tenantId", "workspaceId", "domain", "status");

-- CreateIndex
CREATE INDEX "data_marts_tenantId_warehouseId_idx" ON "data_marts"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "data_marts_tenantId_ownerTeamId_idx" ON "data_marts"("tenantId", "ownerTeamId");

-- CreateIndex
CREATE INDEX "data_marts_tenantId_deletedAt_idx" ON "data_marts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_marts_tenantId_dataMartKey_key" ON "data_marts"("tenantId", "dataMartKey");

-- CreateIndex
CREATE INDEX "semantic_metrics_tenantId_workspaceId_metricType_category_idx" ON "semantic_metrics"("tenantId", "workspaceId", "metricType", "category");

-- CreateIndex
CREATE INDEX "semantic_metrics_tenantId_dataMartId_idx" ON "semantic_metrics"("tenantId", "dataMartId");

-- CreateIndex
CREATE INDEX "semantic_metrics_tenantId_certified_idx" ON "semantic_metrics"("tenantId", "certified");

-- CreateIndex
CREATE INDEX "semantic_metrics_tenantId_ownerUserId_idx" ON "semantic_metrics"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "semantic_metrics_tenantId_deletedAt_idx" ON "semantic_metrics"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "semantic_metrics_tenantId_metricKey_key" ON "semantic_metrics"("tenantId", "metricKey");

-- CreateIndex
CREATE INDEX "semantic_dimensions_tenantId_workspaceId_dimensionType_idx" ON "semantic_dimensions"("tenantId", "workspaceId", "dimensionType");

-- CreateIndex
CREATE INDEX "semantic_dimensions_tenantId_dataMartId_idx" ON "semantic_dimensions"("tenantId", "dataMartId");

-- CreateIndex
CREATE INDEX "semantic_dimensions_tenantId_sourceField_idx" ON "semantic_dimensions"("tenantId", "sourceField");

-- CreateIndex
CREATE INDEX "semantic_dimensions_tenantId_deletedAt_idx" ON "semantic_dimensions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "semantic_dimensions_tenantId_dimensionKey_key" ON "semantic_dimensions"("tenantId", "dimensionKey");

-- CreateIndex
CREATE INDEX "kpis_tenantId_workspaceId_category_status_idx" ON "kpis"("tenantId", "workspaceId", "category", "status");

-- CreateIndex
CREATE INDEX "kpis_tenantId_semanticMetricId_idx" ON "kpis"("tenantId", "semanticMetricId");

-- CreateIndex
CREATE INDEX "kpis_tenantId_ownerUserId_idx" ON "kpis"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "kpis_tenantId_deletedAt_idx" ON "kpis"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "kpis_tenantId_kpiKey_key" ON "kpis"("tenantId", "kpiKey");

-- CreateIndex
CREATE INDEX "kpi_results_tenantId_workspaceId_band_idx" ON "kpi_results"("tenantId", "workspaceId", "band");

-- CreateIndex
CREATE INDEX "kpi_results_tenantId_kpiId_idx" ON "kpi_results"("tenantId", "kpiId");

-- CreateIndex
CREATE INDEX "kpi_results_tenantId_periodStart_periodEnd_idx" ON "kpi_results"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "kpi_results_tenantId_generatedAt_idx" ON "kpi_results"("tenantId", "generatedAt");

-- CreateIndex
CREATE INDEX "kpi_results_tenantId_deletedAt_idx" ON "kpi_results"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_results_tenantId_resultKey_key" ON "kpi_results"("tenantId", "resultKey");

-- CreateIndex
CREATE INDEX "executive_dashboards_tenantId_workspaceId_dashboardType_sta_idx" ON "executive_dashboards"("tenantId", "workspaceId", "dashboardType", "status");

-- CreateIndex
CREATE INDEX "executive_dashboards_tenantId_dataMartId_idx" ON "executive_dashboards"("tenantId", "dataMartId");

-- CreateIndex
CREATE INDEX "executive_dashboards_tenantId_audience_idx" ON "executive_dashboards"("tenantId", "audience");

-- CreateIndex
CREATE INDEX "executive_dashboards_tenantId_ownerUserId_idx" ON "executive_dashboards"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "executive_dashboards_tenantId_deletedAt_idx" ON "executive_dashboards"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "executive_dashboards_tenantId_dashboardKey_key" ON "executive_dashboards"("tenantId", "dashboardKey");

-- CreateIndex
CREATE INDEX "warehouse_jobs_tenantId_workspaceId_jobType_status_idx" ON "warehouse_jobs"("tenantId", "workspaceId", "jobType", "status");

-- CreateIndex
CREATE INDEX "warehouse_jobs_tenantId_warehouseId_idx" ON "warehouse_jobs"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "warehouse_jobs_tenantId_startedAt_idx" ON "warehouse_jobs"("tenantId", "startedAt");

-- CreateIndex
CREATE INDEX "warehouse_jobs_tenantId_deletedAt_idx" ON "warehouse_jobs"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_jobs_tenantId_jobKey_key" ON "warehouse_jobs"("tenantId", "jobKey");

-- CreateIndex
CREATE INDEX "data_pipelines_tenantId_workspaceId_pipelineType_status_idx" ON "data_pipelines"("tenantId", "workspaceId", "pipelineType", "status");

-- CreateIndex
CREATE INDEX "data_pipelines_tenantId_dataLakeId_idx" ON "data_pipelines"("tenantId", "dataLakeId");

-- CreateIndex
CREATE INDEX "data_pipelines_tenantId_warehouseId_idx" ON "data_pipelines"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "data_pipelines_tenantId_sourceSystem_targetSystem_idx" ON "data_pipelines"("tenantId", "sourceSystem", "targetSystem");

-- CreateIndex
CREATE INDEX "data_pipelines_tenantId_lastRunAt_idx" ON "data_pipelines"("tenantId", "lastRunAt");

-- CreateIndex
CREATE INDEX "data_pipelines_tenantId_deletedAt_idx" ON "data_pipelines"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_pipelines_tenantId_pipelineKey_key" ON "data_pipelines"("tenantId", "pipelineKey");

-- CreateIndex
CREATE INDEX "ai_model_registries_tenantId_workspaceId_registryType_statu_idx" ON "ai_model_registries"("tenantId", "workspaceId", "registryType", "status");

-- CreateIndex
CREATE INDEX "ai_model_registries_tenantId_ownerUserId_idx" ON "ai_model_registries"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "ai_model_registries_tenantId_deletedAt_idx" ON "ai_model_registries"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_model_registries_tenantId_registryKey_key" ON "ai_model_registries"("tenantId", "registryKey");

-- CreateIndex
CREATE INDEX "ai_models_tenantId_workspaceId_provider_modelType_idx" ON "ai_models"("tenantId", "workspaceId", "provider", "modelType");

-- CreateIndex
CREATE INDEX "ai_models_tenantId_registryId_idx" ON "ai_models"("tenantId", "registryId");

-- CreateIndex
CREATE INDEX "ai_models_tenantId_status_riskTier_idx" ON "ai_models"("tenantId", "status", "riskTier");

-- CreateIndex
CREATE INDEX "ai_models_tenantId_ownerUserId_idx" ON "ai_models"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "ai_models_tenantId_deletedAt_idx" ON "ai_models"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_models_tenantId_modelKey_key" ON "ai_models"("tenantId", "modelKey");

-- CreateIndex
CREATE INDEX "ai_model_versions_tenantId_workspaceId_status_releaseStage_idx" ON "ai_model_versions"("tenantId", "workspaceId", "status", "releaseStage");

-- CreateIndex
CREATE INDEX "ai_model_versions_tenantId_aiModelId_idx" ON "ai_model_versions"("tenantId", "aiModelId");

-- CreateIndex
CREATE INDEX "ai_model_versions_tenantId_approvedAt_idx" ON "ai_model_versions"("tenantId", "approvedAt");

-- CreateIndex
CREATE INDEX "ai_model_versions_tenantId_deletedAt_idx" ON "ai_model_versions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_model_versions_tenantId_versionKey_key" ON "ai_model_versions"("tenantId", "versionKey");

-- CreateIndex
CREATE UNIQUE INDEX "ai_model_versions_tenantId_aiModelId_version_key" ON "ai_model_versions"("tenantId", "aiModelId", "version");

-- CreateIndex
CREATE INDEX "ai_model_deployments_tenantId_workspaceId_environment_statu_idx" ON "ai_model_deployments"("tenantId", "workspaceId", "environment", "status");

-- CreateIndex
CREATE INDEX "ai_model_deployments_tenantId_aiModelId_idx" ON "ai_model_deployments"("tenantId", "aiModelId");

-- CreateIndex
CREATE INDEX "ai_model_deployments_tenantId_modelVersionId_idx" ON "ai_model_deployments"("tenantId", "modelVersionId");

-- CreateIndex
CREATE INDEX "ai_model_deployments_tenantId_healthStatus_idx" ON "ai_model_deployments"("tenantId", "healthStatus");

-- CreateIndex
CREATE INDEX "ai_model_deployments_tenantId_deletedAt_idx" ON "ai_model_deployments"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_model_deployments_tenantId_deploymentKey_key" ON "ai_model_deployments"("tenantId", "deploymentKey");

-- CreateIndex
CREATE INDEX "ai_decisions_tenantId_workspaceId_decisionType_riskLevel_idx" ON "ai_decisions"("tenantId", "workspaceId", "decisionType", "riskLevel");

-- CreateIndex
CREATE INDEX "ai_decisions_tenantId_aiModelId_idx" ON "ai_decisions"("tenantId", "aiModelId");

-- CreateIndex
CREATE INDEX "ai_decisions_tenantId_modelVersionId_idx" ON "ai_decisions"("tenantId", "modelVersionId");

-- CreateIndex
CREATE INDEX "ai_decisions_tenantId_deploymentId_idx" ON "ai_decisions"("tenantId", "deploymentId");

-- CreateIndex
CREATE INDEX "ai_decisions_tenantId_subjectType_subjectId_idx" ON "ai_decisions"("tenantId", "subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "ai_decisions_tenantId_decidedAt_idx" ON "ai_decisions"("tenantId", "decidedAt");

-- CreateIndex
CREATE INDEX "ai_decisions_tenantId_deletedAt_idx" ON "ai_decisions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_decisions_tenantId_decisionKey_key" ON "ai_decisions"("tenantId", "decisionKey");

-- CreateIndex
CREATE INDEX "ai_decision_reasons_tenantId_workspaceId_reasonType_idx" ON "ai_decision_reasons"("tenantId", "workspaceId", "reasonType");

-- CreateIndex
CREATE INDEX "ai_decision_reasons_tenantId_decisionId_idx" ON "ai_decision_reasons"("tenantId", "decisionId");

-- CreateIndex
CREATE INDEX "ai_decision_reasons_tenantId_deletedAt_idx" ON "ai_decision_reasons"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_decision_reasons_tenantId_reasonKey_key" ON "ai_decision_reasons"("tenantId", "reasonKey");

-- CreateIndex
CREATE INDEX "ai_decision_risks_tenantId_workspaceId_riskType_severity_st_idx" ON "ai_decision_risks"("tenantId", "workspaceId", "riskType", "severity", "status");

-- CreateIndex
CREATE INDEX "ai_decision_risks_tenantId_decisionId_idx" ON "ai_decision_risks"("tenantId", "decisionId");

-- CreateIndex
CREATE INDEX "ai_decision_risks_tenantId_deletedAt_idx" ON "ai_decision_risks"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_decision_risks_tenantId_riskKey_key" ON "ai_decision_risks"("tenantId", "riskKey");

-- CreateIndex
CREATE INDEX "ai_audit_logs_tenantId_workspaceId_action_severity_idx" ON "ai_audit_logs"("tenantId", "workspaceId", "action", "severity");

-- CreateIndex
CREATE INDEX "ai_audit_logs_tenantId_aiModelId_idx" ON "ai_audit_logs"("tenantId", "aiModelId");

-- CreateIndex
CREATE INDEX "ai_audit_logs_tenantId_decisionId_idx" ON "ai_audit_logs"("tenantId", "decisionId");

-- CreateIndex
CREATE INDEX "ai_audit_logs_tenantId_actorUserId_idx" ON "ai_audit_logs"("tenantId", "actorUserId");

-- CreateIndex
CREATE INDEX "ai_audit_logs_tenantId_occurredAt_idx" ON "ai_audit_logs"("tenantId", "occurredAt");

-- CreateIndex
CREATE INDEX "ai_audit_logs_tenantId_deletedAt_idx" ON "ai_audit_logs"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_audit_logs_tenantId_auditKey_key" ON "ai_audit_logs"("tenantId", "auditKey");

-- CreateIndex
CREATE INDEX "ai_compliance_records_tenantId_workspaceId_framework_status_idx" ON "ai_compliance_records"("tenantId", "workspaceId", "framework", "status");

-- CreateIndex
CREATE INDEX "ai_compliance_records_tenantId_aiModelId_idx" ON "ai_compliance_records"("tenantId", "aiModelId");

-- CreateIndex
CREATE INDEX "ai_compliance_records_tenantId_deploymentId_idx" ON "ai_compliance_records"("tenantId", "deploymentId");

-- CreateIndex
CREATE INDEX "ai_compliance_records_tenantId_assessedAt_idx" ON "ai_compliance_records"("tenantId", "assessedAt");

-- CreateIndex
CREATE INDEX "ai_compliance_records_tenantId_deletedAt_idx" ON "ai_compliance_records"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_compliance_records_tenantId_complianceKey_key" ON "ai_compliance_records"("tenantId", "complianceKey");

-- CreateIndex
CREATE INDEX "ai_explainability_records_tenantId_workspaceId_explanationT_idx" ON "ai_explainability_records"("tenantId", "workspaceId", "explanationType");

-- CreateIndex
CREATE INDEX "ai_explainability_records_tenantId_aiModelId_idx" ON "ai_explainability_records"("tenantId", "aiModelId");

-- CreateIndex
CREATE INDEX "ai_explainability_records_tenantId_modelVersionId_idx" ON "ai_explainability_records"("tenantId", "modelVersionId");

-- CreateIndex
CREATE INDEX "ai_explainability_records_tenantId_decisionId_idx" ON "ai_explainability_records"("tenantId", "decisionId");

-- CreateIndex
CREATE INDEX "ai_explainability_records_tenantId_generatedAt_idx" ON "ai_explainability_records"("tenantId", "generatedAt");

-- CreateIndex
CREATE INDEX "ai_explainability_records_tenantId_deletedAt_idx" ON "ai_explainability_records"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_explainability_records_tenantId_explanationKey_key" ON "ai_explainability_records"("tenantId", "explanationKey");

-- CreateIndex
CREATE INDEX "model_performance_metrics_tenantId_workspaceId_metricType_s_idx" ON "model_performance_metrics"("tenantId", "workspaceId", "metricType", "status");

-- CreateIndex
CREATE INDEX "model_performance_metrics_tenantId_aiModelId_idx" ON "model_performance_metrics"("tenantId", "aiModelId");

-- CreateIndex
CREATE INDEX "model_performance_metrics_tenantId_modelVersionId_idx" ON "model_performance_metrics"("tenantId", "modelVersionId");

-- CreateIndex
CREATE INDEX "model_performance_metrics_tenantId_deploymentId_idx" ON "model_performance_metrics"("tenantId", "deploymentId");

-- CreateIndex
CREATE INDEX "model_performance_metrics_tenantId_measuredAt_idx" ON "model_performance_metrics"("tenantId", "measuredAt");

-- CreateIndex
CREATE INDEX "model_performance_metrics_tenantId_deletedAt_idx" ON "model_performance_metrics"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "model_performance_metrics_tenantId_metricKey_key" ON "model_performance_metrics"("tenantId", "metricKey");

-- CreateIndex
CREATE INDEX "model_approval_workflows_tenantId_workspaceId_workflowType__idx" ON "model_approval_workflows"("tenantId", "workspaceId", "workflowType", "status");

-- CreateIndex
CREATE INDEX "model_approval_workflows_tenantId_aiModelId_idx" ON "model_approval_workflows"("tenantId", "aiModelId");

-- CreateIndex
CREATE INDEX "model_approval_workflows_tenantId_modelVersionId_idx" ON "model_approval_workflows"("tenantId", "modelVersionId");

-- CreateIndex
CREATE INDEX "model_approval_workflows_tenantId_deploymentId_idx" ON "model_approval_workflows"("tenantId", "deploymentId");

-- CreateIndex
CREATE INDEX "model_approval_workflows_tenantId_riskTier_idx" ON "model_approval_workflows"("tenantId", "riskTier");

-- CreateIndex
CREATE INDEX "model_approval_workflows_tenantId_requestedAt_idx" ON "model_approval_workflows"("tenantId", "requestedAt");

-- CreateIndex
CREATE INDEX "model_approval_workflows_tenantId_deletedAt_idx" ON "model_approval_workflows"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "model_approval_workflows_tenantId_workflowKey_key" ON "model_approval_workflows"("tenantId", "workflowKey");

-- CreateIndex
CREATE INDEX "security_incidents_tenantId_workspaceId_severity_status_idx" ON "security_incidents"("tenantId", "workspaceId", "severity", "status");

-- CreateIndex
CREATE INDEX "security_incidents_tenantId_incidentType_source_idx" ON "security_incidents"("tenantId", "incidentType", "source");

-- CreateIndex
CREATE INDEX "security_incidents_tenantId_detectedAt_idx" ON "security_incidents"("tenantId", "detectedAt");

-- CreateIndex
CREATE INDEX "security_incidents_tenantId_assignedUserId_idx" ON "security_incidents"("tenantId", "assignedUserId");

-- CreateIndex
CREATE INDEX "security_incidents_tenantId_deletedAt_idx" ON "security_incidents"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "security_incidents_tenantId_incidentKey_key" ON "security_incidents"("tenantId", "incidentKey");

-- CreateIndex
CREATE INDEX "security_threats_tenantId_workspaceId_threatType_severity_idx" ON "security_threats"("tenantId", "workspaceId", "threatType", "severity");

-- CreateIndex
CREATE INDEX "security_threats_tenantId_status_source_idx" ON "security_threats"("tenantId", "status", "source");

-- CreateIndex
CREATE INDEX "security_threats_tenantId_firstSeenAt_idx" ON "security_threats"("tenantId", "firstSeenAt");

-- CreateIndex
CREATE INDEX "security_threats_tenantId_deletedAt_idx" ON "security_threats"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "security_threats_tenantId_threatKey_key" ON "security_threats"("tenantId", "threatKey");

-- CreateIndex
CREATE INDEX "threat_detection_rules_tenantId_workspaceId_ruleType_status_idx" ON "threat_detection_rules"("tenantId", "workspaceId", "ruleType", "status");

-- CreateIndex
CREATE INDEX "threat_detection_rules_tenantId_severity_idx" ON "threat_detection_rules"("tenantId", "severity");

-- CreateIndex
CREATE INDEX "threat_detection_rules_tenantId_lastTriggeredAt_idx" ON "threat_detection_rules"("tenantId", "lastTriggeredAt");

-- CreateIndex
CREATE INDEX "threat_detection_rules_tenantId_deletedAt_idx" ON "threat_detection_rules"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "threat_detection_rules_tenantId_ruleKey_key" ON "threat_detection_rules"("tenantId", "ruleKey");

-- CreateIndex
CREATE INDEX "threat_events_tenantId_workspaceId_eventType_severity_idx" ON "threat_events"("tenantId", "workspaceId", "eventType", "severity");

-- CreateIndex
CREATE INDEX "threat_events_tenantId_threatId_idx" ON "threat_events"("tenantId", "threatId");

-- CreateIndex
CREATE INDEX "threat_events_tenantId_ruleId_idx" ON "threat_events"("tenantId", "ruleId");

-- CreateIndex
CREATE INDEX "threat_events_tenantId_incidentId_idx" ON "threat_events"("tenantId", "incidentId");

-- CreateIndex
CREATE INDEX "threat_events_tenantId_occurredAt_idx" ON "threat_events"("tenantId", "occurredAt");

-- CreateIndex
CREATE INDEX "threat_events_tenantId_deletedAt_idx" ON "threat_events"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "threat_events_tenantId_eventKey_key" ON "threat_events"("tenantId", "eventKey");

-- CreateIndex
CREATE INDEX "security_risks_tenantId_workspaceId_riskType_severity_statu_idx" ON "security_risks"("tenantId", "workspaceId", "riskType", "severity", "status");

-- CreateIndex
CREATE INDEX "security_risks_tenantId_threatId_idx" ON "security_risks"("tenantId", "threatId");

-- CreateIndex
CREATE INDEX "security_risks_tenantId_ownerUserId_idx" ON "security_risks"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "security_risks_tenantId_dueAt_idx" ON "security_risks"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "security_risks_tenantId_deletedAt_idx" ON "security_risks"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "security_risks_tenantId_riskKey_key" ON "security_risks"("tenantId", "riskKey");

-- CreateIndex
CREATE INDEX "security_scores_tenantId_workspaceId_scopeType_scopeId_idx" ON "security_scores"("tenantId", "workspaceId", "scopeType", "scopeId");

-- CreateIndex
CREATE INDEX "security_scores_tenantId_scoreBand_trend_idx" ON "security_scores"("tenantId", "scoreBand", "trend");

-- CreateIndex
CREATE INDEX "security_scores_tenantId_calculatedAt_idx" ON "security_scores"("tenantId", "calculatedAt");

-- CreateIndex
CREATE INDEX "security_scores_tenantId_deletedAt_idx" ON "security_scores"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "security_scores_tenantId_scoreKey_key" ON "security_scores"("tenantId", "scoreKey");

-- CreateIndex
CREATE INDEX "security_audits_tenantId_workspaceId_auditType_action_idx" ON "security_audits"("tenantId", "workspaceId", "auditType", "action");

-- CreateIndex
CREATE INDEX "security_audits_tenantId_incidentId_idx" ON "security_audits"("tenantId", "incidentId");

-- CreateIndex
CREATE INDEX "security_audits_tenantId_actorUserId_idx" ON "security_audits"("tenantId", "actorUserId");

-- CreateIndex
CREATE INDEX "security_audits_tenantId_severity_idx" ON "security_audits"("tenantId", "severity");

-- CreateIndex
CREATE INDEX "security_audits_tenantId_occurredAt_idx" ON "security_audits"("tenantId", "occurredAt");

-- CreateIndex
CREATE INDEX "security_audits_tenantId_deletedAt_idx" ON "security_audits"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "security_audits_tenantId_auditKey_key" ON "security_audits"("tenantId", "auditKey");

-- CreateIndex
CREATE INDEX "compliance_violations_tenantId_workspaceId_framework_status_idx" ON "compliance_violations"("tenantId", "workspaceId", "framework", "status");

-- CreateIndex
CREATE INDEX "compliance_violations_tenantId_incidentId_idx" ON "compliance_violations"("tenantId", "incidentId");

-- CreateIndex
CREATE INDEX "compliance_violations_tenantId_severity_idx" ON "compliance_violations"("tenantId", "severity");

-- CreateIndex
CREATE INDEX "compliance_violations_tenantId_detectedAt_idx" ON "compliance_violations"("tenantId", "detectedAt");

-- CreateIndex
CREATE INDEX "compliance_violations_tenantId_deletedAt_idx" ON "compliance_violations"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_violations_tenantId_violationKey_key" ON "compliance_violations"("tenantId", "violationKey");

-- CreateIndex
CREATE INDEX "zero_trust_policies_tenantId_workspaceId_policyType_status_idx" ON "zero_trust_policies"("tenantId", "workspaceId", "policyType", "status");

-- CreateIndex
CREATE INDEX "zero_trust_policies_tenantId_enforcementMode_idx" ON "zero_trust_policies"("tenantId", "enforcementMode");

-- CreateIndex
CREATE INDEX "zero_trust_policies_tenantId_deletedAt_idx" ON "zero_trust_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "zero_trust_policies_tenantId_policyKey_key" ON "zero_trust_policies"("tenantId", "policyKey");

-- CreateIndex
CREATE INDEX "access_verifications_tenantId_workspaceId_userId_idx" ON "access_verifications"("tenantId", "workspaceId", "userId");

-- CreateIndex
CREATE INDEX "access_verifications_tenantId_policyId_idx" ON "access_verifications"("tenantId", "policyId");

-- CreateIndex
CREATE INDEX "access_verifications_tenantId_resourceType_resourceId_idx" ON "access_verifications"("tenantId", "resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "access_verifications_tenantId_decision_trustLevel_idx" ON "access_verifications"("tenantId", "decision", "trustLevel");

-- CreateIndex
CREATE INDEX "access_verifications_tenantId_verifiedAt_idx" ON "access_verifications"("tenantId", "verifiedAt");

-- CreateIndex
CREATE INDEX "access_verifications_tenantId_deletedAt_idx" ON "access_verifications"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "access_verifications_tenantId_verificationKey_key" ON "access_verifications"("tenantId", "verificationKey");

-- CreateIndex
CREATE INDEX "security_alerts_tenantId_workspaceId_alertType_severity_sta_idx" ON "security_alerts"("tenantId", "workspaceId", "alertType", "severity", "status");

-- CreateIndex
CREATE INDEX "security_alerts_tenantId_incidentId_idx" ON "security_alerts"("tenantId", "incidentId");

-- CreateIndex
CREATE INDEX "security_alerts_tenantId_threatId_idx" ON "security_alerts"("tenantId", "threatId");

-- CreateIndex
CREATE INDEX "security_alerts_tenantId_triggeredAt_idx" ON "security_alerts"("tenantId", "triggeredAt");

-- CreateIndex
CREATE INDEX "security_alerts_tenantId_deletedAt_idx" ON "security_alerts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "security_alerts_tenantId_alertKey_key" ON "security_alerts"("tenantId", "alertKey");

-- CreateIndex
CREATE INDEX "security_investigations_tenantId_workspaceId_status_priorit_idx" ON "security_investigations"("tenantId", "workspaceId", "status", "priority");

-- CreateIndex
CREATE INDEX "security_investigations_tenantId_incidentId_idx" ON "security_investigations"("tenantId", "incidentId");

-- CreateIndex
CREATE INDEX "security_investigations_tenantId_investigatorUserId_idx" ON "security_investigations"("tenantId", "investigatorUserId");

-- CreateIndex
CREATE INDEX "security_investigations_tenantId_openedAt_idx" ON "security_investigations"("tenantId", "openedAt");

-- CreateIndex
CREATE INDEX "security_investigations_tenantId_deletedAt_idx" ON "security_investigations"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "security_investigations_tenantId_investigationKey_key" ON "security_investigations"("tenantId", "investigationKey");

-- CreateIndex
CREATE INDEX "service_health_tenantId_workspaceId_serviceType_status_idx" ON "service_health"("tenantId", "workspaceId", "serviceType", "status");

-- CreateIndex
CREATE INDEX "service_health_tenantId_environment_region_idx" ON "service_health"("tenantId", "environment", "region");

-- CreateIndex
CREATE INDEX "service_health_tenantId_lastCheckedAt_idx" ON "service_health"("tenantId", "lastCheckedAt");

-- CreateIndex
CREATE INDEX "service_health_tenantId_deletedAt_idx" ON "service_health"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "service_health_tenantId_serviceKey_key" ON "service_health"("tenantId", "serviceKey");

-- CreateIndex
CREATE INDEX "system_incidents_tenantId_workspaceId_severity_status_idx" ON "system_incidents"("tenantId", "workspaceId", "severity", "status");

-- CreateIndex
CREATE INDEX "system_incidents_tenantId_serviceHealthId_idx" ON "system_incidents"("tenantId", "serviceHealthId");

-- CreateIndex
CREATE INDEX "system_incidents_tenantId_incidentType_source_idx" ON "system_incidents"("tenantId", "incidentType", "source");

-- CreateIndex
CREATE INDEX "system_incidents_tenantId_region_idx" ON "system_incidents"("tenantId", "region");

-- CreateIndex
CREATE INDEX "system_incidents_tenantId_detectedAt_idx" ON "system_incidents"("tenantId", "detectedAt");

-- CreateIndex
CREATE INDEX "system_incidents_tenantId_deletedAt_idx" ON "system_incidents"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_incidents_tenantId_incidentKey_key" ON "system_incidents"("tenantId", "incidentKey");

-- CreateIndex
CREATE INDEX "incident_timelines_tenantId_workspaceId_eventType_idx" ON "incident_timelines"("tenantId", "workspaceId", "eventType");

-- CreateIndex
CREATE INDEX "incident_timelines_tenantId_incidentId_idx" ON "incident_timelines"("tenantId", "incidentId");

-- CreateIndex
CREATE INDEX "incident_timelines_tenantId_occurredAt_idx" ON "incident_timelines"("tenantId", "occurredAt");

-- CreateIndex
CREATE INDEX "incident_timelines_tenantId_deletedAt_idx" ON "incident_timelines"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "incident_timelines_tenantId_timelineKey_key" ON "incident_timelines"("tenantId", "timelineKey");

-- CreateIndex
CREATE INDEX "recovery_actions_tenantId_workspaceId_actionType_status_idx" ON "recovery_actions"("tenantId", "workspaceId", "actionType", "status");

-- CreateIndex
CREATE INDEX "recovery_actions_tenantId_incidentId_idx" ON "recovery_actions"("tenantId", "incidentId");

-- CreateIndex
CREATE INDEX "recovery_actions_tenantId_automationType_idx" ON "recovery_actions"("tenantId", "automationType");

-- CreateIndex
CREATE INDEX "recovery_actions_tenantId_createdAt_idx" ON "recovery_actions"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "recovery_actions_tenantId_deletedAt_idx" ON "recovery_actions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "recovery_actions_tenantId_actionKey_key" ON "recovery_actions"("tenantId", "actionKey");

-- CreateIndex
CREATE INDEX "uptime_metrics_tenantId_workspaceId_serviceName_status_idx" ON "uptime_metrics"("tenantId", "workspaceId", "serviceName", "status");

-- CreateIndex
CREATE INDEX "uptime_metrics_tenantId_serviceHealthId_idx" ON "uptime_metrics"("tenantId", "serviceHealthId");

-- CreateIndex
CREATE INDEX "uptime_metrics_tenantId_region_environment_idx" ON "uptime_metrics"("tenantId", "region", "environment");

-- CreateIndex
CREATE INDEX "uptime_metrics_tenantId_windowStart_windowEnd_idx" ON "uptime_metrics"("tenantId", "windowStart", "windowEnd");

-- CreateIndex
CREATE INDEX "uptime_metrics_tenantId_deletedAt_idx" ON "uptime_metrics"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "uptime_metrics_tenantId_metricKey_key" ON "uptime_metrics"("tenantId", "metricKey");

-- CreateIndex
CREATE INDEX "reliability_scores_tenantId_workspaceId_scopeType_scopeId_idx" ON "reliability_scores"("tenantId", "workspaceId", "scopeType", "scopeId");

-- CreateIndex
CREATE INDEX "reliability_scores_tenantId_scoreBand_trend_idx" ON "reliability_scores"("tenantId", "scoreBand", "trend");

-- CreateIndex
CREATE INDEX "reliability_scores_tenantId_calculatedAt_idx" ON "reliability_scores"("tenantId", "calculatedAt");

-- CreateIndex
CREATE INDEX "reliability_scores_tenantId_deletedAt_idx" ON "reliability_scores"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "reliability_scores_tenantId_scoreKey_key" ON "reliability_scores"("tenantId", "scoreKey");

-- CreateIndex
CREATE INDEX "scaling_policies_tenantId_workspaceId_serviceName_status_idx" ON "scaling_policies"("tenantId", "workspaceId", "serviceName", "status");

-- CreateIndex
CREATE INDEX "scaling_policies_tenantId_serviceType_region_idx" ON "scaling_policies"("tenantId", "serviceType", "region");

-- CreateIndex
CREATE INDEX "scaling_policies_tenantId_mode_idx" ON "scaling_policies"("tenantId", "mode");

-- CreateIndex
CREATE INDEX "scaling_policies_tenantId_deletedAt_idx" ON "scaling_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "scaling_policies_tenantId_policyKey_key" ON "scaling_policies"("tenantId", "policyKey");

-- CreateIndex
CREATE INDEX "scaling_events_tenantId_workspaceId_serviceName_status_idx" ON "scaling_events"("tenantId", "workspaceId", "serviceName", "status");

-- CreateIndex
CREATE INDEX "scaling_events_tenantId_policyId_idx" ON "scaling_events"("tenantId", "policyId");

-- CreateIndex
CREATE INDEX "scaling_events_tenantId_region_direction_idx" ON "scaling_events"("tenantId", "region", "direction");

-- CreateIndex
CREATE INDEX "scaling_events_tenantId_triggeredAt_idx" ON "scaling_events"("tenantId", "triggeredAt");

-- CreateIndex
CREATE INDEX "scaling_events_tenantId_deletedAt_idx" ON "scaling_events"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "scaling_events_tenantId_eventKey_key" ON "scaling_events"("tenantId", "eventKey");

-- CreateIndex
CREATE INDEX "region_health_tenantId_workspaceId_provider_status_idx" ON "region_health"("tenantId", "workspaceId", "provider", "status");

-- CreateIndex
CREATE INDEX "region_health_tenantId_region_idx" ON "region_health"("tenantId", "region");

-- CreateIndex
CREATE INDEX "region_health_tenantId_activeFailover_idx" ON "region_health"("tenantId", "activeFailover");

-- CreateIndex
CREATE INDEX "region_health_tenantId_lastCheckedAt_idx" ON "region_health"("tenantId", "lastCheckedAt");

-- CreateIndex
CREATE INDEX "region_health_tenantId_deletedAt_idx" ON "region_health"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "region_health_tenantId_regionKey_key" ON "region_health"("tenantId", "regionKey");

-- CreateIndex
CREATE INDEX "failover_events_tenantId_workspaceId_sourceRegion_targetReg_idx" ON "failover_events"("tenantId", "workspaceId", "sourceRegion", "targetRegion");

-- CreateIndex
CREATE INDEX "failover_events_tenantId_regionHealthId_idx" ON "failover_events"("tenantId", "regionHealthId");

-- CreateIndex
CREATE INDEX "failover_events_tenantId_incidentId_idx" ON "failover_events"("tenantId", "incidentId");

-- CreateIndex
CREATE INDEX "failover_events_tenantId_status_idx" ON "failover_events"("tenantId", "status");

-- CreateIndex
CREATE INDEX "failover_events_tenantId_startedAt_idx" ON "failover_events"("tenantId", "startedAt");

-- CreateIndex
CREATE INDEX "failover_events_tenantId_deletedAt_idx" ON "failover_events"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "failover_events_tenantId_eventKey_key" ON "failover_events"("tenantId", "eventKey");

-- CreateIndex
CREATE INDEX "sre_alerts_tenantId_workspaceId_alertType_severity_status_idx" ON "sre_alerts"("tenantId", "workspaceId", "alertType", "severity", "status");

-- CreateIndex
CREATE INDEX "sre_alerts_tenantId_serviceHealthId_idx" ON "sre_alerts"("tenantId", "serviceHealthId");

-- CreateIndex
CREATE INDEX "sre_alerts_tenantId_incidentId_idx" ON "sre_alerts"("tenantId", "incidentId");

-- CreateIndex
CREATE INDEX "sre_alerts_tenantId_triggeredAt_idx" ON "sre_alerts"("tenantId", "triggeredAt");

-- CreateIndex
CREATE INDEX "sre_alerts_tenantId_deletedAt_idx" ON "sre_alerts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "sre_alerts_tenantId_alertKey_key" ON "sre_alerts"("tenantId", "alertKey");

-- CreateIndex
CREATE INDEX "capacity_forecasts_tenantId_workspaceId_serviceName_forecas_idx" ON "capacity_forecasts"("tenantId", "workspaceId", "serviceName", "forecastType");

-- CreateIndex
CREATE INDEX "capacity_forecasts_tenantId_serviceHealthId_idx" ON "capacity_forecasts"("tenantId", "serviceHealthId");

-- CreateIndex
CREATE INDEX "capacity_forecasts_tenantId_region_horizon_idx" ON "capacity_forecasts"("tenantId", "region", "horizon");

-- CreateIndex
CREATE INDEX "capacity_forecasts_tenantId_forecastAt_idx" ON "capacity_forecasts"("tenantId", "forecastAt");

-- CreateIndex
CREATE INDEX "capacity_forecasts_tenantId_deletedAt_idx" ON "capacity_forecasts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "capacity_forecasts_tenantId_forecastKey_key" ON "capacity_forecasts"("tenantId", "forecastKey");

-- CreateIndex
CREATE INDEX "cost_centers_tenantId_workspaceId_status_idx" ON "cost_centers"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "cost_centers_tenantId_department_idx" ON "cost_centers"("tenantId", "department");

-- CreateIndex
CREATE INDEX "cost_centers_tenantId_ownerUserId_idx" ON "cost_centers"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "cost_centers_tenantId_deletedAt_idx" ON "cost_centers"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "cost_centers_tenantId_costCenterKey_key" ON "cost_centers"("tenantId", "costCenterKey");

-- CreateIndex
CREATE INDEX "resource_usage_tenantId_workspaceId_resourceType_provider_idx" ON "resource_usage"("tenantId", "workspaceId", "resourceType", "provider");

-- CreateIndex
CREATE INDEX "resource_usage_tenantId_costCenterId_idx" ON "resource_usage"("tenantId", "costCenterId");

-- CreateIndex
CREATE INDEX "resource_usage_tenantId_serviceName_region_idx" ON "resource_usage"("tenantId", "serviceName", "region");

-- CreateIndex
CREATE INDEX "resource_usage_tenantId_measuredAt_idx" ON "resource_usage"("tenantId", "measuredAt");

-- CreateIndex
CREATE INDEX "resource_usage_tenantId_deletedAt_idx" ON "resource_usage"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "resource_usage_tenantId_usageKey_key" ON "resource_usage"("tenantId", "usageKey");

-- CreateIndex
CREATE INDEX "cost_metrics_tenantId_workspaceId_metricType_idx" ON "cost_metrics"("tenantId", "workspaceId", "metricType");

-- CreateIndex
CREATE INDEX "cost_metrics_tenantId_costCenterId_idx" ON "cost_metrics"("tenantId", "costCenterId");

-- CreateIndex
CREATE INDEX "cost_metrics_tenantId_provider_serviceName_idx" ON "cost_metrics"("tenantId", "provider", "serviceName");

-- CreateIndex
CREATE INDEX "cost_metrics_tenantId_periodStart_periodEnd_idx" ON "cost_metrics"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "cost_metrics_tenantId_deletedAt_idx" ON "cost_metrics"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "cost_metrics_tenantId_metricKey_key" ON "cost_metrics"("tenantId", "metricKey");

-- CreateIndex
CREATE INDEX "cost_forecasts_tenantId_workspaceId_forecastType_horizon_idx" ON "cost_forecasts"("tenantId", "workspaceId", "forecastType", "horizon");

-- CreateIndex
CREATE INDEX "cost_forecasts_tenantId_costCenterId_idx" ON "cost_forecasts"("tenantId", "costCenterId");

-- CreateIndex
CREATE INDEX "cost_forecasts_tenantId_forecastAt_idx" ON "cost_forecasts"("tenantId", "forecastAt");

-- CreateIndex
CREATE INDEX "cost_forecasts_tenantId_deletedAt_idx" ON "cost_forecasts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "cost_forecasts_tenantId_forecastKey_key" ON "cost_forecasts"("tenantId", "forecastKey");

-- CreateIndex
CREATE INDEX "optimization_recommendations_tenantId_workspaceId_recommend_idx" ON "optimization_recommendations"("tenantId", "workspaceId", "recommendationType", "priority", "status");

-- CreateIndex
CREATE INDEX "optimization_recommendations_tenantId_costCenterId_idx" ON "optimization_recommendations"("tenantId", "costCenterId");

-- CreateIndex
CREATE INDEX "optimization_recommendations_tenantId_estimatedSavings_idx" ON "optimization_recommendations"("tenantId", "estimatedSavings");

-- CreateIndex
CREATE INDEX "optimization_recommendations_tenantId_deletedAt_idx" ON "optimization_recommendations"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "optimization_recommendations_tenantId_recommendationKey_key" ON "optimization_recommendations"("tenantId", "recommendationKey");

-- CreateIndex
CREATE INDEX "efficiency_scores_tenantId_workspaceId_scopeType_scopeId_idx" ON "efficiency_scores"("tenantId", "workspaceId", "scopeType", "scopeId");

-- CreateIndex
CREATE INDEX "efficiency_scores_tenantId_costCenterId_idx" ON "efficiency_scores"("tenantId", "costCenterId");

-- CreateIndex
CREATE INDEX "efficiency_scores_tenantId_scoreBand_trend_idx" ON "efficiency_scores"("tenantId", "scoreBand", "trend");

-- CreateIndex
CREATE INDEX "efficiency_scores_tenantId_calculatedAt_idx" ON "efficiency_scores"("tenantId", "calculatedAt");

-- CreateIndex
CREATE INDEX "efficiency_scores_tenantId_deletedAt_idx" ON "efficiency_scores"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "efficiency_scores_tenantId_scoreKey_key" ON "efficiency_scores"("tenantId", "scoreKey");

-- CreateIndex
CREATE INDEX "performance_metrics_tenantId_workspaceId_metricType_status_idx" ON "performance_metrics"("tenantId", "workspaceId", "metricType", "status");

-- CreateIndex
CREATE INDEX "performance_metrics_tenantId_resourceUsageId_idx" ON "performance_metrics"("tenantId", "resourceUsageId");

-- CreateIndex
CREATE INDEX "performance_metrics_tenantId_provider_serviceName_idx" ON "performance_metrics"("tenantId", "provider", "serviceName");

-- CreateIndex
CREATE INDEX "performance_metrics_tenantId_measuredAt_idx" ON "performance_metrics"("tenantId", "measuredAt");

-- CreateIndex
CREATE INDEX "performance_metrics_tenantId_deletedAt_idx" ON "performance_metrics"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "performance_metrics_tenantId_metricKey_key" ON "performance_metrics"("tenantId", "metricKey");

-- CreateIndex
CREATE INDEX "resource_allocations_tenantId_workspaceId_resourceType_allo_idx" ON "resource_allocations"("tenantId", "workspaceId", "resourceType", "allocationType");

-- CreateIndex
CREATE INDEX "resource_allocations_tenantId_costCenterId_idx" ON "resource_allocations"("tenantId", "costCenterId");

-- CreateIndex
CREATE INDEX "resource_allocations_tenantId_allocatedTo_idx" ON "resource_allocations"("tenantId", "allocatedTo");

-- CreateIndex
CREATE INDEX "resource_allocations_tenantId_effectiveFrom_effectiveTo_idx" ON "resource_allocations"("tenantId", "effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE INDEX "resource_allocations_tenantId_deletedAt_idx" ON "resource_allocations"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "resource_allocations_tenantId_allocationKey_key" ON "resource_allocations"("tenantId", "allocationKey");

-- CreateIndex
CREATE INDEX "finops_policies_tenantId_workspaceId_policyType_status_idx" ON "finops_policies"("tenantId", "workspaceId", "policyType", "status");

-- CreateIndex
CREATE INDEX "finops_policies_tenantId_enforcementMode_idx" ON "finops_policies"("tenantId", "enforcementMode");

-- CreateIndex
CREATE INDEX "finops_policies_tenantId_ownerUserId_idx" ON "finops_policies"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "finops_policies_tenantId_deletedAt_idx" ON "finops_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "finops_policies_tenantId_policyKey_key" ON "finops_policies"("tenantId", "policyKey");

-- CreateIndex
CREATE INDEX "budget_tracking_tenantId_workspaceId_period_status_idx" ON "budget_tracking"("tenantId", "workspaceId", "period", "status");

-- CreateIndex
CREATE INDEX "budget_tracking_tenantId_costCenterId_idx" ON "budget_tracking"("tenantId", "costCenterId");

-- CreateIndex
CREATE INDEX "budget_tracking_tenantId_policyId_idx" ON "budget_tracking"("tenantId", "policyId");

-- CreateIndex
CREATE INDEX "budget_tracking_tenantId_periodStart_periodEnd_idx" ON "budget_tracking"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "budget_tracking_tenantId_deletedAt_idx" ON "budget_tracking"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "budget_tracking_tenantId_budgetKey_key" ON "budget_tracking"("tenantId", "budgetKey");

-- CreateIndex
CREATE INDEX "cost_alerts_tenantId_workspaceId_alertType_severity_status_idx" ON "cost_alerts"("tenantId", "workspaceId", "alertType", "severity", "status");

-- CreateIndex
CREATE INDEX "cost_alerts_tenantId_costCenterId_idx" ON "cost_alerts"("tenantId", "costCenterId");

-- CreateIndex
CREATE INDEX "cost_alerts_tenantId_policyId_idx" ON "cost_alerts"("tenantId", "policyId");

-- CreateIndex
CREATE INDEX "cost_alerts_tenantId_budgetId_idx" ON "cost_alerts"("tenantId", "budgetId");

-- CreateIndex
CREATE INDEX "cost_alerts_tenantId_triggeredAt_idx" ON "cost_alerts"("tenantId", "triggeredAt");

-- CreateIndex
CREATE INDEX "cost_alerts_tenantId_deletedAt_idx" ON "cost_alerts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "cost_alerts_tenantId_alertKey_key" ON "cost_alerts"("tenantId", "alertKey");

-- CreateIndex
CREATE INDEX "savings_opportunities_tenantId_workspaceId_opportunityType__idx" ON "savings_opportunities"("tenantId", "workspaceId", "opportunityType", "status");

-- CreateIndex
CREATE INDEX "savings_opportunities_tenantId_costCenterId_idx" ON "savings_opportunities"("tenantId", "costCenterId");

-- CreateIndex
CREATE INDEX "savings_opportunities_tenantId_recommendationId_idx" ON "savings_opportunities"("tenantId", "recommendationId");

-- CreateIndex
CREATE INDEX "savings_opportunities_tenantId_estimatedSavings_idx" ON "savings_opportunities"("tenantId", "estimatedSavings");

-- CreateIndex
CREATE INDEX "savings_opportunities_tenantId_identifiedAt_idx" ON "savings_opportunities"("tenantId", "identifiedAt");

-- CreateIndex
CREATE INDEX "savings_opportunities_tenantId_deletedAt_idx" ON "savings_opportunities"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "savings_opportunities_tenantId_opportunityKey_key" ON "savings_opportunities"("tenantId", "opportunityKey");

-- CreateIndex
CREATE INDEX "data_regions_tenantId_workspaceId_status_idx" ON "data_regions"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "data_regions_tenantId_countryCode_regionCode_idx" ON "data_regions"("tenantId", "countryCode", "regionCode");

-- CreateIndex
CREATE INDEX "data_regions_tenantId_jurisdiction_idx" ON "data_regions"("tenantId", "jurisdiction");

-- CreateIndex
CREATE INDEX "data_regions_tenantId_deletedAt_idx" ON "data_regions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_regions_tenantId_regionKey_key" ON "data_regions"("tenantId", "regionKey");

-- CreateIndex
CREATE INDEX "residency_policies_tenantId_workspaceId_policyType_status_idx" ON "residency_policies"("tenantId", "workspaceId", "policyType", "status");

-- CreateIndex
CREATE INDEX "residency_policies_tenantId_dataRegionId_idx" ON "residency_policies"("tenantId", "dataRegionId");

-- CreateIndex
CREATE INDEX "residency_policies_tenantId_enforcementMode_idx" ON "residency_policies"("tenantId", "enforcementMode");

-- CreateIndex
CREATE INDEX "residency_policies_tenantId_effectiveFrom_effectiveTo_idx" ON "residency_policies"("tenantId", "effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE INDEX "residency_policies_tenantId_deletedAt_idx" ON "residency_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "residency_policies_tenantId_policyKey_key" ON "residency_policies"("tenantId", "policyKey");

-- CreateIndex
CREATE INDEX "sovereignty_rules_tenantId_workspaceId_ruleType_status_idx" ON "sovereignty_rules"("tenantId", "workspaceId", "ruleType", "status");

-- CreateIndex
CREATE INDEX "sovereignty_rules_tenantId_countryCode_jurisdiction_idx" ON "sovereignty_rules"("tenantId", "countryCode", "jurisdiction");

-- CreateIndex
CREATE INDEX "sovereignty_rules_tenantId_enforcementMode_idx" ON "sovereignty_rules"("tenantId", "enforcementMode");

-- CreateIndex
CREATE INDEX "sovereignty_rules_tenantId_deletedAt_idx" ON "sovereignty_rules"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "sovereignty_rules_tenantId_ruleKey_key" ON "sovereignty_rules"("tenantId", "ruleKey");

-- CreateIndex
CREATE INDEX "regulatory_frameworks_tenantId_workspaceId_frameworkType_st_idx" ON "regulatory_frameworks"("tenantId", "workspaceId", "frameworkType", "status");

-- CreateIndex
CREATE INDEX "regulatory_frameworks_tenantId_countryCode_jurisdiction_idx" ON "regulatory_frameworks"("tenantId", "countryCode", "jurisdiction");

-- CreateIndex
CREATE INDEX "regulatory_frameworks_tenantId_deletedAt_idx" ON "regulatory_frameworks"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "regulatory_frameworks_tenantId_frameworkKey_key" ON "regulatory_frameworks"("tenantId", "frameworkKey");

-- CreateIndex
CREATE INDEX "compliance_requirements_tenantId_workspaceId_requirementTyp_idx" ON "compliance_requirements"("tenantId", "workspaceId", "requirementType", "status");

-- CreateIndex
CREATE INDEX "compliance_requirements_tenantId_frameworkId_idx" ON "compliance_requirements"("tenantId", "frameworkId");

-- CreateIndex
CREATE INDEX "compliance_requirements_tenantId_severity_idx" ON "compliance_requirements"("tenantId", "severity");

-- CreateIndex
CREATE INDEX "compliance_requirements_tenantId_dueAt_idx" ON "compliance_requirements"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "compliance_requirements_tenantId_deletedAt_idx" ON "compliance_requirements"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_requirements_tenantId_requirementKey_key" ON "compliance_requirements"("tenantId", "requirementKey");

-- CreateIndex
CREATE INDEX "jurisdiction_rules_tenantId_workspaceId_jurisdiction_status_idx" ON "jurisdiction_rules"("tenantId", "workspaceId", "jurisdiction", "status");

-- CreateIndex
CREATE INDEX "jurisdiction_rules_tenantId_dataRegionId_idx" ON "jurisdiction_rules"("tenantId", "dataRegionId");

-- CreateIndex
CREATE INDEX "jurisdiction_rules_tenantId_countryCode_ruleType_idx" ON "jurisdiction_rules"("tenantId", "countryCode", "ruleType");

-- CreateIndex
CREATE INDEX "jurisdiction_rules_tenantId_deletedAt_idx" ON "jurisdiction_rules"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "jurisdiction_rules_tenantId_ruleKey_key" ON "jurisdiction_rules"("tenantId", "ruleKey");

-- CreateIndex
CREATE INDEX "data_transfer_rules_tenantId_workspaceId_transferType_statu_idx" ON "data_transfer_rules"("tenantId", "workspaceId", "transferType", "status");

-- CreateIndex
CREATE INDEX "data_transfer_rules_tenantId_sourceRegionId_idx" ON "data_transfer_rules"("tenantId", "sourceRegionId");

-- CreateIndex
CREATE INDEX "data_transfer_rules_tenantId_destinationRegionId_idx" ON "data_transfer_rules"("tenantId", "destinationRegionId");

-- CreateIndex
CREATE INDEX "data_transfer_rules_tenantId_allowed_approvalRequired_idx" ON "data_transfer_rules"("tenantId", "allowed", "approvalRequired");

-- CreateIndex
CREATE INDEX "data_transfer_rules_tenantId_deletedAt_idx" ON "data_transfer_rules"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_transfer_rules_tenantId_ruleKey_key" ON "data_transfer_rules"("tenantId", "ruleKey");

-- CreateIndex
CREATE INDEX "compliance_audits_tenantId_workspaceId_auditType_status_idx" ON "compliance_audits"("tenantId", "workspaceId", "auditType", "status");

-- CreateIndex
CREATE INDEX "compliance_audits_tenantId_frameworkId_idx" ON "compliance_audits"("tenantId", "frameworkId");

-- CreateIndex
CREATE INDEX "compliance_audits_tenantId_requirementId_idx" ON "compliance_audits"("tenantId", "requirementId");

-- CreateIndex
CREATE INDEX "compliance_audits_tenantId_dataRegionId_idx" ON "compliance_audits"("tenantId", "dataRegionId");

-- CreateIndex
CREATE INDEX "compliance_audits_tenantId_auditedAt_idx" ON "compliance_audits"("tenantId", "auditedAt");

-- CreateIndex
CREATE INDEX "compliance_audits_tenantId_deletedAt_idx" ON "compliance_audits"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_audits_tenantId_auditKey_key" ON "compliance_audits"("tenantId", "auditKey");

-- CreateIndex
CREATE INDEX "regulatory_alerts_tenantId_workspaceId_alertType_severity_s_idx" ON "regulatory_alerts"("tenantId", "workspaceId", "alertType", "severity", "status");

-- CreateIndex
CREATE INDEX "regulatory_alerts_tenantId_frameworkId_idx" ON "regulatory_alerts"("tenantId", "frameworkId");

-- CreateIndex
CREATE INDEX "regulatory_alerts_tenantId_dataRegionId_idx" ON "regulatory_alerts"("tenantId", "dataRegionId");

-- CreateIndex
CREATE INDEX "regulatory_alerts_tenantId_triggeredAt_idx" ON "regulatory_alerts"("tenantId", "triggeredAt");

-- CreateIndex
CREATE INDEX "regulatory_alerts_tenantId_deletedAt_idx" ON "regulatory_alerts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "regulatory_alerts_tenantId_alertKey_key" ON "regulatory_alerts"("tenantId", "alertKey");

-- CreateIndex
CREATE INDEX "residency_assignments_tenantId_workspaceId_subjectType_subj_idx" ON "residency_assignments"("tenantId", "workspaceId", "subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "residency_assignments_tenantId_dataRegionId_idx" ON "residency_assignments"("tenantId", "dataRegionId");

-- CreateIndex
CREATE INDEX "residency_assignments_tenantId_policyId_idx" ON "residency_assignments"("tenantId", "policyId");

-- CreateIndex
CREATE INDEX "residency_assignments_tenantId_dataClass_residencyStatus_idx" ON "residency_assignments"("tenantId", "dataClass", "residencyStatus");

-- CreateIndex
CREATE INDEX "residency_assignments_tenantId_deletedAt_idx" ON "residency_assignments"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "residency_assignments_tenantId_assignmentKey_key" ON "residency_assignments"("tenantId", "assignmentKey");

-- CreateIndex
CREATE INDEX "data_locations_tenantId_workspaceId_dataObjectType_dataObje_idx" ON "data_locations"("tenantId", "workspaceId", "dataObjectType", "dataObjectId");

-- CreateIndex
CREATE INDEX "data_locations_tenantId_dataRegionId_idx" ON "data_locations"("tenantId", "dataRegionId");

-- CreateIndex
CREATE INDEX "data_locations_tenantId_storageProvider_storageRegion_idx" ON "data_locations"("tenantId", "storageProvider", "storageRegion");

-- CreateIndex
CREATE INDEX "data_locations_tenantId_residencyState_encryptionState_idx" ON "data_locations"("tenantId", "residencyState", "encryptionState");

-- CreateIndex
CREATE INDEX "data_locations_tenantId_deletedAt_idx" ON "data_locations"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_locations_tenantId_locationKey_key" ON "data_locations"("tenantId", "locationKey");

-- CreateIndex
CREATE INDEX "regulatory_risks_tenantId_workspaceId_riskType_severity_sta_idx" ON "regulatory_risks"("tenantId", "workspaceId", "riskType", "severity", "status");

-- CreateIndex
CREATE INDEX "regulatory_risks_tenantId_frameworkId_idx" ON "regulatory_risks"("tenantId", "frameworkId");

-- CreateIndex
CREATE INDEX "regulatory_risks_tenantId_requirementId_idx" ON "regulatory_risks"("tenantId", "requirementId");

-- CreateIndex
CREATE INDEX "regulatory_risks_tenantId_dataRegionId_idx" ON "regulatory_risks"("tenantId", "dataRegionId");

-- CreateIndex
CREATE INDEX "regulatory_risks_tenantId_dueAt_idx" ON "regulatory_risks"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "regulatory_risks_tenantId_deletedAt_idx" ON "regulatory_risks"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "regulatory_risks_tenantId_riskKey_key" ON "regulatory_risks"("tenantId", "riskKey");

-- CreateIndex
CREATE INDEX "data_contracts_tenantId_workspaceId_domain_status_idx" ON "data_contracts"("tenantId", "workspaceId", "domain", "status");

-- CreateIndex
CREATE INDEX "data_contracts_tenantId_contractType_status_idx" ON "data_contracts"("tenantId", "contractType", "status");

-- CreateIndex
CREATE INDEX "data_contracts_tenantId_ownerUserId_idx" ON "data_contracts"("tenantId", "ownerUserId");

-- CreateIndex
CREATE INDEX "data_contracts_tenantId_deletedAt_idx" ON "data_contracts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "data_contracts_tenantId_contractKey_key" ON "data_contracts"("tenantId", "contractKey");

-- CreateIndex
CREATE INDEX "contract_versions_tenantId_workspaceId_status_idx" ON "contract_versions"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "contract_versions_tenantId_dataContractId_idx" ON "contract_versions"("tenantId", "dataContractId");

-- CreateIndex
CREATE INDEX "contract_versions_tenantId_publishedAt_idx" ON "contract_versions"("tenantId", "publishedAt");

-- CreateIndex
CREATE INDEX "contract_versions_tenantId_deletedAt_idx" ON "contract_versions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "contract_versions_tenantId_versionKey_key" ON "contract_versions"("tenantId", "versionKey");

-- CreateIndex
CREATE UNIQUE INDEX "contract_versions_dataContractId_version_key" ON "contract_versions"("dataContractId", "version");

-- CreateIndex
CREATE INDEX "api_products_tenantId_workspaceId_category_status_idx" ON "api_products"("tenantId", "workspaceId", "category", "status");

-- CreateIndex
CREATE INDEX "api_products_tenantId_visibility_status_idx" ON "api_products"("tenantId", "visibility", "status");

-- CreateIndex
CREATE INDEX "api_products_tenantId_dataContractId_idx" ON "api_products"("tenantId", "dataContractId");

-- CreateIndex
CREATE INDEX "api_products_tenantId_contractVersionId_idx" ON "api_products"("tenantId", "contractVersionId");

-- CreateIndex
CREATE INDEX "api_products_tenantId_deletedAt_idx" ON "api_products"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "api_products_tenantId_productKey_key" ON "api_products"("tenantId", "productKey");

-- CreateIndex
CREATE INDEX "api_plans_tenantId_workspaceId_tier_status_idx" ON "api_plans"("tenantId", "workspaceId", "tier", "status");

-- CreateIndex
CREATE INDEX "api_plans_tenantId_apiProductId_idx" ON "api_plans"("tenantId", "apiProductId");

-- CreateIndex
CREATE INDEX "api_plans_tenantId_currency_idx" ON "api_plans"("tenantId", "currency");

-- CreateIndex
CREATE INDEX "api_plans_tenantId_deletedAt_idx" ON "api_plans"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "api_plans_tenantId_planKey_key" ON "api_plans"("tenantId", "planKey");

-- CreateIndex
CREATE INDEX "api_subscriptions_tenantId_workspaceId_status_idx" ON "api_subscriptions"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "api_subscriptions_tenantId_apiProductId_idx" ON "api_subscriptions"("tenantId", "apiProductId");

-- CreateIndex
CREATE INDEX "api_subscriptions_tenantId_apiPlanId_idx" ON "api_subscriptions"("tenantId", "apiPlanId");

-- CreateIndex
CREATE INDEX "api_subscriptions_tenantId_apiKeyId_idx" ON "api_subscriptions"("tenantId", "apiKeyId");

-- CreateIndex
CREATE INDEX "api_subscriptions_tenantId_subscriberType_subscriberId_idx" ON "api_subscriptions"("tenantId", "subscriberType", "subscriberId");

-- CreateIndex
CREATE INDEX "api_subscriptions_tenantId_deletedAt_idx" ON "api_subscriptions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "api_subscriptions_tenantId_subscriptionKey_key" ON "api_subscriptions"("tenantId", "subscriptionKey");

-- CreateIndex
CREATE INDEX "api_usage_records_tenantId_workspaceId_occurredAt_idx" ON "api_usage_records"("tenantId", "workspaceId", "occurredAt");

-- CreateIndex
CREATE INDEX "api_usage_records_tenantId_apiProductId_occurredAt_idx" ON "api_usage_records"("tenantId", "apiProductId", "occurredAt");

-- CreateIndex
CREATE INDEX "api_usage_records_tenantId_subscriptionId_occurredAt_idx" ON "api_usage_records"("tenantId", "subscriptionId", "occurredAt");

-- CreateIndex
CREATE INDEX "api_usage_records_tenantId_apiKeyId_occurredAt_idx" ON "api_usage_records"("tenantId", "apiKeyId", "occurredAt");

-- CreateIndex
CREATE INDEX "api_usage_records_tenantId_endpoint_method_idx" ON "api_usage_records"("tenantId", "endpoint", "method");

-- CreateIndex
CREATE INDEX "api_usage_records_tenantId_deletedAt_idx" ON "api_usage_records"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "api_usage_records_tenantId_usageKey_key" ON "api_usage_records"("tenantId", "usageKey");

-- CreateIndex
CREATE INDEX "api_billings_tenantId_workspaceId_status_idx" ON "api_billings"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "api_billings_tenantId_apiPlanId_idx" ON "api_billings"("tenantId", "apiPlanId");

-- CreateIndex
CREATE INDEX "api_billings_tenantId_subscriptionId_idx" ON "api_billings"("tenantId", "subscriptionId");

-- CreateIndex
CREATE INDEX "api_billings_tenantId_periodStart_periodEnd_idx" ON "api_billings"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "api_billings_tenantId_deletedAt_idx" ON "api_billings"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "api_billings_tenantId_billingKey_key" ON "api_billings"("tenantId", "billingKey");

-- CreateIndex
CREATE INDEX "governance_policies_tenantId_workspaceId_policyType_status_idx" ON "governance_policies"("tenantId", "workspaceId", "policyType", "status");

-- CreateIndex
CREATE INDEX "governance_policies_tenantId_enforcementMode_idx" ON "governance_policies"("tenantId", "enforcementMode");

-- CreateIndex
CREATE INDEX "governance_policies_tenantId_dataContractId_idx" ON "governance_policies"("tenantId", "dataContractId");

-- CreateIndex
CREATE INDEX "governance_policies_tenantId_deletedAt_idx" ON "governance_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "governance_policies_tenantId_policyKey_key" ON "governance_policies"("tenantId", "policyKey");

-- CreateIndex
CREATE INDEX "api_quotas_tenantId_workspaceId_quotaType_status_idx" ON "api_quotas"("tenantId", "workspaceId", "quotaType", "status");

-- CreateIndex
CREATE INDEX "api_quotas_tenantId_apiProductId_idx" ON "api_quotas"("tenantId", "apiProductId");

-- CreateIndex
CREATE INDEX "api_quotas_tenantId_apiPlanId_idx" ON "api_quotas"("tenantId", "apiPlanId");

-- CreateIndex
CREATE INDEX "api_quotas_tenantId_resetAt_idx" ON "api_quotas"("tenantId", "resetAt");

-- CreateIndex
CREATE INDEX "api_quotas_tenantId_deletedAt_idx" ON "api_quotas"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "api_quotas_tenantId_quotaKey_key" ON "api_quotas"("tenantId", "quotaKey");

-- CreateIndex
CREATE INDEX "rate_limit_policies_tenantId_workspaceId_scopeType_status_idx" ON "rate_limit_policies"("tenantId", "workspaceId", "scopeType", "status");

-- CreateIndex
CREATE INDEX "rate_limit_policies_tenantId_apiProductId_idx" ON "rate_limit_policies"("tenantId", "apiProductId");

-- CreateIndex
CREATE INDEX "rate_limit_policies_tenantId_enforcementMode_idx" ON "rate_limit_policies"("tenantId", "enforcementMode");

-- CreateIndex
CREATE INDEX "rate_limit_policies_tenantId_deletedAt_idx" ON "rate_limit_policies"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "rate_limit_policies_tenantId_policyKey_key" ON "rate_limit_policies"("tenantId", "policyKey");

-- CreateIndex
CREATE INDEX "partner_access_tenantId_workspaceId_partnerType_status_idx" ON "partner_access"("tenantId", "workspaceId", "partnerType", "status");

-- CreateIndex
CREATE INDEX "partner_access_tenantId_apiProductId_idx" ON "partner_access"("tenantId", "apiProductId");

-- CreateIndex
CREATE INDEX "partner_access_tenantId_subscriptionId_idx" ON "partner_access"("tenantId", "subscriptionId");

-- CreateIndex
CREATE INDEX "partner_access_tenantId_expiresAt_idx" ON "partner_access"("tenantId", "expiresAt");

-- CreateIndex
CREATE INDEX "partner_access_tenantId_deletedAt_idx" ON "partner_access"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "partner_access_tenantId_partnerKey_key" ON "partner_access"("tenantId", "partnerKey");

-- CreateIndex
CREATE INDEX "trust_reports_tenantId_workspaceId_reportType_status_idx" ON "trust_reports"("tenantId", "workspaceId", "reportType", "status");

-- CreateIndex
CREATE INDEX "trust_reports_tenantId_visibility_status_idx" ON "trust_reports"("tenantId", "visibility", "status");

-- CreateIndex
CREATE INDEX "trust_reports_tenantId_publishedAt_idx" ON "trust_reports"("tenantId", "publishedAt");

-- CreateIndex
CREATE INDEX "trust_reports_tenantId_deletedAt_idx" ON "trust_reports"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "trust_reports_tenantId_reportKey_key" ON "trust_reports"("tenantId", "reportKey");

-- CreateIndex
CREATE INDEX "security_certifications_tenantId_workspaceId_certificationT_idx" ON "security_certifications"("tenantId", "workspaceId", "certificationType", "status");

-- CreateIndex
CREATE INDEX "security_certifications_tenantId_trustReportId_idx" ON "security_certifications"("tenantId", "trustReportId");

-- CreateIndex
CREATE INDEX "security_certifications_tenantId_authority_idx" ON "security_certifications"("tenantId", "authority");

-- CreateIndex
CREATE INDEX "security_certifications_tenantId_expiresAt_idx" ON "security_certifications"("tenantId", "expiresAt");

-- CreateIndex
CREATE INDEX "security_certifications_tenantId_deletedAt_idx" ON "security_certifications"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "security_certifications_tenantId_certificationKey_key" ON "security_certifications"("tenantId", "certificationKey");

-- CreateIndex
CREATE INDEX "compliance_artifacts_tenantId_workspaceId_artifactType_stat_idx" ON "compliance_artifacts"("tenantId", "workspaceId", "artifactType", "status");

-- CreateIndex
CREATE INDEX "compliance_artifacts_tenantId_trustReportId_idx" ON "compliance_artifacts"("tenantId", "trustReportId");

-- CreateIndex
CREATE INDEX "compliance_artifacts_tenantId_framework_idx" ON "compliance_artifacts"("tenantId", "framework");

-- CreateIndex
CREATE INDEX "compliance_artifacts_tenantId_classification_idx" ON "compliance_artifacts"("tenantId", "classification");

-- CreateIndex
CREATE INDEX "compliance_artifacts_tenantId_deletedAt_idx" ON "compliance_artifacts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_artifacts_tenantId_artifactKey_key" ON "compliance_artifacts"("tenantId", "artifactKey");

-- CreateIndex
CREATE INDEX "developer_accounts_tenantId_workspaceId_accountType_status_idx" ON "developer_accounts"("tenantId", "workspaceId", "accountType", "status");

-- CreateIndex
CREATE INDEX "developer_accounts_tenantId_verificationStatus_idx" ON "developer_accounts"("tenantId", "verificationStatus");

-- CreateIndex
CREATE INDEX "developer_accounts_tenantId_deletedAt_idx" ON "developer_accounts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "developer_accounts_tenantId_accountKey_key" ON "developer_accounts"("tenantId", "accountKey");

-- CreateIndex
CREATE UNIQUE INDEX "developer_accounts_tenantId_email_key" ON "developer_accounts"("tenantId", "email");

-- CreateIndex
CREATE INDEX "developer_applications_tenantId_workspaceId_appType_status_idx" ON "developer_applications"("tenantId", "workspaceId", "appType", "status");

-- CreateIndex
CREATE INDEX "developer_applications_tenantId_developerAccountId_idx" ON "developer_applications"("tenantId", "developerAccountId");

-- CreateIndex
CREATE INDEX "developer_applications_tenantId_approvalStatus_idx" ON "developer_applications"("tenantId", "approvalStatus");

-- CreateIndex
CREATE INDEX "developer_applications_tenantId_publishedAt_idx" ON "developer_applications"("tenantId", "publishedAt");

-- CreateIndex
CREATE INDEX "developer_applications_tenantId_deletedAt_idx" ON "developer_applications"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "developer_applications_tenantId_applicationKey_key" ON "developer_applications"("tenantId", "applicationKey");

-- CreateIndex
CREATE INDEX "api_documentation_tenantId_workspaceId_status_idx" ON "api_documentation"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "api_documentation_tenantId_apiProductId_idx" ON "api_documentation"("tenantId", "apiProductId");

-- CreateIndex
CREATE INDEX "api_documentation_tenantId_audience_idx" ON "api_documentation"("tenantId", "audience");

-- CreateIndex
CREATE INDEX "api_documentation_tenantId_publishedAt_idx" ON "api_documentation"("tenantId", "publishedAt");

-- CreateIndex
CREATE INDEX "api_documentation_tenantId_deletedAt_idx" ON "api_documentation"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "api_documentation_tenantId_documentationKey_key" ON "api_documentation"("tenantId", "documentationKey");

-- CreateIndex
CREATE INDEX "sdk_packages_tenantId_workspaceId_language_status_idx" ON "sdk_packages"("tenantId", "workspaceId", "language", "status");

-- CreateIndex
CREATE INDEX "sdk_packages_tenantId_apiDocumentationId_idx" ON "sdk_packages"("tenantId", "apiDocumentationId");

-- CreateIndex
CREATE INDEX "sdk_packages_tenantId_packageManager_idx" ON "sdk_packages"("tenantId", "packageManager");

-- CreateIndex
CREATE INDEX "sdk_packages_tenantId_publishedAt_idx" ON "sdk_packages"("tenantId", "publishedAt");

-- CreateIndex
CREATE INDEX "sdk_packages_tenantId_deletedAt_idx" ON "sdk_packages"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "sdk_packages_tenantId_packageKey_key" ON "sdk_packages"("tenantId", "packageKey");

-- CreateIndex
CREATE INDEX "partner_listings_tenantId_workspaceId_partnerType_status_idx" ON "partner_listings"("tenantId", "workspaceId", "partnerType", "status");

-- CreateIndex
CREATE INDEX "partner_listings_tenantId_certificationLevel_idx" ON "partner_listings"("tenantId", "certificationLevel");

-- CreateIndex
CREATE INDEX "partner_listings_tenantId_deletedAt_idx" ON "partner_listings"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "partner_listings_tenantId_listingKey_key" ON "partner_listings"("tenantId", "listingKey");

-- CreateIndex
CREATE INDEX "marketplace_applications_tenantId_workspaceId_category_stat_idx" ON "marketplace_applications"("tenantId", "workspaceId", "category", "status");

-- CreateIndex
CREATE INDEX "marketplace_applications_tenantId_developerApplicationId_idx" ON "marketplace_applications"("tenantId", "developerApplicationId");

-- CreateIndex
CREATE INDEX "marketplace_applications_tenantId_partnerListingId_idx" ON "marketplace_applications"("tenantId", "partnerListingId");

-- CreateIndex
CREATE INDEX "marketplace_applications_tenantId_publishedAt_idx" ON "marketplace_applications"("tenantId", "publishedAt");

-- CreateIndex
CREATE INDEX "marketplace_applications_tenantId_deletedAt_idx" ON "marketplace_applications"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_applications_tenantId_marketplaceKey_key" ON "marketplace_applications"("tenantId", "marketplaceKey");

-- CreateIndex
CREATE INDEX "external_integrations_tenantId_workspaceId_category_status_idx" ON "external_integrations"("tenantId", "workspaceId", "category", "status");

-- CreateIndex
CREATE INDEX "external_integrations_tenantId_provider_idx" ON "external_integrations"("tenantId", "provider");

-- CreateIndex
CREATE INDEX "external_integrations_tenantId_healthStatus_idx" ON "external_integrations"("tenantId", "healthStatus");

-- CreateIndex
CREATE INDEX "external_integrations_tenantId_partnerListingId_idx" ON "external_integrations"("tenantId", "partnerListingId");

-- CreateIndex
CREATE INDEX "external_integrations_tenantId_marketplaceApplicationId_idx" ON "external_integrations"("tenantId", "marketplaceApplicationId");

-- CreateIndex
CREATE INDEX "external_integrations_tenantId_deletedAt_idx" ON "external_integrations"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "external_integrations_tenantId_integrationKey_key" ON "external_integrations"("tenantId", "integrationKey");

-- CreateIndex
CREATE INDEX "status_incidents_tenantId_workspaceId_severity_status_idx" ON "status_incidents"("tenantId", "workspaceId", "severity", "status");

-- CreateIndex
CREATE INDEX "status_incidents_tenantId_externalIntegrationId_idx" ON "status_incidents"("tenantId", "externalIntegrationId");

-- CreateIndex
CREATE INDEX "status_incidents_tenantId_marketplaceApplicationId_idx" ON "status_incidents"("tenantId", "marketplaceApplicationId");

-- CreateIndex
CREATE INDEX "status_incidents_tenantId_startedAt_idx" ON "status_incidents"("tenantId", "startedAt");

-- CreateIndex
CREATE INDEX "status_incidents_tenantId_deletedAt_idx" ON "status_incidents"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "status_incidents_tenantId_incidentKey_key" ON "status_incidents"("tenantId", "incidentKey");

-- CreateIndex
CREATE INDEX "ecosystem_events_tenantId_workspaceId_eventType_severity_idx" ON "ecosystem_events"("tenantId", "workspaceId", "eventType", "severity");

-- CreateIndex
CREATE INDEX "ecosystem_events_tenantId_developerApplicationId_idx" ON "ecosystem_events"("tenantId", "developerApplicationId");

-- CreateIndex
CREATE INDEX "ecosystem_events_tenantId_externalIntegrationId_idx" ON "ecosystem_events"("tenantId", "externalIntegrationId");

-- CreateIndex
CREATE INDEX "ecosystem_events_tenantId_occurredAt_idx" ON "ecosystem_events"("tenantId", "occurredAt");

-- CreateIndex
CREATE INDEX "ecosystem_events_tenantId_deletedAt_idx" ON "ecosystem_events"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ecosystem_events_tenantId_eventKey_key" ON "ecosystem_events"("tenantId", "eventKey");

-- CreateIndex
CREATE INDEX "customer_accounts_tenantId_workspaceId_accountType_status_idx" ON "customer_accounts"("tenantId", "workspaceId", "accountType", "status");

-- CreateIndex
CREATE INDEX "customer_accounts_tenantId_customerIdentityId_idx" ON "customer_accounts"("tenantId", "customerIdentityId");

-- CreateIndex
CREATE INDEX "customer_accounts_tenantId_customerId_idx" ON "customer_accounts"("tenantId", "customerId");

-- CreateIndex
CREATE INDEX "customer_accounts_tenantId_lifecycleStage_idx" ON "customer_accounts"("tenantId", "lifecycleStage");

-- CreateIndex
CREATE INDEX "customer_accounts_tenantId_countryCode_idx" ON "customer_accounts"("tenantId", "countryCode");

-- CreateIndex
CREATE INDEX "customer_accounts_tenantId_deletedAt_idx" ON "customer_accounts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "customer_accounts_tenantId_accountKey_key" ON "customer_accounts"("tenantId", "accountKey");

-- CreateIndex
CREATE INDEX "customer_workspaces_tenantId_workspaceId_workspaceType_stat_idx" ON "customer_workspaces"("tenantId", "workspaceId", "workspaceType", "status");

-- CreateIndex
CREATE INDEX "customer_workspaces_tenantId_customerAccountId_idx" ON "customer_workspaces"("tenantId", "customerAccountId");

-- CreateIndex
CREATE INDEX "customer_workspaces_tenantId_accessLevel_idx" ON "customer_workspaces"("tenantId", "accessLevel");

-- CreateIndex
CREATE INDEX "customer_workspaces_tenantId_deletedAt_idx" ON "customer_workspaces"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "customer_workspaces_tenantId_workspaceKey_key" ON "customer_workspaces"("tenantId", "workspaceKey");

-- CreateIndex
CREATE INDEX "billing_profiles_tenantId_workspaceId_status_idx" ON "billing_profiles"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "billing_profiles_tenantId_customerAccountId_idx" ON "billing_profiles"("tenantId", "customerAccountId");

-- CreateIndex
CREATE INDEX "billing_profiles_tenantId_countryCode_idx" ON "billing_profiles"("tenantId", "countryCode");

-- CreateIndex
CREATE INDEX "billing_profiles_tenantId_currency_idx" ON "billing_profiles"("tenantId", "currency");

-- CreateIndex
CREATE INDEX "billing_profiles_tenantId_deletedAt_idx" ON "billing_profiles"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "billing_profiles_tenantId_profileKey_key" ON "billing_profiles"("tenantId", "profileKey");

-- CreateIndex
CREATE INDEX "customer_subscriptions_tenantId_workspaceId_planTier_status_idx" ON "customer_subscriptions"("tenantId", "workspaceId", "planTier", "status");

-- CreateIndex
CREATE INDEX "customer_subscriptions_tenantId_customerAccountId_idx" ON "customer_subscriptions"("tenantId", "customerAccountId");

-- CreateIndex
CREATE INDEX "customer_subscriptions_tenantId_billingProfileId_idx" ON "customer_subscriptions"("tenantId", "billingProfileId");

-- CreateIndex
CREATE INDEX "customer_subscriptions_tenantId_renewsAt_idx" ON "customer_subscriptions"("tenantId", "renewsAt");

-- CreateIndex
CREATE INDEX "customer_subscriptions_tenantId_deletedAt_idx" ON "customer_subscriptions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "customer_subscriptions_tenantId_subscriptionKey_key" ON "customer_subscriptions"("tenantId", "subscriptionKey");

-- CreateIndex
CREATE INDEX "invoice_records_tenantId_workspaceId_status_idx" ON "invoice_records"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "invoice_records_tenantId_customerAccountId_idx" ON "invoice_records"("tenantId", "customerAccountId");

-- CreateIndex
CREATE INDEX "invoice_records_tenantId_subscriptionId_idx" ON "invoice_records"("tenantId", "subscriptionId");

-- CreateIndex
CREATE INDEX "invoice_records_tenantId_billingProfileId_idx" ON "invoice_records"("tenantId", "billingProfileId");

-- CreateIndex
CREATE INDEX "invoice_records_tenantId_dueAt_idx" ON "invoice_records"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "invoice_records_tenantId_deletedAt_idx" ON "invoice_records"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_records_tenantId_invoiceKey_key" ON "invoice_records"("tenantId", "invoiceKey");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_records_tenantId_invoiceNumber_key" ON "invoice_records"("tenantId", "invoiceNumber");

-- CreateIndex
CREATE INDEX "payment_methods_tenantId_workspaceId_methodType_status_idx" ON "payment_methods"("tenantId", "workspaceId", "methodType", "status");

-- CreateIndex
CREATE INDEX "payment_methods_tenantId_customerAccountId_idx" ON "payment_methods"("tenantId", "customerAccountId");

-- CreateIndex
CREATE INDEX "payment_methods_tenantId_billingProfileId_idx" ON "payment_methods"("tenantId", "billingProfileId");

-- CreateIndex
CREATE INDEX "payment_methods_tenantId_provider_idx" ON "payment_methods"("tenantId", "provider");

-- CreateIndex
CREATE INDEX "payment_methods_tenantId_deletedAt_idx" ON "payment_methods"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_tenantId_methodKey_key" ON "payment_methods"("tenantId", "methodKey");

-- CreateIndex
CREATE INDEX "usage_metrics_tenantId_workspaceId_metricType_idx" ON "usage_metrics"("tenantId", "workspaceId", "metricType");

-- CreateIndex
CREATE INDEX "usage_metrics_tenantId_customerAccountId_idx" ON "usage_metrics"("tenantId", "customerAccountId");

-- CreateIndex
CREATE INDEX "usage_metrics_tenantId_subscriptionId_idx" ON "usage_metrics"("tenantId", "subscriptionId");

-- CreateIndex
CREATE INDEX "usage_metrics_tenantId_periodStart_periodEnd_idx" ON "usage_metrics"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "usage_metrics_tenantId_deletedAt_idx" ON "usage_metrics"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "usage_metrics_tenantId_metricKey_key" ON "usage_metrics"("tenantId", "metricKey");

-- CreateIndex
CREATE INDEX "partner_accounts_tenantId_workspaceId_partnerType_status_idx" ON "partner_accounts"("tenantId", "workspaceId", "partnerType", "status");

-- CreateIndex
CREATE INDEX "partner_accounts_tenantId_tier_idx" ON "partner_accounts"("tenantId", "tier");

-- CreateIndex
CREATE INDEX "partner_accounts_tenantId_countryCode_idx" ON "partner_accounts"("tenantId", "countryCode");

-- CreateIndex
CREATE INDEX "partner_accounts_tenantId_deletedAt_idx" ON "partner_accounts"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "partner_accounts_tenantId_partnerKey_key" ON "partner_accounts"("tenantId", "partnerKey");

-- CreateIndex
CREATE INDEX "partner_workspaces_tenantId_workspaceId_status_idx" ON "partner_workspaces"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "partner_workspaces_tenantId_partnerAccountId_idx" ON "partner_workspaces"("tenantId", "partnerAccountId");

-- CreateIndex
CREATE INDEX "partner_workspaces_tenantId_portalRole_idx" ON "partner_workspaces"("tenantId", "portalRole");

-- CreateIndex
CREATE INDEX "partner_workspaces_tenantId_deletedAt_idx" ON "partner_workspaces"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "partner_workspaces_tenantId_workspaceKey_key" ON "partner_workspaces"("tenantId", "workspaceKey");

-- CreateIndex
CREATE INDEX "partner_commissions_tenantId_workspaceId_status_idx" ON "partner_commissions"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "partner_commissions_tenantId_partnerAccountId_idx" ON "partner_commissions"("tenantId", "partnerAccountId");

-- CreateIndex
CREATE INDEX "partner_commissions_tenantId_sourceType_sourceId_idx" ON "partner_commissions"("tenantId", "sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "partner_commissions_tenantId_earnedAt_idx" ON "partner_commissions"("tenantId", "earnedAt");

-- CreateIndex
CREATE INDEX "partner_commissions_tenantId_deletedAt_idx" ON "partner_commissions"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "partner_commissions_tenantId_commissionKey_key" ON "partner_commissions"("tenantId", "commissionKey");

-- CreateIndex
CREATE INDEX "partner_referrals_tenantId_workspaceId_status_idx" ON "partner_referrals"("tenantId", "workspaceId", "status");

-- CreateIndex
CREATE INDEX "partner_referrals_tenantId_partnerAccountId_idx" ON "partner_referrals"("tenantId", "partnerAccountId");

-- CreateIndex
CREATE INDEX "partner_referrals_tenantId_customerAccountId_idx" ON "partner_referrals"("tenantId", "customerAccountId");

-- CreateIndex
CREATE INDEX "partner_referrals_tenantId_submittedAt_idx" ON "partner_referrals"("tenantId", "submittedAt");

-- CreateIndex
CREATE INDEX "partner_referrals_tenantId_deletedAt_idx" ON "partner_referrals"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "partner_referrals_tenantId_referralKey_key" ON "partner_referrals"("tenantId", "referralKey");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthAccount" ADD CONSTRAINT "AuthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAssignment" ADD CONSTRAINT "RoleAssignment_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAssignment" ADD CONSTRAINT "RoleAssignment_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAssignment" ADD CONSTRAINT "RoleAssignment_workspaceMemberId_fkey" FOREIGN KEY ("workspaceMemberId") REFERENCES "WorkspaceMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStepExecution" ADD CONSTRAINT "WorkflowStepExecution_workflowExecutionId_fkey" FOREIGN KEY ("workflowExecutionId") REFERENCES "WorkflowExecution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventBusSubscription" ADD CONSTRAINT "EventBusSubscription_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "EventBusTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "EventBusTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "IntegrationProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingAccount" ADD CONSTRAINT "BillingAccount_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_billingAccountId_fkey" FOREIGN KEY ("billingAccountId") REFERENCES "BillingAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageRecord" ADD CONSTRAINT "UsageRecord_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_billingAccountId_fkey" FOREIGN KEY ("billingAccountId") REFERENCES "BillingAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_currency_fkey" FOREIGN KEY ("currency") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "invoice_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "invoice_series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiToolCall" ADD CONSTRAINT "AiToolCall_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRecommendation" ADD CONSTRAINT "AiRecommendation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiInsight" ADD CONSTRAINT "AiInsight_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiInsight" ADD CONSTRAINT "AiInsight_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "KpiMetric"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiMetric" ADD CONSTRAINT "KpiMetric_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricValue" ADD CONSTRAINT "MetricValue_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "KpiMetric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricValue" ADD CONSTRAINT "MetricValue_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "AnalyticsDataset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardWidget" ADD CONSTRAINT "DashboardWidget_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardWidget" ADD CONSTRAINT "DashboardWidget_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "KpiMetric"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessModule" ADD CONSTRAINT "BusinessModule_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleSetting" ADD CONSTRAINT "ModuleSetting_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "BusinessModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleSetting" ADD CONSTRAINT "ModuleSetting_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmContact" ADD CONSTRAINT "CrmContact_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "CrmAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmDeal" ADD CONSTRAINT "CrmDeal_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "CrmAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceTransaction" ADD CONSTRAINT "FinanceTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "FinanceAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeUserId_fkey" FOREIGN KEY ("assigneeUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_controls" ADD CONSTRAINT "compliance_controls_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "compliance_frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityFinding" ADD CONSTRAINT "SecurityFinding_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityFinding" ADD CONSTRAINT "SecurityFinding_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmOpportunity" ADD CONSTRAINT "CrmOpportunity_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "CrmPipeline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmOpportunity" ADD CONSTRAINT "CrmOpportunity_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CrmCustomerRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFolder" ADD CONSTRAINT "DocumentFolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DocumentFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadRecord" ADD CONSTRAINT "UploadRecord_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "DocumentFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "WebhookEndpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translation_values" ADD CONSTRAINT "translation_values_translationKeyId_fkey" FOREIGN KEY ("translationKeyId") REFERENCES "translation_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_profiles" ADD CONSTRAINT "country_profiles_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_compliance" ADD CONSTRAINT "country_compliance_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_compliance" ADD CONSTRAINT "country_compliance_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "compliance_frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_tax_profiles" ADD CONSTRAINT "country_tax_profiles_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_business_rules" ADD CONSTRAINT "country_business_rules_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_holidays" ADD CONSTRAINT "country_holidays_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_rules" ADD CONSTRAINT "compliance_rules_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "compliance_frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_controls" ADD CONSTRAINT "privacy_controls_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "compliance_frameworks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_baseCurrencyCode_fkey" FOREIGN KEY ("baseCurrencyCode") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_quoteCurrencyCode_fkey" FOREIGN KEY ("quoteCurrencyCode") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_regions" ADD CONSTRAINT "tax_regions_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "tax_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rules" ADD CONSTRAINT "tax_rules_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "tax_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rules" ADD CONSTRAINT "tax_rules_taxCategoryId_fkey" FOREIGN KEY ("taxCategoryId") REFERENCES "tax_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_taxes" ADD CONSTRAINT "invoice_taxes_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_taxes" ADD CONSTRAINT "invoice_taxes_invoiceItemId_fkey" FOREIGN KEY ("invoiceItemId") REFERENCES "invoice_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_taxes" ADD CONSTRAINT "invoice_taxes_taxRuleId_fkey" FOREIGN KEY ("taxRuleId") REFERENCES "tax_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_audits" ADD CONSTRAINT "invoice_audits_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_definitions" ADD CONSTRAINT "workflow_definitions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_definitions" ADD CONSTRAINT "workflow_definitions_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_definitions" ADD CONSTRAINT "workflow_definitions_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_definitions" ADD CONSTRAINT "workflow_definitions_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WorkflowTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_definitions" ADD CONSTRAINT "workflow_definitions_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_nodes" ADD CONSTRAINT "workflow_nodes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_nodes" ADD CONSTRAINT "workflow_nodes_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_nodes" ADD CONSTRAINT "workflow_nodes_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "workflow_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_edges" ADD CONSTRAINT "workflow_edges_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_edges" ADD CONSTRAINT "workflow_edges_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_edges" ADD CONSTRAINT "workflow_edges_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "workflow_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_approvals" ADD CONSTRAINT "workflow_approvals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_approvals" ADD CONSTRAINT "workflow_approvals_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_approvals" ADD CONSTRAINT "workflow_approvals_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_approvals" ADD CONSTRAINT "workflow_approvals_workflowExecutionId_fkey" FOREIGN KEY ("workflowExecutionId") REFERENCES "WorkflowExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_approvals" ADD CONSTRAINT "workflow_approvals_approverUserId_fkey" FOREIGN KEY ("approverUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_metrics" ADD CONSTRAINT "workflow_metrics_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_metrics" ADD CONSTRAINT "workflow_metrics_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_metrics" ADD CONSTRAINT "workflow_metrics_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_metrics" ADD CONSTRAINT "workflow_metrics_workflowExecutionId_fkey" FOREIGN KEY ("workflowExecutionId") REFERENCES "WorkflowExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_audits" ADD CONSTRAINT "workflow_audits_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_audits" ADD CONSTRAINT "workflow_audits_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_audits" ADD CONSTRAINT "workflow_audits_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_audits" ADD CONSTRAINT "workflow_audits_workflowExecutionId_fkey" FOREIGN KEY ("workflowExecutionId") REFERENCES "WorkflowExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_audits" ADD CONSTRAINT "workflow_audits_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_import_batches" ADD CONSTRAINT "data_import_batches_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "data_import_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_import_records" ADD CONSTRAINT "data_import_records_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "data_import_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_import_errors" ADD CONSTRAINT "data_import_errors_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "data_import_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "migration_runs" ADD CONSTRAINT "migration_runs_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "migration_connections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "migration_mappings" ADD CONSTRAINT "migration_mappings_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "migration_connections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_steps" ADD CONSTRAINT "onboarding_steps_onboardingProfileId_fkey" FOREIGN KEY ("onboardingProfileId") REFERENCES "onboarding_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_recommendations" ADD CONSTRAINT "onboarding_recommendations_onboardingProfileId_fkey" FOREIGN KEY ("onboardingProfileId") REFERENCES "onboarding_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_apps" ADD CONSTRAINT "marketplace_apps_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "partner_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_app_versions" ADD CONSTRAINT "marketplace_app_versions_appId_fkey" FOREIGN KEY ("appId") REFERENCES "marketplace_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_installations" ADD CONSTRAINT "marketplace_installations_appId_fkey" FOREIGN KEY ("appId") REFERENCES "marketplace_apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_installations" ADD CONSTRAINT "marketplace_installations_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "marketplace_app_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_permissions" ADD CONSTRAINT "marketplace_permissions_appId_fkey" FOREIGN KEY ("appId") REFERENCES "marketplace_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extension_definitions" ADD CONSTRAINT "extension_definitions_appId_fkey" FOREIGN KEY ("appId") REFERENCES "marketplace_apps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extension_hooks" ADD CONSTRAINT "extension_hooks_extensionId_fkey" FOREIGN KEY ("extensionId") REFERENCES "extension_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extension_points" ADD CONSTRAINT "extension_points_extensionId_fkey" FOREIGN KEY ("extensionId") REFERENCES "extension_definitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_certifications" ADD CONSTRAINT "partner_certifications_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "partner_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_service_listings" ADD CONSTRAINT "partner_service_listings_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "partner_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_sessions" ADD CONSTRAINT "device_sessions_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "registered_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_permissions" ADD CONSTRAINT "device_permissions_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "registered_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_activity_logs" ADD CONSTRAINT "device_activity_logs_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "registered_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_approval_requests" ADD CONSTRAINT "device_approval_requests_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "registered_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_workspace_profiles" ADD CONSTRAINT "mobile_workspace_profiles_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "registered_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desktop_companion_profiles" ADD CONSTRAINT "desktop_companion_profiles_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "registered_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offline_stores" ADD CONSTRAINT "offline_stores_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "registered_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offline_queue_items" ADD CONSTRAINT "offline_queue_items_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "registered_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offline_queue_items" ADD CONSTRAINT "offline_queue_items_offlineStoreId_fkey" FOREIGN KEY ("offlineStoreId") REFERENCES "offline_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offline_conflicts" ADD CONSTRAINT "offline_conflicts_queueItemId_fkey" FOREIGN KEY ("queueItemId") REFERENCES "offline_queue_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_cursors" ADD CONSTRAINT "sync_cursors_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "registered_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_classification_events" ADD CONSTRAINT "data_classification_events_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "data_catalog_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_ownership_assignments" ADD CONSTRAINT "data_ownership_assignments_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "data_catalog_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_lineage_edges" ADD CONSTRAINT "data_lineage_edges_sourceAssetId_fkey" FOREIGN KEY ("sourceAssetId") REFERENCES "data_catalog_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_lineage_edges" ADD CONSTRAINT "data_lineage_edges_targetAssetId_fkey" FOREIGN KEY ("targetAssetId") REFERENCES "data_catalog_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_quality_checks" ADD CONSTRAINT "data_quality_checks_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "data_catalog_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_workflow_runs" ADD CONSTRAINT "privacy_workflow_runs_privacyRequestId_fkey" FOREIGN KEY ("privacyRequestId") REFERENCES "privacy_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records_lifecycle_actions" ADD CONSTRAINT "records_lifecycle_actions_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "records_lifecycle_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records_archive_jobs" ADD CONSTRAINT "records_archive_jobs_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "records_lifecycle_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_indexed_documents" ADD CONSTRAINT "search_indexed_documents_indexId_fkey" FOREIGN KEY ("indexId") REFERENCES "search_indexes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_embedding_records" ADD CONSTRAINT "search_embedding_records_indexId_fkey" FOREIGN KEY ("indexId") REFERENCES "search_indexes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_embedding_records" ADD CONSTRAINT "search_embedding_records_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "search_indexed_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retrieval_results" ADD CONSTRAINT "retrieval_results_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "retrieval_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_access_policies" ADD CONSTRAINT "search_access_policies_indexId_fkey" FOREIGN KEY ("indexId") REFERENCES "search_indexes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_categories" ADD CONSTRAINT "knowledge_categories_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "knowledge_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_categories" ADD CONSTRAINT "knowledge_categories_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "knowledge_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_articles" ADD CONSTRAINT "knowledge_articles_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "knowledge_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_articles" ADD CONSTRAINT "knowledge_articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "knowledge_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "knowledge_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_parentThreadId_fkey" FOREIGN KEY ("parentThreadId") REFERENCES "discussion_threads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_messages" ADD CONSTRAINT "discussion_messages_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "discussions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_messages" ADD CONSTRAINT "discussion_messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "discussion_threads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaboration_mentions" ADD CONSTRAINT "collaboration_mentions_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "discussion_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaboration_reactions" ADD CONSTRAINT "collaboration_reactions_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "discussion_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaboration_activities" ADD CONSTRAINT "collaboration_activities_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "knowledge_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_rooms" ADD CONSTRAINT "decision_rooms_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "knowledge_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_participants" ADD CONSTRAINT "decision_participants_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "decision_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_votes" ADD CONSTRAINT "decision_votes_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "decision_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_votes" ADD CONSTRAINT "decision_votes_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "decision_participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_approvals" ADD CONSTRAINT "decision_approvals_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "decision_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_records" ADD CONSTRAINT "decision_records_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "decision_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_collaboration_summaries" ADD CONSTRAINT "ai_collaboration_summaries_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "knowledge_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_collaboration_summaries" ADD CONSTRAINT "ai_collaboration_summaries_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "discussions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_collaboration_summaries" ADD CONSTRAINT "ai_collaboration_summaries_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "decision_rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaboration_action_items" ADD CONSTRAINT "collaboration_action_items_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "knowledge_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaboration_action_items" ADD CONSTRAINT "collaboration_action_items_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "discussions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaboration_action_items" ADD CONSTRAINT "collaboration_action_items_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "decision_rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaboration_action_items" ADD CONSTRAINT "collaboration_action_items_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "ai_collaboration_summaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication_members" ADD CONSTRAINT "communication_members_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "communication_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "communication_channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "communication_channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reactions" ADD CONSTRAINT "message_reactions_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_recipients" ADD CONSTRAINT "announcement_recipients_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_participants" ADD CONSTRAINT "meeting_participants_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_agendas" ADD CONSTRAINT "meeting_agendas_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_decisions" ADD CONSTRAINT "meeting_decisions_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_action_items" ADD CONSTRAINT "meeting_action_items_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_action_items" ADD CONSTRAINT "meeting_action_items_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "meeting_summaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_summaries" ADD CONSTRAINT "meeting_summaries_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_participants" ADD CONSTRAINT "calendar_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "calendar_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_rules" ADD CONSTRAINT "schedule_rules_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "calendars"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_windows" ADD CONSTRAINT "availability_windows_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "calendars"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_recommendations" ADD CONSTRAINT "meeting_recommendations_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "calendar_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_contracts" ADD CONSTRAINT "revenue_contracts_revenueAccountId_fkey" FOREIGN KEY ("revenueAccountId") REFERENCES "revenue_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_amendments" ADD CONSTRAINT "contract_amendments_revenueContractId_fkey" FOREIGN KEY ("revenueContractId") REFERENCES "revenue_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renewal_schedules" ADD CONSTRAINT "renewal_schedules_revenueAccountId_fkey" FOREIGN KEY ("revenueAccountId") REFERENCES "revenue_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renewal_schedules" ADD CONSTRAINT "renewal_schedules_revenueContractId_fkey" FOREIGN KEY ("revenueContractId") REFERENCES "revenue_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renewal_forecasts" ADD CONSTRAINT "renewal_forecasts_revenueAccountId_fkey" FOREIGN KEY ("revenueAccountId") REFERENCES "revenue_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renewal_forecasts" ADD CONSTRAINT "renewal_forecasts_renewalScheduleId_fkey" FOREIGN KEY ("renewalScheduleId") REFERENCES "renewal_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "churn_signals" ADD CONSTRAINT "churn_signals_revenueAccountId_fkey" FOREIGN KEY ("revenueAccountId") REFERENCES "revenue_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expansion_opportunities" ADD CONSTRAINT "expansion_opportunities_revenueAccountId_fkey" FOREIGN KEY ("revenueAccountId") REFERENCES "revenue_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_health_scores" ADD CONSTRAINT "account_health_scores_revenueAccountId_fkey" FOREIGN KEY ("revenueAccountId") REFERENCES "revenue_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_forecasts" ADD CONSTRAINT "revenue_forecasts_revenueAccountId_fkey" FOREIGN KEY ("revenueAccountId") REFERENCES "revenue_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_events" ADD CONSTRAINT "revenue_events_revenueAccountId_fkey" FOREIGN KEY ("revenueAccountId") REFERENCES "revenue_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_events" ADD CONSTRAINT "revenue_events_revenueContractId_fkey" FOREIGN KEY ("revenueContractId") REFERENCES "revenue_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_contracts" ADD CONSTRAINT "vendor_contracts_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_scorecards" ADD CONSTRAINT "vendor_scorecards_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_requests" ADD CONSTRAINT "procurement_requests_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_requests" ADD CONSTRAINT "procurement_requests_purchaseCategoryId_fkey" FOREIGN KEY ("purchaseCategoryId") REFERENCES "purchase_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_approvals" ADD CONSTRAINT "procurement_approvals_procurementRequestId_fkey" FOREIGN KEY ("procurementRequestId") REFERENCES "procurement_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_procurementRequestId_fkey" FOREIGN KEY ("procurementRequestId") REFERENCES "procurement_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_purchaseCategoryId_fkey" FOREIGN KEY ("purchaseCategoryId") REFERENCES "purchase_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_allocations" ADD CONSTRAINT "budget_allocations_purchaseCategoryId_fkey" FOREIGN KEY ("purchaseCategoryId") REFERENCES "purchase_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spend_transactions" ADD CONSTRAINT "spend_transactions_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spend_transactions" ADD CONSTRAINT "spend_transactions_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spend_transactions" ADD CONSTRAINT "spend_transactions_purchaseCategoryId_fkey" FOREIGN KEY ("purchaseCategoryId") REFERENCES "purchase_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spend_insights" ADD CONSTRAINT "spend_insights_purchaseCategoryId_fkey" FOREIGN KEY ("purchaseCategoryId") REFERENCES "purchase_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_optimization_recommendations" ADD CONSTRAINT "cost_optimization_recommendations_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_optimization_recommendations" ADD CONSTRAINT "cost_optimization_recommendations_purchaseCategoryId_fkey" FOREIGN KEY ("purchaseCategoryId") REFERENCES "purchase_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_events" ADD CONSTRAINT "procurement_events_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_events" ADD CONSTRAINT "procurement_events_procurementRequestId_fkey" FOREIGN KEY ("procurementRequestId") REFERENCES "procurement_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_events" ADD CONSTRAINT "procurement_events_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_zones" ADD CONSTRAINT "warehouse_zones_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_bins" ADD CONSTRAINT "warehouse_bins_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_bins" ADD CONSTRAINT "warehouse_bins_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "warehouse_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "supply_chain_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "warehouse_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_binId_fkey" FOREIGN KEY ("binId") REFERENCES "warehouse_bins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "inventory_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_batches" ADD CONSTRAINT "inventory_batches_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "supply_chain_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_serials" ADD CONSTRAINT "inventory_serials_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "supply_chain_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_serials" ADD CONSTRAINT "inventory_serials_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "inventory_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_audits" ADD CONSTRAINT "inventory_audits_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "supply_chain_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_audits" ADD CONSTRAINT "inventory_audits_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement_history" ADD CONSTRAINT "inventory_movement_history_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "supply_chain_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement_history" ADD CONSTRAINT "inventory_movement_history_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement_history" ADD CONSTRAINT "inventory_movement_history_sourceBinId_fkey" FOREIGN KEY ("sourceBinId") REFERENCES "warehouse_bins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement_history" ADD CONSTRAINT "inventory_movement_history_destinationBinId_fkey" FOREIGN KEY ("destinationBinId") REFERENCES "warehouse_bins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transfers" ADD CONSTRAINT "inventory_transfers_sourceWarehouseId_fkey" FOREIGN KEY ("sourceWarehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transfers" ADD CONSTRAINT "inventory_transfers_destinationWarehouseId_fkey" FOREIGN KEY ("destinationWarehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_records" ADD CONSTRAINT "receiving_records_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_records" ADD CONSTRAINT "receiving_records_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "supply_chain_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fulfillment_orders" ADD CONSTRAINT "fulfillment_orders_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picking_tasks" ADD CONSTRAINT "picking_tasks_fulfillmentOrderId_fkey" FOREIGN KEY ("fulfillmentOrderId") REFERENCES "fulfillment_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picking_tasks" ADD CONSTRAINT "picking_tasks_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "supply_chain_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packing_tasks" ADD CONSTRAINT "packing_tasks_fulfillmentOrderId_fkey" FOREIGN KEY ("fulfillmentOrderId") REFERENCES "fulfillment_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_fulfillmentOrderId_fkey" FOREIGN KEY ("fulfillmentOrderId") REFERENCES "fulfillment_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "carriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_tracking_events" ADD CONSTRAINT "shipment_tracking_events_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribution_centers" ADD CONSTRAINT "distribution_centers_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_optimization_plans" ADD CONSTRAINT "route_optimization_plans_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "carriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_optimization_plans" ADD CONSTRAINT "route_optimization_plans_originCenterId_fkey" FOREIGN KEY ("originCenterId") REFERENCES "distribution_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_optimization_plans" ADD CONSTRAINT "route_optimization_plans_destinationCenterId_fkey" FOREIGN KEY ("destinationCenterId") REFERENCES "distribution_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand_forecast_scenarios" ADD CONSTRAINT "demand_forecast_scenarios_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "demand_forecast_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand_forecast_scenarios" ADD CONSTRAINT "demand_forecast_scenarios_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "supply_chain_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replenishment_plans" ADD CONSTRAINT "replenishment_plans_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "supply_chain_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replenishment_plans" ADD CONSTRAINT "replenishment_plans_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_steps" ADD CONSTRAINT "journey_steps_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "user_journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funnel_stages" ADD CONSTRAINT "funnel_stages_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "funnel_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funnel_results" ADD CONSTRAINT "funnel_results_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "funnel_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment_variants" ADD CONSTRAINT "experiment_variants_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment_results" ADD CONSTRAINT "experiment_results_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment_results" ADD CONSTRAINT "experiment_results_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "experiment_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast_results" ADD CONSTRAINT "forecast_results_forecastModelId_fkey" FOREIGN KEY ("forecastModelId") REFERENCES "forecast_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prediction_results" ADD CONSTRAINT "prediction_results_predictionModelId_fkey" FOREIGN KEY ("predictionModelId") REFERENCES "prediction_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategic_goals" ADD CONSTRAINT "strategic_goals_strategicPlanId_fkey" FOREIGN KEY ("strategicPlanId") REFERENCES "strategic_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_models" ADD CONSTRAINT "scenario_models_strategicPlanId_fkey" FOREIGN KEY ("strategicPlanId") REFERENCES "strategic_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_results" ADD CONSTRAINT "scenario_results_scenarioModelId_fkey" FOREIGN KEY ("scenarioModelId") REFERENCES "scenario_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_plans" ADD CONSTRAINT "budget_plans_strategicPlanId_fkey" FOREIGN KEY ("strategicPlanId") REFERENCES "strategic_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capacity_plans" ADD CONSTRAINT "capacity_plans_strategicPlanId_fkey" FOREIGN KEY ("strategicPlanId") REFERENCES "strategic_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_warehouses" ADD CONSTRAINT "data_warehouses_dataLakeId_fkey" FOREIGN KEY ("dataLakeId") REFERENCES "data_lakes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_marts" ADD CONSTRAINT "data_marts_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "data_warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semantic_metrics" ADD CONSTRAINT "semantic_metrics_dataMartId_fkey" FOREIGN KEY ("dataMartId") REFERENCES "data_marts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semantic_dimensions" ADD CONSTRAINT "semantic_dimensions_dataMartId_fkey" FOREIGN KEY ("dataMartId") REFERENCES "data_marts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpis" ADD CONSTRAINT "kpis_semanticMetricId_fkey" FOREIGN KEY ("semanticMetricId") REFERENCES "semantic_metrics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_results" ADD CONSTRAINT "kpi_results_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "kpis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executive_dashboards" ADD CONSTRAINT "executive_dashboards_dataMartId_fkey" FOREIGN KEY ("dataMartId") REFERENCES "data_marts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_jobs" ADD CONSTRAINT "warehouse_jobs_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "data_warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_pipelines" ADD CONSTRAINT "data_pipelines_dataLakeId_fkey" FOREIGN KEY ("dataLakeId") REFERENCES "data_lakes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_pipelines" ADD CONSTRAINT "data_pipelines_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "data_warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_models" ADD CONSTRAINT "ai_models_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "ai_model_registries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_versions" ADD CONSTRAINT "ai_model_versions_aiModelId_fkey" FOREIGN KEY ("aiModelId") REFERENCES "ai_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_deployments" ADD CONSTRAINT "ai_model_deployments_aiModelId_fkey" FOREIGN KEY ("aiModelId") REFERENCES "ai_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_deployments" ADD CONSTRAINT "ai_model_deployments_modelVersionId_fkey" FOREIGN KEY ("modelVersionId") REFERENCES "ai_model_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_decisions" ADD CONSTRAINT "ai_decisions_aiModelId_fkey" FOREIGN KEY ("aiModelId") REFERENCES "ai_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_decisions" ADD CONSTRAINT "ai_decisions_modelVersionId_fkey" FOREIGN KEY ("modelVersionId") REFERENCES "ai_model_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_decisions" ADD CONSTRAINT "ai_decisions_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "ai_model_deployments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_decision_reasons" ADD CONSTRAINT "ai_decision_reasons_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "ai_decisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_decision_risks" ADD CONSTRAINT "ai_decision_risks_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "ai_decisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_audit_logs" ADD CONSTRAINT "ai_audit_logs_aiModelId_fkey" FOREIGN KEY ("aiModelId") REFERENCES "ai_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_audit_logs" ADD CONSTRAINT "ai_audit_logs_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "ai_decisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_compliance_records" ADD CONSTRAINT "ai_compliance_records_aiModelId_fkey" FOREIGN KEY ("aiModelId") REFERENCES "ai_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_compliance_records" ADD CONSTRAINT "ai_compliance_records_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "ai_model_deployments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_explainability_records" ADD CONSTRAINT "ai_explainability_records_aiModelId_fkey" FOREIGN KEY ("aiModelId") REFERENCES "ai_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_explainability_records" ADD CONSTRAINT "ai_explainability_records_modelVersionId_fkey" FOREIGN KEY ("modelVersionId") REFERENCES "ai_model_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_explainability_records" ADD CONSTRAINT "ai_explainability_records_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "ai_decisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_performance_metrics" ADD CONSTRAINT "model_performance_metrics_aiModelId_fkey" FOREIGN KEY ("aiModelId") REFERENCES "ai_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_performance_metrics" ADD CONSTRAINT "model_performance_metrics_modelVersionId_fkey" FOREIGN KEY ("modelVersionId") REFERENCES "ai_model_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_performance_metrics" ADD CONSTRAINT "model_performance_metrics_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "ai_model_deployments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_approval_workflows" ADD CONSTRAINT "model_approval_workflows_aiModelId_fkey" FOREIGN KEY ("aiModelId") REFERENCES "ai_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_approval_workflows" ADD CONSTRAINT "model_approval_workflows_modelVersionId_fkey" FOREIGN KEY ("modelVersionId") REFERENCES "ai_model_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_approval_workflows" ADD CONSTRAINT "model_approval_workflows_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "ai_model_deployments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threat_events" ADD CONSTRAINT "threat_events_threatId_fkey" FOREIGN KEY ("threatId") REFERENCES "security_threats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threat_events" ADD CONSTRAINT "threat_events_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "threat_detection_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threat_events" ADD CONSTRAINT "threat_events_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "security_incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_risks" ADD CONSTRAINT "security_risks_threatId_fkey" FOREIGN KEY ("threatId") REFERENCES "security_threats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_audits" ADD CONSTRAINT "security_audits_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "security_incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_violations" ADD CONSTRAINT "compliance_violations_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "security_incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_verifications" ADD CONSTRAINT "access_verifications_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "zero_trust_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_alerts" ADD CONSTRAINT "security_alerts_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "security_incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_alerts" ADD CONSTRAINT "security_alerts_threatId_fkey" FOREIGN KEY ("threatId") REFERENCES "security_threats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_investigations" ADD CONSTRAINT "security_investigations_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "security_incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_incidents" ADD CONSTRAINT "system_incidents_serviceHealthId_fkey" FOREIGN KEY ("serviceHealthId") REFERENCES "service_health"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_timelines" ADD CONSTRAINT "incident_timelines_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "system_incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recovery_actions" ADD CONSTRAINT "recovery_actions_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "system_incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uptime_metrics" ADD CONSTRAINT "uptime_metrics_serviceHealthId_fkey" FOREIGN KEY ("serviceHealthId") REFERENCES "service_health"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scaling_events" ADD CONSTRAINT "scaling_events_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "scaling_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "failover_events" ADD CONSTRAINT "failover_events_regionHealthId_fkey" FOREIGN KEY ("regionHealthId") REFERENCES "region_health"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "failover_events" ADD CONSTRAINT "failover_events_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "system_incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sre_alerts" ADD CONSTRAINT "sre_alerts_serviceHealthId_fkey" FOREIGN KEY ("serviceHealthId") REFERENCES "service_health"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sre_alerts" ADD CONSTRAINT "sre_alerts_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "system_incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capacity_forecasts" ADD CONSTRAINT "capacity_forecasts_serviceHealthId_fkey" FOREIGN KEY ("serviceHealthId") REFERENCES "service_health"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_usage" ADD CONSTRAINT "resource_usage_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_metrics" ADD CONSTRAINT "cost_metrics_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_forecasts" ADD CONSTRAINT "cost_forecasts_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "optimization_recommendations" ADD CONSTRAINT "optimization_recommendations_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "efficiency_scores" ADD CONSTRAINT "efficiency_scores_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_metrics" ADD CONSTRAINT "performance_metrics_resourceUsageId_fkey" FOREIGN KEY ("resourceUsageId") REFERENCES "resource_usage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_allocations" ADD CONSTRAINT "resource_allocations_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_tracking" ADD CONSTRAINT "budget_tracking_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_tracking" ADD CONSTRAINT "budget_tracking_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "finops_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_alerts" ADD CONSTRAINT "cost_alerts_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_alerts" ADD CONSTRAINT "cost_alerts_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "finops_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_alerts" ADD CONSTRAINT "cost_alerts_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budget_tracking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_opportunities" ADD CONSTRAINT "savings_opportunities_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_opportunities" ADD CONSTRAINT "savings_opportunities_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "optimization_recommendations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residency_policies" ADD CONSTRAINT "residency_policies_dataRegionId_fkey" FOREIGN KEY ("dataRegionId") REFERENCES "data_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_requirements" ADD CONSTRAINT "compliance_requirements_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "regulatory_frameworks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jurisdiction_rules" ADD CONSTRAINT "jurisdiction_rules_dataRegionId_fkey" FOREIGN KEY ("dataRegionId") REFERENCES "data_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_transfer_rules" ADD CONSTRAINT "data_transfer_rules_sourceRegionId_fkey" FOREIGN KEY ("sourceRegionId") REFERENCES "data_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_transfer_rules" ADD CONSTRAINT "data_transfer_rules_destinationRegionId_fkey" FOREIGN KEY ("destinationRegionId") REFERENCES "data_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_audits" ADD CONSTRAINT "compliance_audits_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "regulatory_frameworks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_audits" ADD CONSTRAINT "compliance_audits_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "compliance_requirements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_audits" ADD CONSTRAINT "compliance_audits_dataRegionId_fkey" FOREIGN KEY ("dataRegionId") REFERENCES "data_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_alerts" ADD CONSTRAINT "regulatory_alerts_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "regulatory_frameworks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_alerts" ADD CONSTRAINT "regulatory_alerts_dataRegionId_fkey" FOREIGN KEY ("dataRegionId") REFERENCES "data_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residency_assignments" ADD CONSTRAINT "residency_assignments_dataRegionId_fkey" FOREIGN KEY ("dataRegionId") REFERENCES "data_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residency_assignments" ADD CONSTRAINT "residency_assignments_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "residency_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_locations" ADD CONSTRAINT "data_locations_dataRegionId_fkey" FOREIGN KEY ("dataRegionId") REFERENCES "data_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_risks" ADD CONSTRAINT "regulatory_risks_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "regulatory_frameworks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_risks" ADD CONSTRAINT "regulatory_risks_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "compliance_requirements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_risks" ADD CONSTRAINT "regulatory_risks_dataRegionId_fkey" FOREIGN KEY ("dataRegionId") REFERENCES "data_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_versions" ADD CONSTRAINT "contract_versions_dataContractId_fkey" FOREIGN KEY ("dataContractId") REFERENCES "data_contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_products" ADD CONSTRAINT "api_products_dataContractId_fkey" FOREIGN KEY ("dataContractId") REFERENCES "data_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_products" ADD CONSTRAINT "api_products_contractVersionId_fkey" FOREIGN KEY ("contractVersionId") REFERENCES "contract_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_plans" ADD CONSTRAINT "api_plans_apiProductId_fkey" FOREIGN KEY ("apiProductId") REFERENCES "api_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_subscriptions" ADD CONSTRAINT "api_subscriptions_apiProductId_fkey" FOREIGN KEY ("apiProductId") REFERENCES "api_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_subscriptions" ADD CONSTRAINT "api_subscriptions_apiPlanId_fkey" FOREIGN KEY ("apiPlanId") REFERENCES "api_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_usage_records" ADD CONSTRAINT "api_usage_records_apiProductId_fkey" FOREIGN KEY ("apiProductId") REFERENCES "api_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_usage_records" ADD CONSTRAINT "api_usage_records_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "api_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_billings" ADD CONSTRAINT "api_billings_apiPlanId_fkey" FOREIGN KEY ("apiPlanId") REFERENCES "api_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_billings" ADD CONSTRAINT "api_billings_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "api_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "governance_policies" ADD CONSTRAINT "governance_policies_dataContractId_fkey" FOREIGN KEY ("dataContractId") REFERENCES "data_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_quotas" ADD CONSTRAINT "api_quotas_apiProductId_fkey" FOREIGN KEY ("apiProductId") REFERENCES "api_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_quotas" ADD CONSTRAINT "api_quotas_apiPlanId_fkey" FOREIGN KEY ("apiPlanId") REFERENCES "api_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_limit_policies" ADD CONSTRAINT "rate_limit_policies_apiProductId_fkey" FOREIGN KEY ("apiProductId") REFERENCES "api_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_access" ADD CONSTRAINT "partner_access_apiProductId_fkey" FOREIGN KEY ("apiProductId") REFERENCES "api_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_access" ADD CONSTRAINT "partner_access_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "api_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_certifications" ADD CONSTRAINT "security_certifications_trustReportId_fkey" FOREIGN KEY ("trustReportId") REFERENCES "trust_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_artifacts" ADD CONSTRAINT "compliance_artifacts_trustReportId_fkey" FOREIGN KEY ("trustReportId") REFERENCES "trust_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_applications" ADD CONSTRAINT "developer_applications_developerAccountId_fkey" FOREIGN KEY ("developerAccountId") REFERENCES "developer_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sdk_packages" ADD CONSTRAINT "sdk_packages_apiDocumentationId_fkey" FOREIGN KEY ("apiDocumentationId") REFERENCES "api_documentation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_applications" ADD CONSTRAINT "marketplace_applications_developerApplicationId_fkey" FOREIGN KEY ("developerApplicationId") REFERENCES "developer_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_applications" ADD CONSTRAINT "marketplace_applications_partnerListingId_fkey" FOREIGN KEY ("partnerListingId") REFERENCES "partner_listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_integrations" ADD CONSTRAINT "external_integrations_partnerListingId_fkey" FOREIGN KEY ("partnerListingId") REFERENCES "partner_listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_integrations" ADD CONSTRAINT "external_integrations_marketplaceApplicationId_fkey" FOREIGN KEY ("marketplaceApplicationId") REFERENCES "marketplace_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_incidents" ADD CONSTRAINT "status_incidents_externalIntegrationId_fkey" FOREIGN KEY ("externalIntegrationId") REFERENCES "external_integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_incidents" ADD CONSTRAINT "status_incidents_marketplaceApplicationId_fkey" FOREIGN KEY ("marketplaceApplicationId") REFERENCES "marketplace_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecosystem_events" ADD CONSTRAINT "ecosystem_events_developerApplicationId_fkey" FOREIGN KEY ("developerApplicationId") REFERENCES "developer_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecosystem_events" ADD CONSTRAINT "ecosystem_events_externalIntegrationId_fkey" FOREIGN KEY ("externalIntegrationId") REFERENCES "external_integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_workspaces" ADD CONSTRAINT "customer_workspaces_customerAccountId_fkey" FOREIGN KEY ("customerAccountId") REFERENCES "customer_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_profiles" ADD CONSTRAINT "billing_profiles_customerAccountId_fkey" FOREIGN KEY ("customerAccountId") REFERENCES "customer_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_subscriptions" ADD CONSTRAINT "customer_subscriptions_customerAccountId_fkey" FOREIGN KEY ("customerAccountId") REFERENCES "customer_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_subscriptions" ADD CONSTRAINT "customer_subscriptions_billingProfileId_fkey" FOREIGN KEY ("billingProfileId") REFERENCES "billing_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_records" ADD CONSTRAINT "invoice_records_customerAccountId_fkey" FOREIGN KEY ("customerAccountId") REFERENCES "customer_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_records" ADD CONSTRAINT "invoice_records_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "customer_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_records" ADD CONSTRAINT "invoice_records_billingProfileId_fkey" FOREIGN KEY ("billingProfileId") REFERENCES "billing_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_customerAccountId_fkey" FOREIGN KEY ("customerAccountId") REFERENCES "customer_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_billingProfileId_fkey" FOREIGN KEY ("billingProfileId") REFERENCES "billing_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_metrics" ADD CONSTRAINT "usage_metrics_customerAccountId_fkey" FOREIGN KEY ("customerAccountId") REFERENCES "customer_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_metrics" ADD CONSTRAINT "usage_metrics_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "customer_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_workspaces" ADD CONSTRAINT "partner_workspaces_partnerAccountId_fkey" FOREIGN KEY ("partnerAccountId") REFERENCES "partner_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_commissions" ADD CONSTRAINT "partner_commissions_partnerAccountId_fkey" FOREIGN KEY ("partnerAccountId") REFERENCES "partner_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_referrals" ADD CONSTRAINT "partner_referrals_partnerAccountId_fkey" FOREIGN KEY ("partnerAccountId") REFERENCES "partner_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_referrals" ADD CONSTRAINT "partner_referrals_customerAccountId_fkey" FOREIGN KEY ("customerAccountId") REFERENCES "customer_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
