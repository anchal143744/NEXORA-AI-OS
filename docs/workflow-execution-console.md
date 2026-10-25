# Workflow Execution Console

Phase 18 adds the backend and frontend foundations for enterprise workflow execution operations.

## Backend Capabilities

- List workflow executions by status.
- View running, queued and failed executions.
- View retry queue.
- Retry failed executions through BullMQ workflow execution queue.
- View approval queue.
- Track AI execution traces and workflow metrics.
- Record workflow monitoring metrics.
- Request and decide workflow approvals.
- Audit workflow definition, approval, metric and retry actions.
- Publish workflow events into the event bus.

## API Groups

- `/v1/workflow-executions`
- `/v1/workflow-monitoring`
- `/v1/workflow-approvals`
- `/v1/workflow-ai`

## Security Model

- All Phase 18 workflow controllers use JWT authentication guards.
- Tenant and workspace context are read through existing request context middleware.
- Query and mutation operations are tenant scoped.
- Approval and retry actions create workflow audit records.
- Workflow events are registered before publication and dispatched through the existing event bus.
