# Enterprise Contact Center

Version: `0.27.0`

Phase: Phase 27 - Enterprise Voice AI, Contact Center and Omnichannel Engagement.

Platform totals after this phase: 275 Prisma models and 590 controller endpoints.

## Purpose

The Contact Center module turns NEXORA AI into an enterprise service operations layer with queues, routing, assignments, escalations, SLA monitoring and agent workspaces.

## Capabilities

- Contact-center queues by tenant, workspace, department and team.
- Unified inbox combining assignments, active voice sessions and conversations.
- Agent assignments for conversations, voice sessions and customer identities.
- Escalation routing with severity, recommendations and audit-ready events.
- Service-level monitoring with open assignment and breach calculations.
- Agent workspace for assigned customer communication work.

## Data Model

- `ContactCenterQueue` stores routing strategy, supported channels, SLA target, business hours and escalation policy.
- `AgentAssignment` tracks assignment target, owner, status, priority, SLA due date and escalation level.
- `EscalationEvent` records severity, reason, recommendation, source and target user.

## API Surface

- `GET /v1/contact-center/queues`
- `POST /v1/contact-center/queues`
- `GET /v1/contact-center/queues/:id`
- `GET /v1/contact-center/unified-inbox`
- `GET /v1/contact-center/assignments`
- `POST /v1/contact-center/assignments`
- `PATCH /v1/contact-center/assignments/:id/status`
- `GET /v1/contact-center/escalations`
- `POST /v1/contact-center/escalations`
- `GET /v1/contact-center/service-levels`
- `GET /v1/contact-center/agents/workspace`

## Security

Controllers are JWT protected and all query filters enforce tenant context and workspace context where applicable. Escalations and assignments publish domain events for audit and realtime notification pipelines.
