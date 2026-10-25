# Retrieval Engine

Date: 2026-06-13
Version: 0.24.0
Phase: Phase 24 - Enterprise Knowledge Search, Semantic Indexing and Secure Retrieval
Database Model Count: 226
API Count: 435

## Purpose

The Retrieval Engine assembles evidence-backed context packages for NEXORA AI Copilot, autonomous agents and enterprise search. It combines semantic matches, indexed business records, business memory, AI memory and knowledge graph context.

## Retrieval Modes

- Semantic retrieval.
- Context retrieval.
- Relationship retrieval.
- Knowledge graph retrieval.
- Copilot retrieval.
- Agent retrieval.

## Data Models

- `RetrievalSession` records the query, retrieval type, AI readiness and assembled context.
- `RetrievalResult` records ranked results, citations, snippets, sensitivity levels and source metadata.

## API Surface

- `POST /v1/search/retrieval`
- `POST /v1/search/retrieval/copilot`
- `POST /v1/search/retrieval/agents`
- `GET /v1/search/retrieval/sessions`
- `GET /v1/search/retrieval/sessions/:id/results`

## AI Context Contract

A retrieval response returns the session, ranked results, source citations, graph context, memory context and token estimates. Agents can use the response before planning or executing actions, while audit teams can review the exact sources used.

## Events

- `retrieval.session.created`
- `retrieval.context.generated`