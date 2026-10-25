# Desktop Companion

Phase: 22
Version: 0.22.0

## Purpose

The desktop companion foundation prepares NEXORA for native desktop command-center experiences while preserving the browser-first enterprise shell.

## API Surface

API group: `/v1/desktop`

- `GET /architecture` returns desktop companion architecture metadata.
- `GET /profiles` lists desktop companion profiles.
- `POST /profiles` creates desktop companion profiles.
- `GET /windows` returns multi-window definitions.
- `GET /tray` returns system tray action definitions.
- `POST /notifications` creates desktop notification activity and realtime events.

## Capabilities

- Multi-window support for command center, AI Copilot, workflow console and approval queue.
- Desktop notifications with workspace-aware payloads.
- System tray foundation for sync, quick capture and queue status.
- Native desktop workspace support through `DesktopCompanionProfile`.
- Remote session revocation and device trust enforcement.

## Data Model

`DesktopCompanionProfile` stores window state, notification config, tray config and native capabilities by tenant, workspace, user and device.

## Events

- `desktop.notification.created`