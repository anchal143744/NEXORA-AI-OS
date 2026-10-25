# Workflow Engine

The workflow engine supports draft workflows, published workflows, version creation and rollback-by-copy. Workflow definitions are metadata driven and stored in Prisma as triggerDefinition and graphDefinition JSON.

Supported lifecycle:
- Create draft workflow.
- Validate graph and trigger metadata.
- Publish workflow for event execution.
- Create draft version from latest definition.
- Roll back by creating a new draft version from a previous version.

All execution is asynchronous through BullMQ and all important state changes emit domain events.
