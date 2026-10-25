# Workflow Runtime

The workflow runtime turns tenant and workspace events into queued executions. Published workflows are matched by trigger type, persisted as WorkflowExecution rows, and dispatched through BullMQ.

Runtime guarantees:
- Tenant and workspace scoped execution jobs.
- Durable execution and step state in PostgreSQL.
- Event publication for started, completed and failed lifecycle events.
- Retry handoff through the workflow-retry queue.
- Realtime updates through the existing event and activity infrastructure.

Primary files:
- apps/api/src/modules/workflows/workflow-runtime.service.ts
- apps/api/src/modules/workflows/workflow-executor.service.ts
- apps/api/src/modules/workflows/processors/workflow-execution.processor.ts
- apps/api/src/modules/workflows/processors/workflow-retry.processor.ts
