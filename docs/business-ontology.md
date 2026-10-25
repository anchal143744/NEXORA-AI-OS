# Business Ontology

NEXORA AI Phase 13 adds a tenant-aware business ontology that turns operational records into semantic business entities. The ontology is implemented in `apps/api/src/modules/knowledge-graph` and persisted through Prisma models in `prisma/schema.prisma`.

## Core Entity Types

The ontology supports these first-class business concepts:

- business
- organization
- workspace
- department
- employee
- customer
- lead
- project
- task
- invoice
- revenue
- expense
- inventory
- supplier
- workflow
- kpi
- goal
- ai_agent

Entity creation uses `OntologyService`. Each ontology entity also creates a matching `KnowledgeNode`, allowing semantic records and graph traversal records to remain synchronized.

## Storage Model

Primary tables:

- `ontology_entities`: canonical semantic entities with entity type, entity key, source record link, attributes and tags.
- `knowledge_nodes`: graph node projection for query traversal and AI context assembly.
- `entity_links`: external or module-level links between ontology entities and source systems.
- `industry_knowledge_models`: industry-specific ontology defaults for SaaS, retail, agency, healthcare, education, manufacturing, finance, logistics, consulting and ecommerce.

## Tenant And Workspace Scope

Every persisted ontology object is tenant scoped. Workspace scope is supported on graph nodes, contexts, snapshots, entity links and memories. The module uses `TenantContextService` so tenant and workspace identifiers are propagated from authenticated request context.

## API Surface

- `POST /v1/knowledge-graph/entities`
- `GET /v1/knowledge-graph/entities`

The endpoints are protected by `JwtAuthGuard` and documented with Swagger metadata.