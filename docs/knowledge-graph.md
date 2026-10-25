# Knowledge Graph

The Knowledge Graph layer gives NEXORA AI a connected representation of business operations instead of isolated database rows.

## Runtime Components

- `KnowledgeGraphModule`: registers graph, ontology, relationship, context, memory and AI context services.
- `KnowledgeGraphService`: builds context graphs and stores context snapshots.
- `GraphQueryService`: answers dependency and relationship queries.
- `KnowledgeNode`: persisted graph vertex.
- `KnowledgeEdge`: persisted graph relationship.

## Graph Persistence

Tables:

- `knowledge_nodes`: graph nodes with `nodeType`, label, weight, metadata and source record references.
- `knowledge_edges`: graph edges with source node, target node, relationship type, direction, strength and metadata.
- `context_snapshots`: immutable graph snapshots created during context graph assembly.

## Query Capabilities

Implemented query operations:

- Find connected entities.
- Find revenue drivers.
- Find customer relationships.
- Find KPI dependencies.
- Find department dependencies.
- Find workflow dependencies.

## API Surface

- `GET /v1/knowledge-graph/context-graph`
- `GET /v1/knowledge-graph/entity-network/:entityId`
- `GET /v1/knowledge-graph/kpi-dependencies`
- `GET /v1/knowledge-graph/revenue-dependencies`
- `GET /v1/knowledge-graph/customer-relationships`
- `GET /v1/knowledge-graph/department-dependencies`
- `GET /v1/knowledge-graph/workflow-dependencies`

## Graph Isolation

Queries are always constrained by the active tenant from request context. Workspace filters are applied where graph data is workspace scoped.