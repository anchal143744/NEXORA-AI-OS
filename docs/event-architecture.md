# Event Architecture

## Purpose

NEXORA AI uses an event-first backend foundation for auditability, realtime updates, async execution, and future AI agent coordination.

## Components

- `DomainEvent`: normalized event envelope.
- `EventBusService`: publishing boundary.
- `DomainEventPublisher`: module-facing publisher abstraction.
- BullMQ queues: events, notifications, AI, activity.
- Prisma Event table from Phase 1 as durable event record.

## Event Flow

1. A module creates a domain event.
2. EventBusService validates tenant and event metadata.
3. Event is persisted to the Event table.
4. Event job is queued through BullMQ.
5. Subscribers process async work.
6. Realtime gateway fans out tenant/workspace notifications where appropriate.

## Queue Architecture

BullMQ queues are named centrally in `queue.constants.ts`:

- `events`
- `notifications`
- `ai`
- `activity`

Workflow implementation is intentionally not included in Phase 2. This phase creates the event and queue foundation only.
