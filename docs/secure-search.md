# Secure Search

Date: 2026-06-13
Version: 0.24.0
Phase: Phase 24 - Enterprise Knowledge Search, Semantic Indexing and Secure Retrieval
Database Model Count: 226
API Count: 435

## Purpose

Secure Search enforces enterprise isolation and access control for human search, Copilot retrieval and autonomous agent retrieval. Search results are filtered before they leave the backend service boundary.

## Controls

- Tenant isolation on every search, index and retrieval query.
- Workspace isolation with request-context propagation.
- RBAC-aware result contracts through role and permission inputs.
- Sensitivity thresholds for public, internal, confidential and restricted records.
- Sensitive metadata and summary masking when access is not elevated.
- Query logging with filtered result counts.

## Data Models

- `SearchAccessPolicy` stores role keys, permission keys, sensitivity thresholds, filter rules and masking rules.
- `SearchQueryLog` stores query audit data, latency and sensitive-filter counts.
- `RetrievalResult` stores allowed state, denial reason and sensitivity level per source.

## Enforcement Points

- `SecureSearchService.tenantScopedWhere` builds tenant and workspace scoped filters.
- `SecureSearchService.filterDocuments` applies sensitivity thresholds and masking.
- Search, semantic, context and retrieval services call the secure layer before returning results.

## Operational Notes

Phase 24 implements the foundation for policy-aware filtering. Future phases can connect the stored policy rules to the full RBAC policy engine, data classification engine and compliance controls for jurisdiction-specific search behavior.