# Marketplace Platform

Phase: 21
Version: 0.21.0

## Purpose

The marketplace platform turns NEXORA into an extensible business operating ecosystem. Tenant administrators can govern apps, versions, installation scopes and permissions without bypassing tenant or workspace isolation.

## Backend Surface

API group: `/v1/marketplace`

- `GET /catalog` lists tenant-visible apps by category and status.
- `POST /apps` creates a catalog app.
- `GET /apps/:id` returns app detail, versions, permissions, extensions and installations.
- `POST /apps/:id/versions` creates a version manifest.
- `POST /apps/:id/permissions` registers app permission scopes.
- `GET /installations` lists tenant/workspace installations.
- `POST /apps/:id/install` installs an app at tenant, organization, business or workspace scope.
- `POST /installations/:id/uninstall` revokes an installation.

## Data Model

- `MarketplaceApp` stores catalog identity, category, visibility, risk level and supported modules/industries.
- `MarketplaceAppVersion` stores versioned manifests, release notes, SDK version and publication status.
- `MarketplaceInstallation` stores scope, configuration, granted scopes, health and uninstall state.
- `MarketplacePermission` stores least-privilege app permissions and risk metadata.

## Tenant Isolation

Every marketplace record includes `tenantId`. Installations also support `organizationId`, `businessId` and `workspaceId` so marketplace apps can be scoped without leaking configuration across tenants or workspaces.

## Events

- `marketplace.app.created`
- `marketplace.app.installed`
- `marketplace.app.uninstalled`

## Admin UI

The marketplace console is implemented in `apps/web/features/marketplace/marketplace-admin-workspace.tsx` and wired through `apps/web/app/page.tsx` inside the adaptive `EnterpriseShell`.