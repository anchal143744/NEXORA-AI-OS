# Mobile Architecture

Phase: 22
Version: 0.22.0

## Purpose

The mobile foundation allows NEXORA workspaces to operate on mobile and tablet devices without reducing the platform to a static dashboard. Mobile views are generated from tenant, workspace, role, module and device context.

## API Surface

API group: `/v1/mobile`

- `GET /shell` returns adaptive mobile shell metadata.
- `GET /dashboard-framework` returns role-aware mobile dashboard structure.
- `GET /workspaces` returns mobile-accessible workspaces.
- `GET /profiles` lists mobile workspace profiles.
- `POST /profiles` creates mobile workspace profiles.
- `POST /commands` queues mobile command center actions.

## Capabilities

- Responsive enterprise layouts for mobile, tablet and foldable devices.
- Mobile navigation shell with role-aware modules.
- Mobile dashboard framework for KPIs, tasks, approvals and offline status.
- Mobile workspace switching with tenant isolation.
- Mobile command center for create, approve, sync and AI actions.
- Mobile AI Copilot access with offline queue support.

## Data Model

`MobileWorkspaceProfile` stores mobile shell, navigation, dashboard and command center configuration per tenant, workspace, user and device.

## Security

Mobile access depends on registered device trust, offline permission validation and encrypted local cache policy.