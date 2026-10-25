# Enterprise Knowledge Search

Date: 2026-06-13
Version: 0.24.0
Phase: Phase 24 - Enterprise Knowledge Search, Semantic Indexing and Secure Retrieval
Database Model Count: 226
API Count: 435

## Purpose

The Knowledge Search Engine gives NEXORA a tenant-aware discovery layer across business records, documents, AI memory and the business knowledge graph. It is designed for humans, Copilot and autonomous agents.

## Scope

- Global search across indexed records.
- Module search for CRM, finance, HR, workflows, AI memory and documents.
- Cross-module discovery grouped by module and business relationship.
- Saved searches with user, workspace and tenant visibility.
- Query logging for audit, analytics and security monitoring.

## Backend Components

- `KnowledgeSearchService` executes global, module, discovery and saved-search operations.
- `KnowledgeSearchController` exposes `/v1/search`.
- `SearchIndexService` owns index lifecycle, document indexing, embedding metadata and access policies.
- `SearchQueryLog` stores query metadata, result counts, latency and filtered sensitive result counts.

## API Surface

- `GET /v1/search/global`
- `GET /v1/search/module`
- `GET /v1/search/discovery`
- `POST /v1/search`
- `GET /v1/search/saved`
- `POST /v1/search/saved`
- `POST /v1/search/saved/:id/run`

## Events

- `search.index.created`
- `search.document.indexed`
- `search.query.executed`

## Security

Every query is tenant scoped and workspace scoped. Secure result shaping applies sensitivity thresholds, masking and policy-aware filtering before results leave the service layer.