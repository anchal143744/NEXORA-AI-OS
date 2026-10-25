# Realtime Architecture

Phase 6 implements the NestJS Socket.IO gateway under `/realtime`.

Channels:

- workspace
- notifications
- dashboard
- analytics
- activity-feed
- ai-updates

Room isolation:

- `tenant:{tenantId}:{channel}`
- `tenant:{tenantId}:workspace:{workspaceId}:{channel}`

Connection validation requires tenant context from socket auth or headers. Workspace rooms are joined only for the authenticated workspace context.
