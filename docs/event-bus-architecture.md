# Event Bus Architecture

Phase 6 implements durable domain events with registry validation, database persistence, BullMQ queueing, Redis transport, and realtime fanout.

Core events implemented:

- user.created
- user.updated
- organization.created
- workspace.created
- lead.created
- lead.updated
- lead.converted
- customer.created
- invoice.created
- invoice.updated
- invoice.paid
- expense.created
- employee.created
- project.created
- task.created
- task.completed
- workflow.executed
- notification.created
- ai.insight.generated

Event path:

1. Business service calls BusinessAuditService.
2. Audit log is persisted.
3. Activity stream event is persisted.
4. Domain event is published through EventBusService.
5. Event is stored in the Event table.
6. Event is queued to BullMQ.
7. Event is published to Redis transport.
8. Event is pushed to realtime channels.
