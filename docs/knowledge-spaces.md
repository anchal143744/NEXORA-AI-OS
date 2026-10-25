# Knowledge Spaces

Date: 2026-06-13
Version: 0.25.0
Phase: Phase 25 - Enterprise Collaboration, Knowledge Spaces and Decision Rooms
Database Model Count: 242
API Count: 477

## Purpose

Knowledge Spaces organize enterprise knowledge by team, department, project and global company scope. They give NEXORA a governed collaboration surface where business knowledge, discussions and decisions stay connected.

## Capabilities

- Team spaces.
- Department spaces.
- Project spaces.
- Global company spaces.
- Knowledge categories.
- Knowledge articles with publishing, versions, tags and search indexing.

## Data Models

- `KnowledgeSpace`
- `KnowledgeCategory`
- `KnowledgeArticle`

## APIs

- `GET /v1/knowledge-spaces`
- `POST /v1/knowledge-spaces`
- `GET /v1/knowledge-spaces/:id`
- `PATCH /v1/knowledge-spaces/:id`
- `GET /v1/knowledge-spaces/:id/categories`
- `POST /v1/knowledge-spaces/:id/categories`
- `GET /v1/knowledge-spaces/:id/articles`
- `GET /v1/knowledge-spaces/:id/activity`
- `GET /v1/knowledge/articles`
- `POST /v1/knowledge/articles`
- `PATCH /v1/knowledge/articles/:id/publish`
- `GET /v1/knowledge/search`

## Search Integration

Knowledge articles are indexed into the collaboration search index with article status, version and tags as metadata.