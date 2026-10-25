# AI Collaboration

Date: 2026-06-13
Version: 0.25.0
Phase: Phase 25 - Enterprise Collaboration, Knowledge Spaces and Decision Rooms
Database Model Count: 242
API Count: 477

## Purpose

AI Collaboration turns discussions, meetings and decision rooms into concise summaries, action items, recommendations and searchable source-linked context.

## Capabilities

- AI discussion summaries.
- AI meeting summaries.
- Decision-room summaries.
- Action item extraction.
- Recommendation generation.
- Search indexing for AI-generated collaboration records.

## Data Models

- `AiCollaborationSummary`
- `CollaborationActionItem`

## APIs

- `GET /v1/collaboration/ai/summaries`
- `POST /v1/collaboration/ai/summaries`
- `POST /v1/collaboration/ai/action-items/extract`
- `GET /v1/collaboration/ai/recommendations`

## Security and Auditability

AI summaries store source references, provider metadata, model metadata, action item extraction outputs and generated recommendations. Records are tenant scoped, workspace scoped and indexed into the enterprise search foundation.