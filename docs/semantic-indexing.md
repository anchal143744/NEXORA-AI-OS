# Semantic Indexing

Date: 2026-06-13
Version: 0.24.0
Phase: Phase 24 - Enterprise Knowledge Search, Semantic Indexing and Secure Retrieval
Database Model Count: 226
API Count: 435

## Purpose

Semantic Indexing prepares business records, documents, workflow state and AI memory for contextual retrieval. Phase 24 stores index metadata, indexed records and embedding records while keeping the vector provider replaceable.

## Indexed Domains

- Business entities and ontology nodes.
- CRM leads, customers, opportunities and pipelines.
- Finance invoices, expenses, revenue and payments.
- HR employees, departments and attendance.
- Workflow definitions, executions and decisions.
- AI memory, recommendations, insights and risks.
- Documents, upload records and governed files.

## Data Models

- `SearchIndex`
- `SearchIndexedDocument`
- `SearchEmbeddingRecord`
- `SearchAccessPolicy`

## API Surface

- `GET /v1/search/indexes`
- `POST /v1/search/indexes`
- `POST /v1/search/indexes/:id/documents`
- `GET /v1/search/indexes/:id/documents`
- `POST /v1/search/indexes/:id/embeddings`
- `GET /v1/search/indexes/:id/embeddings`
- `POST /v1/search/indexes/:id/rebuild`
- `GET /v1/search/indexes/policies`
- `POST /v1/search/indexes/policies`

## Provider Strategy

Embedding provider, model, dimension, vector reference and chunk metadata are persisted separately from the source record. This lets NEXORA move from the Phase 24 lexical scoring foundation to pgvector, OpenSearch, Pinecone, Qdrant or a managed vector store without changing the public API.