# Service Automation

Version: `0.28.0`

Phase: Phase 28 - Enterprise Customer Experience, Service Automation and Revenue Engagement.

Platform totals after this phase: 290 Prisma models and 650 controller endpoints.

## Purpose

Service Automation links customer experience to operational service delivery through tickets, escalation automation, resolution tracking, SLA monitoring and service workflows.

## Capabilities

- Service request and ticket management.
- Ticket automation and queue-ready metadata.
- Escalation automation with severity and recommended action.
- Resolution tracking with root cause and actions taken.
- SLA monitoring and breach detection.
- Service workflow registry and service analytics.

## Data Model

- `ServiceTicket` stores ticket source, status, priority, severity, assigned owner, queue and SLA due date.
- `ServiceEscalation` stores escalation reason, severity, target owner and recommended action.
- `ServiceResolution` stores resolution summary, root cause, actions and confirmation metadata.
- `SLARecord` stores target, achieved time, breach time, policy and actual duration.

## API Surface

- `GET /v1/service-center/dashboard`
- `GET /v1/service-center/analytics`
- `GET /v1/service-center/workflows`
- `GET /v1/service-center/escalations`
- `GET /v1/service-tickets`
- `POST /v1/service-tickets`
- `GET /v1/service-tickets/:id`
- `POST /v1/service-tickets/:id/escalate`
- `POST /v1/service-tickets/:id/resolve`
- `GET /v1/sla`
- `POST /v1/sla`
- `GET /v1/sla/breaches`

## Security

Service records are tenant scoped, workspace aware and protected by JWT guards. Service ticket, resolution, escalation and SLA events are published for audit and realtime operations.
