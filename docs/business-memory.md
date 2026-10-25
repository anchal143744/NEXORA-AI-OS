# Business Memory

Business Memory stores durable business context that should influence future automation and AI reasoning.

## Memory Types

The memory layer is designed to store:

- Historical context.
- Business decisions.
- Recommendations.
- KPI history.
- Goal history.
- AI insights.

## Implementation

`BusinessMemoryService` writes tenant-scoped memory records to `business_memory`. Records can optionally attach to a workspace and ontology entity.

Fields include:

- `memoryType`
- `title`
- `content`
- `workspaceId`
- `entityId`
- `tenantId`
- timestamps
- soft delete marker

## API Surface

- `POST /v1/knowledge-graph/memory`
- `GET /v1/knowledge-graph/memory`

## Governance

Memory records are tenant isolated and soft deletable. This supports future retention policies, compliance controls and explainability for AI-driven decisions.